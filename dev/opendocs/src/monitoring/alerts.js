/**
 * Alerting System for Performance Monitoring
 * Phase 5.06: Threshold-based alerting with notifications
 */

import { collector } from './enhanced-metrics.js';

class AlertManager {
  constructor() {
    this.alerts = [];
    this.thresholds = {
      latency: {
        p95: 500, // 500ms P95 latency
        p99: 1000 // 1000ms P99 latency
      },
      errorRate: 5, // 5% error rate
      throughput: {
        min: 10, // Minimum requests per minute
        max: 1000 // Maximum requests per minute
      }
    };
    this.cooldownPeriods = new Map(); // Track alert cooldowns
  }

  // Check all thresholds and generate alerts
  checkThresholds() {
    const metrics = collector.getMetricsSnapshot();
    const newAlerts = [];

    // Check latency thresholds
    const latencyPercentiles = metrics.latencyPercentiles;
    if (latencyPercentiles.p95 > this.thresholds.latency.p95) {
      newAlerts.push(this.createAlert('LATENCY_P95_HIGH', 
        `P95 latency exceeded threshold: ${latencyPercentiles.p95}ms > ${this.thresholds.latency.p95}ms`,
        'warning'
      ));
    }

    if (latencyPercentiles.p99 > this.thresholds.latency.p99) {
      newAlerts.push(this.createAlert('LATENCY_P99_HIGH', 
        `P99 latency exceeded threshold: ${latencyPercentiles.p99}ms > ${this.thresholds.latency.p99}ms`,
        'critical'
      ));
    }

    // Check error rate thresholds
    const globalErrorRate = this.calculateGlobalErrorRate(metrics.errorRateByEndpoint);
    if (globalErrorRate > this.thresholds.errorRate) {
      newAlerts.push(this.createAlert('ERROR_RATE_HIGH', 
        `Global error rate exceeded threshold: ${globalErrorRate.toFixed(2)}% > ${this.thresholds.errorRate}%`,
        'critical'
      ));
    }

    // Check endpoint-specific error rates
    Object.entries(metrics.errorRateByEndpoint).forEach(([endpoint, stats]) => {
      const errorRate = parseFloat(stats.rate);
      if (errorRate > this.thresholds.errorRate) {
        newAlerts.push(this.createAlert('ENDPOINT_ERROR_RATE_HIGH', 
          `${endpoint} error rate exceeded: ${errorRate.toFixed(2)}% > ${this.thresholds.errorRate}%`,
          'warning',
          { endpoint }
        ));
      }
    });

    // Check throughput thresholds
    const totalRequests = metrics.totalRequests;
    if (totalRequests < this.thresholds.throughput.min) {
      newAlerts.push(this.createAlert('THROUGHPUT_LOW', 
        `Throughput too low: ${totalRequests} requests < minimum ${this.thresholds.throughput.min}`,
        'warning'
      ));
    }

    if (totalRequests > this.thresholds.throughput.max) {
      newAlerts.push(this.createAlert('THROUGHPUT_HIGH', 
        `Throughput too high: ${totalRequests} requests > maximum ${this.thresholds.throughput.max}`,
        'warning'
      ));
    }

    // Apply cooldown and deduplication
    return newAlerts.filter(alert => this.shouldTriggerAlert(alert));
  }

  createAlert(type, message, severity = 'warning', metadata = {}) {
    return {
      id: `${type}_${Date.now()}`,
      type,
      message,
      severity,
      timestamp: new Date().toISOString(),
      metadata
    };
  }

  calculateGlobalErrorRate(errorRates) {
    let totalRequests = 0;
    let totalErrors = 0;

    Object.values(errorRates).forEach(stats => {
      totalRequests += stats.total;
      totalErrors += stats.errors;
    });

    return totalRequests > 0 ? (totalErrors / totalRequests) * 100 : 0;
  }

  shouldTriggerAlert(alert) {
    // Check cooldown period (5 minutes for same alert type)
    const cooldownKey = alert.type;
    const lastTriggered = this.cooldownPeriods.get(cooldownKey);
    
    if (lastTriggered && (Date.now() - lastTriggered < 5 * 60 * 1000)) {
      return false; // Still in cooldown
    }

    // Update cooldown
    this.cooldownPeriods.set(cooldownKey, Date.now());
    return true;
  }

  getActiveAlerts() {
    return this.alerts.filter(alert => 
      Date.now() - new Date(alert.timestamp).getTime() < 24 * 60 * 60 * 1000 // Last 24 hours
    );
  }

  clearAlerts() {
    const count = this.alerts.length;
    this.alerts = [];
    this.cooldownPeriods.clear();
    return count;
  }

  // Add alert manually (for testing)
  addAlert(alert) {
    this.alerts.push({
      ...alert,
      id: alert.id || `manual_${Date.now()}`,
      timestamp: alert.timestamp || new Date().toISOString()
    });
  }
}

const alertManager = new AlertManager();

// Export for server integration
export { alertManager };

export function alertsHandler(req, res) {
  const activeAlerts = alertManager.getActiveAlerts();
  
  res.json({
    activeAlerts,
    total: activeAlerts.length,
    critical: activeAlerts.filter(a => a.severity === 'critical').length,
    warning: activeAlerts.filter(a => a.severity === 'warning').length,
    timestamp: new Date().toISOString()
  });
}

export function checkAlertsHandler(req, res) {
  const newAlerts = alertManager.checkThresholds();
  
  res.json({
    newAlerts,
    total: newAlerts.length,
    timestamp: new Date().toISOString()
  });
}

export function clearAlertsHandler(req, res) {
  const count = alertManager.clearAlerts();
  
  res.json({
    success: true,
    message: `Cleared ${count} alerts`,
    timestamp: new Date().toISOString()
  });
}

export function addTestAlertHandler(req, res) {
  const { type, message, severity } = req.body;
  
  alertManager.addAlert({
    type: type || 'TEST_ALERT',
    message: message || 'Test alert generated',
    severity: severity || 'warning'
  });
  
  res.json({
    success: true,
    message: 'Test alert added',
    timestamp: new Date().toISOString()
  });
}