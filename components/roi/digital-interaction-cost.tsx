"use client"

import { useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Zap, Users } from "lucide-react"

export interface InteractionCosts {
  smsPerSegmentCost: number
  wxConnectRemoteRunCost: number
  emailSendCost: number
}

interface DigitalInteractionCostProps {
  costs: InteractionCosts
  onChange: (costs: InteractionCosts) => void
  staffHourlyCost: number
  onStaffHourlyCostChange: (value: number) => void
}

function CurrencyField({
  id,
  label,
  description,
  value,
  onChange,
  step = "0.001",
}: {
  id: string
  label: string
  description: string
  value: number
  onChange: (v: number) => void
  step?: string
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-medium">
        {label}
      </Label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
          $
        </span>
        <Input
          id={id}
          type="number"
          step={step}
          min="0"
          value={value}
          onChange={(e) => onChange(Number.parseFloat(e.target.value) || 0)}
          className="pl-7"
        />
      </div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  )
}

export function DigitalInteractionCost({
  costs,
  onChange,
  staffHourlyCost,
  onStaffHourlyCostChange,
}: DigitalInteractionCostProps) {
  const update = (field: keyof InteractionCosts, value: number) => {
    onChange({ ...costs, [field]: value })
  }

  const totalPerInteraction = useMemo(
    () =>
      costs.smsPerSegmentCost +
      costs.wxConnectRemoteRunCost +
      costs.emailSendCost,
    [costs]
  )

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Zap className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="font-heading text-lg">
              Interaction Costs
            </CardTitle>
            <CardDescription>
              Human labour and digital channel unit rates used to calculate per-workflow costs
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Human Cost sub-section */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
              <Users className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Human Cost</p>
              <p className="text-xs text-muted-foreground">
                Labour cost baseline for savings calculations
              </p>
            </div>
          </div>
          <div className="max-w-xs">
            <CurrencyField
              id="staff-hourly"
              label="Staff Hourly Rate"
              description="Average fully-loaded labour cost per hour (salary + benefits + overheads)"
              value={staffHourlyCost}
              onChange={onStaffHourlyCostChange}
              step="0.01"
            />
          </div>
        </div>

        <Separator />

        {/* Digital channel rates */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
              <Zap className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Digital Channel Unit Rates</p>
              <p className="text-xs text-muted-foreground">
                Multiplied by each workflow's channel usage to compute cost per flow
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <CurrencyField
              id="sms-segment"
              label="SMS per Segment Cost"
              description="Cost per SMS segment sent"
              value={costs.smsPerSegmentCost}
              onChange={(v) => update("smsPerSegmentCost", v)}
            />
            <CurrencyField
              id="wx-connect"
              label="WX Connect Remote Run Cost"
              description="Cisco WX Connect per-run execution cost"
              value={costs.wxConnectRemoteRunCost}
              onChange={(v) => update("wxConnectRemoteRunCost", v)}
            />
            <CurrencyField
              id="email-send"
              label="Email Send Cost"
              description="Cost per outbound email sent"
              value={costs.emailSendCost}
              onChange={(v) => update("emailSendCost", v)}
            />
          </div>
        </div>

        <Separator />

        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Combined Unit Rate (all channels)
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Per-workflow cost is calculated from each workflow's actual channel usage
            </p>
          </div>
          <p className="font-heading text-3xl font-bold text-foreground">
            $
            {totalPerInteraction < 0.01
              ? totalPerInteraction.toFixed(4)
              : totalPerInteraction.toFixed(3)}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
