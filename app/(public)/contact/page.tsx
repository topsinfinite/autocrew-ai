"use client";

import { useState } from "react";
import { Mail, MessageSquare, Phone, MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { APP_CONFIG } from "@/lib/constants";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock form submission
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: "", email: "", company: "", message: "" });
    }, 3000);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="pt-16 pb-16 sm:pt-24 sm:pb-24 md:pt-32 md:pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight font-space-grotesk text-foreground mb-6 leading-[1.1]">
            Get in Touch
          </h1>
          <p className="text-xl text-muted-foreground font-geist leading-relaxed">
            Have questions? We'd love to hear from you. Send us a message and
            we'll respond as soon as possible.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Form */}
          <div className="bg-card border border-border rounded-3xl p-8">
            <h2 className="text-2xl font-semibold font-space-grotesk tracking-tight mb-6">
              Send us a message
            </h2>

            {submitted ? (
              <div className="bg-primary/10 border border-primary/20 rounded-xl p-6 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-primary/20 text-primary mb-4">
                  <MessageSquare className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold font-space-grotesk mb-2">
                  Message Sent!
                </h3>
                <p className="text-muted-foreground font-geist">
                  Thank you for reaching out. We'll get back to you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium font-geist mb-2"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background font-geist text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium font-geist mb-2"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background font-geist text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="company"
                    className="block text-sm font-medium font-geist mb-2"
                  >
                    Company Name
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background font-geist text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors"
                    placeholder="Acme Corp"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium font-geist mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background font-geist text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors resize-none"
                    placeholder="Tell us about your project..."
                  />
                </div>

                <Button
                  variant="pill"
                  size="pill-lg"
                  type="submit"
                  className="w-full group"
                >
                  Send Message
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Button>
              </form>
            )}
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-semibold font-space-grotesk tracking-tight mb-6">
                Contact Information
              </h2>
              <p className="text-muted-foreground font-geist mb-8 leading-relaxed">
                Reach out to us through any of these channels, and our team will
                be happy to assist you.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold font-space-grotesk mb-1">
                    Email
                  </h3>
                  <p className="text-muted-foreground font-geist">
                    support@autocrew-ai.com
                  </p>
                  <p className="text-sm text-muted-foreground font-geist">
                    We'll respond within 24 hours
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary">
                  <Phone className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold font-space-grotesk mb-1">
                    Phone
                  </h3>
                  <a
                    href={APP_CONFIG.supportPhoneTel}
                    className="text-muted-foreground font-geist hover:text-primary hover:underline underline-offset-2 transition-colors"
                  >
                    {APP_CONFIG.supportPhoneDisplay}
                  </a>
                  <p className="text-sm text-muted-foreground font-geist mt-1">
                    {APP_CONFIG.supportPhoneHours}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold font-space-grotesk mb-1">
                    Office
                  </h3>
                  <p className="text-muted-foreground font-geist">
                    123 AI Street
                  </p>
                  <p className="text-muted-foreground font-geist">
                    San Francisco, CA 94102
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary">
                  <MessageSquare className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold font-space-grotesk mb-1">
                    Live Chat
                  </h3>
                  <p className="text-muted-foreground font-geist">
                    Available 24/7
                  </p>
                  <p className="text-sm text-muted-foreground font-geist">
                    Click the chat icon in the bottom right
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
