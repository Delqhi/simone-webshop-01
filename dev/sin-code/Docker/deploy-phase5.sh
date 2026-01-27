#!/bin/bash

# =============================================================================
# PHASE 5 DEPLOYMENT SCRIPT - SIN-SOLVER MONITORING & ALERTING
# =============================================================================
# Automates deployment of production monitoring infrastructure
# Usage: bash deploy-phase5.sh [--dry-run] [--skip-validation]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DRY_RUN=${1:-false}
SKIP_VALIDATION=${2:-false}
MONITORING_DIR="./monitoring"
CONFIG_FILE="docker-compose-production.yml"
LOG_FILE="phase5-deployment-$(date +%Y%m%d_%H%M%S).log"

# Functions
log() { echo -e "${BLUE}[$(date +'%H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"; }
success() { echo -e "${GREEN}✅ $1${NC}" | tee -a "$LOG_FILE"; }
error() { echo -e "${RED}❌ $1${NC}" | tee -a "$LOG_FILE"; exit 1; }
warning() { echo -e "${YELLOW}⚠️  $1${NC}" | tee -a "$LOG_FILE"; }

# Pre-flight checks
log "Starting Phase 5 Deployment - $(date)"
log "=========================================="

log "Checking prerequisites..."

# Check Docker
if ! command -v docker &> /dev/null; then
  error "Docker not found. Please install Docker."
fi
success "Docker installed"

# Check docker-compose
if ! command -v docker-compose &> /dev/null; then
  error "docker-compose not found. Please install Docker Compose."
fi
success "docker-compose installed"

# Check configuration files
if [ ! -f "$CONFIG_FILE" ]; then
  error "Configuration file not found: $CONFIG_FILE"
fi
success "Configuration file found: $CONFIG_FILE"

# Check monitoring directory
if [ ! -d "$MONITORING_DIR" ]; then
  error "Monitoring configuration directory not found: $MONITORING_DIR"
fi
success "Monitoring directory exists: $MONITORING_DIR"

# Verify required monitoring files
REQUIRED_FILES=(
  "monitoring/prometheus.yml"
  "monitoring/alert-rules.yml"
  "monitoring/alertmanager.yml"
  "monitoring/loki-config.yml"
  "monitoring/promtail-config.yml"
)

for file in "${REQUIRED_FILES[@]}"; do
  if [ ! -f "$file" ]; then
    error "Required config file missing: $file"
  fi
done
success "All monitoring configuration files present"

# Validate Docker Compose syntax
log "Validating Docker Compose configuration..."
if ! docker-compose -f "$CONFIG_FILE" config > /dev/null 2>&1; then
  error "Invalid Docker Compose configuration"
fi
success "Docker Compose configuration valid"

# Create/verify external network
log "Checking Docker network..."
if docker network inspect haus-netzwerk > /dev/null 2>&1; then
  success "Network haus-netzwerk already exists"
else
  log "Creating network haus-netzwerk..."
  if [ "$DRY_RUN" != "--dry-run" ]; then
    docker network create --driver bridge --subnet=172.20.0.0/16 haus-netzwerk
    success "Network haus-netzwerk created"
  else
    log "[DRY RUN] Would create network haus-netzwerk"
  fi
fi

# Stop current services
log "Stopping current services..."
if [ "$DRY_RUN" != "--dry-run" ]; then
  if docker-compose ps | grep -q "Up"; then
    docker-compose down --remove-orphans || warning "Could not stop some services"
    sleep 5
    success "Current services stopped"
  else
    log "No running services found"
  fi
else
  log "[DRY RUN] Would stop current services"
fi

# Deploy monitoring infrastructure (Tier 0)
log "Deploying monitoring infrastructure..."
MONITORING_SERVICES=(
  "room-00-prometheus"
  "room-00-alertmanager"
  "room-00-node-exporter"
  "room-00-cadvisor"
  "room-00-loki"
  "room-00-promtail"
)

for service in "${MONITORING_SERVICES[@]}"; do
  log "Starting $service..."
  if [ "$DRY_RUN" != "--dry-run" ]; then
    docker-compose -f "$CONFIG_FILE" up -d "$service"
  else
    log "[DRY RUN] Would start $service"
  fi
done

# Wait for monitoring stack to stabilize
if [ "$DRY_RUN" != "--dry-run" ]; then
  log "Waiting for monitoring infrastructure to stabilize (30s)..."
  sleep 30
  success "Monitoring infrastructure deployed"
fi

# Deploy Grafana
log "Starting Grafana dashboard..."
if [ "$DRY_RUN" != "--dry-run" ]; then
  docker-compose -f "$CONFIG_FILE" up -d room-00-grafana
  sleep 15
  success "Grafana started"
else
  log "[DRY RUN] Would start Grafana"
fi

# Verify monitoring health
log "Verifying monitoring stack health..."
if [ "$DRY_RUN" != "--dry-run" ]; then
  
  # Check Prometheus
  if curl -sf http://localhost:9090/-/healthy > /dev/null 2>&1; then
    success "Prometheus healthy"
  else
    warning "Prometheus not responding yet"
  fi

  # Check AlertManager
  if curl -sf http://localhost:9093/-/healthy > /dev/null 2>&1; then
    success "AlertManager healthy"
  else
    warning "AlertManager not responding yet"
  fi

  # Check Grafana
  if curl -sf http://localhost:3000/api/health > /dev/null 2>&1; then
    success "Grafana healthy"
  else
    warning "Grafana not responding yet"
  fi

  # Check Loki
  if curl -sf http://localhost:3100/ready > /dev/null 2>&1; then
    success "Loki healthy"
  else
    warning "Loki not responding yet"
  fi
fi

# Deploy application infrastructure
log "Deploying application infrastructure..."
APP_SERVICES=(
  "cloudflared-tunnel"
  "agent-01-n8n-manager"
  "agent-02-temporal-scheduler"
  "room-01-dashboard-cockpit"
  "room-03-archiv-postgres"
  "room-04-memory-redis"
)

for service in "${APP_SERVICES[@]}"; do
  log "Starting $service..."
  if [ "$DRY_RUN" != "--dry-run" ]; then
    docker-compose -f "$CONFIG_FILE" up -d "$service"
    sleep 3
  else
    log "[DRY RUN] Would start $service"
  fi
done

# Final verification
log "Final verification..."
if [ "$DRY_RUN" != "--dry-run" ]; then
  
  RUNNING=$(docker-compose -f "$CONFIG_FILE" ps | grep -c "Up" || echo "0")
  log "Services running: $RUNNING"
  
  if [ "$RUNNING" -gt 0 ]; then
    success "Services deployed successfully"
  else
    warning "No services running - check docker-compose logs"
  fi
  
  # Show status
  log "=========================================="
  log "DEPLOYMENT STATUS"
  log "=========================================="
  docker-compose -f "$CONFIG_FILE" ps
  
  log "=========================================="
  log "DASHBOARD ACCESS"
  log "=========================================="
  log "Prometheus:  http://localhost:9090"
  log "AlertManager: http://localhost:9093"
  log "Grafana:     http://localhost:3000 (admin/sin-solver-2026)"
  log "Loki:        http://localhost:3100"
  
else
  log "[DRY RUN] Deployment simulation complete"
fi

log "=========================================="
success "Phase 5 Deployment Complete! ($(date))"
log "Review full output: cat $LOG_FILE"

