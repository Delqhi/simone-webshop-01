'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Cpu, 
  Shield, 
  FileText, 
  Box, 
  Activity,
  Settings,
  ExternalLink,
  Play,
  Pause,
  RotateCcw,
  TrendingUp,
  Users
} from 'lucide-react';

interface Worker {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  status: 'active' | 'inactive' | 'error';
  port: number;
  url: string;
  lastActive: string;
  accounts?: number;
  metrics: {
    tasksCompleted: number;
    successRate: string;
    avgTime: string;
  };
}

const workers: Worker[] = [
  {
    id: 'captcha',
    name: 'CAPTCHA Solver',
    description: 'High-performance CAPTCHA solving with 5-account parallel processing',
    icon: <Shield className="h-6 w-6" />,
    status: 'active',
    port: 8019,
    url: 'https://captcha.delqhi.com',
    lastActive: '1 minute ago',
    accounts: 5,
    metrics: {
      tasksCompleted: 45230,
      successRate: '98.5%',
      avgTime: '12s'
    }
  },
  {
    id: 'survey',
    name: 'Survey Worker',
    description: 'Automated survey completion and form filling worker',
    icon: <FileText className="h-6 w-6" />,
    status: 'active',
    port: 8018,
    url: 'https://survey.delqhi.com',
    lastActive: '3 minutes ago',
    metrics: {
      tasksCompleted: 12890,
      successRate: '96.2%',
      avgTime: '45s'
    }
  },
  {
    id: 'website',
    name: 'Website Builder',
    description: 'Automated website generation and deployment worker',
    icon: <Box className="h-6 w-6" />,
    status: 'active',
    port: 8020,
    url: 'https://website.delqhi.com',
    lastActive: '5 minutes ago',
    metrics: {
      tasksCompleted: 3421,
      successRate: '99.1%',
      avgTime: '3m 20s'
    }
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-emerald-500';
    case 'inactive':
      return 'bg-gray-500';
    case 'error':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'active':
      return <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">Active</Badge>;
    case 'inactive':
      return <Badge variant="secondary">Inactive</Badge>;
    case 'error':
      return <Badge variant="destructive">Error</Badge>;
    default:
      return <Badge variant="secondary">Unknown</Badge>;
  }
};

export default function WorkersPage() {
  const [workerList, setWorkerList] = useState(workers);

  const handleRestart = (workerId: string) => {
    console.log(`Restarting worker: ${workerId}`);
  };

  const handlePause = (workerId: string) => {
    console.log(`Pausing worker: ${workerId}`);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Cpu className="h-8 w-8 text-blue-500" />
          <h1 className="text-3xl font-bold">Task Workers</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Manage and monitor your task execution workers
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Workers</CardDescription>
            <CardTitle className="text-3xl">{workerList.length}</CardTitle>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active</CardDescription>
            <CardTitle className="text-3xl text-emerald-500">
              {workerList.filter(w => w.status === 'active').length}
            </CardTitle>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Tasks Completed</CardDescription>
            <CardTitle className="text-3xl">
              {workerList.reduce((acc, w) => acc + w.metrics.tasksCompleted, 0).toLocaleString()}
            </CardTitle>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Avg Success Rate</CardDescription>
            <CardTitle className="text-3xl">97.9%</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {workerList.map((worker) => (
          <Card key={worker.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-accent">
                    {worker.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">{worker.name}</CardTitle>
                      {worker.accounts && (
                        <Badge variant="secondary" className="text-xs">
                          {worker.accounts} Accounts
                        </Badge>
                      )}
                    </div>
                    <CardDescription>{worker.description}</CardDescription>
                  </div>
                </div>
                {getStatusBadge(worker.status)}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${getStatusColor(worker.status)} animate-pulse`} />
                <span className="text-sm text-muted-foreground">
                  Last active: {worker.lastActive}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4 py-4 border-y">
                <div>
                  <p className="text-sm text-muted-foreground">Tasks Done</p>
                  <p className="text-lg font-semibold">{worker.metrics.tasksCompleted.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Success Rate</p>
                  <p className="text-lg font-semibold text-emerald-500">{worker.metrics.successRate}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg Time</p>
                  <p className="text-lg font-semibold">{worker.metrics.avgTime}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handlePause(worker.id)}
                >
                  <Pause className="h-4 w-4 mr-1" />
                  Pause
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleRestart(worker.id)}
                >
                  <RotateCcw className="h-4 w-4 mr-1" />
                  Restart
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  asChild
                >
                  <a href={worker.url} target="_blank" rel="noopener noreferrer">
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
                  <Link href={`/workers/${worker.id}`}>
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
