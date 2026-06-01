"use client";

import { useState, useEffect } from "react";
import { useBotStatus } from "@/hooks/useBotStatus";
import { useWebSocket } from "@/hooks/useWebSocket";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Activity, 
  Bot, 
  Clock, 
  Cpu, 
  Database, 
  HardDrive, 
  RefreshCcw, 
  Server,
  Play,
  Square,
  RefreshCw,
  TerminalSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { botService } from "@/services/bot.service";

function formatUptime(seconds: number) {
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor(seconds % (3600 * 24) / 3600);
  const m = Math.floor(seconds % 3600 / 60);
  const s = Math.floor(seconds % 60);

  const parts = [];
  if (d > 0) parts.push(`${d}d`);
  if (h > 0) parts.push(`${h}h`);
  if (m > 0) parts.push(`${m}m`);
  parts.push(`${s}s`);
  return parts.join(' ');
}

export default function DashboardPage() {
  const { status, systemStats, clones, loading, error, refetch } = useBotStatus(30000);
  const { isConnected, lastMessage } = useWebSocket(); // Assuming fallback handles default URL
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});
  const [logs, setLogs] = useState<{content: string, time: string}[]>([]);
  
  // Handle adding websocket messages to logs
  useEffect(() => {
    if (lastMessage) {
      // Append the new message, keep only the last 100 logs
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLogs((prev) => [...prev, { content: lastMessage, time: new Date().toLocaleTimeString() }].slice(-100));
    }
  }, [lastMessage]);

  const handleAction = async (id: string, action: 'start' | 'stop' | 'restart') => {
    setActionLoading(prev => ({ ...prev, [id]: true }));
    try {
      if (action === 'start') {
        await botService.startClone(id);
      } else if (action === 'stop') {
        await botService.stopClone(id);
      } else if (action === 'restart') {
        await botService.restartClone(id);
      }
      // Re-fetch bots explicitly to reflect changes smoothly
      await refetch();
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } }; message?: string };
      console.error(errorObj?.response?.data?.message || errorObj?.message || "Failed to execute action");
    } finally {
      setActionLoading(prev => ({ ...prev, [id]: false }));
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-4">
        <div className="bg-red-500/10 p-4 rounded-full">
          <Activity className="h-10 w-10 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-100">Failed to load data</h2>
        <p className="text-gray-400">{error}</p>
        <Button onClick={() => refetch()} className="mx-auto">
          <RefreshCcw className="mr-2 h-4 w-4" /> Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header and WS connection status */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 bg-slate-900/50 p-6 rounded-xl border border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-medium">Dashboard</span>
          <span className="text-slate-700">/</span>
          <span className="text-slate-200 font-medium tracking-tight">Main Infrastructure</span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Live Status</span>
            <div className={`flex items-center gap-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tighter ${isConnected ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
              <div className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
              {isConnected ? "Connected" : "Disconnected"}
            </div>
          </div>
          <Button onClick={() => refetch()} disabled={loading} className="bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-300">
            <RefreshCcw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 flex flex-col justify-between h-[120px]">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Total Clones</p>
          <div className="flex items-end justify-between">
            {loading ? (
              <Skeleton className="h-9 w-20" />
            ) : (
              <h3 className="text-3xl font-bold font-mono text-slate-100">{status?.clones || 0}</h3>
            )}
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
              <Bot className="h-5 w-5" />
            </div>
          </div>
        </div>
        
        <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 flex flex-col justify-between h-[120px]">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Bot Uptime</p>
          <div className="flex items-end justify-between">
            {loading ? (
              <Skeleton className="h-9 w-24" />
            ) : (
              <h3 className="text-3xl font-bold font-mono text-green-400">
                {status?.uptime ? formatUptime(status.uptime) : "0s"}
              </h3>
            )}
            <div className="p-2 bg-green-500/10 rounded-lg text-green-400">
              <Clock className="h-5 w-5" />
            </div>
          </div>
        </div>
        
        <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 flex flex-col justify-between h-[120px]">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">RAM Usage</p>
          <div className="flex items-end justify-between">
            {loading ? (
              <Skeleton className="h-9 w-24" />
            ) : (
              <h3 className="text-3xl font-bold font-mono text-slate-100">
                {systemStats?.ram_used || "0MB"}
                <span className="text-slate-600 text-lg italic font-normal ml-1">/ {systemStats?.ram_total || "0GB"}</span>
              </h3>
            )}
            <div className="p-2 bg-orange-500/10 rounded-lg text-orange-400">
              <Database className="h-5 w-5" />
            </div>
          </div>
        </div>
        
        <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 flex flex-col justify-between h-[120px]">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Platform</p>
          <div className="flex items-end justify-between">
            {loading ? (
              <Skeleton className="h-9 w-20" />
            ) : (
              <h3 className="text-2xl font-bold uppercase truncate text-slate-100">{systemStats?.platform || "Unknown"}</h3>
            )}
            <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
              <Server className="h-5 w-5" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* System Stats Section */}
        <div className="col-span-1 bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-800/30">
             <h4 className="text-sm font-bold uppercase tracking-wider text-slate-100">System Health</h4>
             <span className="text-[10px] text-blue-500 font-mono tracking-widest font-bold">REALTIME</span>
          </div>
          <div className="p-5 space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400 uppercase font-bold tracking-widest text-[10px]">CPU Usage</span>
                {loading ? <Skeleton className="h-4 w-8" /> : (
                  <span className="font-mono text-slate-200">{systemStats?.cpu_usage || "0%"}</span>
                )}
              </div>
              <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: systemStats?.cpu_usage || "0%" }}></div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400 uppercase font-bold tracking-widest text-[10px]">RAM Allocation</span>
                {loading ? <Skeleton className="h-4 w-20" /> : (
                  <span className="font-mono text-slate-200">
                    {systemStats?.ram_used || "0MB"} / {systemStats?.ram_total || "0MB"}
                  </span>
                )}
              </div>
              <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div className="h-full bg-orange-500 rounded-full" style={{ width: '50%' }}></div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-800/50">
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-center">
                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-1.5">Public Mode</p>
                {loading ? <Skeleton className="h-5 w-16 mx-auto" /> : (
                  <Badge variant={status?.public ? "success" : "default"}>
                    {status?.public ? "Enabled" : "Disabled"}
                  </Badge>
                )}
              </div>
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-center">
                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-1.5">Bot Status</p>
                <div className="flex justify-center">
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-green-500/10 text-green-500 border border-green-500/20">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div> Active
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Clones Table */}
        <div className="col-span-1 lg:col-span-2 bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-800/30">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-100">Active Bot Clones</h4>
            <span className="text-[10px] font-mono text-slate-500 font-bold">Total: {clones?.length || 0}</span>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">ID</TableHead>
                <TableHead>Instance Identity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Uptime</TableHead>
                <TableHead className="text-right">Controls</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-6 w-8 rounded" /></TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-2 w-20" />
                      </div>
                    </TableCell>
                    <TableCell><Skeleton className="h-5 w-16 rounded-full" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-4 w-16 inline-block" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-8 w-24 inline-block ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : clones && clones.length > 0 ? (
                clones.map((clone, index) => (
                  <TableRow key={clone.id}>
                    <TableCell>
                      <div className="w-8 h-8 rounded bg-slate-950 flex items-center justify-center font-mono text-xs text-blue-400 border border-slate-800">
                        {String(index + 1).padStart(2, '0')}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-semibold text-sm text-slate-200">{clone.name}</div>
                      <div className="text-[10px] font-mono text-slate-500 mt-0.5">UUID: {clone.id}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={clone.status === "online" ? "success" : "error"}>
                        {clone.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono text-xs text-slate-400">
                      {clone.uptime ? formatUptime(clone.uptime) : "--:--:--"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        {clone.status === "online" ? (
                          <>
                            <Button 
                              className="h-8 px-2 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
                              onClick={() => handleAction(clone.id, 'restart')}
                              disabled={actionLoading[clone.id]}
                              title="Restart"
                            >
                              <RefreshCw className={`h-4 w-4 ${actionLoading[clone.id] ? 'animate-spin' : ''}`} />
                            </Button>
                            <Button 
                              className="h-8 px-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20"
                              onClick={() => handleAction(clone.id, 'stop')}
                              disabled={actionLoading[clone.id]}
                              title="Stop"
                            >
                              <Square className="h-4 w-4 fill-current" />
                            </Button>
                          </>
                        ) : (
                          <Button 
                            className="h-8 px-2 bg-green-500/10 hover:bg-green-500/20 text-green-500 border border-green-500/20"
                            onClick={() => handleAction(clone.id, 'start')}
                            disabled={actionLoading[clone.id]}
                            title="Start"
                          >
                            <Play className="h-4 w-4 fill-current" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-slate-500 text-sm">
                    <Bot className="h-6 w-6 text-slate-600 mx-auto mb-2" />
                    No clone bots found in fleet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Real-time Logs Terminal */}
      <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden mt-6 mb-6">
        <div className="px-5 py-3 border-b border-slate-800 flex justify-between items-center bg-slate-900">
           <div className="flex items-center gap-2">
             <TerminalSquare className="w-4 h-4 text-slate-500" />
             <h4 className="text-sm font-bold tracking-wider text-slate-400">Diagnostic Output</h4>
           </div>
           <div className="flex items-center gap-2">
             <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
             <span className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-widest">{isConnected ? "STREAMING" : "OFFLINE"}</span>
           </div>
        </div>
        <div className="p-4 h-64 overflow-y-auto font-mono text-xs text-slate-300 space-y-1 bg-black/50" id="terminal-scroll">
          {logs.length === 0 ? (
            <div className="text-slate-600 italic">Waiting for broadcast streams...</div>
          ) : (
            logs.map((log, index) => (
              <div key={index} className="flex gap-3">
                <span className="text-slate-600 select-none">[{log.time}]</span>
                <span className="break-all">{log.content}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
