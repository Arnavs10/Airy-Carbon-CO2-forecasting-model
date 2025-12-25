"use client"

import Link from "next/link"
import { useScroll, useTransform, motion } from "framer-motion"
import { useRef } from "react"
import Header from "./header"
import { Leaf } from "lucide-react"
import { AnimatedBackground } from "./animated-background"

export default function Hero() {
  const container = useRef(null)
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0vh", "150vh"])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  return (
    <div ref={container} className="h-screen overflow-hidden relative">
      <Header />
      <motion.div style={{ y }} className="relative h-full">
        <AnimatedBackground />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-background/80" />
        <motion.div style={{ opacity }} className="absolute inset-0 flex items-center justify-center z-10">
          <div className="text-center max-w-4xl px-6">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="flex justify-center mb-6"
            >
              <div className="bg-primary/10 backdrop-blur-sm p-6 rounded-full">
                <Leaf className="w-16 h-16 text-accent" />
              </div>
            </motion.div>
            <motion.h1
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-balance text-gray-900 dark:text-white"
            >
              Airy
            </motion.h1>
            <motion.p
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-xl md:text-2xl leading-relaxed mb-4 text-balance text-gray-900 dark:text-white"
            >
              Carbon CO₂ Emissions Predictor
            </motion.p>
            <motion.p
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="text-base md:text-lg leading-relaxed mb-8 max-w-2xl mx-auto text-balance text-gray-700 dark:text-gray-200"
            >
              Empowering climate action through advanced machine learning predictions. Understand the future of global
              emissions and take informed steps toward a sustainable planet.
            </motion.p>
            {/* </CHANGE> */}
            <Link href="/global-prediction">
              <motion.button
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.8 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-primary text-primary-foreground font-medium rounded-full transition-all duration-300 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/50"
              >
                Explore Predictions
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
