'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  LayoutDashboard,
  Activity,
  Settings,
  Users,
  BarChart3,
  FileText,
  Bell,
  Shield,
  ChevronLeft,
  ChevronRight,
  Zap,
  Webhook,
  Terminal,
  Bot,
  Cpu,
  Database,
  HardDrive,
  Briefcase,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Box,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
}

interface NavCategory {
  label: string;
  icon: React.ReactNode;
  items: NavItem[];
}

// Main dashboard items
const mainNavItems: NavItem[] = [
  { label: 'Dashboard', href: '/', icon: <LayoutDashboard className="h-5 w-5" /> },
  { label: 'Analytics', href: '/analytics', icon: <BarChart3 className="h-5 w-5" /> },
  { label: 'Activity Log', href: '/activity', icon: <Activity className="h-5 w-5" /> },
];

// Category: Agents (AI Agents)
const agentsCategory: NavCategory = {
  label: 'Agents',
  icon: <Bot className="h-5 w-5" />,
  items: [
    { label: 'Overview', href: '/agents', icon: <LayoutDashboard className="h-4 w-4" /> },
    { label: 'n8n Orchestrator', href: '/agents/n8n', icon: <Webhook className="h-4 w-4" />, badge: 'Active' },
    { label: 'Agent Zero', href: '/agents/agent-zero', icon: <Terminal className="h-4 w-4" /> },
    { label: 'Steel Browser', href: '/agents/steel', icon: <Box className="h-4 w-4" /> },
    { label: 'Skyvern Solver', href: '/agents/skyvern', icon: <Zap className="h-4 w-4" /> },
  ],
};

// Category: Workers (Task Workers)
const workersCategory: NavCategory = {
  label: 'Workers',
  icon: <Cpu className="h-5 w-5" />,
  items: [
    { label: 'Overview', href: '/workers', icon: <LayoutDashboard className="h-4 w-4" /> },
    { label: 'CAPTCHA Solver', href: '/workers/captcha', icon: <Shield className="h-4 w-4" />, badge: '5 Accounts' },
    { label: 'Survey Worker', href: '/workers/survey', icon: <FileText className="h-4 w-4" /> },
    { label: 'Website Builder', href: '/workers/website', icon: <Box className="h-4 w-4" /> },
  ],
};

// Category: Infrastructure Rooms
const infrastructureCategory: NavCategory = {
  label: 'Infrastructure',
  icon: <Database className="h-5 w-5" />,
  items: [
    { label: 'Overview', href: '/infrastructure', icon: <LayoutDashboard className="h-4 w-4" /> },
    { label: 'PostgreSQL', href: '/infrastructure/postgres', icon: <Database className="h-4 w-4" /> },
    { label: 'Redis Cache', href: '/infrastructure/redis', icon: <Zap className="h-4 w-4" /> },
    { label: 'Vault Secrets', href: '/infrastructure/vault', icon: <Shield className="h-4 w-4" /> },
    { label: 'Cloudflare Tunnel', href: '/infrastructure/cloudflare', icon: <Webhook className="h-4 w-4" /> },
    { label: 'Scira AI Search', href: '/infrastructure/scira', icon: <Box className="h-4 w-4" /> },
  ],
};

// Category: Storage & Monitoring
const storageCategory: NavCategory = {
  label: 'Storage & Monitoring',
  icon: <HardDrive className="h-5 w-5" />,
  items: [
    { label: 'Overview', href: '/storage', icon: <LayoutDashboard className="h-4 w-4" /> },
    { label: 'Prometheus', href: '/storage/prometheus', icon: <BarChart3 className="h-4 w-4" /> },
    { label: 'Grafana', href: '/storage/grafana', icon: <Activity className="h-4 w-4" /> },
    { label: 'Jaeger Tracing', href: '/storage/jaeger', icon: <Terminal className="h-4 w-4" /> },
    { label: 'Loki Logs', href: '/storage/loki', icon: <FileText className="h-4 w-4" /> },
    { label: 'Alertmanager', href: '/storage/alertmanager', icon: <Bell className="h-4 w-4" /> },
  ],
};

