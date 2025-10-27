import { type NextRequest, NextResponse } from "next/server"
import type { Slide } from "@/lib/types/slide"

export async function POST(request: NextRequest) {
  try {
    const { slideId, currentSlide, prompt } = await request.json()

    const openRouterApiKey = process.env.OPENROUTER_API_KEY
    if (!openRouterApiKey) {
      return NextResponse.json({ error: "OpenRouter API key not configured" }, { status: 500 })
    }

    const systemPrompt = `You are a professional presentation designer. Regenerate this slide with improvements.

Current slide: ${JSON.stringify(currentSlide, null, 2)}

User feedback: ${prompt || "Make it better and more engaging"}

Return ONLY a valid JSON object using this EXACT structure:

{
  "id": "${slideId}",
  "template": "${currentSlide.template}",
  "meta": {
    "title": "Improved Title",
    "subtitle": null or "subtitle text",
    "author": null or "author name"
  },
  "content": {
    "textBlocks": ["Paragraph 1", "Paragraph 2"],
    "listItems": ["Item 1", "Item 2"],
    "columns": {
      "left": "Left content",
      "right": "Right content"
    },
    "quote": "Quote text",
    "image": {
      "url": null,
      "position": "full"
    },
    "layoutHints": {}
  }
}

TEMPLATE-SPECIFIC REQUIREMENTS:
- "title": Fill meta.title and meta.subtitle
- "text": Fill meta.title and content.textBlocks (1-3 paragraphs)
- "list": Fill meta.title and content.listItems (3-6 items)
- "two-column": Fill meta.title, content.columns.left, and content.columns.right
- "quote": Fill content.quote and meta.author
- "image": Fill meta.title

Keep the same template type but improve the content based on user feedback.
Always include ALL fields in the structure, use empty arrays [] or empty strings "" for unused fields.`

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openRouterApiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: systemPrompt,
          },
        ],
        temperature: 0.8,
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.statusText}`)
    }

    const data = await response.json()
    const content = data.choices[0]?.message?.content

    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error("Failed to parse slide from AI response")
    }

    const slide: Slide = JSON.parse(jsonMatch[0])

    return NextResponse.json({ slide })
  } catch (error) {
    console.error("[debug] Error regenerating slide:", error)
    return NextResponse.json({ error: "Failed to regenerate slide" }, { status: 500 })
  }
}
