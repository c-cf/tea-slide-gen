"use client"

import { Button } from "@/components/ui/button"
import { Sparkles, LayoutTemplate } from "lucide-react"
import type { Slide, SlideTemplate } from "@/lib/types/slide"
import { RegenerateDialog } from "./regenerate-dialog"
import { TemplateSelectorDialog } from "./template-selector-dialog"
import { useState } from "react"

interface SlideToolbarProps {
  currentSlide: Slide
  slideIndex: number
  onUpdate: (slide: Slide) => void
}

export function SlideToolbar({ currentSlide, slideIndex, onUpdate }: SlideToolbarProps) {
  const [showTemplateSelector, setShowTemplateSelector] = useState(false)

  const handleTemplateChange = (newTemplate: SlideTemplate) => {
    const { meta, content } = currentSlide

    // Create new content structure based on template switch
    const newContent = { ...content }

    switch (newTemplate) {
      case "title":
        // Keep meta.title and meta.subtitle
        break

      case "text":
        // Convert other content to textBlocks
        if (content.listItems.length > 0) {
          newContent.textBlocks = content.listItems
        } else if (content.columns.left || content.columns.right) {
          newContent.textBlocks = [content.columns.left, content.columns.right].filter(Boolean)
        } else if (content.quote) {
          newContent.textBlocks = [content.quote]
        } else if (content.textBlocks.length === 0) {
          newContent.textBlocks = ["Add your content here"]
        }
        break

      case "list":
        // Convert other content to listItems
        if (content.textBlocks.length > 0) {
          newContent.listItems = content.textBlocks
        } else if (content.columns.left || content.columns.right) {
          newContent.listItems = [content.columns.left, content.columns.right].filter(Boolean)
        } else if (content.quote) {
          newContent.listItems = [content.quote]
        } else if (content.listItems.length === 0) {
          newContent.listItems = ["Item 1", "Item 2", "Item 3"]
        }
        break

      case "two-column":
        // Split content into columns
        if (content.textBlocks.length >= 2) {
          const mid = Math.ceil(content.textBlocks.length / 2)
          newContent.columns = {
            left: content.textBlocks.slice(0, mid).join("\n\n"),
            right: content.textBlocks.slice(mid).join("\n\n"),
          }
        } else if (content.listItems.length >= 2) {
          const mid = Math.ceil(content.listItems.length / 2)
          newContent.columns = {
            left: content.listItems.slice(0, mid).join("\n"),
            right: content.listItems.slice(mid).join("\n"),
          }
        } else if (!content.columns.left && !content.columns.right) {
          newContent.columns = {
            left: "Left column content",
            right: "Right column content",
          }
        }
        break

      case "quote":
        // Convert content to quote
        if (content.textBlocks.length > 0) {
          newContent.quote = content.textBlocks[0]
        } else if (content.listItems.length > 0) {
          newContent.quote = content.listItems[0]
        } else if (!content.quote) {
          newContent.quote = "Your quote here"
        }
        break

      case "image":
        // Keep image settings, adjust position to full
        newContent.image = {
          ...content.image,
          position: "full",
        }
        break
    }

    const newSlide: Slide = {
      ...currentSlide,
      template: newTemplate,
      content: newContent,
    }

    onUpdate(newSlide)
  }

  return (
    <>
      <div className="flex h-14 items-center justify-between border-b bg-card px-4">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium">Slide {slideIndex + 1}</span>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowTemplateSelector(true)} className="gap-2">
            <LayoutTemplate className="size-4" />
            Change Layout
          </Button>
          <RegenerateDialog currentSlide={currentSlide} onRegenerate={onUpdate}>
            <Button variant="outline" size="sm">
              <Sparkles className="mr-2 size-4" />
              Regenerate
            </Button>
          </RegenerateDialog>
        </div>
      </div>

      <TemplateSelectorDialog
        open={showTemplateSelector}
        onOpenChange={setShowTemplateSelector}
        currentTemplate={currentSlide.template}
        onSelectTemplate={handleTemplateChange}
      />
    </>
  )
}
