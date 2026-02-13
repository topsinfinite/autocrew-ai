"use client";

import { useState } from "react";
import { Mail, Lock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/layout";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="antialiased min-h-screen flex selection:bg-[#FF6B35]/20 selection:text-[#FF6B35] text-slate-300 relative bg-[#03060e]">
      <div className="w-full min-h-screen grid lg:grid-cols-2">
        {/* Left Column: Branding / Art */}
        <div className="hidden lg:flex relative flex-col justify-between p-12 overflow-hidden bg-[#0A0C14] border-r border-white/5">
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1600&q=80')" }}
          />
          {/* Grid Overlay */}
          <div className="linear-grid absolute inset-0 opacity-50" />
          {/* Accent Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#FF6B35]/10 blur-[120px] rounded-full opacity-40 pointer-events-none" />

          {/* Logo Area */}
          <div className="z-10 relative">
            <Link href="/">
              <Logo height={19} className="text-white" />
            </Link>
          </div>

          {/* Middle Art Element (Abstract glow) */}
          <div className="relative z-10 mx-auto w-full max-w-md aspect-square mt-12 opacity-80">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#FF6B35]/20 to-transparent rounded-full blur-3xl" />
          </div>

          {/* Testimonial */}
          <div className="relative z-10 mt-12">
            <div className="max-w-md">
              <p className="text-xl font-medium font-space-grotesk text-white mb-4">
                "AutoCrew transformed our support workflow overnight. We're
                handling 5x the volume with zero additional headcount."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 border border-white/10" />
                <div>
                  <div className="text-sm font-medium text-white">Alex Chen</div>
                  <div className="text-xs text-slate-500">CTO, TechFlow Inc.</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Login Form */}
        <div className="flex flex-col lg:p-12 overflow-y-auto custom-scrollbar bg-[#03060e] p-6 relative items-center justify-center">
          {/* Mobile Header */}
          <div className="absolute top-0 right-0 p-6 lg:hidden">
            <Link href="/">
              <Logo height={19} className="text-white" />
            </Link>
          </div>

          <div className="max-w-md w-full">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-semibold text-white tracking-tight font-space-grotesk mb-3">
                Welcome back
              </h1>
              <p className="text-base text-slate-400">
                Enter your credentials to access your workspace.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label
                  htmlFor="email"
                  className="text-xs font-medium text-slate-400 font-space-grotesk"
                >
                  Work Email
                </label>
                <div className="relative group">
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@company.com"
                    required
                    className="w-full bg-white/[0.02] border border-white/10 rounded-lg pl-10 pr-3 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-white/20 focus:bg-white/[0.04] transition-all"
                  />
                  <div className="absolute left-3 top-2.5 text-slate-600 group-focus-within:text-slate-400 transition-colors">
                    <Mail className="h-4 w-4" />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="password"
                  className="text-xs font-medium text-slate-400 font-space-grotesk"
                >
                  Password
                </label>
                <div className="relative group">
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full bg-white/[0.02] border border-white/10 rounded-lg pl-10 pr-3 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-white/20 focus:bg-white/[0.04] transition-all"
                  />
                  <div className="absolute left-3 top-2.5 text-slate-600 group-focus-within:text-slate-400 transition-colors">
                    <Lock className="h-4 w-4" />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-white text-black text-sm font-semibold h-10 rounded-lg hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)]"
                >
                  Sign In
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </form>

            {/* Footer Link */}
            <div className="mt-8 text-center">
              <p className="text-sm text-slate-500">
                Don't have an account?{" "}
                <Link
                  href="/signup"
                  className="text-white font-medium hover:text-[#FF6B35] transition-colors inline-flex items-center gap-1 group"
                >
                  Request access
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
