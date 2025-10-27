export type SlideTemplate = "title" | "text" | "list" | "two-column" | "quote" | "image"

export interface SlideMeta {
  title: string
  subtitle?: string | null
  author?: string | null
}

export interface SlideContent {
  textBlocks: string[]
  listItems: string[]
  columns: {
    left: string
    right: string
  }
  quote: string
  image: {
    url: string | null
    position: "left" | "right" | "full"
  }
  layoutHints?: Record<string, unknown>
}

export interface Slide {
  id: string
  template: SlideTemplate
  meta: SlideMeta
  content: SlideContent
}

export interface Presentation {
  id: string
  title: string
  slides: Slide[]
  createdAt: string
  updatedAt: string
}

export interface GenerateSlideRequest {
  prompt: string
  topic: string
  referenceFiles?: string[]
  slideCount?: number
}
