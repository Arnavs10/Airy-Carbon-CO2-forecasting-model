"use client"

import { motion } from "framer-motion"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Target, Zap, Users } from "lucide-react"

export default function About() {
  const Developer = [
    {
      name: "Arnav Shukla",
      role: "Lead Developer",
      bio: "Full-stack developer specializing in machine learning applications and climate data visualization.",
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <Header />
      <main className="container mx-auto px-6 pt-32 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto"
        >
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">About Airy</h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-balance">
              Empowering climate action through data-driven insights and accessible technology
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="h-full">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-primary/10 p-2 rounded-lg">
                      <Heart className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-2xl">Our Inspiration</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="leading-relaxed text-muted-foreground">
                    Airy was born from a simple yet powerful realization: while climate change is one of humanity's
                    greatest challenges, access to accurate emission forecasts remains limited to large institutions and
                    research organizations.
                  </p>
                  <p className="leading-relaxed text-muted-foreground">
                    We believe that democratizing climate data and predictions can accelerate global action. By making
                    sophisticated machine learning models accessible to everyone—from policymakers to students—we're
                    enabling informed decisions at every level.
                  </p>
                  <p className="leading-relaxed text-muted-foreground">
                    Our mission is to bridge the gap between complex climate science and practical action, turning data
                    into insights and insights into impact.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="h-full">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-primary/10 p-2 rounded-lg">
                      <Target className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-2xl">Our Mission</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="leading-relaxed text-muted-foreground">
                    To provide accurate, accessible, and actionable CO₂ emission predictions that empower individuals,
                    organizations, and governments to make informed decisions for a sustainable future.
                  </p>
                  <div className="space-y-3 pt-4">
                    <div className="flex items-start gap-3">
                      <Zap className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold mb-1">Accuracy First</p>
                        <p className="text-sm text-muted-foreground">
                          Combining multiple ML models for the most reliable forecasts
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Users className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold mb-1">Accessibility</p>
                        <p className="text-sm text-muted-foreground">
                          Making climate science understandable and actionable for everyone
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Heart className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold mb-1">Impact Driven</p>
                        <p className="text-sm text-muted-foreground">
                          Translating predictions into practical climate action
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* ===== Developer block (centered) ===== */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-16"
            id="team"
          >
            <h2 className="text-3xl font-bold text-center mb-12">Developer</h2>
            <div className="flex justify-center">
              <div className="grid md:grid-cols-1 gap-6 max-w-md w-full">
                {Developer.map((member, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card className="h-full hover:shadow-lg hover:shadow-primary/10 transition-all duration-300">
                      <CardHeader>
                        <div className="w-20 h-20 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                          <Users className="w-10 h-10 text-primary" />
                        </div>
                        <CardTitle className="text-center text-lg">{member.name}</CardTitle>
                        <CardDescription className="text-center text-primary font-medium">
                          {member.role}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground text-center leading-relaxed">
                          {member.bio}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
          {/* ===== end Developer block ===== */}

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Card className="bg-gradient-to-r from-primary to-accent text-primary-foreground">
              <CardHeader>
                <CardTitle className="text-2xl text-center">The Technology Behind Airy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="leading-relaxed text-center">
                  Our prediction engine combines three powerful machine learning approaches:
                </p>
                <div className="grid md:grid-cols-3 gap-6 pt-4">
                  <div className="text-center">
                    <h3 className="font-bold text-lg mb-2">SARIMA</h3>
                    <p className="text-sm opacity-90">
                      Seasonal AutoRegressive Integrated Moving Average for capturing temporal patterns and trends
                    </p>
                  </div>
                  <div className="text-center">
                    <h3 className="font-bold text-lg mb-2">Holt-Winters</h3>
                    <p className="text-sm opacity-90">
                      Exponential smoothing technique for handling seasonality and trend components
                    </p>
                  </div>
                  <div className="text-center">
                    <h3 className="font-bold text-lg mb-2">LSTM Networks</h3>
                    <p className="text-sm opacity-90">
                      Deep learning neural networks for complex non-linear pattern recognition
                    </p>
                  </div>
                </div>
                <p className="text-center text-sm opacity-90 pt-4">
                  By combining these models with weighted averaging based on validation performance, we achieve superior
                  accuracy compared to any single approach.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </main>
      <Footer />
    </div>
  )
}
