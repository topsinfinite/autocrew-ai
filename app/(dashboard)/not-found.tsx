import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileQuestion } from "lucide-react";

export default function DashboardNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <FileQuestion className="h-16 w-16 text-muted-foreground" />
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold">Page Not Found</h2>
        <p className="text-muted-foreground">
          The page you're looking for doesn't exist in the dashboard.
        </p>
      </div>
      <Button asChild>
        <Link href="/dashboard">Return to Dashboard</Link>
      </Button>
    </div>
  );
}
