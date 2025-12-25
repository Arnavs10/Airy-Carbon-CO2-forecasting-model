"use client"

import Link from "next/link"
import { usePathname } from 'next/navigation'
import { motion } from "framer-motion"
import { Leaf } from 'lucide-react'
import { ThemeToggle } from "./theme-toggle"

export default function Header() {
  const pathname = usePathname()

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/global-prediction", label: "Global Prediction" },
    { href: "/country-prediction", label: "Country-wise Prediction" },
    { href: "/use-cases", label: "Use Cases" },
    { href: "/about", label: "About" },
  ]

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-primary/10"
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <Leaf className="w-8 h-8 text-primary" />
            <motion.div whileHover={{ scale: 1.05 }} className="text-2xl font-bold text-primary">
              Airy
            </motion.div>
          </Link>

          <nav className="absolute left-1/2 -translate-x-1/2 flex gap-8 items-center">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`relative text-sm font-medium transition-colors duration-300 hover:text-primary ${
                  pathname === item.href ? "text-primary" : "text-foreground/70"
                }`}
              >
                {item.label}
                {pathname === item.href && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </nav>

          <ThemeToggle />
        </div>
      </div>
    </motion.header>
  )
}
