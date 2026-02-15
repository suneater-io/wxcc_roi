"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface FieldProps {
  id: string
  label: string
  description: string
  value: number
  onChange: (v: number) => void
}

export function CurrencyField({
  id,
  label,
  description,
  value,
  onChange,
  step = "0.01",
}: FieldProps & { step?: string }) {
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

export function NumberField({
  id,
  label,
  description,
  value,
  onChange,
}: FieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-medium">
        {label}
      </Label>
      <Input
        id={id}
        type="number"
        step="1"
        min="0"
        value={value}
        onChange={(e) => onChange(Number.parseFloat(e.target.value) || 0)}
      />
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  )
}