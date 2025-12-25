"use client"

import Link from "next/link"
import { Leaf } from "lucide-react"

export default function Footer() {
  return (
    <div
      className="relative h-[400px] sm:h-[600px] lg:h-[800px] max-h-[800px]"
      style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}
    >
      <div className="relative h-[calc(100vh+400px)] sm:h-[calc(100vh+600px)] lg:h-[calc(100vh+800px)] -top-[100vh]">
        <div className="h-[400px] sm:h-[600px] lg:h-[800px] sticky top-[calc(100vh-400px)] sm:top-[calc(100vh-600px)] lg:top-[calc(100vh-800px)]">
          <div className="bg-primary py-4 sm:py-6 lg:py-8 px-4 sm:px-6 h-full w-full flex flex-col justify-between">
            <div className="flex shrink-0 gap-8 sm:gap-12 lg:gap-20">
              <div className="flex flex-col gap-1 sm:gap-2">
                <h3 className="mb-1 sm:mb-2 uppercase text-primary-foreground/70 text-xs sm:text-sm">Predictions</h3>
                <Link
                  href="/global-prediction"
                  className="text-primary-foreground hover:text-primary-foreground/70 transition-colors duration-300 text-sm sm:text-base"
                >
                  Global Forecast
                </Link>
                <Link
                  href="/country-prediction"
                  className="text-primary-foreground hover:text-primary-foreground/70 transition-colors duration-300 text-sm sm:text-base"
                >
                  Country Analysis
                </Link>
                <Link
                  href="/use-cases"
                  className="text-primary-foreground hover:text-primary-foreground/70 transition-colors duration-300 text-sm sm:text-base"
                >
                  Use Cases
                </Link>
              </div>
              <div className="flex flex-col gap-1 sm:gap-2">
                <h3 className="mb-1 sm:mb-2 uppercase text-primary-foreground/70 text-xs sm:text-sm">About</h3>
                <Link
                  href="/about"
                  className="text-primary-foreground hover:text-primary-foreground/70 transition-colors duration-300 text-sm sm:text-base"
                >
                  Our Mission
                </Link>
                <Link
                  href="/about#team"
                  className="text-primary-foreground hover:text-primary-foreground/70 transition-colors duration-300 text-sm sm:text-base"
                >
                  Team
                </Link>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 sm:gap-0">
              <div className="flex items-center gap-4">
                <Leaf className="w-12 h-12 sm:w-16 sm:h-16 text-primary-foreground" />
                <h1 className="text-6xl sm:text-8xl lg:text-9xl leading-[0.8] text-primary-foreground font-bold tracking-tight">
                  AIRY
                </h1>
              </div>
              <p className="text-primary-foreground/70 text-sm sm:text-base">©2025 Airy. For a sustainable future.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
