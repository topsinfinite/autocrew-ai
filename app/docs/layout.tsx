import { PublicNav } from "@/components/layout/public-nav";
import { PhoneCallFab } from "@/components/layout/phone-call-fab";
import { DocsSidebar } from "@/components/layout/docs-sidebar";
import { TableOfContents } from "@/components/docs/table-of-contents";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <PublicNav variant="docs" />

      {/* Main Layout */}
      <div className="container flex-1 pt-24">
        <div className="flex min-w-0">
          {/* Left Sidebar */}
          <DocsSidebar className="hidden lg:block" />

          {/* Main Content */}
          <main
            id="main-content"
            className="min-w-0 flex-1 px-4 py-8 sm:px-6 lg:px-12"
          >
            <article className="max-w-none">{children}</article>
          </main>

          {/* Right Sidebar (Table of Contents) */}
          <TableOfContents />
        </div>
      </div>
      <PhoneCallFab />
    </div>
  );
}
