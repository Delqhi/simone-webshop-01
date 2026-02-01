'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  HardDrive, 
  BarChart3, 
  Activity, 
  Terminal, 
  FileText,
  Bell,
  Activity as ActivityIcon,
  Settings,
  ExternalLink,
  TrendingUp,
  Database
} from 'lucide-react';

interface MonitoringService {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  status: 'healthy' | 'warning' | 'error';
  port: number;
  url: string;
  version: string;
  metrics: {
    dataPoints: string;
    retention: string;
    queries: string;
  };
}

const services: MonitoringService[] = [
  {
    id: 'prometheus',
    name: 'Prometheus',
    description: 'Metrics collection and alerting system',
    icon: <BarChart3 className="h-6 w-6" />,
    status: 'healthy',
    port: 9090,
    url: 'https://prometheus.delqhi.com',
    version: '2.48',
    metrics: {
      dataPoints: '2.4M',
      retention: '15 days',
      queries: '1.2K/min'
    }
  },
  {
    id: 'grafana',
    name: 'Grafana',
    description: 'Visualization and monitoring dashboards',
    icon: <Activity className="h-6 w-6" />,
    status: 'healthy',
    port: 3001,
    url: 'https://grafana.delqhi.com',
    version: '10.2',
    metrics: {
      dataPoints: 'N/A',
      retention: 'N/A',
      queries: '850/min'
    }
  },
  {
    id: 'jaeger',
    name: 'Jaeger Tracing',
    description: 'Distributed tracing and performance monitoring',
    icon: <Terminal className="h-6 w-6" />,
    status: 'healthy',
    port: 16686,
    url: 'https://jaeger.delqhi.com',
    version: '1.50',
    metrics: {
      dataPoints: '450K',
      retention: '7 days',
      queries: '320/min'
    }
  },
  {
    id: 'loki',
    name: 'Loki Logs',
    description: 'Log aggregation and search system',
    icon: <FileText className="h-6 w-6" />,
    status: 'healthy',
    port: 3100,
    url: 'https://loki.delqhi.com',
    version: '2.9',
    metrics: {
      dataPoints: '12M',
      retention: '30 days',
      queries: '2.1K/min'
    }
  },
  {
    id: 'alertmanager',
    name: 'Alertmanager',
    description: 'Alert routing and notification management',
    icon: <Bell className="h-6 w-6" />,
    status: 'healthy',
    port: 9093,
    url: 'https://alertmanager.delqhi.com',
    version: '0.26',
    metrics: {
      dataPoints: 'N/A',
      retention: 'N/A',
      queries: '45/min'
    }
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'healthy':
      return 'bg-emerald-500';
    case 'warning':
      return 'bg-amber-500';
    case 'error':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'healthy':
      return <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">Healthy</Badge>;
    case 'warning':
      return <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20">Warning</Badge>;
    case 'error':
      return <Badge variant="destructive">Error</Badge>;
    default:
      return <Badge variant="secondary">Unknown</Badge>;
  }
};

export default function StoragePage() {
  const [serviceList, setServiceList] = useState(services);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Database className="h-8 w-8 text-blue-500" />
          <h1 className="text-3xl font-bold">Storage & Monitoring</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Monitor metrics, logs, traces, and alerts
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Services</CardDescription>
            <CardTitle className="text-3xl">{serviceList.length}</CardTitle>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Healthy</CardDescription>
            <CardTitle className="text-3xl text-emerald-500">
              {serviceList.filter(s => s.status === 'healthy').length}
            </CardTitle>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Data Points</CardDescription>
            <CardTitle className="text-3xl">14.8M</CardTitle>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Avg Queries/min</CardDescription>
            <CardTitle className="text-3xl">4.5K</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {serviceList.map((service) => (
          <Card key={service.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-accent">
                    {service.icon}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{service.name}</CardTitle>
                    <CardDescription>{service.description}</CardDescription>
                  </div>
                </div>
                {getStatusBadge(service.status)}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${getStatusColor(service.status)} animate-pulse`} />
                  <span className="text-sm text-muted-foreground">
                    Port: {service.port}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Version: {service.version}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 py-4 border-y">
                <div>
                  <p className="text-sm text-muted-foreground">Data Points</p>
                  <p className="text-lg font-semibold">{service.metrics.dataPoints}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Retention</p>
                  <p className="text-lg font-semibold">{service.metrics.retention}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Queries</p>
                  <p className="text-lg font-semibold">{service.metrics.queries}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  asChild
                >
                  <a href={service.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Open
                  </a>
                </Button>
                
                <div className="flex-1" />
                
                <Button 
                  variant="default" 
                  size="sm"
                  asChild
                >
                  <Link href={`/storage/${service.id}`}>
                    <Settings className="h-4 w-4 mr-1" />
                    Configure
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
