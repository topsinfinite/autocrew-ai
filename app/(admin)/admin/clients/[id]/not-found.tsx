import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, ArrowLeft, Building2 } from "lucide-react";

export default function ClientNotFound() {
  return (
    <div className="p-8">
      <Link href="/admin/clients">
        <Button variant="ghost" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Clients
        </Button>
      </Link>

      <Card className="max-w-lg mx-auto mt-12">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Client Not Found</h1>
            <p className="text-muted-foreground max-w-sm">
              The client organization you&apos;re looking for doesn&apos;t exist or you don&apos;t have permission to view it.
            </p>
            <div className="pt-4">
              <Link href="/admin/clients">
                <Button className="gap-2">
                  <Building2 className="h-4 w-4" />
                  View All Clients
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
