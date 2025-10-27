"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Upload, Sparkles, Loader2, ChevronDown, ChevronUp, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const router = useRouter()
  const [topic, setTopic] = useState("")
  const [prompt, setPrompt] = useState("")
  const [files, setFiles] = useState<File[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [showMoreDetails, setShowMoreDetails] = useState(false)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files))
    }
  }

  const scrollToForm = () => {
    document.getElementById("form-section")?.scrollIntoView({ behavior: "smooth" })
  }

  const handleGenerate = async () => {
    if (!topic.trim()) return

    setIsGenerating(true)
    try {
      // Read file contents
      const referenceFiles = await Promise.all(
        files.map(async (file) => {
          const text = await file.text()
          return `File: ${file.name}\n${text}`
        }),
      )

      const response = await fetch("/api/generate-slides", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          prompt,
          referenceFiles,
          slideCount: 8,
        }),
      })

      if (!response.ok) throw new Error("Failed to generate slides")

      const { slides } = await response.json()

      // Store slides in sessionStorage and navigate to editor
      sessionStorage.setItem(
        "presentation",
        JSON.stringify({
          id: Date.now().toString(),
          title: topic,
          slides,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }),
      )

      router.push("/editor")
    } catch (error) {
      console.error("[debug] Error:", error)
      alert("Failed to generate slides. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen">
      <section className="relative flex h-screen items-center overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/northern-lights-aurora-borealis-night-sky.jpg"
            alt="Northern Lights"
            className="h-full w-full object-cover"
          />
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
        </div>

        {/* Hero content - Left aligned */}
        <div className="relative z-10 mx-auto max-w-7xl px-8 w-full">
          <div className="max-w-2xl">
            <h1 className="mb-6 text-8xl font-bold tracking-tight text-white text-balance drop-shadow-2xl">
              Tea Slide Gen
            </h1>
            <p className="mb-12 text-3xl text-white/90 text-balance drop-shadow-lg leading-relaxed">
              Create stunning presentations in seconds with AI
            </p>

            <Button
              onClick={scrollToForm}
              size="lg"
              className="group relative overflow-hidden bg-white text-black hover:bg-white/90 text-xl px-10 py-8 rounded-2xl shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.5)]"
            >
              <span className="relative z-10 flex items-center font-semibold">
                Try Now
                <ArrowRight className="ml-3 size-6 transition-transform duration-300 group-hover:translate-x-2" />
              </span>
              {/* Animated gradient background on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="size-8 text-white/60" />
        </div>
      </section>

      <section id="form-section" className="min-h-screen bg-background py-20">
        <div className="mx-auto max-w-3xl px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold tracking-tight text-balance">What would you like to present?</h2>
            <p className="text-lg text-muted-foreground text-balance">
              Just enter a topic and let AI create your slides
            </p>
          </div>

          <Card className="glass-effect p-8 backdrop-blur-sm border-border/50">
            <div className="space-y-6">
              {/* Main topic input */}
              <div className="space-y-2">
                <Label htmlFor="topic" className="text-lg font-semibold">
                  Presentation Topic
                </Label>
                <Input
                  id="topic"
                  placeholder="e.g., Introduction to Machine Learning"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="text-lg h-14 glass-effect"
                />
              </div>

              <div className="space-y-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowMoreDetails(!showMoreDetails)}
                  className="w-full justify-between text-base font-medium"
                >
                  More Details (Optional)
                  {showMoreDetails ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                </Button>

                {showMoreDetails && (
                  <div className="space-y-6 animate-in slide-in-from-top-2 duration-300">
                    <div className="space-y-2">
                      <Label htmlFor="prompt" className="text-base font-semibold">
                        Additional Instructions
                      </Label>
                      <Textarea
                        id="prompt"
                        placeholder="Describe the style, audience, key points you want to cover..."
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        rows={4}
                        className="resize-none text-base glass-effect"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="files" className="text-base font-semibold">
                        Reference Materials
                      </Label>
                      <div className="flex items-center gap-3">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => document.getElementById("files")?.click()}
                          className="w-full justify-start text-base glass-effect"
                        >
                          <Upload className="mr-2 size-4" />
                          {files.length > 0 ? `${files.length} file(s) selected` : "Upload files"}
                        </Button>
                        <input
                          id="files"
                          type="file"
                          multiple
                          accept=".txt,.md,.pdf,.doc,.docx"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </div>
                      {files.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {files.map((file, i) => (
                            <div key={i} className="text-sm text-muted-foreground">
                              • {file.name}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Generate button */}
              <Button
                onClick={handleGenerate}
                disabled={!topic.trim() || isGenerating}
                className="w-full text-lg h-14"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 size-5 animate-spin" />
                    Generating Slides...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 size-5" />
                    Generate Presentation
                  </>
                )}
              </Button>
            </div>
          </Card>
        </div>
      </section>
    </div>
  )
}
