"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Loader2, MapPin } from "lucide-react"

export default function CountryPrediction() {
  const [countries, setCountries] = useState<string[]>([])
  const [selectedCountry, setSelectedCountry] = useState("")
  const [year, setYear] = useState("")
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Fetch available countries
    fetch("/api/countries")
      .then((res) => res.json())
      .then((data) => setCountries(data.countries))
      .catch((error) => console.error("Failed to fetch countries:", error))
  }, [])

  const handlePredict = async () => {
    if (!selectedCountry || !year || Number.parseInt(year) <= 2019 || Number.parseInt(year) > 2150) {
      alert("Please select a country and enter a year between 2020 and 2150")
      return
    }
    // </CHANGE>

    setLoading(true)
    setError(null)

    try {
      console.log("[v0] Sending country prediction request:", {
        country: selectedCountry,
        targetYear: Number.parseInt(year),
      })

      const response = await fetch("/api/country-prediction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country: selectedCountry, targetYear: Number.parseInt(year) }),
      })

      console.log("[v0] Response status:", response.status)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log("[v0] Received data:", data)

      if (data.error) {
        throw new Error(data.error)
      }

      setResults(data)
    } catch (error) {
      console.error("[v0] Prediction error:", error)
      setError(error instanceof Error ? error.message : "Failed to generate prediction")
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
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Country-wise CO₂ Emissions Prediction</h1>
            <p className="text-lg text-muted-foreground text-balance">
              Get detailed emission forecasts for specific countries using polynomial regression and Holt-Winters
              exponential smoothing. Understand regional trends and their impact on global climate goals.
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Select Country and Year</CardTitle>
              <CardDescription>Choose a country and target year for emission predictions (up to 2150)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Country</label>
                  <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country} value={country}>
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Target Year</label>
                  <div className="flex gap-4">
                    <Input
                      type="number"
                      placeholder="e.g., 2050"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      min="2020"
                      max="2150"
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
                          <MapPin className="mr-2 h-4 w-4" />
                          Predict
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {error && (
            <Card className="mb-8 border-destructive">
              <CardContent className="pt-6">
                <p className="text-destructive">{error}</p>
              </CardContent>
            </Card>
          )}

          {results && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle>
                    Prediction Results for {results.country} in {results.targetYear}
                  </CardTitle>
                  <CardDescription>Country-specific emission forecast</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4 mb-6">
                    <div className="p-4 bg-secondary/50 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Polynomial Regression</p>
                      <p className="text-2xl font-bold text-primary">
                        {results.predictions.Polynomial.toLocaleString()} kt CO₂
                      </p>
                    </div>
                    <div className="p-4 bg-secondary/50 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Holt-Winters</p>
                      <p className="text-2xl font-bold text-primary">
                        {results.predictions.HoltWinters.toLocaleString()} kt CO₂
                      </p>
                    </div>
                    <div className="p-4 bg-primary/10 rounded-lg border-2 border-primary">
                      <p className="text-sm text-muted-foreground mb-1">Weighted Average</p>
                      <p className="text-2xl font-bold text-primary">
                        {results.predictions.WeightedAverage.toLocaleString()} kt CO₂
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Regional Impact Analysis</CardTitle>
                  <CardDescription>What this means for {results.country}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none">
                    <p className="whitespace-pre-line text-foreground leading-relaxed">{results.summary}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Historical Data & Forecast</CardTitle>
                  <CardDescription>Emission trends and model predictions</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={results.chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="actual" stroke="hsl(var(--foreground))" strokeWidth={2} />
                      <Line type="monotone" dataKey="Polynomial" stroke="hsl(var(--chart-1))" strokeWidth={2} />
                      <Line type="monotone" dataKey="HoltWinters" stroke="hsl(var(--chart-2))" strokeWidth={2} />
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
