import { type NextRequest, NextResponse } from "next/server"
import type { Slide } from "@/lib/types/slide"

export async function POST(request: NextRequest) {
  try {
    const { prompt, topic, referenceFiles, slideCount = 5 } = await request.json()

    const openRouterApiKey = process.env.OPENROUTER_API_KEY
    if (!openRouterApiKey) {
      return NextResponse.json({ error: "OpenRouter API key not configured" }, { status: 500 })
    }

    const context = referenceFiles?.length ? `Reference materials: ${referenceFiles.join("\n\n")}` : ""

    const systemPrompt = `You are a professional presentation designer. Generate ${slideCount} slides for a presentation about "${topic}".

${context}

User requirements: ${prompt}

Return ONLY a valid JSON array of slides using this EXACT structure:

{
  "id": "slide-1",
  "template": "title" | "text" | "list" | "two-column" | "quote" | "image",
  "meta": {
    "title": "Slide Title",
    "subtitle": "Optional subtitle" or null,
    "author": "Optional author" or null
  },
  "content": {
    "textBlocks": ["Paragraph 1", "Paragraph 2"],
    "listItems": ["Item 1", "Item 2", "Item 3"],
    "columns": {
      "left": "Left column content",
      "right": "Right column content"
    },
    "quote": "Quote text",
    "image": {
      "url": null,
      "position": "left" | "right" | "full"
    },
    "layoutHints": {}
  }
}

TEMPLATE USAGE GUIDE:
- "title": Use meta.title and meta.subtitle
- "text": Use meta.title and content.textBlocks (array of paragraphs)
- "list": Use meta.title and content.listItems (array of bullet points)
- "two-column": Use meta.title, content.columns.left, and content.columns.right
- "quote": Use content.quote and meta.author
- "image": Use meta.title and content.image (position: "full")

CRITICAL RULES:
1. ALL slides must have meta.title filled
2. For "text" template: Fill content.textBlocks with 1-3 paragraphs
3. For "list" template: Fill content.listItems with 3-6 items
4. For "two-column" template: Fill BOTH content.columns.left AND content.columns.right
5. For "quote" template: Fill content.quote and meta.author
6. Always include ALL fields in the structure, use empty arrays [] or empty strings "" for unused fields
7. Use a variety of templates for visual interest

Example slide:
{
  "id": "slide-1",
  "template": "text",
  "meta": {
    "title": "Introduction to AI",
    "subtitle": null,
    "author": null
  },
  "content": {
    "textBlocks": ["Artificial Intelligence is transforming how we work and live.", "From healthcare to transportation, AI is making significant impacts."],
    "listItems": [],
    "columns": { "left": "", "right": "" },
    "quote": "",
    "image": { "url": null, "position": "full" },
    "layoutHints": {}
  }
}

Return the array starting with [ and ending with ]`

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
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.statusText}`)
    }

    const data = await response.json()
    const content = data.choices[0]?.message?.content

    const jsonMatch = content.match(/\[[\s\S]*\]/)
    if (!jsonMatch) {
      throw new Error("Failed to parse slides from AI response")
    }

    const slides: Slide[] = JSON.parse(jsonMatch[0])

    return NextResponse.json({ slides })
  } catch (error) {
    console.error("[debug] Error generating slides:", error)
    return NextResponse.json({ error: "Failed to generate slides" }, { status: 500 })
  }
}
