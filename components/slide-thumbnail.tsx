import type { Slide } from "@/lib/types/slide"

interface SlideThumbnailProps {
  slide: Slide
}

export function SlideThumbnail({ slide }: SlideThumbnailProps) {
  return (
    <div className="aspect-video w-full overflow-hidden rounded border bg-background p-2 text-xs">
      {slide.template === "title" && (
        <div className="flex h-full flex-col items-center justify-center text-center">
          <div className="font-bold line-clamp-2">{slide.meta.title}</div>
          {slide.meta.subtitle && <div className="mt-1 text-muted-foreground line-clamp-1">{slide.meta.subtitle}</div>}
        </div>
      )}

      {slide.template === "text" && (
        <div className="space-y-1">
          <div className="font-semibold line-clamp-1">{slide.meta.title}</div>
          {slide.content.textBlocks.length > 0 && (
            <div className="text-muted-foreground line-clamp-3">{slide.content.textBlocks.join(" ")}</div>
          )}
        </div>
      )}

      {slide.template === "list" && (
        <div className="space-y-1">
          <div className="font-semibold line-clamp-1">{slide.meta.title}</div>
          <div className="space-y-0.5">
            {slide.content.listItems.slice(0, 3).map((item, i) => (
              <div key={i} className="text-muted-foreground line-clamp-1">
                • {item}
              </div>
            ))}
          </div>
        </div>
      )}

      {slide.template === "two-column" && (
        <div className="space-y-1">
          <div className="font-semibold line-clamp-1">{slide.meta.title}</div>
          <div className="grid grid-cols-2 gap-1">
            <div className="text-muted-foreground line-clamp-3">{slide.content.columns.left}</div>
            <div className="text-muted-foreground line-clamp-3">{slide.content.columns.right}</div>
          </div>
        </div>
      )}

      {slide.template === "quote" && (
        <div className="flex h-full flex-col justify-center">
          <div className="italic line-clamp-3">"{slide.content.quote}"</div>
          {slide.meta.author && <div className="mt-1 text-muted-foreground line-clamp-1">— {slide.meta.author}</div>}
        </div>
      )}

      {slide.template === "image" && (
        <div className="space-y-1">
          <div className="font-semibold line-clamp-1">{slide.meta.title}</div>
          <div className="flex h-12 items-center justify-center rounded bg-muted text-muted-foreground">[Image]</div>
        </div>
      )}
    </div>
  )
}
