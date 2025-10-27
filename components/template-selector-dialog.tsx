"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { SlideTemplate } from "@/lib/types/slide"
import { Type, List, Columns2, Quote, ImageIcon, Presentation, Check } from "lucide-react"

interface TemplateSelectorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentTemplate: SlideTemplate
  onSelectTemplate: (template: SlideTemplate) => void
}

const TEMPLATE_GROUPS = {
  "BASIC LAYOUTS": [
    {
      value: "title" as SlideTemplate,
      label: "Title Slide",
      description: "Large centered title with subtitle",
      icon: Type,
    },
    {
      value: "text" as SlideTemplate,
      label: "Content",
      description: "Title with text paragraphs",
      icon: Presentation,
    },
    {
      value: "two-column" as SlideTemplate,
      label: "Two Column",
      description: "Split content into two columns",
      icon: Columns2,
    },
  ],
  "MEDIA LAYOUTS": [
    {
      value: "image" as SlideTemplate,
      label: "Image",
      description: "Full-width image with title",
      icon: ImageIcon,
    },
    {
      value: "list" as SlideTemplate,
      label: "List",
      description: "Title with bullet points",
      icon: List,
    },
  ],
  "SPECIAL LAYOUTS": [
    {
      value: "quote" as SlideTemplate,
      label: "Quote",
      description: "Large centered quote with attribution",
      icon: Quote,
    },
  ],
}

export function TemplateSelectorDialog({
  open,
  onOpenChange,
  currentTemplate,
  onSelectTemplate,
}: TemplateSelectorDialogProps) {
  const handleSelect = (template: SlideTemplate) => {
    onSelectTemplate(template)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Choose a Template</DialogTitle>
          <DialogDescription>Select a layout for your current slide</DialogDescription>
        </DialogHeader>

        <div className="space-y-8 py-4">
          {Object.entries(TEMPLATE_GROUPS).map(([groupName, templates]) => (
            <div key={groupName}>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">{groupName}</h3>
              <div className="grid grid-cols-3 gap-4">
                {templates.map((template) => {
                  const Icon = template.icon
                  const isSelected = currentTemplate === template.value

                  return (
                    <button
                      key={template.value}
                      onClick={() => handleSelect(template.value)}
                      className={`group relative flex flex-col items-start gap-3 rounded-lg border-2 p-4 text-left transition-all hover:border-primary ${
                        isSelected ? "border-primary bg-primary/5" : "border-border"
                      }`}
                    >
                      {/* Preview area */}
                      <div className="flex h-32 w-full items-center justify-center rounded-md bg-muted/50">
                        <Icon className="size-8 text-muted-foreground" />
                      </div>

                      {/* Template info */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold">{template.label}</h4>
                          {isSelected && (
                            <div className="flex size-5 items-center justify-center rounded-full bg-primary">
                              <Check className="size-3 text-primary-foreground" />
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{template.description}</p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
