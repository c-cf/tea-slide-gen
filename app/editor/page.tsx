"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Download, Share2 } from "lucide-react"
import { useRouter } from "next/navigation"
import type { Presentation, Slide } from "@/lib/types/slide"
import { SlideThumbnails } from "@/components/slide-thumbnails"
import { SlideCanvas } from "@/components/slide-canvas"
import { SlideToolbar } from "@/components/slide-toolbar"

export default function EditorPage() {
  const router = useRouter()
  const [presentation, setPresentation] = useState<Presentation | null>(null)
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)

  useEffect(() => {
    const stored = sessionStorage.getItem("presentation")
    if (stored) {
      setPresentation(JSON.parse(stored))
    } else {
      router.push("/")
    }
  }, [router])

  const updateSlide = (index: number, updatedSlide: Slide) => {
    if (!presentation) return

    const newSlides = [...presentation.slides]
    newSlides[index] = updatedSlide

    const updated = {
      ...presentation,
      slides: newSlides,
      updatedAt: new Date().toISOString(),
    }

    setPresentation(updated)
    sessionStorage.setItem("presentation", JSON.stringify(updated))
  }

  if (!presentation) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-muted-foreground">Loading presentation...</div>
      </div>
    )
  }

  const currentSlide = presentation.slides[currentSlideIndex]

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Header - Fixed */}
      <header className="flex h-16 items-center justify-between border-b bg-card px-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.push("/")}>
            <ChevronLeft className="size-5" />
          </Button>
          <div>
            <h1 className="text-lg font-semibold">{presentation.title}</h1>
            <p className="text-xs text-muted-foreground">
              Last edited: {new Date(presentation.updatedAt).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Share2 className="mr-2 size-4" />
            Share
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 size-4" />
            Export
          </Button>
        </div>
      </header>

      {/* Main Content - Fixed */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Thumbnails with independent scroll */}
        <SlideThumbnails
          slides={presentation.slides}
          currentIndex={currentSlideIndex}
          onSelectSlide={setCurrentSlideIndex}
        />

        {/* Main Canvas Area - Fixed */}
        <div className="flex flex-1 flex-col">
          {/* Toolbar - Fixed */}
          <SlideToolbar
            currentSlide={currentSlide}
            slideIndex={currentSlideIndex}
            onUpdate={(updated) => updateSlide(currentSlideIndex, updated)}
          />

          {/* Slide Canvas - Fixed, centered */}
          <div className="flex flex-1 items-center justify-center overflow-hidden bg-muted/30 p-8">
            <SlideCanvas slide={currentSlide} onUpdate={(updated) => updateSlide(currentSlideIndex, updated)} />
          </div>
        </div>
      </div>
    </div>
  )
}
