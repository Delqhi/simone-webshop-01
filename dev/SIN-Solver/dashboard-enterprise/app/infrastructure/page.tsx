'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Database, 
  Database as DatabaseIcon, 
  Zap, 
  Shield, 
  Webhook, 
  Box,
  Activity,
  Settings,
  ExternalLink,
  CheckCircle,
  AlertTriangle,
  Server
} from 'lucide-react';

interface InfrastructureService {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  status: 'healthy' | 'warning' | 'error';
  port: number;
  url: string;
  uptime: string;
  version: string;
  metrics: {
    cpu: string;
    memory: string;
    disk: string;
  };
}

const services: InfrastructureService[] = [
  {
    id: 'postgres',
    name: 'PostgreSQL',
    description: 'Primary database for persistent data storage',
    icon: <DatabaseIcon className="h-6 w-6" />,
    status: 'healthy',
    port: 5432,
    url: 'https://postgres.delqhi.com',
    uptime: '45 days',
    version: '15.4',
    metrics: {
      cpu: '12%',
      memory: '2.4 GB',
      disk: '45%'
    }
  },
  {
    id: 'redis',
    name: 'Redis Cache',
    description: 'High-performance caching and session storage',
    icon: <Zap className="h-6 w-6" />,
    status: 'healthy',
    port: 6379,
    url: 'https://redis.delqhi.com',
    uptime: '45 days',
    version: '7.2',
    metrics: {
      cpu: '5%',
      memory: '512 MB',
      disk: 'N/A'
    }
  },
  {
    id: 'vault',
    name: 'Vault Secrets',
    description: 'Secure secrets management and credential storage',
    icon: <Shield className="h-6 w-6" />,
    status: 'healthy',
    port: 8200,
    url: 'https://vault.delqhi.com',
    uptime: '30 days',
    version: '1.15',
    metrics: {
      cpu: '3%',
      memory: '256 MB',
      disk: '12%'
    }
  },
  {
    id: 'cloudflare',
    name: 'Cloudflare Tunnel',
    description: 'Secure tunnel for public access to internal services',
    icon: <Webhook className="h-6 w-6" />,
    status: 'healthy',
    port: 0,
    url: 'https://dash.cloudflare.com',
    uptime: '60 days',
    version: '2024.1',
    metrics: {
      cpu: '1%',
      memory: '128 MB',
      disk: 'N/A'
    }
  },
  {
    id: 'scira',
    name: 'Scira AI Search',
    description: 'Enterprise AI search with authenticated scraping',
    icon: <Box className="h-6 w-6" />,
    status: 'healthy',
    port: 7890,
    url: 'https://scira.delqhi.com',
    uptime: '15 days',
    version: '2.1',
    metrics: {
      cpu: '18%',
      memory: '1.2 GB',
      disk: '25%'
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

export default function InfrastructurePage() {
  const [serviceList, setServiceList] = useState(services);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Server className="h-8 w-8 text-blue-500" />
          <h1 className="text-3xl font-bold">Infrastructure</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Monitor and manage your infrastructure services
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
            <CardDescription>Warnings</CardDescription>
            <CardTitle className="text-3xl text-amber-500">
              {serviceList.filter(s => s.status === 'warning').length}
            </CardTitle>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Avg Uptime</CardDescription>
            <CardTitle className="text-3xl">39 days</CardTitle>
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
                    Uptime: {service.uptime}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Version: {service.version}
                </div>
                {service.port > 0 && (
                  <div className="text-sm text-muted-foreground">
                    Port: {service.port}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4 py-4 border-y">
                <div>
                  <p className="text-sm text-muted-foreground">CPU</p>
                  <p className="text-lg font-semibold">{service.metrics.cpu}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Memory</p>
                  <p className="text-lg font-semibold">{service.metrics.memory}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Disk</p>
                  <p className="text-lg font-semibold">{service.metrics.disk}</p>
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
                  <Link href={`/infrastructure/${service.id}`}>
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
