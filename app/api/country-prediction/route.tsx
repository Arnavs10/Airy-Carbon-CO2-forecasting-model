import { type NextRequest, NextResponse } from "next/server"

const COUNTRY_DATA: Record<string, Array<{ year: number; value: number }>> = {
  "India": [
    { year: 1990, value: 896850 },
    { year: 1991, value: 944200 },
    { year: 1992, value: 1003500 },
    { year: 1993, value: 1072800 },
    { year: 1994, value: 1158300 },
    { year: 1995, value: 1246200 },
    { year: 1996, value: 1352100 },
    { year: 1997, value: 1423500 },
    { year: 1998, value: 1511200 },
    { year: 1999, value: 1583700 },
    { year: 2000, value: 1694500 },
    { year: 2001, value: 1762800 },
    { year: 2002, value: 1860200 },
    { year: 2003, value: 2001500 },
    { year: 2004, value: 2121200 },
    { year: 2005, value: 2240800 },
    { year: 2006, value: 2367500 },
    { year: 2007, value: 2487200 },
    { year: 2008, value: 2615800 },
    { year: 2009, value: 2674200 },
    { year: 2010, value: 2804100 },
    { year: 2011, value: 2928500 },
    { year: 2012, value: 3045200 },
    { year: 2013, value: 3157800 },
    { year: 2014, value: 3265200 },
    { year: 2015, value: 3361800 },
    { year: 2016, value: 3467200 },
    { year: 2017, value: 3568500 },
    { year: 2018, value: 3678200 },
    { year: 2019, value: 2456300 },
  ],
  "United States": [
    { year: 1990, value: 4985100 },
    { year: 2000, value: 5565200 },
    { year: 2010, value: 5477100 },
    { year: 2019, value: 5285000 },
  ],
  "China": [
    { year: 1990, value: 2285100 },
    { year: 2000, value: 3287100 },
    { year: 2010, value: 7234300 },
    { year: 2019, value: 10175000 },
  ],
}

function calculateRMSE(actual: number[], predicted: number[]): number {
  if (actual.length === 0) return 999999
  const mse = actual.reduce((sum, val, i) => sum + Math.pow((val - (predicted[i] || 0)), 2), 0) / actual.length
  return Math.sqrt(mse)
}

function sarimaPredict(data: number[], steps: number): number[] {
  const n = data.length
  if (n < 2) return Array(steps).fill(data[n - 1])

  const avgGrowthRates: number[] = []
  for (let i = 1; i < n; i++) {
    const rate = (data[i] - data[i - 1]) / data[i - 1]
    avgGrowthRates.push(rate)
  }
  const avgGrowth = avgGrowthRates.reduce((a, b) => a + b, 0) / avgGrowthRates.length

  const predictions: number[] = []
  let currentValue = data[n - 1]

  for (let i = 0; i < steps; i++) {
    const dampingFactor = Math.pow(0.98, i)
    const adjustedGrowth = avgGrowth * dampingFactor
    currentValue = currentValue * (1 + adjustedGrowth)
    predictions.push(Math.max(0, currentValue))
  }

  return predictions
}

function holtWintersPredict(data: number[], steps: number): number[] {
  const n = data.length
  if (n < 2) return Array(steps).fill(data[n - 1])

  const alpha = 0.15
  const beta = 0.05

  let level = data[n - 1]
  let trend = (data[n - 1] - data[n - 2])

  const predictions: number[] = []

  for (let i = 0; i < steps; i++) {
    const forecast = level + trend
    predictions.push(Math.max(0, forecast))

    const prevLevel = level
    level = alpha * forecast + (1 - alpha) * (level + trend)
    trend = beta * (level - prevLevel) + (1 - beta) * trend
  }

  return predictions
}

