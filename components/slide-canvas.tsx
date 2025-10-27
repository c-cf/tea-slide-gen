"use client"

import type { Slide } from "@/lib/types/slide"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Plus, X } from "lucide-react"
import { useState } from "react"
import { slideColors } from "@/lib/colors"

interface SlideCanvasProps {
  slide: Slide
  onUpdate: (slide: Slide) => void
}

export function SlideCanvas({ slide, onUpdate }: SlideCanvasProps) {
  const [isEditing, setIsEditing] = useState<string | null>(null)

  const updateMeta = (field: keyof Slide["meta"], value: string) => {
    onUpdate({
      ...slide,
      meta: {
        ...slide.meta,
        [field]: value,
      },
    })
  }

  const updateContent = (field: keyof Slide["content"], value: unknown) => {
    onUpdate({
      ...slide,
      content: {
        ...slide.content,
        [field]: value,
      },
    })
  }

  const updateTextBlock = (index: number, value: string) => {
    const newBlocks = [...slide.content.textBlocks]
    newBlocks[index] = value
    updateContent("textBlocks", newBlocks)
  }

  const addTextBlock = () => {
    updateContent("textBlocks", [...slide.content.textBlocks, "New paragraph"])
  }

  const deleteTextBlock = (index: number) => {
    const newBlocks = slide.content.textBlocks.filter((_, i) => i !== index)
    updateContent("textBlocks", newBlocks)
  }

  const updateListItem = (index: number, value: string) => {
    const newItems = [...slide.content.listItems]
    newItems[index] = value
    updateContent("listItems", newItems)
  }

  const addListItem = () => {
    updateContent("listItems", [...slide.content.listItems, "New item"])
  }

  const deleteListItem = (index: number) => {
    const newItems = slide.content.listItems.filter((_, i) => i !== index)
    updateContent("listItems", newItems)
  }

  const updateColumn = (side: "left" | "right", value: string) => {
    updateContent("columns", {
      ...slide.content.columns,
      [side]: value,
    })
  }

  return (
    <div
      className="aspect-video w-full max-w-5xl rounded-lg border-2 shadow-2xl"
      style={{ backgroundColor: slideColors.background }}
    >
      <div className="h-full p-12" style={{ color: slideColors.text }}>
        {slide.template === "title" && (
          <div className="flex h-full flex-col items-center justify-center gap-6 text-center">
            {isEditing === "title" ? (
              <Input
                value={slide.meta.title}
                onChange={(e) => updateMeta("title", e.target.value)}
                onBlur={() => setIsEditing(null)}
                autoFocus
                className="text-center text-5xl font-bold"
                style={{ color: slideColors.text }}
              />
            ) : (
              <h1
                className="cursor-pointer text-5xl font-bold text-balance hover:opacity-70"
                onClick={() => setIsEditing("title")}
                style={{ color: slideColors.primary }}
              >
                {slide.meta.title}
              </h1>
            )}

            {isEditing === "subtitle" ? (
              <Input
                value={slide.meta.subtitle || ""}
                onChange={(e) => updateMeta("subtitle", e.target.value)}
                onBlur={() => setIsEditing(null)}
                autoFocus
                className="text-center text-2xl"
                style={{ color: slideColors.text }}
              />
            ) : (
              <p
                className="cursor-pointer text-2xl text-balance hover:opacity-70"
                onClick={() => setIsEditing("subtitle")}
                style={{ color: slideColors.text, opacity: 0.7 }}
              >
                {slide.meta.subtitle || "Click to add subtitle"}
              </p>
            )}
          </div>
        )}

        {slide.template === "text" && (
          <div className="space-y-6">
            {isEditing === "title" ? (
              <Input
                value={slide.meta.title}
                onChange={(e) => updateMeta("title", e.target.value)}
                onBlur={() => setIsEditing(null)}
                autoFocus
                className="text-3xl font-bold"
                style={{ color: slideColors.text }}
              />
            ) : (
              <h2
                className="cursor-pointer text-3xl font-bold hover:opacity-70"
                onClick={() => setIsEditing("title")}
                style={{ color: slideColors.primary }}
              >
                {slide.meta.title}
              </h2>
            )}

            <div className="space-y-4">
              {slide.content.textBlocks.map((block, i) => (
                <div key={i} className="group relative">
                  {isEditing === `text-${i}` ? (
                    <Textarea
                      value={block}
                      onChange={(e) => updateTextBlock(i, e.target.value)}
                      onBlur={() => setIsEditing(null)}
                      autoFocus
                      rows={3}
                      className="text-lg leading-relaxed"
                      style={{ color: slideColors.text }}
                    />
                  ) : (
                    <p
                      className="cursor-pointer whitespace-pre-wrap text-lg leading-relaxed hover:opacity-70"
                      onClick={() => setIsEditing(`text-${i}`)}
                      style={{ color: slideColors.text, opacity: 0.8 }}
                    >
                      {block}
                    </p>
                  )}
                  {slide.content.textBlocks.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute -right-2 -top-2 size-6 opacity-0 transition-opacity group-hover:opacity-100"
                      onClick={() => deleteTextBlock(i)}
                    >
                      <X className="size-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={addTextBlock}
              className="bg-transparent opacity-30 transition-opacity hover:opacity-100"
            >
              <Plus className="mr-2 size-4" />
              Add Paragraph
            </Button>
          </div>
        )}

        {slide.template === "list" && (
          <div className="space-y-6">
            {isEditing === "title" ? (
              <Input
                value={slide.meta.title}
                onChange={(e) => updateMeta("title", e.target.value)}
                onBlur={() => setIsEditing(null)}
                autoFocus
                className="text-3xl font-bold"
                style={{ color: slideColors.text }}
              />
            ) : (
              <h2
                className="cursor-pointer text-3xl font-bold hover:opacity-70"
                onClick={() => setIsEditing("title")}
                style={{ color: slideColors.primary }}
              >
                {slide.meta.title}
              </h2>
            )}

            <ul className="space-y-4">
              {slide.content.listItems.map((item, i) => (
                <li key={i} className="group flex items-start gap-3">
                  <span className="mt-1 size-2 shrink-0 rounded-full" style={{ backgroundColor: slideColors.accent }} />
                  <div className="flex flex-1 items-center gap-2">
                    {isEditing === `item-${i}` ? (
                      <Input
                        value={item}
                        onChange={(e) => updateListItem(i, e.target.value)}
                        onBlur={() => setIsEditing(null)}
                        autoFocus
                        className="text-lg"
                        style={{ color: slideColors.text }}
                      />
                    ) : (
                      <span
                        className="flex-1 cursor-pointer text-lg hover:opacity-70"
                        onClick={() => setIsEditing(`item-${i}`)}
                        style={{ color: slideColors.text }}
                      >
                        {item}
                      </span>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-6 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                      onClick={() => deleteListItem(i)}
                    >
                      <X className="size-4" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>

            <Button
              variant="outline"
              size="sm"
              onClick={addListItem}
              className="bg-transparent opacity-30 transition-opacity hover:opacity-100"
            >
              <Plus className="mr-2 size-4" />
              Add Item
            </Button>
          </div>
        )}

        {slide.template === "two-column" && (
          <div className="flex h-full flex-col gap-6">
            <div>
              {isEditing === "title" ? (
                <Input
                  value={slide.meta.title}
                  onChange={(e) => updateMeta("title", e.target.value)}
                  onBlur={() => setIsEditing(null)}
                  autoFocus
                  className="text-3xl font-bold"
                  style={{ color: slideColors.text }}
                />
              ) : (
                <h2
                  className="cursor-pointer text-3xl font-bold hover:opacity-70"
                  onClick={() => setIsEditing("title")}
                  style={{ color: slideColors.primary }}
                >
                  {slide.meta.title}
                </h2>
              )}
            </div>
            <div className="grid flex-1 grid-cols-2 gap-8">
              <div>
                {isEditing === "leftColumn" ? (
                  <Textarea
                    value={slide.content.columns.left}
                    onChange={(e) => updateColumn("left", e.target.value)}
                    onBlur={() => setIsEditing(null)}
                    autoFocus
                    rows={10}
                    className="h-full text-base leading-relaxed"
                    style={{ color: slideColors.text }}
                  />
                ) : (
                  <div
                    className="cursor-pointer whitespace-pre-wrap text-base leading-relaxed hover:opacity-70"
                    onClick={() => setIsEditing("leftColumn")}
                    style={{ color: slideColors.text }}
                  >
                    {slide.content.columns.left || "Click to add left content"}
                  </div>
                )}
              </div>
              <div>
                {isEditing === "rightColumn" ? (
                  <Textarea
                    value={slide.content.columns.right}
                    onChange={(e) => updateColumn("right", e.target.value)}
                    onBlur={() => setIsEditing(null)}
                    autoFocus
                    rows={10}
                    className="h-full text-base leading-relaxed"
                    style={{ color: slideColors.text }}
                  />
                ) : (
                  <div
                    className="cursor-pointer whitespace-pre-wrap text-base leading-relaxed hover:opacity-70"
                    onClick={() => setIsEditing("rightColumn")}
                    style={{ color: slideColors.text }}
                  >
                    {slide.content.columns.right || "Click to add right content"}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {slide.template === "quote" && (
          <div className="flex h-full flex-col items-center justify-center gap-6 text-center">
            {isEditing === "quote" ? (
              <Textarea
                value={slide.content.quote}
                onChange={(e) => updateContent("quote", e.target.value)}
                onBlur={() => setIsEditing(null)}
                autoFocus
                rows={4}
                className="text-center text-3xl italic"
                style={{ color: slideColors.text }}
              />
            ) : (
              <blockquote
                className="cursor-pointer text-3xl italic text-balance hover:opacity-70"
                onClick={() => setIsEditing("quote")}
                style={{ color: slideColors.accent }}
              >
                "{slide.content.quote}"
              </blockquote>
            )}

            {isEditing === "author" ? (
              <Input
                value={slide.meta.author || ""}
                onChange={(e) => updateMeta("author", e.target.value)}
                onBlur={() => setIsEditing(null)}
                autoFocus
                className="text-center text-xl"
                style={{ color: slideColors.text }}
              />
            ) : (
              <cite
                className="cursor-pointer text-xl not-italic hover:opacity-70"
                onClick={() => setIsEditing("author")}
                style={{ color: slideColors.text, opacity: 0.7 }}
              >
                — {slide.meta.author || "Unknown"}
              </cite>
            )}
          </div>
        )}

        {slide.template === "image" && (
          <div className="flex h-full flex-col gap-6">
            {isEditing === "title" ? (
              <Input
                value={slide.meta.title}
                onChange={(e) => updateMeta("title", e.target.value)}
                onBlur={() => setIsEditing(null)}
                autoFocus
                className="text-3xl font-bold"
                style={{ color: slideColors.text }}
              />
            ) : (
              <h2
                className="cursor-pointer text-3xl font-bold hover:opacity-70"
                onClick={() => setIsEditing("title")}
                style={{ color: slideColors.primary }}
              >
                {slide.meta.title}
              </h2>
            )}

            <div
              className="flex flex-1 items-center justify-center rounded-lg"
              style={{ backgroundColor: slideColors.accent, opacity: 0.1 }}
            >
              {slide.content.image.url ? (
                <img
                  src={slide.content.image.url || "/placeholder.svg"}
                  alt={slide.meta.title}
                  className="h-full w-full rounded-lg object-cover"
                />
              ) : (
                <p style={{ color: slideColors.text, opacity: 0.5 }}>Image placeholder (full width)</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
