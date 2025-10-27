"use client"

import { cn } from "@/lib/utils"
import type { Slide } from "@/lib/types/slide"
import { SlideThumbnail } from "./slide-thumbnail"

interface SlideThumbnailsProps {
  slides: Slide[]
  currentIndex: number
  onSelectSlide: (index: number) => void
}

export function SlideThumbnails({ slides, currentIndex, onSelectSlide }: SlideThumbnailsProps) {
  return (
    <aside className="flex w-64 flex-col border-r bg-sidebar">
      {/* Header - Fixed */}
      <div className="flex h-12 items-center border-b px-4">
        <h2 className="text-sm font-semibold text-sidebar-foreground">Slides</h2>
      </div>

      {/* Scrollable thumbnail list */}
      <div className="flex-1 overflow-y-auto p-3">
        <div className="space-y-3">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              onClick={() => onSelectSlide(index)}
              className={cn(
                "group relative w-full rounded-lg border-2 bg-card p-2 text-left transition-all hover:border-accent",
                currentIndex === index ? "border-accent ring-2 ring-accent/20" : "border-transparent",
              )}
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">Slide {index + 1}</span>
              </div>
              <SlideThumbnail slide={slide} />
            </button>
          ))}
        </div>
      </div>
    </aside>
  )
}
