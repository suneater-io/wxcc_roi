'use client'

import { Card } from "@/components/ui/card"
import { TrendingUp, Zap, Clock, DollarSign } from "lucide-react"

interface SavingsStatsProps {
  savingsPercentage?: number
  timeReductionPercentage?: number
  errorReductionPercentage?: number
  costPerInteraction?: number
}

export function SavingsStats({
  savingsPercentage = 42,
  timeReductionPercentage = 68,
  errorReductionPercentage = 85,
  costPerInteraction = 12.50,
}: SavingsStatsProps) {
  const stats = [
    {
      value: `${savingsPercentage}%`,
      label: "Efficiency Gain per Flow",
      icon: TrendingUp,
      color: "text-green-600",
    },
    {
      value: `${timeReductionPercentage}%`,
      label: "Est. Time Reduction",
      icon: Clock,
      color: "text-blue-600",
    },
    {
      value: `${errorReductionPercentage}%`,
      label: "Platform Error Reduction",
      icon: Zap,
      color: "text-amber-600",
    },
    {
      value: `$${costPerInteraction.toFixed(2)}`,
      label: "Digital Cost / Interaction",
      icon: DollarSign,
      color: "text-purple-600",
    },
  ]

  return (
    <div className="py-12">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="flex flex-col items-center justify-center p-6 text-center hover:shadow-lg transition-shadow bg-card">
              <Icon className={`h-8 w-8 ${stat.color} mb-4`} />
              <div className={`text-4xl font-bold ${stat.color} mb-2`}>
                {stat.value}
              </div>
              <p className="text-sm text-muted-foreground">
                {stat.label}
              </p>
            </Card>
          )
        })}
      </div>
    </div>
  )
}