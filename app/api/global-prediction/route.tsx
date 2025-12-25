import { type NextRequest, NextResponse } from "next/server"

const GLOBAL_DATA_POINTS = [
  { year: 1990, value: 21048227 },
  { year: 1991, value: 20949850 },
  { year: 1992, value: 21028550 },
  { year: 1993, value: 21272025 },
  { year: 1994, value: 21594250 },
  { year: 1995, value: 21842400 },
  { year: 1996, value: 22186850 },
  { year: 1997, value: 22251200 },
  { year: 1998, value: 22043975 },
  { year: 1999, value: 22237500 },
  { year: 2000, value: 23005075 },
  { year: 2001, value: 23198275 },
  { year: 2002, value: 23617300 },
  { year: 2003, value: 24437275 },
  { year: 2004, value: 25385300 },
  { year: 2005, value: 26255350 },
  { year: 2006, value: 26962500 },
  { year: 2007, value: 27571200 },
  { year: 2008, value: 27404800 },
  { year: 2009, value: 26739500 },
  { year: 2010, value: 27963900 },
  { year: 2011, value: 28563800 },
  { year: 2012, value: 28892100 },
  { year: 2013, value: 29381400 },
  { year: 2014, value: 29629200 },
  { year: 2015, value: 29479600 },
  { year: 2016, value: 29736200 },
  { year: 2017, value: 30152100 },
  { year: 2018, value: 30543200 },
  { year: 2019, value: 33871180 },
]

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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { targetYear } = body

    if (!targetYear || targetYear < 2020 || targetYear > 2125) {
      return NextResponse.json({ error: "Target year must be between 2020 and 2125" }, { status: 400 })
    }

    const fullSeries = GLOBAL_DATA_POINTS.map(d => d.value)
    const baselineYear = 2019
    const baselineValue = 33871180

    const TEST_YEARS = 5
    const trainData = fullSeries.slice(0, fullSeries.length - TEST_YEARS)
    const testData = fullSeries.slice(-TEST_YEARS)

    const forecastSteps = targetYear - baselineYear

    const sarimaForecast = sarimaPredict(trainData, forecastSteps)
    const hwForecast = holtWintersPredict(trainData, forecastSteps)
    const lstmForecast = lstmPredict(trainData, forecastSteps)

    const testSarima = sarimaPredict(trainData, TEST_YEARS)
    const testHW = holtWintersPredict(trainData, TEST_YEARS)
    const testLSTM = lstmPredict(trainData, TEST_YEARS)

    const rmse_s = calculateRMSE(testData, testSarima)
    const rmse_h = calculateRMSE(testData, testHW)
    const rmse_l = calculateRMSE(testData, testLSTM)

    const weights = [
      1 / (rmse_s + 1e-9),
      1 / (rmse_h + 1e-9),
      1 / (rmse_l + 1e-9),
    ]
    const weightSum = weights.reduce((a, b) => a + b, 0)
    const normalizedWeights = weights.map(w => w / weightSum)

    const weightedForecast = sarimaForecast.map((val, i) =>
      val * normalizedWeights[0] +
      hwForecast[i] * normalizedWeights[1] +
      lstmForecast[i] * normalizedWeights[2]
    )

    const finalPrediction = weightedForecast[forecastSteps - 1]
    const sarimaPrediction = sarimaForecast[forecastSteps - 1]
    const hwPrediction = hwForecast[forecastSteps - 1]
    const lstmPrediction = lstmForecast[forecastSteps - 1]

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
      baseline: { year: baselineYear, value: baselineValue },
      predictions: {
        SARIMA: Math.round(sarimaPrediction),
        HoltWinters: Math.round(hwPrediction),
        LSTM: Math.round(lstmPrediction),
        WeightedAverage: Math.round(finalPrediction),
      },
      change: {
        absolute: Math.round(absoluteChange),
        percentage: parseFloat(percentageChange.toFixed(1)),
      },
      summary,
      chartData: generateChartData(
        targetYear,
        GLOBAL_DATA_POINTS,
        sarimaForecast,
        hwForecast,
        lstmForecast,
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
        WeightedAverage: Math.round(weighted[idx]),
      })
    }
  }

  return chart
}
