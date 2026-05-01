"use client";

import { useState } from "react";
import { ArrowRight, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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

  if (submitted) {
    return (
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
    );
  }

  return (
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
  );
}
