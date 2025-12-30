import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bot, Users, TrendingUp, ArrowRight } from "lucide-react"

interface ClientOverviewCardProps {
  id: string
  name: string
  companyName: string
  plan: string
  status: string
  crewsCount: number
  usersCount: number
  conversationsCount: number
}

export function ClientOverviewCard({
  id,
  name,
  companyName,
  plan,
  status,
  crewsCount,
  usersCount,
  conversationsCount,
}: ClientOverviewCardProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-500/10 text-green-500"
      case "trial":
        return "bg-blue-500/10 text-blue-500"
      case "inactive":
        return "bg-gray-500/10 text-gray-500"
      default:
        return "bg-gray-500/10 text-gray-500"
    }
  }

  const getPlanColor = (plan: string) => {
    switch (plan.toLowerCase()) {
      case "enterprise":
        return "bg-purple-500/10 text-purple-500"
      case "professional":
        return "bg-primary/10 text-primary"
      case "starter":
        return "bg-secondary/10 text-secondary"
      default:
        return "bg-gray-500/10 text-gray-500"
    }
  }

  return (
    <Card className="transition-all hover:border-primary hover:shadow-md">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">{companyName}</CardTitle>
            <p className="text-sm text-muted-foreground">{name}</p>
          </div>
          <div className="flex gap-2">
            <Badge className={getPlanColor(plan)}>{plan}</Badge>
            <Badge className={getStatusColor(status)}>{status}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <Bot className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Crews</p>
              <p className="text-sm font-semibold text-foreground">{crewsCount}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary/10">
              <Users className="h-4 w-4 text-secondary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Users</p>
              <p className="text-sm font-semibold text-foreground">{usersCount}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-success/10">
              <TrendingUp className="h-4 w-4 text-success" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Conversations</p>
              <p className="text-sm font-semibold text-foreground">
                {conversationsCount}
              </p>
            </div>
          </div>
        </div>
        <Link href={`/admin/clients/${id}`}>
          <Button variant="outline" className="w-full">
            View Details
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
