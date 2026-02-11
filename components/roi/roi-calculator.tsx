"use client"

import { useState, useMemo, useCallback } from "react"
import { PlatformInputs, type PlatformCosts } from "./platform-inputs"
import {
  DigitalInteractionCost,
  type InteractionCosts,
} from "./digital-interaction-cost"
import { WorkflowList, type Workflow } from "./workflow-list"
import { ResultsPanel } from "./results-panel"
import { SavingsStats } from "./savings-stats"

const DEFAULT_WORKFLOWS: Omit<Workflow, "id">[] = [
  { name: "Pre-Admission", minutesRemoved: 30, smsPerFlow: 2, emailsPerFlow: 1, wxConnectRunsPerFlow: 1, annualVolume: null },
  { name: "Appointment Confirmation", minutesRemoved: 20, smsPerFlow: 1, emailsPerFlow: 1, wxConnectRunsPerFlow: 1, annualVolume: null },
  { name: "Appointment Reschedule", minutesRemoved: 15, smsPerFlow: 2, emailsPerFlow: 1, wxConnectRunsPerFlow: 1, annualVolume: null },
  { name: "Appointment Cancellation", minutesRemoved: 10, smsPerFlow: 1, emailsPerFlow: 1, wxConnectRunsPerFlow: 1, annualVolume: null },
  { name: "Post-Operative Notification", minutesRemoved: 10, smsPerFlow: 1, emailsPerFlow: 2, wxConnectRunsPerFlow: 1, annualVolume: null },
]

let nextId = 1
function generateId() {
  return `wf-${nextId++}`
}

