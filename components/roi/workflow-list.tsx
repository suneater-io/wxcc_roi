"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Plus, Trash2, Workflow as WorkflowIcon } from "lucide-react"

export interface Workflow {
  id: string
  name: string
  minutesRemoved: number
  smsPerFlow: number
  emailsPerFlow: number
  wxConnectRunsPerFlow: number
  lettersPerFlow: number
  annualVolume: number | null
}

export interface UnitCosts {
  smsPerSegmentCost: number
  wxConnectRemoteRunCost: number
  emailSendCost: number
}

interface WorkflowListProps {
  workflows: Workflow[]
  unitCosts: UnitCosts
  onAdd: () => void
  onRemove: (id: string) => void
  onUpdate: (id: string, field: keyof Omit<Workflow, "id">, value: string | number | null) => void
  onLoadDefaults: () => void
}

function formatCurrency(value: number): string {
  if (value < 0.01 && value > 0) return `$${value.toFixed(4)}`
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }).format(value)
}

function calcWorkflowCost(w: Workflow, unitCosts: UnitCosts): number {
  return (
    w.smsPerFlow * unitCosts.smsPerSegmentCost +
    w.emailsPerFlow * unitCosts.emailSendCost +
    w.wxConnectRunsPerFlow * unitCosts.wxConnectRemoteRunCost
  )
}

export function WorkflowList({ workflows, unitCosts, onAdd, onRemove, onUpdate, onLoadDefaults }: WorkflowListProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <WorkflowIcon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="font-heading text-lg">Workflows</CardTitle>
              <CardDescription>Add the workflows you want to evaluate</CardDescription>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onLoadDefaults}>
              Load Examples
            </Button>
            <Button size="sm" onClick={onAdd}>
              <Plus className="mr-1 h-4 w-4" />
              Add
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {workflows.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12">
            <WorkflowIcon className="mb-3 h-8 w-8 text-muted-foreground" />
            <p className="text-sm font-medium text-muted-foreground">No workflows added yet</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Add a workflow or load example defaults to get started
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Column headers for lg+ */}
            <div className="hidden items-center gap-3 border-b pb-2 lg:grid lg:grid-cols-[1fr_100px_80px_80px_80px_80px_100px_100px_36px]">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Workflow Name
              </span>
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Min. Removed
              </span>
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                SMS
              </span>
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Emails
              </span>
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                WX Runs
              </span>
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Letters Removed
              </span>
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Cost / Flow
              </span>
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Annual Vol.
              </span>
              <span className="sr-only">Actions</span>
            </div>

            {workflows.map((workflow) => {
              const costPerFlow = calcWorkflowCost(workflow, unitCosts)
              return (
                <div
                  key={workflow.id}
                  className="grid grid-cols-1 items-end gap-3 rounded-lg border bg-card p-4 lg:grid-cols-[1fr_100px_80px_80px_80px_80px_100px_100px_36px] lg:border-0 lg:bg-transparent lg:p-0"
                >
                  <div className="space-y-1">
                    <Label className="text-xs lg:sr-only">Workflow Name</Label>
                    <Input
                      placeholder="e.g. Pre-Admission"
                      value={workflow.name}
                      onChange={(e) => onUpdate(workflow.id, "name", e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs lg:sr-only">Minutes Removed</Label>
                    <Input
                      type="number"
                      min="0"
                      placeholder="0"
                      value={workflow.minutesRemoved || ""}
                      onChange={(e) =>
                        onUpdate(workflow.id, "minutesRemoved", Number.parseFloat(e.target.value) || 0)
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs lg:sr-only">SMS Sent</Label>
                    <Input
                      type="number"
                      min="0"
                      placeholder="0"
                      value={workflow.smsPerFlow || ""}
                      onChange={(e) =>
                        onUpdate(workflow.id, "smsPerFlow", Number.parseFloat(e.target.value) || 0)
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs lg:sr-only">Emails Sent</Label>
                    <Input
                      type="number"
                      min="0"
                      placeholder="0"
                      value={workflow.emailsPerFlow || ""}
                      onChange={(e) =>
                        onUpdate(workflow.id, "emailsPerFlow", Number.parseFloat(e.target.value) || 0)
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs lg:sr-only">WX Connect Runs</Label>
                    <Input
                      type="number"
                      min="0"
                      placeholder="0"
                      value={workflow.wxConnectRunsPerFlow || ""}
                      onChange={(e) =>
                        onUpdate(workflow.id, "wxConnectRunsPerFlow", Number.parseFloat(e.target.value) || 0)
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs lg:sr-only">Letters no longer being sent</Label>
                    <Input
                      type="number"
                      min="0"
                      placeholder="0"
                      value={workflow.lettersPerFlow || ""}
                      onChange={(e) =>
                        onUpdate(workflow.id, "lettersPerFlow", Number.parseFloat(e.target.value) || 0)
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs lg:sr-only">Cost / Flow</Label>
                    <div className="flex h-9 items-center rounded-md border bg-muted/50 px-3">
                      <span className="text-sm font-medium tabular-nums text-foreground">
                        {formatCurrency(costPerFlow)}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs lg:sr-only">Annual Volume (optional)</Label>
                    <Input
                      type="number"
                      min="0"
                      placeholder="Optional"
                      value={workflow.annualVolume ?? ""}
                      onChange={(e) => {
                        const val = e.target.value
                        onUpdate(workflow.id, "annualVolume", val === "" ? null : Number.parseFloat(val) || 0)
                      }}
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onRemove(workflow.id)}
                      className="text-muted-foreground hover:text-destructive"
                      aria-label={`Remove ${workflow.name || "workflow"}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}