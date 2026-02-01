'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Briefcase, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle, 
  XCircle, 
  Clock,
  AlertCircle,
  Filter,
  MoreHorizontal
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Job {
  id: string;
  name: string;
  type: 'captcha' | 'survey' | 'website' | 'automation';
  status: 'running' | 'completed' | 'failed' | 'queued' | 'paused';
  progress: number;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  worker: string;
  priority: 'high' | 'medium' | 'low';
}

const jobs: Job[] = [
  {
    id: 'job-001',
    name: 'CAPTCHA Batch Processing #4521',
    type: 'captcha',
    status: 'running',
    progress: 67,
    createdAt: '2026-02-01 00:15:00',
    startedAt: '2026-02-01 00:16:30',
    worker: 'CAPTCHA Solver',
    priority: 'high'
  },
  {
    id: 'job-002',
    name: 'Survey Auto-Complete #892',
    type: 'survey',
    status: 'queued',
    progress: 0,
    createdAt: '2026-02-01 00:20:00',
    worker: 'Survey Worker',
    priority: 'medium'
  },
  {
    id: 'job-003',
    name: 'Website Generation #123',
    type: 'website',
    status: 'completed',
    progress: 100,
    createdAt: '2026-02-01 00:00:00',
    startedAt: '2026-02-01 00:01:00',
    completedAt: '2026-02-01 00:05:30',
    worker: 'Website Builder',
    priority: 'low'
  },
  {
    id: 'job-004',
    name: 'n8n Workflow Execution #5567',
    type: 'automation',
    status: 'failed',
    progress: 45,
    createdAt: '2026-01-31 23:50:00',
    startedAt: '2026-01-31 23:51:00',
    worker: 'n8n Orchestrator',
    priority: 'high'
  },
  {
    id: 'job-005',
    name: 'CAPTCHA Batch Processing #4520',
    type: 'captcha',
    status: 'completed',
    progress: 100,
    createdAt: '2026-01-31 23:30:00',
    startedAt: '2026-01-31 23:31:00',
    completedAt: '2026-01-31 23:45:00',
    worker: 'CAPTCHA Solver',
    priority: 'medium'
  }
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'running':
      return <Clock className="h-4 w-4 text-blue-500 animate-pulse" />;
    case 'completed':
      return <CheckCircle className="h-4 w-4 text-emerald-500" />;
    case 'failed':
      return <XCircle className="h-4 w-4 text-red-500" />;
    case 'queued':
      return <Clock className="h-4 w-4 text-gray-500" />;
    case 'paused':
      return <AlertCircle className="h-4 w-4 text-amber-500" />;
    default:
      return <Clock className="h-4 w-4 text-gray-500" />;
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'running':
      return <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">Running</Badge>;
    case 'completed':
      return <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">Completed</Badge>;
    case 'failed':
      return <Badge variant="destructive">Failed</Badge>;
    case 'queued':
      return <Badge variant="secondary">Queued</Badge>;
    case 'paused':
      return <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20">Paused</Badge>;
    default:
      return <Badge variant="secondary">Unknown</Badge>;
  }
};

const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case 'high':
      return <Badge variant="outline" className="text-red-500 border-red-500/20">High</Badge>;
    case 'medium':
      return <Badge variant="outline" className="text-amber-500 border-amber-500/20">Medium</Badge>;
    case 'low':
      return <Badge variant="outline" className="text-blue-500 border-blue-500/20">Low</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

export default function JobsPage() {
  const [jobList, setJobList] = useState(jobs);
  const [filter, setFilter] = useState('all');

  const handlePause = (jobId: string) => {
    console.log(`Pausing job: ${jobId}`);
  };

  const handleResume = (jobId: string) => {
    console.log(`Resuming job: ${jobId}`);
  };

  const handleRestart = (jobId: string) => {
    console.log(`Restarting job: ${jobId}`);
  };

  const handleCancel = (jobId: string) => {
    console.log(`Canceling job: ${jobId}`);
  };

  const filteredJobs = filter === 'all' 
    ? jobList 
    : jobList.filter(job => job.status === filter);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Briefcase className="h-8 w-8 text-blue-500" />
          <h1 className="text-3xl font-bold">Jobs</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Manage and monitor task execution jobs
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Jobs</CardDescription>
            <CardTitle className="text-3xl">{jobList.length}</CardTitle>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Running</CardDescription>
            <CardTitle className="text-3xl text-blue-500">
              {jobList.filter(j => j.status === 'running').length}
            </CardTitle>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Queued</CardDescription>
            <CardTitle className="text-3xl text-gray-500">
              {jobList.filter(j => j.status === 'queued').length}
            </CardTitle>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Completed</CardDescription>
            <CardTitle className="text-3xl text-emerald-500">
              {jobList.filter(j => j.status === 'completed').length}
            </CardTitle>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Failed</CardDescription>
            <CardTitle className="text-3xl text-red-500">
              {jobList.filter(j => j.status === 'failed').length}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Job Queue</CardTitle>
            <div className="flex items-center gap-2">
              <Button 
                variant={filter === 'all' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setFilter('all')}
              >
                All
              </Button>
              <Button 
                variant={filter === 'running' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setFilter('running')}
              >
                Running
              </Button>
              <Button 
                variant={filter === 'queued' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setFilter('queued')}
              >
                Queued
              </Button>
              <Button 
                variant={filter === 'completed' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setFilter('completed')}
              >
                Completed
              </Button>
              <Button 
                variant={filter === 'failed' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setFilter('failed')}
              >
                Failed
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <div 
                key={job.id} 
                className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  {getStatusIcon(job.status)}
                  
                  <div>
                    <p className="font-medium">{job.name}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{job.worker}</span>
                      <span>•</span>
                      <span>Created: {job.createdAt}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {job.status === 'running' && (
                    <div className="w-32">
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 transition-all"
                          style={{ width: `${job.progress}%` }}
                        />
                      </div>
                      <p className="text-xs text-center mt-1">{job.progress}%</p>
                    </div>
                  )}
                  
                  {getPriorityBadge(job.priority)}
                  {getStatusBadge(job.status)}
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {job.status === 'running' && (
                        <DropdownMenuItem onClick={() => handlePause(job.id)}>
                          <Pause className="h-4 w-4 mr-2" />
                          Pause
                        </DropdownMenuItem>
                      )}
                      {job.status === 'paused' && (
                        <DropdownMenuItem onClick={() => handleResume(job.id)}>
                          <Play className="h-4 w-4 mr-2" />
                          Resume
                        </DropdownMenuItem>
                      )}
                      {(job.status === 'failed' || job.status === 'completed') && (
                        <DropdownMenuItem onClick={() => handleRestart(job.id)}>
                          <RotateCcw className="h-4 w-4 mr-2" />
                          Restart
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem 
                        onClick={() => handleCancel(job.id)}
                        className="text-red-500"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Cancel
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
