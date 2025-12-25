# Airy – CO₂ Emissions Forecasting Engine

Airy is a climate‑analytics project that forecasts **global** and **country‑level** CO₂ emissions using a hybrid ensemble of statistical and deep‑learning time‑series models. It aims to make long‑horizon climate forecasting understandable and accessible for researchers, students, and policymakers.

---

## 🔍 Problem Statement

Carbon dioxide emissions are the primary driver of long‑term global warming, yet most public datasets stop at historical values and do not provide flexible, country‑wise forecasting tools.  
This project builds a reusable forecasting pipeline that can:

- Predict global CO₂ emissions for any future year in a user‑defined range (e.g., 2020–2125).  
- Predict annual CO₂ emissions for any selected country using the same core pipeline.  
- Provide smooth, scientifically realistic long‑term trajectories instead of noisy or unstable curves.  

---

## 📊 Data and Pre‑processing

- **Dataset**: Annual CO₂ emissions by country (1990–2019), measured in kilotons.  
- **Key columns**: `Date`, `Country`, `Kilotons of CO2`.  
- **Pre‑processing steps**:
  - Standardize column names and convert `Date` → `Year`.  
  - Convert emission values to numeric and handle missing data with interpolation and forward/backward fill.  
  - Aggregate:
    - Global series: sum of all countries per year.  
    - Country series: filtered and grouped by year.  
  - Fuzzy matching for country names to tolerate typos and naming variants (e.g., “usa”, “United States”).  

---

## 🧠 Models and Methodology

The forecasting engine combines multiple complementary time‑series models.

### Global‑level models

- **SARIMA (Auto‑ARIMA)**  
  - Captures autoregressive structure and long‑term trend in non‑stationary annual data.  

- **Holt‑Winters (Exponential Smoothing – additive trend)**  
  - Smooths the level and trend; closely follows long‑run behaviour of global emissions.  

- **LSTM Networks**  
  - Sequence model trained on scaled annual emissions; learns nonlinear temporal dependencies and produces conservative, smooth forecasts.  

> Polynomial regression is **not** used for the global series to avoid unrealistic curvature and over‑extrapolation in very long horizons.

### Country‑level models

For each country, the system trains:

- SARIMA  
- Holt‑Winters  
- LSTM  
- **Polynomial regression (degree 2)** – used here because many countries exhibit clearer curvature in their emission trajectories, and a low‑order polynomial can fit this structure without exploding when used carefully.  

### Stationarity and diagnostics

- Augmented Dickey‑Fuller (ADF) and KPSS tests confirm that both global and country series are trend‑dominated and non‑stationary.  
- ACF/PACF plots are generated to inspect autocorrelation structure and support model selection.  

### Ensemble strategy

To improve robustness, the final forecast is a **weighted ensemble**:

- Each model is evaluated using RMSE on a held‑out test window.  
- Inverse‑RMSE weights are computed so that lower‑error models contribute more.  
- The final prediction is the weighted average of all available model forecasts (3 models for global, 4 for country).  

This produces stable, policy‑relevant forecasts that align qualitatively with trajectories reported by major climate and energy agencies.  

---

## 📈 Outputs and Visualizations

The pipeline generates both **graphs** and **textual explanations**.

### Plots

For global and for each country:

- Historical series with 3‑year moving average.  
- Year‑over‑year percentage change.  
- Normalized and cumulative emissions plots.  
- Backtesting plots comparing each model’s reconstruction against actual data.  
- Forecast plots up to the user‑selected target year, with all model curves and the ensemble point highlighted.  

### Natural‑language summaries

A rule‑based explanation layer converts numeric results into structured text:

- Classifies percentage change vs baseline into categories like “moderate increase”, “substantial increase”, or “sharp increase” using scientifically motivated thresholds.  
- Describes likely climate impacts (e.g., risks of extreme weather, sea‑level rise) and suggests practical mitigation actions at global, national, and individual levels.  
- Includes an optional variant with multiple phrasings per impact level to avoid repetitive wording while preserving factual consistency.  

These summaries are designed to be deterministic, auditable, and suitable for academic evaluation.  

---

## 🏗️ System Architecture

High‑level flow of the system:

1. **User input**: select country (with fuzzy matching) and target year.  
2. **Data module**: load CSV, clean, interpolate, and build global/country time series.  
3. **Diagnostics**: stationarity tests and ACF/PACF plots.  
4. **Model training**:
   - Global: SARIMA, Holt‑Winters, LSTM.  
   - Country: SARIMA, Holt‑Winters, LSTM, Polynomial.  
5. **Backtesting**: reconstruct historical period and compute errors.  
6. **Ensemble**: compute inverse‑RMSE weights and final blended forecast.  
7. **Visualization & summary**: generate graphs and textual explanation block.  

---

## 🚀 How to Run

### Prerequisites

- Python 3.x  
- Recommended environment: Google Colab or a local virtualenv.  
- Key libraries: `numpy`, `pandas`, `statsmodels`, `pmdarima`, `tensorflow`, `scikit-learn`, `matplotlib`.  

### Setup

