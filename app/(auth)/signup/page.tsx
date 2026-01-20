"use client";

import { Bot, ArrowRight, ArrowLeft, Clock, Building2 } from "lucide-react";
import Link from "next/link";

export default function SignUpPage() {
  return (
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
        <div className="z-10 flex gap-2 relative items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg flex items-center justify-center border bg-white/5 text-white border-white/10">
              <Bot className="h-4 w-4" />
            </div>
            <span className="text-lg font-semibold tracking-tight font-space-grotesk text-white">
              AutoCrew
            </span>
          </Link>
        </div>

        {/* Middle Art Element (Abstract Dashboard Preview) */}
        <div className="relative z-10 mx-auto w-full max-w-md aspect-square mt-12 opacity-80">
          <div className="absolute inset-0 bg-gradient-to-tr from-[#FF6B35]/20 to-transparent rounded-full blur-3xl" />
        </div>

        {/* Testimonial */}
        <div className="relative z-10 mt-12">
          <div className="max-w-md">
            <p className="text-xl font-medium font-space-grotesk text-white mb-4">
              &ldquo;AutoCrew transformed our support workflow overnight. We&apos;re
              handling 5x the volume with zero additional headcount.&rdquo;
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

      {/* Right Column: Request Access Form */}
      <div className="flex flex-col lg:p-12 p-6 overflow-y-auto custom-scrollbar bg-[#03060e] relative items-center justify-center">
        {/* Mobile Logo (hidden on desktop) */}
        <div className="absolute top-0 right-0 p-6 lg:hidden">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg flex items-center justify-center border bg-white/5 text-white border-white/10">
              <Bot className="h-4 w-4" />
            </div>
            <span className="text-lg font-semibold tracking-tight font-space-grotesk text-white">
              AutoCrew
            </span>
          </Link>
        </div>

        <div className="max-w-xl w-full">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-3xl font-semibold text-white tracking-tight font-space-grotesk mb-3">
              Getting started - request access
            </h1>
            <p className="text-base text-slate-400">
              Fill out the details below to request access to the AutoCrew
              workspace.
            </p>
          </div>

          {/* Form */}
          <form className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400 font-space-grotesk">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Alex Chen"
                  className="w-full bg-white/[0.02] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-white/20 focus:bg-white/[0.04] transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400 font-space-grotesk">
                  Work Email
                </label>
                <input
                  type="email"
                  placeholder="alex@company.com"
                  className="w-full bg-white/[0.02] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-white/20 focus:bg-white/[0.04] transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400 font-space-grotesk">
                  Organization
                </label>
                <input
                  type="text"
                  placeholder="Acme Inc."
                  className="w-full bg-white/[0.02] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-white/20 focus:bg-white/[0.04] transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400 font-space-grotesk">
                  Role / Job Title
                </label>
                <input
                  type="text"
                  placeholder="Product Manager"
                  className="w-full bg-white/[0.02] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-white/20 focus:bg-white/[0.04] transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400 font-space-grotesk">
                Intended Use Case
              </label>
              <textarea
                rows={3}
                placeholder="I plan to use AutoCrew to automate our customer support tickets..."
                className="w-full bg-white/[0.02] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-white/20 focus:bg-white/[0.04] transition-all resize-none"
              />
            </div>

            <div className="pt-2">
              <button
                type="button"
                className="w-full bg-white text-black text-sm font-semibold h-10 rounded-lg hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)]"
              >
                Submit Request
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </form>

          {/* Support Info Cards */}
          <div className="mt-10 pt-8 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Response Time */}
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5 text-slate-500">
                <Clock className="h-[18px] w-[18px]" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-white font-space-grotesk">
                  Fast Response
                </h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Our team typically reviews and approves requests within 24-48
                  business hours.
                </p>
              </div>
            </div>

            {/* Existing Org */}
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5 text-slate-500">
                <Building2 className="h-[18px] w-[18px]" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-white font-space-grotesk">
                  Existing Team?
                </h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  If your organization is already on AutoCrew, ask your admin
                  for an invite link.
                </p>
              </div>
            </div>
          </div>

          {/* Footer Link */}
          <div className="mt-8 flex items-center justify-start">
            <Link
              href="/login"
              className="group flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-1 transition-transform" />
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