// Admin items
const adminNavItems: NavItem[] = [
  { label: 'Jobs', href: '/jobs', icon: <Briefcase className="h-5 w-5" /> },
  { label: 'MoltBot Chat', href: '/moltbot', icon: <MessageSquare className="h-5 w-5" />, badge: 'AI' },
  { label: 'Users', href: '/users', icon: <Users className="h-5 w-5" /> },
  { label: 'API Keys', href: '/api-keys', icon: <Webhook className="h-5 w-5" /> },
  { label: 'Security', href: '/security', icon: <Shield className="h-5 w-5" /> },
  { label: 'Logs', href: '/logs', icon: <Terminal className="h-5 w-5" /> },
  { label: 'Settings', href: '/settings', icon: <Settings className="h-5 w-5" /> },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['Agents', 'Workers']);

  const toggleCategory = (categoryLabel: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryLabel) 
        ? prev.filter(c => c !== categoryLabel)
        : [...prev, categoryLabel]
    );
  };

  const NavLink = ({ item }: { item: NavItem }) => {
    const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

    const content = (
      <Link
        href={item.href}
        className={cn(
          "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200",
          "hover:bg-accent group",
          isActive 
            ? "bg-accent/80 text-accent-foreground font-medium" 
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <span className={cn(
          "transition-colors",
          isActive ? "text-blue-500" : "group-hover:text-foreground"
        )}>
          {item.icon}
        </span>
        {!collapsed && (
          <>
            <span className="flex-1 text-sm">{item.label}</span>
            {item.badge && (
              <span className="bg-blue-500/10 text-blue-500 text-xs px-2 py-0.5 rounded-full">
                {item.badge}
              </span>
            )}
          </>
        )}
      </Link>
    );

    if (collapsed) {
      return (
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>{content}</TooltipTrigger>
          <TooltipContent side="right" className="flex items-center gap-2">
            {item.label}
            {item.badge && (
              <span className="bg-blue-500/10 text-blue-500 text-xs px-2 py-0.5 rounded-full">
                {item.badge}
              </span>
            )}
          </TooltipContent>
        </Tooltip>
      );
    }

    return content;
  };

  const CategorySection = ({ category }: { category: NavCategory }) => {
    const isExpanded = expandedCategories.includes(category.label);
    const hasActiveItem = category.items.some(item => 
      pathname === item.href || pathname.startsWith(`${item.href}/`)
    );

    if (collapsed) {
      return (
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={() => toggleCategory(category.label)}
              className={cn(
                "w-full flex items-center justify-center p-2 rounded-lg transition-all duration-200",
                "hover:bg-accent group",
                hasActiveItem ? "text-blue-500" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {category.icon}
            </button>
          </TooltipTrigger>
          <TooltipContent side="right">
            {category.label}
          </TooltipContent>
        </Tooltip>
      );
    }

    return (
      <div className="space-y-1">
        <button
          type="button"
          onClick={() => toggleCategory(category.label)}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200",
            "hover:bg-accent group text-left",
            hasActiveItem ? "text-blue-500" : "text-muted-foreground hover:text-foreground"
          )}
        >
          <span className={cn(
            "transition-colors",
            hasActiveItem ? "text-blue-500" : "group-hover:text-foreground"
          )}>
            {category.icon}
          </span>
          <span className="flex-1 text-sm font-medium">{category.label}</span>
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
        
        {isExpanded && (
          <div className="ml-4 pl-3 border-l border-border space-y-1">
            {category.items.map((item) => (
              <NavLink key={item.href} item={item} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <TooltipProvider>
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen bg-card border-r transition-all duration-300 flex flex-col",
          collapsed ? "w-16" : "w-64"
        )}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between px-4 border-b shrink-0">
          {!collapsed && (
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-lg leading-tight">SIN-Solver</h1>
                <p className="text-xs text-muted-foreground">Enterprise</p>
              </div>
            </Link>
          )}
          {collapsed && (
            <div className="mx-auto h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Shield className="h-5 w-5 text-white" />
            </div>
          )}
        </div>

        {/* Toggle Button */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute -right-3 top-[60px] h-6 w-6 rounded-full border bg-background shadow-sm z-50"
          onClick={onToggle}
        >
          {collapsed ? (
            <ChevronRight className="h-3 w-3" />
          ) : (
            <ChevronLeft className="h-3 w-3" />
          )}
        </Button>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4 px-2">
          {/* Main Nav */}
          <nav className="space-y-1">
            {mainNavItems.map((item) => (
              <NavLink key={item.href} item={item} />
            ))}
          </nav>

          <Separator className="my-4" />

          {/* Categories */}
          {!collapsed && (
            <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Infrastructure
            </p>
          )}
          <nav className="space-y-1">
            <CategorySection category={agentsCategory} />
            <CategorySection category={workersCategory} />
            <CategorySection category={infrastructureCategory} />
            <CategorySection category={storageCategory} />
          </nav>

          <Separator className="my-4" />

          {/* Admin Nav */}
          {!collapsed && (
            <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Administration
            </p>
          )}
          <nav className="space-y-1">
            {adminNavItems.map((item) => (
              <NavLink key={item.href} item={item} />
            ))}
          </nav>
        </div>

        {/* Footer */}
        <div className="shrink-0 p-4 border-t">
          {!collapsed && (
            <div className="px-3 py-2 rounded-lg bg-accent/50">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>System Online</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                v2.2.0 • API v2
              </p>
            </div>
          )}
          {collapsed && (
            <div className="flex justify-center">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
          )}
        </div>
      </aside>
    </TooltipProvider>
  );
}
