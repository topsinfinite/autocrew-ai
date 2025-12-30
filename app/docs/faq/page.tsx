import { DocNavigation } from "@/components/docs/doc-navigation"
import { faqData } from "@/lib/mock-data/docs-content"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export default function FAQPage() {
  return (
    <div>
      <h1 id="faq" className="mb-4 text-4xl font-bold text-foreground">
        Frequently Asked Questions
      </h1>
      <p className="mb-8 text-lg text-muted-foreground">
        Find answers to common questions about AutoCrew, our AI crews, pricing, and
        more.
      </p>

      <h2 id="general-questions" className="mb-6 text-2xl font-semibold text-foreground">
        General Questions
      </h2>

      <Accordion type="single" collapsible className="mb-12 w-full">
        {faqData.map((item, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="text-left">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <h2 id="still-have-questions" className="mb-4 text-2xl font-semibold text-foreground">
        Still Have Questions?
      </h2>
      <p className="mb-4 text-muted-foreground">
        Can't find the answer you're looking for? Our support team is here to help.
      </p>
      <div className="mb-8 rounded-lg border border-border bg-card p-6">
        <h3 className="mb-2 text-lg font-semibold text-foreground">
          Contact Support
        </h3>
        <p className="mb-4 text-sm text-muted-foreground">
          Get in touch with our team for personalized assistance.
        </p>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>
            <strong>Email:</strong> support@autocrew.ai
          </li>
          <li>
            <strong>Live Chat:</strong> Available 24/7 on our website
          </li>
          <li>
            <strong>Response Time:</strong> Typically within 1 hour
          </li>
        </ul>
      </div>

      <h2 id="additional-resources" className="mb-4 text-2xl font-semibold text-foreground">
        Additional Resources
      </h2>
      <div className="mb-8 grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="mb-2 text-lg font-semibold text-foreground">
            Documentation
          </h3>
          <p className="mb-3 text-sm text-muted-foreground">
            Explore our comprehensive guides and tutorials.
          </p>
          <a
            href="/docs/getting-started"
            className="text-sm font-medium text-primary hover:underline"
          >
            View Documentation →
          </a>
        </div>
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="mb-2 text-lg font-semibold text-foreground">
            Community Forum
          </h3>
          <p className="mb-3 text-sm text-muted-foreground">
            Connect with other AutoCrew users and share insights.
          </p>
          <a
            href="#"
            className="text-sm font-medium text-primary hover:underline"
          >
            Join Community →
          </a>
        </div>
      </div>

      <DocNavigation />
    </div>
  )
}
