"use client"
import { motion } from "framer-motion"
import { TrendingUp, Globe, BarChart3 } from "lucide-react"

export default function Featured() {
  const features = [
    {
      icon: Globe,
      title: "Global Predictions",
      description:
        "Access worldwide CO₂ emission forecasts using advanced machine learning models including SARIMA, Holt-Winters, and LSTM networks.",
    },
    {
      icon: BarChart3,
      title: "Country-Specific Analysis",
      description:
        "Get detailed emission predictions for individual countries with polynomial regression and exponential smoothing techniques.",
    },
    {
      icon: TrendingUp,
      title: "Actionable Insights",
      description:
        "Receive practical recommendations and understand the real-world impact of emission trends on climate change.",
    },
  ]

  return (
    <div className="min-h-screen px-6 py-24 bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">Predict. Understand. Act.</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
            Harness the power of machine learning to forecast carbon emissions and make informed decisions for a
            sustainable future.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="bg-card p-8 rounded-lg border border-primary/10 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
            >
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <feature.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