export function RoiCalculator() {
  // Section 1: Platform Costs (includes AI)
  const [platformCosts, setPlatformCosts] = useState<PlatformCosts>({
    platformCostPerMonth: 0,
    phoneLineMonthly: 0,
    smsServiceMonthly: 0,
    thirdPartyServices: [],
    aiCosts: {
      agentUnitsPerMonth: 0,
      agentUnitPrice: 109.77,
      assistantUnitsPerMonth: 0,
      assistantUnitPrice: 32.93,
    },
    periodMonths: 12,
  })

  // Section 2: Interaction Costs (human + digital channels)
  const [staffHourlyCost, setStaffHourlyCost] = useState(60.0)
  const [interactionCosts, setInteractionCosts] = useState<InteractionCosts>({
    smsPerSegmentCost: 0.04,
    wxConnectRemoteRunCost: 0.01,
    emailSendCost: 0,
  })

  // Workflows
  const [workflows, setWorkflows] = useState<Workflow[]>([])

  // Derived platform total
  const totalPlatformCost = useMemo(() => {
    const thirdPartyTotal = platformCosts.thirdPartyServices.reduce(
      (sum, s) => sum + s.monthlyCost,
      0
    )
    const aiTotal =
      platformCosts.aiCosts.agentUnitsPerMonth * platformCosts.aiCosts.agentUnitPrice +
      platformCosts.aiCosts.assistantUnitsPerMonth * platformCosts.aiCosts.assistantUnitPrice
    const monthly =
      platformCosts.platformCostPerMonth +
      platformCosts.phoneLineMonthly +
      platformCosts.smsServiceMonthly +
      thirdPartyTotal +
      aiTotal
    return monthly * platformCosts.periodMonths
  }, [platformCosts])

  // Per-workflow digital cost
  const calcWorkflowDigitalCost = useCallback(
    (w: Workflow) =>
      w.smsPerFlow * interactionCosts.smsPerSegmentCost +
      w.emailsPerFlow * interactionCosts.emailSendCost +
      w.wxConnectRunsPerFlow * interactionCosts.wxConnectRemoteRunCost,
    [interactionCosts]
  )

  // Workflow handlers
  const handleAddWorkflow = useCallback(() => {
    setWorkflows((prev) => [
      ...prev,
      {
        id: generateId(),
        name: "",
        minutesRemoved: 0,
        smsPerFlow: 0,
        emailsPerFlow: 0,
        wxConnectRunsPerFlow: 0,
        annualVolume: null,
      },
    ])
  }, [])

  const handleRemoveWorkflow = useCallback((id: string) => {
    setWorkflows((prev) => prev.filter((w) => w.id !== id))
  }, [])

  const handleUpdateWorkflow = useCallback(
    (id: string, field: keyof Omit<Workflow, "id">, value: string | number | null) => {
      setWorkflows((prev) =>
        prev.map((w) => (w.id === id ? { ...w, [field]: value } : w))
      )
    },
    []
  )

  const handleLoadDefaults = useCallback(() => {
    setWorkflows(DEFAULT_WORKFLOWS.map((w) => ({ ...w, id: generateId() })))
  }, [])

  // Calculations
  const validWorkflows = useMemo(
    () => workflows.filter((w) => w.name.trim() !== "" && w.minutesRemoved > 0),
    [workflows]
  )

  const workflowResults = useMemo(() => {
    return validWorkflows.map((w) => {
      const hoursRemoved = w.minutesRemoved / 60
      const labourSaving = hoursRemoved * staffHourlyCost
      const digitalCost = calcWorkflowDigitalCost(w)
      const netValuePerInteraction = labourSaving - digitalCost
      const breakEvenInteractions =
        netValuePerInteraction > 0
          ? Math.ceil(totalPlatformCost / netValuePerInteraction)
          : Infinity
      const annualBenefit =
        w.annualVolume !== null ? netValuePerInteraction * w.annualVolume : null

      return {
        name: w.name,
        minutesRemoved: w.minutesRemoved,
        labourSaving,
        digitalCostPerFlow: digitalCost,
        netValuePerInteraction,
        breakEvenInteractions:
          breakEvenInteractions === Infinity ? 0 : breakEvenInteractions,
        annualBenefit,
      }
    })
  }, [validWorkflows, staffHourlyCost, calcWorkflowDigitalCost, totalPlatformCost])

  const combinedResults = useMemo(() => {
    if (workflowResults.length === 0) {
      return {
        combinedNetValue: 0,
        combinedBreakEven: 0,
        totalAnnualBenefit: null,
        netAnnualGain: null,
        roiPercent: null,
      }
    }

    const combinedNetValue = workflowResults.reduce(
      (sum, r) => sum + r.netValuePerInteraction,
      0
    )
    const combinedBreakEven =
      combinedNetValue > 0 ? Math.ceil(totalPlatformCost / combinedNetValue) : 0

    const volumeResults = workflowResults.filter((r) => r.annualBenefit !== null)
    const hasVolumes = volumeResults.length > 0

    const totalAnnualBenefit = hasVolumes
      ? volumeResults.reduce((sum, r) => sum + (r.annualBenefit ?? 0), 0)
      : null

    const netAnnualGain =
      totalAnnualBenefit !== null ? totalAnnualBenefit - totalPlatformCost : null

    const roiPercent =
      netAnnualGain !== null && totalPlatformCost > 0
        ? (netAnnualGain / totalPlatformCost) * 100
        : null

    return {
      combinedNetValue,
      combinedBreakEven,
      totalAnnualBenefit,
      netAnnualGain,
      roiPercent,
    }
  }, [workflowResults, totalPlatformCost])

  // Impact Stats Derivation
  const impactStats = useMemo(() => {
    if (workflowResults.length === 0) return {
      savingsPercentage: undefined,
      timeReductionPercentage: undefined,
      costPerInteraction: undefined,
    }

    const totalLabourSaving = workflowResults.reduce((sum, r) => sum + r.labourSaving, 0)
    const totalDigitalCost = workflowResults.reduce((sum, r) => sum + r.digitalCostPerFlow, 0)
    
    const savingsPercentage = totalLabourSaving > 0 
      ? Math.round(((totalLabourSaving - totalDigitalCost) / totalLabourSaving) * 100)
      : 0

    const totalMinutesRemoved = workflowResults.reduce((sum, r) => sum + r.minutesRemoved, 0)
    const estimatedBaseline = workflowResults.length * 45
    const timeReductionPercentage = Math.round((totalMinutesRemoved / estimatedBaseline) * 100)

    const avgDigitalCost = totalDigitalCost / workflowResults.length

    return {
      savingsPercentage,
      timeReductionPercentage,
      costPerInteraction: avgDigitalCost,
    }
  }, [workflowResults])

  const hasVolumes = workflowResults.some((r) => r.annualBenefit !== null)

  return (
    <div className="space-y-6">
      {/* Section 1: Platform Costs */}
      <PlatformInputs costs={platformCosts} onChange={setPlatformCosts} />

      {/* Section 2: Interaction Costs (Human + Digital) */}
      <DigitalInteractionCost
        costs={interactionCosts}
        onChange={setInteractionCosts}
        staffHourlyCost={staffHourlyCost}
        onStaffHourlyCostChange={setStaffHourlyCost}
      />

      {/* Workflows */}
      <WorkflowList
        workflows={workflows}
        unitCosts={interactionCosts}
        onAdd={handleAddWorkflow}
        onRemove={handleRemoveWorkflow}
        onUpdate={handleUpdateWorkflow}
        onLoadDefaults={handleLoadDefaults}
      />

      {/* Results */}
      <ResultsPanel
        workflowResults={workflowResults}
        combinedResults={combinedResults}
        annualPlatformCost={totalPlatformCost}
        hasVolumes={hasVolumes}
      />

      {/* Dynamic Impact Stats - Always visible */}
      <div className="-mx-4 border-t bg-muted/30 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <SavingsStats 
            savingsPercentage={impactStats.savingsPercentage}
            timeReductionPercentage={impactStats.timeReductionPercentage}
            errorReductionPercentage={85} // Platform standard
            costPerInteraction={impactStats.costPerInteraction}
          />
        </div>
      </div>
    </div>
  )
}