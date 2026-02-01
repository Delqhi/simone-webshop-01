'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Bot, 
  Webhook, 
  Terminal, 
  Box, 
  Zap,
  Settings,
  ExternalLink,
  Pause,
  RotateCcw
} from 'lucide-react';

interface Agent {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  status: 'active' | 'inactive' | 'error';
  port: number;
  url: string;
  lastActive: string;
  metrics: {
    uptime: string;
    requests: number;
    errors: number;
  };
}

const agents: Agent[] = [
  {
    id: 'n8n',
    name: 'n8n Orchestrator',
    description: 'Workflow automation engine for orchestrating complex task sequences',
    icon: <Webhook className="h-6 w-6" />,
    status: 'active',
    port: 5678,
    url: 'https://n8n.delqhi.com',
    lastActive: '2 minutes ago',
    metrics: {
      uptime: '99.9%',
      requests: 15420,
      errors: 12
    }
  },
  {
    id: 'agent-zero',
    name: 'Agent Zero',
    description: 'AI-powered code generation and autonomous programming agent',
    icon: <Terminal className="h-6 w-6" />,
    status: 'active',
    port: 8050,
    url: 'https://agentzero.delqhi.com',
    lastActive: '5 minutes ago',
    metrics: {
      uptime: '99.5%',
      requests: 8932,
      errors: 45
    }
  },
  {
    id: 'steel',
    name: 'Steel Browser',
    description: 'Stealth web browser with anti-detection capabilities',
    icon: <Box className="h-6 w-6" />,
    status: 'active',
    port: 3005,
    url: 'https://steel.delqhi.com',
    lastActive: '1 minute ago',
    metrics: {
      uptime: '99.8%',
      requests: 25680,
      errors: 23
    }
  },
  {
    id: 'skyvern',
    name: 'Skyvern Solver',
    description: 'Visual AI automation for intelligent UI interaction',
    icon: <Zap className="h-6 w-6" />,
    status: 'active',
    port: 8030,
    url: 'https://skyvern.delqhi.com',
    lastActive: '3 minutes ago',
    metrics: {
      uptime: '99.7%',
      requests: 18750,
      errors: 34
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

export default function AgentsPage() {
  const [agentList] = useState(agents);

  const handleRestart = (agentId: string) => {
    console.log(`Restarting agent: ${agentId}`);
  };

  const handlePause = (agentId: string) => {
    console.log(`Pausing agent: ${agentId}`);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Bot className="h-8 w-8 text-blue-500" />
          <h1 className="text-3xl font-bold">AI Agents</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Manage and monitor your AI agents and automation tools
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Agents</CardDescription>
            <CardTitle className="text-3xl">{agentList.length}</CardTitle>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active</CardDescription>
            <CardTitle className="text-3xl text-emerald-500">
              {agentList.filter(a => a.status === 'active').length}
            </CardTitle>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Requests</CardDescription>
            <CardTitle className="text-3xl">
              {agentList.reduce((acc, a) => acc + a.metrics.requests, 0).toLocaleString()}
            </CardTitle>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Avg Uptime</CardDescription>
            <CardTitle className="text-3xl">99.7%</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {agentList.map((agent) => (
          <Card key={agent.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-accent">
                    {agent.icon}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{agent.name}</CardTitle>
                    <CardDescription>{agent.description}</CardDescription>
                  </div>
                </div>
                {getStatusBadge(agent.status)}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Status Indicator */}
              <div className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${getStatusColor(agent.status)} animate-pulse`} />
                <span className="text-sm text-muted-foreground">
                  Last active: {agent.lastActive}
                </span>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-4 py-4 border-y">
                <div>
                  <p className="text-sm text-muted-foreground">Uptime</p>
                  <p className="text-lg font-semibold">{agent.metrics.uptime}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Requests</p>
                  <p className="text-lg font-semibold">{agent.metrics.requests.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Errors</p>
                  <p className="text-lg font-semibold text-red-500">{agent.metrics.errors}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handlePause(agent.id)}
                >
                  <Pause className="h-4 w-4 mr-1" />
                  Pause
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleRestart(agent.id)}
                >
                  <RotateCcw className="h-4 w-4 mr-1" />
                  Restart
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  asChild
                >
                  <a href={agent.url} target="_blank" rel="noopener noreferrer">
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
                  <Link href={`/agents/${agent.id}`}>
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
