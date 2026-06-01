"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Bot } from "lucide-react";
import { authService } from "@/services/auth.service";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
  const router = useRouter();
  const { setToken, setUser } = useAuth();
  
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await authService.login(identifier, password);
      if (response.success && response.data) {
        setToken(response.data.token);
        setUser(response.data.user);
        router.push("/dashboard");
      } else {
        setError(response.message || "Failed to login. Please try again.");
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      setError(error?.response?.data?.message || error?.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col items-center justify-center text-center mb-8">
        <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/20">
          <Bot className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-3xl tracking-tight uppercase font-bold text-slate-100 flex gap-2">
          Asuma <span className="text-blue-500">MD</span>
        </h2>
        <p className="mt-3 text-[10px] font-bold uppercase tracking-widest text-slate-500">System Authentication</p>
      </div>

      <Card className="w-full shadow-2xl shadow-black/50 border-slate-800 bg-slate-900/80 backdrop-blur-sm">
        <CardHeader className="bg-transparent border-b border-slate-800">
          <CardTitle className="text-slate-300">Access Key Required</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 text-[11px] font-mono text-red-400 bg-red-950/30 border border-red-500/20 rounded">
                [ERROR] {error}
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500" htmlFor="identifier">
                Identity Sequence
              </label>
              <Input
                id="identifier"
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Enter your username"
                disabled={loading}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500" htmlFor="password">
                Security Passphrase
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                disabled={loading}
                required
              />
            </div>

            <Button type="submit" className="w-full h-11 text-xs" disabled={loading}>
              {loading ? "Authenticating..." : "Initialize Session"}
            </Button>

            <div className="text-center text-xs text-slate-500 mt-6 pt-4 border-t border-slate-800">
              NO ACCESS CLEARANCE?{" "}
              <Link href="/register" className="font-bold uppercase tracking-wider text-blue-500 hover:text-blue-400 transition-colors ml-2">
                Request Account
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
