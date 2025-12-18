import * as React from "react"
import { Link } from "@tanstack/react-router"
import { Button } from "./button"

interface HeroProps {
  title?: string
  subtitle?: string
  ctaText?: string
  ctaHref?: string
  altCtaText?: string
  altCtaHref?: string
}

export function Hero({
  title = "Delicious food, delivered fast",
  subtitle = "Find your favorite local restaurants and get food delivered to your door.",
  ctaText = "Get started",
  ctaHref = "/signup",
  altCtaText = "Log in",
  altCtaHref = "/login",
}: HeroProps) {
  return (
    <section className="w-full relative min-h-screen py-32">
      <div className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
            {title}
          </h1>
          <p className="mt-4 text-lg text-slate-100/90">{subtitle}</p>

          <div className="mt-8 flex items-center gap-3">
            <Link to={ctaHref}>
              <Button size="lg">{ctaText}</Button>
            </Link>
            <Link to={altCtaHref}>
              <Button size="lg">{altCtaText}</Button>
            </Link>
          </div>
        </div>

        {/* <div className="flex justify-center md:justify-end">
          <div className="w-64 h-64 rounded-lg overflow-hidden shadow-lg bg-white flex items-center justify-center">
            <img src="/logo.png" alt="YuEats" className="w-full h-full object-cover" />
          </div>
        </div> */}
      </div>
    </section>
  )
}

export default Hero
