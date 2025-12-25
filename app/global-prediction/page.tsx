"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Loader2, TrendingUp } from "lucide-react"

export default function GlobalPrediction() {
  const [year, setYear] = useState("")
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any>(null)

  const handlePredict = async () => {
    if (!year || Number.parseInt(year) <= 2019) {
      alert("Please enter a year greater than 2019")
      return
    }

    setLoading(true)
    try {
      console.log("[v0] Making prediction request for year:", year)

      const response = await fetch("/api/global-prediction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetYear: Number.parseInt(year) }),
      })

      console.log("[v0] Response status:", response.status)

      if (!response.ok) {
        const errorData = await response.json()
        console.error("[v0] API error:", errorData)
        throw new Error(errorData.error || "Failed to generate prediction")
      }

      const data = await response.json()
      console.log("[v0] Prediction data received:", data)
      setResults(data)
    } catch (error) {
      console.error("[v0] Prediction error:", error)
      alert(`Prediction error: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <Header />
      <main className="container mx-auto px-6 pt-32 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Global CO₂ Emissions Prediction</h1>
            <p className="text-lg text-muted-foreground text-balance">
              Forecast worldwide carbon dioxide emissions using advanced machine learning models. Our system combines
              SARIMA, Holt-Winters, and LSTM neural networks to provide accurate predictions and actionable climate
              insights.
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Enter Prediction Year</CardTitle>
              <CardDescription>Select a future year to forecast global CO₂ emissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Input
                  type="number"
                  placeholder="e.g., 2050"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  min="2020"
                  max="2125"
                  className="flex-1"
                />
                {/* </CHANGE> */}
                <Button onClick={handlePredict} disabled={loading} className="bg-primary hover:bg-primary/90">
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Predicting...
                    </>
                  ) : (
                    <>
                      <TrendingUp className="mr-2 h-4 w-4" />
                      Predict
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {results && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Prediction Results for {results.targetYear}</CardTitle>
                  <CardDescription>Multi-model forecast analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <div className="p-4 bg-secondary/50 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">SARIMA Model</p>
                      <p className="text-2xl font-bold text-primary">
                        {results.predictions.SARIMA.toLocaleString()} kt CO₂
                      </p>
                    </div>
                    <div className="p-4 bg-secondary/50 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Holt-Winters Model</p>
                      <p className="text-2xl font-bold text-primary">
                        {results.predictions.HoltWinters.toLocaleString()} kt CO₂
                      </p>
                    </div>
                    <div className="p-4 bg-secondary/50 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">LSTM Neural Network</p>
                      <p className="text-2xl font-bold text-primary">
                        {results.predictions.LSTM.toLocaleString()} kt CO₂
                      </p>
                    </div>
                    <div className="p-4 bg-primary/10 rounded-lg border-2 border-primary">
                      <p className="text-sm text-muted-foreground mb-1">Weighted Average (Final Prediction)</p>
                      <p className="text-2xl font-bold text-primary">
                        {results.predictions.WeightedAverage.toLocaleString()} kt CO₂
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Climate Impact Summary</CardTitle>
                  <CardDescription>Understanding the implications</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none">
                    <p className="whitespace-pre-line text-foreground leading-relaxed">{results.summary}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Model Performance Comparison</CardTitle>
                  <CardDescription>Forecast trends from different algorithms</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={results.chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="SARIMA" stroke="hsl(var(--chart-1))" strokeWidth={2} />
                      <Line type="monotone" dataKey="HoltWinters" stroke="hsl(var(--chart-2))" strokeWidth={2} />
                      <Line type="monotone" dataKey="LSTM" stroke="hsl(var(--chart-3))" strokeWidth={2} />
                      <Line
                        type="monotone"
                        dataKey="WeightedAverage"
                        stroke="hsl(var(--primary))"
                        strokeWidth={3}
                        strokeDasharray="5 5"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </motion.div>
      </main>
      <Footer />
    </div>
  )
}