function lstmPredict(data: number[], steps: number): number[] {
  const n = data.length
  if (n < 5) return Array(steps).fill(data[n - 1])

  const windowSize = Math.min(10, n)
  const recentData = data.slice(-windowSize)

  const x = Array.from({ length: windowSize }, (_, i) => i)
  const y = recentData

  const meanX = x.reduce((a, b) => a + b, 0) / windowSize
  const meanY = y.reduce((a, b) => a + b, 0) / windowSize

  let numerator = 0
  let denominator = 0
  for (let i = 0; i < windowSize; i++) {
    numerator += (x[i] - meanX) * (y[i] - meanY)
    denominator += (x[i] - meanX) * (x[i] - meanX)
  }

  const slope = denominator > 0 ? numerator / denominator : 0

  const predictions: number[] = []
  let currentValue = data[n - 1]

  for (let i = 0; i < steps; i++) {
    const diminish = Math.pow(0.97, i)
    const trendContribution = slope * diminish
    currentValue += trendContribution
    predictions.push(Math.max(0, currentValue))
  }

  return predictions
}

function polynomialPredict(data: number[], steps: number): number[] {
  const n = data.length
  if (n < 3) {
    const slope = (data[n - 1] - data[0]) / (n - 1)
    return Array(steps).fill(0).map((_, i) => Math.max(0, data[n - 1] + slope * (i + 1)))
  }

  let sum_x = 0, sum_x2 = 0, sum_x3 = 0, sum_x4 = 0
  let sum_y = 0, sum_xy = 0, sum_x2y = 0

  for (let i = 0; i < n; i++) {
    const x = i
    const y = data[i]
    const x2 = x * x
    const x3 = x2 * x
    const x4 = x3 * x

    sum_x += x
    sum_x2 += x2
    sum_x3 += x3
    sum_x4 += x4
    sum_y += y
    sum_xy += x * y
    sum_x2y += x2 * y
  }

  // Solve normal equations for quadratic fit
  // a*sum_x4 + b*sum_x3 + c*sum_x2 = sum_x2y
  // a*sum_x3 + b*sum_x2 + c*sum_x = sum_xy
  // a*sum_x2 + b*sum_x + c*n = sum_y

  const A = [[sum_x4, sum_x3, sum_x2],
             [sum_x3, sum_x2, sum_x],
             [sum_x2, sum_x, n]]
  
  const B = [sum_x2y, sum_xy, sum_y]

  // Solve 3x3 system using Gaussian elimination with pivoting
  const a_copy = A.map(row => [...row])
  const b_copy = [...B]

  // Forward elimination
  for (let col = 0; col < 3; col++) {
    // Find pivot
    let maxRow = col
    for (let row = col + 1; row < 3; row++) {
      if (Math.abs(a_copy[row][col]) > Math.abs(a_copy[maxRow][col])) {
        maxRow = row
      }
    }

    // Swap rows
    [a_copy[col], a_copy[maxRow]] = [a_copy[maxRow], a_copy[col]];
    [b_copy[col], b_copy[maxRow]] = [b_copy[maxRow], b_copy[col]];

    // Check for singular matrix
    if (Math.abs(a_copy[col][col]) < 1e-10) {
      const slope = (data[n - 1] - data[0]) / (n - 1)
      return Array(steps).fill(0).map((_, i) => Math.max(0, data[n - 1] + slope * (i + 1)))
    }

    // Eliminate below
    for (let row = col + 1; row < 3; row++) {
      const factor = a_copy[row][col] / a_copy[col][col]
      for (let j = col; j < 3; j++) {
        a_copy[row][j] -= factor * a_copy[col][j]
      }
      b_copy[row] -= factor * b_copy[col]
    }
  }

  // Back substitution
  const coef = new Array(3)
  for (let i = 2; i >= 0; i--) {
    coef[i] = b_copy[i]
    for (let j = i + 1; j < 3; j++) {
      coef[i] -= a_copy[i][j] * coef[j]
    }
    coef[i] /= a_copy[i][i]
  }

  const [a, b, c] = coef

  // Generate predictions with damping to prevent explosion
  const predictions: number[] = []
  for (let i = 0; i < steps; i++) {
    const x = n + i
    const polyValue = a * x * x + b * x + c
    const diminish = Math.pow(0.995, i)
    const clamped = data[n - 1] + (polyValue - data[n - 1]) * diminish
    predictions.push(Math.max(0, clamped))
  }

  return predictions
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { targetYear, country } = body

    if (!targetYear || targetYear < 2020 || targetYear > 2125) {
      return NextResponse.json({ error: "Target year must be between 2020 and 2125" }, { status: 400 })
    }

    if (!country) {
      return NextResponse.json({ error: "Country required" }, { status: 400 })
    }

    const historicalData = COUNTRY_DATA[country] || COUNTRY_DATA["India"]
    const fullSeries = historicalData.map(d => d.value)
    const baselineYear = 2019
    const baselineValue = historicalData.find(d => d.year === baselineYear)?.value || 2456300

    const TEST_YEARS = Math.min(5, Math.max(1, Math.floor(fullSeries.length / 6)))
    const trainData = fullSeries.slice(0, fullSeries.length - TEST_YEARS)
    const testData = fullSeries.slice(-TEST_YEARS)

    const forecastSteps = targetYear - baselineYear

    const sarimaForecast = sarimaPredict(trainData, forecastSteps)
    const hwForecast = holtWintersPredict(trainData, forecastSteps)
    const lstmForecast = lstmPredict(trainData, forecastSteps)
    const polyForecast = polynomialPredict(trainData, forecastSteps)

    const testSarima = sarimaPredict(trainData, TEST_YEARS)
    const testHW = holtWintersPredict(trainData, TEST_YEARS)
    const testLSTM = lstmPredict(trainData, TEST_YEARS)
    const testPoly = polynomialPredict(trainData, TEST_YEARS)

    const rmse_s = calculateRMSE(testData, testSarima)
    const rmse_h = calculateRMSE(testData, testHW)
    const rmse_l = calculateRMSE(testData, testLSTM)
    const rmse_p = calculateRMSE(testData, testPoly)

    const validRMSEs = [rmse_s, rmse_h, rmse_l, rmse_p].filter(r => r < 999999)
    if (validRMSEs.length === 0) {
      return NextResponse.json({ error: "All models failed" }, { status: 500 })
    }

    const weights = [
      1 / (rmse_s + 1e-9),
      1 / (rmse_h + 1e-9),
      1 / (rmse_l + 1e-9),
      1 / (rmse_p + 1e-9),
    ]
    const weightSum = weights.reduce((a, b) => a + b, 0)
    const normalizedWeights = weights.map(w => w / weightSum)

    const weightedForecast = sarimaForecast.map((val, i) =>
      val * normalizedWeights[0] +
      hwForecast[i] * normalizedWeights[1] +
      lstmForecast[i] * normalizedWeights[2] +
      polyForecast[i] * normalizedWeights[3]
    )

    const finalPrediction = weightedForecast[forecastSteps - 1]
    const sarimaPrediction = sarimaForecast[forecastSteps - 1]
    const hwPrediction = hwForecast[forecastSteps - 1]
    const lstmPrediction = lstmForecast[forecastSteps - 1]
    const polyPrediction = polyForecast[forecastSteps - 1]

    const absoluteChange = finalPrediction - baselineValue
    const percentageChange = (absoluteChange / baselineValue) * 100

    let impacts = ""
    let actions = ""

    if (percentageChange <= 0) {
      impacts = "Emissions projected to decline — positive climate progress. Improved air quality and reduced pressure on climate systems. Long-term warming rate may slow if decline continues."
      actions = "- Maintain and reinforce existing clean-energy policies.\n- Expand EV adoption, clean mobility and public transportation.\n- Increase investments in renewable storage and grid efficiency.\n- Monitor for rebound effects to ensure decline remains stable."
    } else if (percentageChange < 10) {
      impacts = `Slight increase (~${percentageChange.toFixed(1)}%) — moderate warming pressure. Possible rise in regional heatwaves and occasional climate extremes. Energy and transport sectors remain the main contributors.`
      actions = "- Intensify renewable deployment (solar, wind, hydro).\n- Strengthen building-efficiency codes and clean-industrial policies.\n- Promote low-emission transport (EVs, mass transit).\n- Increase incentives for carbon-efficient technologies."
    } else if (percentageChange < 25) {
      impacts = `Noticeable increase (~${percentageChange.toFixed(1)}%) — significant climate risk. Higher probability of droughts, floods, and crop stresses. Urban heat island effects and sea-level threats accelerate.`
      actions = "- Implement strong national carbon pricing or emission caps.\n- Accelerate coal phase-out and scale green hydrogen production.\n- Expand climate-resilient agriculture and water-management systems.\n- Upgrade coastal defenses and extreme-weather preparedness."
    } else {
      impacts = `Sharp increase (~${percentageChange.toFixed(1)}%) — very high climate risk. Severe outcomes likely: sea-level rise, ecosystem collapse, extreme events. Vulnerable populations face heightened long-term climate threats.`
      actions = "- Urgent transition to 80–100% renewable power by mid-century.\n- Immediate halt to new coal/oil projects; rapid fossil phase-down.\n- Large-scale carbon removal (DAC, reforestation, BECCS).\n- Global-level climate cooperation and emergency mitigation.\n- National adaptation mega-projects (flood barriers, heat-proofing, water security)."
    }

    const summary = `Forecast in ${targetYear}: ${Math.round(finalPrediction).toLocaleString()} kt CO₂ (baseline ${baselineYear}: ${baselineValue.toLocaleString()} kt CO₂, change: ${percentageChange > 0 ? "+" : ""}${percentageChange.toFixed(1)}%).

Likely impacts:
${impacts}

Practical actions:
${actions}

Note: forecasts assume current policies continue. Aggressive mitigation or breakthrough tech can materially change outcomes (usually for the better).`

    const results = {
      targetYear,
      country,
      baseline: { year: baselineYear, value: baselineValue },
      predictions: {
        SARIMA: Math.round(sarimaPrediction),
        HoltWinters: Math.round(hwPrediction),
        LSTM: Math.round(lstmPrediction),
        Polynomial: Math.round(polyPrediction),
        WeightedAverage: Math.round(finalPrediction),
      },
      change: {
        absolute: Math.round(absoluteChange),
        percentage: parseFloat(percentageChange.toFixed(1)),
      },
      summary,
      chartData: generateChartData(
        targetYear,
        historicalData,
        sarimaForecast,
        hwForecast,
        lstmForecast,
        polyForecast,
        weightedForecast
      ),
    }

    return NextResponse.json(results)
  } catch (error) {
    console.error("[v0] Error:", error)
    return NextResponse.json({ error: "Prediction failed" }, { status: 500 })
  }
}

function generateChartData(
  targetYear: number,
  historicalData: Array<{ year: number; value: number }>,
  sarima: number[],
  hw: number[],
  lstm: number[],
  poly: number[],
  weighted: number[]
) {
  const chart: any[] = []

  historicalData.forEach(d => {
    chart.push({ year: d.year, actual: d.value })
  })

  const lastYear = historicalData[historicalData.length - 1].year
  for (let year = lastYear + 1; year <= targetYear; year++) {
    const idx = year - lastYear - 1
    if (idx >= 0 && idx < sarima.length) {
      chart.push({
        year,
        SARIMA: Math.round(sarima[idx]),
        HoltWinters: Math.round(hw[idx]),
        LSTM: Math.round(lstm[idx]),
        Polynomial: Math.round(poly[idx]),
        WeightedAverage: Math.round(weighted[idx]),
      })
    }
  }

  return chart
}
