"use client"

import { useMemo, useState } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Server, Plus, Trash2, ChevronDown, Bot } from "lucide-react"
import { CurrencyField, NumberField } from "./input-fields"
import { formatCurrency } from "@/lib/utils"

export interface ThirdPartyService {
  id: string
  name: string
  monthlyCost: number
}

export interface AiCosts {
  agentUnitsPerMonth: number
  agentUnitPrice: number
  assistantUnitsPerMonth: number
  assistantUnitPrice: number
}

export interface PlatformCosts {
  platformCostPerMonth: number
  phoneLineMonthly: number
  smsServiceMonthly: number
  thirdPartyServices: ThirdPartyService[]
  aiCosts: AiCosts
  periodMonths: number
}

interface PlatformInputsProps {
  costs: PlatformCosts
  onChange: (costs: PlatformCosts) => void
}

export function PlatformInputs({ costs, onChange }: PlatformInputsProps) {
  const [aiPricingOpen, setAiPricingOpen] = useState(false)

  const update = (field: keyof PlatformCosts, value: number) => {
    onChange({ ...costs, [field]: value })
  }

  const updateAi = (field: keyof AiCosts, value: number) => {
    onChange({ ...costs, aiCosts: { ...costs.aiCosts, [field]: value } })
  }

  const thirdPartyTotal = useMemo(
    () => costs.thirdPartyServices.reduce((sum, s) => sum + s.monthlyCost, 0),
    [costs.thirdPartyServices]
  )

  const aiMonthlyTotal = useMemo(
    () =>
      costs.aiCosts.agentUnitsPerMonth * costs.aiCosts.agentUnitPrice +
      costs.aiCosts.assistantUnitsPerMonth * costs.aiCosts.assistantUnitPrice,
    [costs.aiCosts]
  )

  const totalMonthly = useMemo(
    () =>
      costs.platformCostPerMonth +
      costs.phoneLineMonthly +
      costs.smsServiceMonthly +
      thirdPartyTotal +
      aiMonthlyTotal,
    [costs.platformCostPerMonth, costs.phoneLineMonthly, costs.smsServiceMonthly, thirdPartyTotal, aiMonthlyTotal]
  )

  const addService = () => {
    onChange({
      ...costs,
      thirdPartyServices: [
        ...costs.thirdPartyServices,
        { id: `svc-${Date.now()}`, name: "", monthlyCost: 0 },
      ],
    })
  }

  const removeService = (id: string) => {
    onChange({
      ...costs,
      thirdPartyServices: costs.thirdPartyServices.filter((s) => s.id !== id),
    })
  }

  const updateService = (
    id: string,
    field: keyof Omit<ThirdPartyService, "id">,
    value: string | number
  ) => {
    onChange({
      ...costs,
      thirdPartyServices: costs.thirdPartyServices.map((s) =>
        s.id === id ? { ...s, [field]: value } : s
      ),
    })
  }

  const totalForPeriod = totalMonthly * costs.periodMonths

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Server className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="font-heading text-lg">
              Flex 3 for Contact Center Cost
            </CardTitle>
            <CardDescription>
              Monthly Cisco Flex 3 infrastructure, services, and AI fees
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <CurrencyField
            id="platform-cost"
            label="Flex 3 / Month"
            description="Monthly cost for Agents and IVR's. Default is 5 std, 2 Prm, 5 IVR"
            value={costs.platformCostPerMonth}
            onChange={(v) => update("platformCostPerMonth", v)}
          />
          <CurrencyField
            id="phone-line"
            label="Phone Line Monthly"
            description="Telephony line rental / usage"
            value={costs.phoneLineMonthly}
            onChange={(v) => update("phoneLineMonthly", v)}
          />
          <CurrencyField
            id="sms-service"
            label="SMS Service Monthly"
            description="Monthly SMS service subscription"
            value={costs.smsServiceMonthly}
            onChange={(v) => update("smsServiceMonthly", v)}
          />
        </div>

        <Separator />

        {/* AI Costs */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
              <Bot className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">AI Costs</p>
              <p className="text-xs text-muted-foreground">
                Cisco AI Agent and Assistant monthly consumption
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <NumberField
              id="ai-agent-units"
              label="AI Agent Units / Month"
              description="Number of Cisco AI Agent units consumed monthly"
              value={costs.aiCosts.agentUnitsPerMonth}
              onChange={(v) => updateAi("agentUnitsPerMonth", v)}
            />
            <NumberField
              id="ai-assistant-units"
              label="AI Assistant Units / Month"
              description="Number of Cisco AI Assistant units consumed monthly"
              value={costs.aiCosts.assistantUnitsPerMonth}
              onChange={(v) => updateAi("assistantUnitsPerMonth", v)}
            />
          </div>

          <Collapsible open={aiPricingOpen} onOpenChange={setAiPricingOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2 text-xs text-muted-foreground">
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform ${aiPricingOpen ? "rotate-180" : ""}`}
                />
                {aiPricingOpen ? "Hide" : "Show"} per-unit pricing
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="mt-3 grid grid-cols-1 gap-6 rounded-lg border bg-muted/30 p-4 sm:grid-cols-2">
                <CurrencyField
                  id="ai-agent-unit-price"
                  label="AI Agent Unit Price"
                  description="Cost per AI Agent unit"
                  value={costs.aiCosts.agentUnitPrice}
                  step="0.001"
                  onChange={(v) => updateAi("agentUnitPrice", v)}
                />
                <CurrencyField
                  id="ai-assistant-unit-price"
                  label="AI Assistant Unit Price"
                  description="Cost per AI Assistant unit"
                  value={costs.aiCosts.assistantUnitPrice}
                  step="0.001"
                  onChange={(v) => updateAi("assistantUnitPrice", v)}
                />
              </div>
            </CollapsibleContent>
          </Collapsible>

          <div className="flex justify-end">
            <p className="text-xs text-muted-foreground">
              AI total:{" "}
              <span className="font-medium text-foreground">
                {formatCurrency(aiMonthlyTotal)}
              </span>{" "}
              / month
            </p>
          </div>
        </div>

        <Separator />

        {/* Monthly 3rd Party Services */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">
                Monthly 3rd Party Services
              </p>
              <p className="text-xs text-muted-foreground">
                Add any additional monthly service costs
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={addService}>
              <Plus className="mr-1 h-4 w-4" />
              Add Service
            </Button>
          </div>

          {costs.thirdPartyServices.length > 0 && (
            <div className="space-y-3">
              <div className="hidden items-center gap-3 sm:grid sm:grid-cols-[1fr_160px_40px]">
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Service Name
                </span>
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Monthly Cost
                </span>
                <span className="sr-only">Actions</span>
              </div>

              {costs.thirdPartyServices.map((service) => (
                <div
                  key={service.id}
                  className="grid grid-cols-1 items-end gap-3 rounded-lg border bg-secondary/30 p-3 sm:grid-cols-[1fr_160px_40px] sm:border-0 sm:bg-transparent sm:p-0"
                >
                  <div className="space-y-1">
                    <Label className="text-xs sm:sr-only">Service Name</Label>
                    <Input
                      placeholder="e.g. Twilio, SendGrid"
                      value={service.name}
                      onChange={(e) =>
                        updateService(service.id, "name", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs sm:sr-only">Monthly Cost</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                        $
                      </span>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        value={service.monthlyCost || ""}
                        onChange={(e) =>
                          updateService(
                            service.id,
                            "monthlyCost",
                            Number.parseFloat(e.target.value) || 0
                          )
                        }
                        className="pl-7"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeService(service.id)}
                      className="text-muted-foreground hover:text-destructive"
                      aria-label={`Remove ${service.name || "service"}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}

              <div className="flex justify-end pt-1">
                <p className="text-xs text-muted-foreground">
                  3rd party total:{" "}
                  <span className="font-medium text-foreground">
                    {formatCurrency(thirdPartyTotal)}
                  </span>{" "}
                  / month
                </p>
              </div>
            </div>
          )}
        </div>

        <Separator />

        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <Label htmlFor="period-months" className="text-sm font-medium">
              Period (months)
            </Label>
            <Input
              id="period-months"
              type="number"
              min="1"
              step="1"
              value={costs.periodMonths}
              onChange={(e) =>
                update("periodMonths", Number.parseInt(e.target.value) || 1)
              }
              className="w-28"
            />
            <p className="text-xs text-muted-foreground">
              e.g. 12 for annual, 36 for 3-year
            </p>
          </div>

          <div className="text-right">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Total Platform Cost ({costs.periodMonths} mo)
            </p>
            <p className="mt-1 font-heading text-3xl font-bold text-foreground">
              {formatCurrency(totalForPeriod)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {formatCurrency(totalMonthly)} / month
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}