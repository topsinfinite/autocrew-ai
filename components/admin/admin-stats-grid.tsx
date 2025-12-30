import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Bot, UserCog, TrendingUp } from "lucide-react"

interface AdminStatsGridProps {
  totalClients: number
  activeClients: number
  totalCrews: number
  totalUsers: number
}

export function AdminStatsGrid({
  totalClients,
  activeClients,
  totalCrews,
  totalUsers,
}: AdminStatsGridProps) {
  const stats = [
    {
      title: "Total Clients",
      value: totalClients,
      subtitle: `${activeClients} active`,
      icon: Users,
      color: "text-primary",
    },
    {
      title: "Active Crews",
      value: totalCrews,
      subtitle: "Across all clients",
      icon: Bot,
      color: "text-secondary",
    },
    {
      title: "Total Users",
      value: totalUsers,
      subtitle: "Client admins",
      icon: UserCog,
      color: "text-success",
    },
    {
      title: "Growth Rate",
      value: "+12%",
      subtitle: "vs last month",
      icon: TrendingUp,
      color: "text-success",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <Icon className={cn("h-4 w-4", stat.color)} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {stat.value}
              </div>
              <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ")
}
