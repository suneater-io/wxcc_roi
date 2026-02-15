"use client"

import { Card } from "@/components/ui/card"
import { Target, CalendarDays, DollarSign, Info } from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface BreakEvenStatsProps {
  annualBreakEven: number
  monthlyBreakEven: number
  netValuePerInteraction: number
}

export function BreakEvenStats({
  annualBreakEven,
  monthlyBreakEven,
  netValuePerInteraction,
}: BreakEvenStatsProps) {
  const stats = [
    {
      value: new Intl.NumberFormat().format(annualBreakEven),
      label: "Annual Break-Even",
      icon: Target,
      color: "text-primary",
      unit: "interactions / year",
      explanation: "The total number of automated interactions required per year to cover the platform's fixed costs. Every interaction beyond this point generates net operational value."
    },
    {
      value: new Intl.NumberFormat().format(monthlyBreakEven),
      label: "Monthly Break-Even",
      icon: CalendarDays,
      color: "text-primary",
      unit: "interactions / month",
      explanation: "The average number of interactions needed each month to reach the break-even point. This helps track progress against monthly volume targets."
    },
    {
      value: new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
      }).format(netValuePerInteraction),
      label: "Net Value / Interaction",
      icon: DollarSign,
      color: "text-primary",
      unit: "combined per set",
      explanation: "The direct operational benefit realized every time a workflow set runs. Calculated as (Manual Labour Saved + Material Savings) - (Digital Channel Costs)."
    },
  ]

  return (
    <div className="py-12">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="font-heading text-lg font-bold text-foreground">Break-Even Analysis</h3>
        <p className="text-xs text-muted-foreground italic">Efficiency targets for platform recovery</p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Popover key={index}>
              <PopoverTrigger asChild>
                <Card className="flex cursor-pointer flex-col items-center justify-center p-6 text-center hover:shadow-lg transition-shadow bg-card relative group border-primary/10">
                  <div className="absolute top-3 right-3 opacity-20 group-hover:opacity-100 transition-opacity">
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className={`mb-4 rounded-full p-3 bg-muted/50 group-hover:bg-white transition-colors`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div className={`text-4xl font-bold text-foreground mb-2`}>
                    {stat.value}
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </p>
                  <p className="mt-1 text-[10px] text-muted-foreground/60">
                    {stat.unit}
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