# Tea Slide Gen

<div align="center">
  <h3>AI-Powered Presentation Generator</h3>
  <p>Create stunning presentations in seconds with artificial intelligence</p>
</div>

## Overview

Tea Slide Gen is a modern web application that leverages AI to automatically generate professional presentation slides. Simply provide a topic, and the application creates a complete slide deck with intelligent content organization and beautiful layouts.

## Features

- **🤖 AI-Powered Generation** - Automatically create complete presentations from a simple topic
- **📝 Smart Content Organization** - AI intelligently structures your content across multiple slide templates
- **🎨 Multiple Slide Templates** - Support for title, text, list, two-column, quote, and image layouts
- **✏️ Interactive Editor** - Edit and customize slides with an intuitive visual editor
- **📄 Reference Materials** - Upload files to provide context for better slide generation
- **🎯 Custom Instructions** - Fine-tune generation with additional prompts and requirements
- **🔄 Slide Regeneration** - Regenerate individual slides with different content
- **📱 Responsive Design** - Works seamlessly across desktop and mobile devices
- **🌓 Theme Support** - Built-in dark/light mode support

## Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) with App Router
- **Language:** TypeScript
- **UI Components:** [Radix UI](https://www.radix-ui.com/) + Custom Components
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
- **Form Handling:** React Hook Form + Zod validation
- **State Management:** React Hooks + Session Storage
- **Icons:** [Lucide React](https://lucide.dev/)
- **Animations:** Tailwind CSS Animate

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- pnpm (recommended) or npm/yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/ai-slide-generator.git
cd ai-slide-generator
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables (if needed):
```bash
cp .env.example .env.local
```

4. Run the development server:
```bash
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Creating a Presentation

1. **Enter a Topic:** Provide the main subject of your presentation
2. **Add Details (Optional):**
   - Additional instructions for style, audience, or key points
   - Upload reference materials (.txt, .md, .pdf, .doc, .docx)
3. **Generate:** Click "Generate Presentation" and wait for AI to create your slides
4. **Edit:** Customize slides in the interactive editor

### Editor Features

- **Slide Navigation:** Click thumbnails to switch between slides
- **Content Editing:** Modify slide content directly on the canvas
- **Template Selection:** Change slide layouts with the toolbar
- **Slide Regeneration:** Regenerate individual slides with new content
- **Export:** Download your presentation (coming soon)
- **Share:** Share presentations with others (coming soon)

## Project Structure

```
ai-slide-generator/
├── app/                      # Next.js app directory
│   ├── api/                  # API routes
│   │   ├── generate-slides/  # Slide generation endpoint
│   │   └── regenerate-slide/ # Single slide regeneration
│   ├── editor/               # Editor page
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Home page
├── components/               # React components
│   ├── ui/                   # UI component library
│   ├── slide-canvas.tsx      # Main slide editor
│   ├── slide-thumbnails.tsx  # Sidebar thumbnails
│   └── slide-toolbar.tsx     # Editor toolbar
├── lib/                      # Utilities and types
│   ├── types/                # TypeScript definitions
│   ├── colors.ts             # Color utilities
│   └── utils.ts              # Helper functions
├── public/                   # Static assets
└── styles/                   # Global styles
```

## API Routes

### POST /api/generate-slides
Generate a complete presentation from a topic.

**Request Body:**
```typescript
{
  topic: string
  prompt?: string
  referenceFiles?: string[]
  slideCount?: number
}
```

**Response:**
```typescript
{
  slides: Slide[]
}
```

### POST /api/regenerate-slide
Regenerate a single slide with new content.

**Request Body:**
```typescript
{
  slideIndex: number
  currentSlide: Slide
  prompt?: string
  topic: string
}
```

**Response:**
```typescript
{
  slide: Slide
}
```

## Slide Templates

The application supports six template types:

- **Title:** Cover slides with title and subtitle
- **Text:** General text content blocks
- **List:** Bullet-point lists
- **Two-Column:** Side-by-side content layout
- **Quote:** Highlighted quotations
- **Image:** Image-focused slides with captions

## Development

### Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

### Code Style

This project uses:
- ESLint for code linting
- TypeScript for type safety
- Prettier (recommended) for code formatting

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [Radix UI](https://www.radix-ui.com/)
- Icons by [Lucide](https://lucide.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)

## Support

For support, please open an issue in the GitHub repository or contact the maintainers.

