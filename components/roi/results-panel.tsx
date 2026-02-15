"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { 
  TrendingUp, 
  Target, 
  DollarSign, 
  BarChart3, 
  ArrowUpRight, 
  Sparkles, 
  CheckCircle2, 
  CalendarDays,
  Calculator,
  HelpCircle,
  ChevronDown
} from "lucide-react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

interface WorkflowResult {
  name: string
  minutesRemoved: number
  labourSaving: number
  digitalCostPerFlow: number
  netValuePerInteraction: number
  breakEvenInteractions: number
  annualBenefit: number | null
}

interface CombinedResults {
  combinedNetValue: number
  combinedBreakEven: number
  totalAnnualBenefit: number | null
  netAnnualGain: number | null
  roiPercent: number | null
}

interface ResultsPanelProps {
  workflowResults: WorkflowResult[]
  combinedResults: CombinedResults
  annualPlatformCost: number
  hasVolumes: boolean
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value)
}

export function ResultsPanel({
  workflowResults,
  combinedResults,
  annualPlatformCost,
  hasVolumes,
}: ResultsPanelProps) {
  if (workflowResults.length === 0) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <BarChart3 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="font-heading text-lg">Results</CardTitle>
              <CardDescription>Add workflows above to see your ROI analysis</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12">
            <BarChart3 className="mb-3 h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Results will appear here once you add workflows</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const isPositiveROI = combinedResults.netAnnualGain !== null && combinedResults.netAnnualGain > 0
  const roiMultiplier =
    combinedResults.roiPercent !== null ? (combinedResults.roiPercent / 100 + 1).toFixed(1) : null
  
  const monthlyBreakEven = Math.ceil(combinedResults.combinedBreakEven / 12)

  // Calculate totals for the footer row
  const totalMinutes = workflowResults.reduce((sum, r) => sum + r.minutesRemoved, 0)
  const totalLabourSaving = workflowResults.reduce((sum, r) => sum + r.labourSaving, 0)
  const totalDigitalCost = workflowResults.reduce((sum, r) => sum + r.digitalCostPerFlow, 0)

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" />
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Annual Break-Even
              </p>
            </div>
            <p className="mt-2 font-heading text-3xl font-bold text-foreground">
              {formatNumber(combinedResults.combinedBreakEven)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">interactions / year</p>
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-primary" />
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Monthly Break-Even
              </p>
            </div>
            <p className="mt-2 font-heading text-3xl font-bold text-foreground">
              {formatNumber(monthlyBreakEven)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">interactions / month</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-primary" />
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Net Value / Interaction
              </p>
            </div>
            <p className="mt-2 font-heading text-3xl font-bold text-foreground">
              {formatCurrency(combinedResults.combinedNetValue)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">combined per set</p>
          </CardContent>
        </Card>

        {hasVolumes && combinedResults.totalAnnualBenefit !== null && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-accent" />
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Net Annual Gain
                </p>
              </div>
              <p
                className={`mt-2 font-heading text-3xl font-bold ${isPositiveROI ? "text-accent" : "text-destructive"}`}
              >
                {formatCurrency(combinedResults.netAnnualGain!)}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                after {formatCurrency(annualPlatformCost)} Flex 3 cost
              </p>
            </CardContent>
          </Card>
        )}

        {hasVolumes && combinedResults.roiPercent !== null && (
          <Card className={isPositiveROI ? "border-accent/20 bg-accent/5" : "border-destructive/20 bg-destructive/5"}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <ArrowUpRight className={`h-4 w-4 ${isPositiveROI ? "text-accent" : "text-destructive"}`} />
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">ROI</p>
              </div>
              <p
                className={`mt-2 font-heading text-3xl font-bold ${isPositiveROI ? "text-accent" : "text-destructive"}`}
              >
                {combinedResults.roiPercent!.toFixed(1)}%
              </p>
              <p className="mt-1 text-xs text-muted-foreground">return on investment</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Per-workflow breakdown */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <BarChart3 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="font-heading text-lg">Per-Workflow Breakdown</CardTitle>
              <CardDescription>Detailed analysis for each automated workflow</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm" role="table">
              <thead>
                <tr className="border-b">
                  <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Workflow
                  </th>
                  <th className="pb-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Minutes Saved
                  </th>
                  <th className="pb-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Manual Process Saving
                  </th>
                  <th className="pb-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Digital Cost
                  </th>
                  <th className="pb-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Net Value
                  </th>
                  <th className="pb-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Break-Even
                  </th>
                  {hasVolumes && (
                    <th className="pb-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Annual Benefit
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {workflowResults.map((result) => (
                  <tr key={result.name} className="border-b last:border-0">
                    <td className="py-3 font-medium text-foreground">{result.name}</td>
                    <td className="py-3 text-right tabular-nums text-muted-foreground">
                      {result.minutesRemoved} min
                    </td>
                    <td className="py-3 text-right tabular-nums text-muted-foreground">
                      {formatCurrency(result.labourSaving)}
                    </td>
                    <td className="py-3 text-right tabular-nums text-muted-foreground">
                      {formatCurrency(result.digitalCostPerFlow)}
                    </td>
                    <td className="py-3 text-right tabular-nums font-medium text-foreground">
                      {formatCurrency(result.netValuePerInteraction)}
                    </td>
                    <td className="py-3 text-right tabular-nums text-muted-foreground">
                      {formatNumber(result.breakEvenInteractions)}
                    </td>
                    {hasVolumes && (
                      <td className="py-3 text-right tabular-nums font-medium text-accent">
                        {result.annualBenefit !== null ? formatCurrency(result.annualBenefit) : "\u2014"}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-muted/50 font-bold">
                  <td className="py-3 pl-2 text-left text-foreground">Combined Totals</td>
                  <td className="py-3 text-right tabular-nums text-foreground">
                    {totalMinutes} min
                  </td>
                  <td className="py-3 text-right tabular-nums text-foreground">
                    {formatCurrency(totalLabourSaving)}
                  </td>
                  <td className="py-3 text-right tabular-nums text-foreground">
                    {formatCurrency(totalDigitalCost)}
                  </td>
                  <td className="py-3 text-right tabular-nums text-primary">
                    {formatCurrency(combinedResults.combinedNetValue)}
                  </td>
                  <td className="py-3 text-right tabular-nums text-primary">
                    {formatNumber(combinedResults.combinedBreakEven)}
                  </td>
                  {hasVolumes && (
                    <td className="py-3 text-right tabular-nums text-accent">
                      {combinedResults.totalAnnualBenefit !== null ? formatCurrency(combinedResults.totalAnnualBenefit) : "\u2014"}
                    </td>
                  )}
                </tr>
              </tfoot>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Big ROI Showcase */}
      {hasVolumes && combinedResults.roiPercent !== null && combinedResults.netAnnualGain !== null && (
        <div className="relative overflow-hidden rounded-2xl border-2 border-accent/30 bg-gradient-to-br from-accent/5 via-card to-primary/5">
          {/* Subtle background pattern */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }} />

          <div className="relative px-6 py-10 sm:px-10 sm:py-14">
            {/* Top label */}
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="h-5 w-5 text-accent" />
              <p className="text-sm font-semibold uppercase tracking-widest text-accent">
                Your ROI at a Glance
              </p>
              <Sparkles className="h-5 w-5 text-accent" />
            </div>

            {/* Main ROI figure */}
            <div className="mt-6 text-center">
              <p className="font-heading text-7xl font-extrabold tracking-tight text-foreground sm:text-8xl">
                {combinedResults.roiPercent > 0 ? "+" : ""}
                {combinedResults.roiPercent.toFixed(0)}
                <span className="text-5xl text-accent sm:text-6xl">%</span>
              </p>
              <p className="mt-2 text-lg text-muted-foreground">
                Return on Investment
              </p>
            </div>

            {/* Key metrics row */}
            <div className="mx-auto mt-10 grid max-w-3xl grid-cols-1 gap-6 sm:grid-cols-3">
              <div className="rounded-xl border bg-card/80 px-6 py-5 text-center backdrop-blur-sm">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Net Annual Savings
                </p>
                <p className={`mt-2 font-heading text-2xl font-bold ${isPositiveROI ? "text-accent" : "text-destructive"}`}>
                  {formatCurrency(combinedResults.netAnnualGain)}
                </p>
              </div>
              <div className="rounded-xl border bg-card/80 px-6 py-5 text-center backdrop-blur-sm">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Flex 3 Investment
                </p>
                <p className="mt-2 font-heading text-2xl font-bold text-foreground">
                  {formatCurrency(annualPlatformCost)}
                </p>
              </div>
              <div className="rounded-xl border bg-card/80 px-6 py-5 text-center backdrop-blur-sm">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Return Multiplier
                </p>
                <p className="mt-2 font-heading text-2xl font-bold text-primary">
                  {roiMultiplier}x
                </p>
              </div>
            </div>

            {/* Value propositions */}
            {isPositiveROI && (
              <div className="mx-auto mt-8 max-w-2xl">
                <Separator className="mb-6 opacity-30" />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Break-even in just {formatNumber(combinedResults.combinedBreakEven)} interactions</p>
                      <p className="text-xs text-muted-foreground">Every interaction after that is pure operational gain</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{formatCurrency(combinedResults.combinedNetValue)} saved per interaction set</p>
                      <p className="text-xs text-muted-foreground">Includes elimination of paper, printing, and postage costs</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {workflowResults.reduce((sum, r) => sum + r.minutesRemoved, 0)} minutes saved per patient journey
                      </p>
                      <p className="text-xs text-muted-foreground">Staff time redirected to higher-value care</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {formatCurrency(combinedResults.netAnnualGain)} net gain in year 1
                      </p>
                      <p className="text-xs text-muted-foreground">Immediate positive return from day one post break-even</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Transparency Section */}
            <div className="mx-auto mt-12 max-w-3xl">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="math-logic" className="border-none">
                  <AccordionTrigger className="flex justify-center gap-2 rounded-lg bg-background/50 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground hover:bg-background/80 hover:no-underline">
                    <HelpCircle className="h-3.5 w-3.5" />
                    How the Math Works: Why are these numbers so high?
                  </AccordionTrigger>
                  <AccordionContent className="pt-6">
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-foreground">
                          <Users className="h-4 w-4 text-primary" />
                          <h4 className="font-bold">1. Manual Process Saving</h4>
                        </div>
                        <p className="text-xs leading-relaxed text-muted-foreground">
                          We calculate the cost of human labor (e.g., $60/hr = $1.00/min) and add physical material costs (postage/paper). If a workflow saves 30 minutes, that's <span className="font-medium text-foreground">$30.00 in reclaimed capacity</span> per journey.
                        </p>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-foreground">
                          <Zap className="h-4 w-4 text-primary" />
                          <h4 className="font-bold">2. Digital Cost</h4>
                        </div>
                        <p className="text-xs leading-relaxed text-muted-foreground">
                          We calculate the cost of automation (SMS, Email, and API runs). These typically cost <span className="font-medium text-foreground">only a few cents</span> per journey, creating massive leverage against expensive human minutes.
                        </p>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-foreground">
                          <DollarSign className="h-4 w-4 text-primary" />
                          <h4 className="font-bold">3. Net Value per Interaction</h4>
                        </div>
                        <p className="text-xs leading-relaxed text-muted-foreground">
                          By subtracting the digital cost from the manual saving, we find the "profit" per interaction. This is the <span className="font-medium text-foreground">direct operational benefit</span> realized every time the system runs.
                        </p>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-foreground">
                          <Target className="h-4 w-4 text-primary" />
                          <h4 className="font-bold">4. Fixed Cost Leverage</h4>
                        </div>
                        <p className="text-xs leading-relaxed text-muted-foreground">
                          Because the platform cost is <span className="font-medium text-foreground">fixed</span>, it doesn't scale with usage. Once you pass the break-even point, every additional interaction delivers 100% of its net value to the organization's bottom line.
                        </p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}