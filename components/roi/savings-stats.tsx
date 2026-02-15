"use client"

import { Card } from "@/components/ui/card"
import { TrendingUp, Zap, Clock, DollarSign, Info } from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

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
      explanation: "Calculated as (Manual Labor Cost - Digital Channel Cost) / Manual Labor Cost. This represents the percentage of human labor cost eliminated by switching to a digital workflow."
    },
    {
      value: `${timeReductionPercentage}%`,
      label: "Est. Time Reduction",
      icon: Clock,
      color: "text-blue-600",
      explanation: "Compares your 'Minutes Removed' against an industry baseline of 45 minutes for manual coordination and data entry per workflow."
    },
    {
      value: `${errorReductionPercentage}%`,
      label: "Platform Error Reduction",
      icon: Zap,
      color: "text-amber-600",
      explanation: "A fixed industry benchmark representing the typical reduction in human errors (like transcription mistakes) when moving to structured digital automation."
    },
    {
      value: `$${costPerInteraction.toFixed(2)}`,
      label: "Digital Cost / Interaction",
      icon: DollarSign,
      color: "text-purple-600",
      explanation: "The average 'out-of-pocket' cost for digital channels (SMS, Email, WX Connect) for a single execution of your automated workflows."
    },
  ]

  return (
    <div className="py-12">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Popover key={index}>
              <PopoverTrigger asChild>
                <Card className="flex cursor-pointer flex-col items-center justify-center p-6 text-center hover:shadow-lg transition-shadow bg-card relative group">
                  <div className="absolute top-3 right-3 opacity-20 group-hover:opacity-100 transition-opacity">
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <Icon className={`h-8 w-8 ${stat.color} mb-4`} />
                  <div className={`text-4xl font-bold ${stat.color} mb-2`}>
                    {stat.value}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {stat.label}
                  </p>
                  <p className="mt-2 text-[10px] uppercase tracking-wider text-muted-foreground/50 group-hover:text-muted-foreground/80 transition-colors">
                    Click for details
                  </p>
                </Card>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-2">
                  <h4 className="font-heading font-bold leading-none text-foreground">{stat.label}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {stat.explanation}
                  </p>
                </div>
              </PopoverContent>
            </Popover>
          )
        })}
      </div>
    </div>
  )
}