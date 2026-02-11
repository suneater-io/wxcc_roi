import { RoiCalculator } from "@/components/roi/roi-calculator"
import { SavingsStats } from "@/components/roi/savings-stats"
import { Calculator } from "lucide-react"

export default function Page() {
  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Calculator className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-heading text-xl font-bold text-foreground sm:text-2xl text-balance">
              Digital Front Door ROI Calculator
            </h1>
            <p className="text-sm text-muted-foreground">
              Quantify the operational value of automating healthcare workflows
            </p>
          </div>
        </div>
      </header>

      {/* Calculator */}
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <RoiCalculator />
      </div>

      {/* Impact Stats */}
      <div className="border-t bg-muted/30">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <SavingsStats 
            savingsPercentage={42}
            timeReductionPercentage={68}
            errorReductionPercentage={85}
            costPerInteraction={12.50}
          />
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t bg-card">
        <div className="mx-auto max-w-5xl px-4 py-4 sm:px-6 lg:px-8">
          <p className="text-xs text-muted-foreground text-center leading-relaxed">
            All calculations are formula-based and transparent. Break-even figures are rounded up to the nearest whole interaction. No volumes are assumed unless explicitly provided.
          </p>
        </div>
      </footer>
    </main>
  )
}