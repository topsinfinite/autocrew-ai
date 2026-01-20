"use client";

import Link from "next/link";
import { ArrowRight, Mail, Calendar, Bot, Github, Linkedin } from "lucide-react";

export function CtaSection() {
  return (
    <section className="sm:px-6 sm:mt-10 font-space-grotesk max-w-7xl mt-8 mx-auto mb-16 px-4">
      <div className="group overflow-hidden sm:p-10 transition-colors duration-500 text-white bg-[#0A0C14] border-white/10 border rounded-[40px] p-6 relative shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)]">
        {/* Background Effects */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Subtle top-left light */}
          <div className="absolute inset-0 bg-[radial-gradient(1000px_800px_at_0%_0%,rgba(255,255,255,0.02),transparent_100%)]" />
          {/* Burnt Orange Glow bottom-right */}
          <div className="absolute inset-0 bg-[radial-gradient(1000px_800px_at_100%_100%,rgba(255,107,53,0.12),transparent_100%)]" />
          {/* Texture Grid */}
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff0d_1px,transparent_1px)] [background-size:20px_20px] opacity-[0.2]" />
        </div>

        <div className="relative z-10">
          {/* Large Typography Headline */}
          <h2 className="text-[14vw] sm:text-[10vw] lg:text-[8vw] leading-[0.9] font-semibold tracking-tighter font-geist mb-12">
            <span className="block font-space-grotesk text-white">Ready to build</span>
            <span className="block text-white/40 transition-colors duration-700 font-space-grotesk">
              something extraordinary?
            </span>
          </h2>

          {/* Contact Grid */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Email */}
            <div className="flex flex-col items-start">
              <p className="uppercase text-xs font-semibold text-[#FF6B35] tracking-wider font-space mb-3">
                SEND US AN EMAIL
              </p>
              <a
                href="mailto:hello@autocrew.com"
                className="inline-flex items-center gap-3 text-lg sm:text-xl font-medium tracking-tight text-white hover:text-[#FF6B35] transition-colors font-geist group/link"
              >
                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#FF6B35] group-hover/link:bg-[#FF6B35]/10 group-hover/link:border-[#FF6B35]/20 transition-colors">
                  <Mail className="w-4 h-4" />
                </div>
                <span className="break-all">hello@autocrew.com</span>
              </a>
            </div>

            {/* Call */}
            <div className="flex flex-col items-start">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#FF6B35] font-space mb-3">
                Schedule a Call
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 text-sm font-semibold text-black tracking-tight bg-[#FF6B35] hover:bg-[#FF6B35]/90 border border-transparent rounded-full py-3 px-6 transition-all duration-200 shadow-[0_0_20px_-5px_rgba(255,107,53,0.4)] group/btn"
              >
                <Calendar className="w-4 h-4" />
                <span className="font-space">Book a Meeting</span>
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            {/* Try AutoCrew */}
            <div className="flex flex-col items-start">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#FF6B35] font-space mb-3">
                Try AutoCrew
              </p>
              <div className="flex flex-col gap-4 w-full sm:w-auto">
                <Link
                  href="/signup"
                  className="group/btn inline-flex items-center justify-center gap-2 text-sm font-semibold text-[#03060e] tracking-tight bg-white hover:bg-slate-200 border border-transparent rounded-full px-6 py-3 transition-all duration-200 shadow-[0_0_15px_-3px_rgba(255,255,255,0.3)] font-space"
                >
                  Start for free
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors pl-1 font-geist group/link"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-600 group-hover/link:bg-[#FF6B35] transition-colors" />
                  <span>
                    Already a member?{" "}
                    <span className="text-white group-hover/link:text-[#FF6B35] transition-colors">
                      Sign in
                    </span>
                  </span>
                </Link>
              </div>
            </div>
          </div>

          {/* Footer Section */}
          <div className="flex flex-col gap-12 mt-16 w-full">
            {/* Top Section */}
            <div className="flex flex-col lg:flex-row justify-between gap-12 lg:gap-24">
              {/* Brand */}
              <div className="flex flex-col max-w-sm gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-black">
                    <Bot className="w-5 h-5" strokeWidth={2.5} />
                  </div>
                  <span className="text-xl font-semibold text-white font-space-grotesk tracking-tight">
                    AutoCrew
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-slate-400 font-geist">
                  AI-powered automation for modern businesses. Deploy intelligent crews that work
                  24/7 to transform your operations.
                </p>
                <div className="flex gap-5">
                  <a
                    href="#"
                    className="text-slate-400 hover:text-white transition-colors"
                    aria-label="X"
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>
                  <a
                    href="#"
                    className="text-slate-400 hover:text-white transition-colors"
                    aria-label="GitHub"
                  >
                    <Github className="w-5 h-5" />
                  </a>
                  <a
                    href="#"
                    className="text-slate-400 hover:text-white transition-colors"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                </div>
              </div>

              {/* Navigation Columns */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-16 w-full lg:w-auto">
                {/* Product */}
                <div className="flex flex-col gap-4">
                  <h3 className="text-sm font-semibold text-white font-space-grotesk">Product</h3>
                  <div className="flex flex-col gap-3 text-sm text-slate-400 font-geist">
                    <Link href="/#features" className="hover:text-white transition-colors">
                      Features
                    </Link>
                    <Link href="/#solutions" className="hover:text-white transition-colors">
                      Support Crew
                    </Link>
                    <Link href="/#solutions" className="hover:text-white transition-colors">
                      LeadGen Crew
                    </Link>
                    <Link href="/#pricing" className="hover:text-white transition-colors">
                      Pricing
                    </Link>
                    <Link href="#" className="hover:text-white transition-colors">
                      Changelog
                    </Link>
                  </div>
                </div>

                {/* Resources */}
                <div className="flex flex-col gap-4">
                  <h3 className="text-sm font-semibold text-white font-space-grotesk">Resources</h3>
                  <div className="flex flex-col gap-3 text-sm text-slate-400 font-geist">
                    <Link href="/docs" className="hover:text-white transition-colors">
                      Documentation
                    </Link>
                    <Link href="/docs" className="hover:text-white transition-colors">
                      Getting Started
                    </Link>
                    <Link href="/docs" className="hover:text-white transition-colors">
                      User Guide
                    </Link>
                    <Link href="#" className="hover:text-white transition-colors">
                      FAQ
                    </Link>
                  </div>
                </div>

                {/* Legal */}
                <div className="flex flex-col gap-4">
                  <h3 className="text-sm font-semibold text-white font-space-grotesk">Legal</h3>
                  <div className="flex flex-col gap-3 text-sm text-slate-400 font-geist">
                    <Link href="#" className="hover:text-white transition-colors">
                      Privacy Policy
                    </Link>
                    <Link href="#" className="hover:text-white transition-colors">
                      Terms of Service
                    </Link>
                    <Link href="#" className="hover:text-white transition-colors">
                      Security
                    </Link>
                    <Link href="#" className="hover:text-white transition-colors">
                      Compliance
                    </Link>
                  </div>
                </div>

                {/* Company */}
                <div className="flex flex-col gap-4">
                  <h3 className="text-sm font-semibold text-white font-space-grotesk">Company</h3>
                  <div className="flex flex-col gap-3 text-sm text-slate-400 font-geist">
                    <Link href="#" className="hover:text-white transition-colors">
                      About
                    </Link>
                    <Link href="/contact" className="hover:text-white transition-colors">
                      Contact
                    </Link>
                    <Link href="#" className="hover:text-white transition-colors">
                      Blog
                    </Link>
                    <Link href="#" className="hover:text-white transition-colors">
                      Careers
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Section */}
            <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/10 gap-4 mt-4">
              <p className="text-sm text-slate-400 font-geist">
                © 2026 AutoCrew. All rights reserved.
              </p>
              <div className="flex gap-6 text-sm text-slate-400 font-geist">
                <Link href="#" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
                <Link href="#" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
