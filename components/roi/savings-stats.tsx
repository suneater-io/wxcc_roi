"use client"

import { Card } from "@/components/ui/card"
import { TrendingUp, Zap, Clock, DollarSign, Info, Users, Calendar, ArrowRightLeft } from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface SavingsStatsProps {
  fteReclaimed?: number
  paybackMonths?: number
  returnMultiplier?: number
  totalAnnualHours?: number
  isPositive?: boolean
}

export function SavingsStats({
  fteReclaimed = 0,
  paybackMonths = 0,
  returnMultiplier = 0,
  totalAnnualHours = 0,
  isPositive = false,
}: SavingsStatsProps) {
  const stats = [
    {
      value: fteReclaimed.toFixed(2),
      label: "FTE Capacity Reclaimed",
      icon: Users,
      color: "text-blue-600",
      explanation: "The number of Full-Time Equivalent staff members whose time is freed up from manual tasks. Calculated based on a standard 1,920-hour work year (40 hours/week minus leave)."
    },
    {
      value: paybackMonths > 0 && paybackMonths <= 12 ? `${paybackMonths.toFixed(1)} mo` : paybackMonths > 12 ? "> 1 year" : "N/A",
      label: "Payback Period",
      icon: Calendar,
      color: "text-green-600",
      explanation: "The estimated time required to recover the platform investment through operational savings. Calculated as (Annual Platform Cost / Monthly Net Savings)."
    },
    {
      value: `${returnMultiplier.toFixed(1)}x`,
      label: "Return Multiplier",
      icon: ArrowRightLeft,
      color: "text-purple-600",
      explanation: "The ratio of savings to cost. For every $1.00 invested in the platform, your organization realizes this much in operational value."
    },
    {
      value: new Intl.NumberFormat().format(Math.round(totalAnnualHours)),
      label: "Annual Hours Saved",
      icon: Clock,
      color: "text-amber-600",
      explanation: "The total number of staff hours returned to the organization annually across all automated workflows at your projected volumes."
    },
  ]

  return (
    <div className="py-12">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="font-heading text-lg font-bold text-foreground">Organizational Impact</h3>
        <p className="text-xs text-muted-foreground italic">Based on your projected annual volumes</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
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