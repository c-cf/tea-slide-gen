"use client"

import type React from "react"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import type { Slide } from "@/lib/types/slide"

interface RegenerateDialogProps {
  currentSlide: Slide
  onRegenerate: (newSlide: Slide) => void
  children: React.ReactNode
}

export function RegenerateDialog({ currentSlide, onRegenerate, children }: RegenerateDialogProps) {
  const [prompt, setPrompt] = useState("")
  const [isRegenerating, setIsRegenerating] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const handleRegenerate = async () => {
    setIsRegenerating(true)
    try {
      const response = await fetch("/api/regenerate-slide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slideId: currentSlide.id,
          currentSlide,
          prompt,
        }),
      })

      if (!response.ok) throw new Error("Failed to regenerate slide")

      const { slide } = await response.json()
      onRegenerate(slide)
      setIsOpen(false)
      setPrompt("")
    } catch (error) {
      console.error("[debug] Error regenerating slide:", error)
      alert("Failed to regenerate slide. Please try again.")
    } finally {
      setIsRegenerating(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Regenerate Slide with AI</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="regenerate-prompt">What would you like to improve?</Label>
            <Textarea
              id="regenerate-prompt"
              placeholder="e.g., Make it more concise, add more details, change the tone..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>

          <div className="rounded-lg bg-muted p-3">
            <p className="text-sm text-muted-foreground">
              Current slide template: <span className="font-medium text-foreground">{currentSlide.template}</span>
            </p>
          </div>

          <Button onClick={handleRegenerate} disabled={isRegenerating} className="w-full">
            {isRegenerating ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Regenerating...
              </>
            ) : (
              "Regenerate Slide"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
