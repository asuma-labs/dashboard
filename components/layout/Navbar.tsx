"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { Bot, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const { logout, user } = useAuth();

  return (
    <header className="border-b border-slate-800 bg-slate-900/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <Link href="/dashboard" className="text-xl tracking-tight uppercase font-bold text-slate-100">
              Asuma <span className="text-blue-500">MD</span>
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest hidden sm:block">
              {user?.username ? `@${user.username}` : "GUEST_SESSION"}
            </div>
            <Button
              onClick={logout}
              className="bg-transparent border border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span className="text-sm font-medium">Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
