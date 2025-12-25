"use client"

import Image from "next/image"
import { useScroll, useTransform, motion } from "framer-motion"
import { useRef } from "react"

export default function Promo() {
  const container = useRef(null)
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start end", "end start"],
  })
  const y = useTransform(scrollYProgress, [0, 1], ["-10vh", "10vh"])

  return (
    <div
      ref={container}
      className="relative flex items-center justify-center h-screen overflow-hidden"
      style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}
    >
      <div className="fixed top-[-10vh] left-0 h-[120vh] w-full">
        <motion.div style={{ y }} className="relative w-full h-full">
          <Image
            src="/images/earth-atmosphere.jpg"
            fill
            alt="Earth atmosphere from space"
            style={{ objectFit: "cover" }}
          />
          <div className="absolute inset-0 bg-primary/40" />
        </motion.div>
      </div>

      <div className="relative z-10 text-center text-white px-6 max-w-4xl">
        <motion.h3
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-sm md:text-base uppercase mb-6 tracking-wider"
        >
          The Science Behind Airy
        </motion.h3>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-2xl md:text-4xl lg:text-5xl font-bold leading-tight text-balance"
        >
          Advanced algorithms trained on decades of emission data to provide accurate forecasts and meaningful climate
          insights
        </motion.p>
      </div>
      {/* </CHANGE> */}
    </div>
  )
}
