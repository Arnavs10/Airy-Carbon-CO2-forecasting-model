import { NextResponse } from "next/server"

// List of countries available in the dataset
const countries = [
  "India",
  "China",
  "United States",
  "Russia",
  "Japan",
  "Germany",
  "United Kingdom",
  "France",
  "Brazil",
  "Canada",
  "Australia",
  "South Korea",
  "Mexico",
  "Indonesia",
  "Saudi Arabia",
  "South Africa",
  "Turkey",
  "Italy",
  "Spain",
  "Poland",
  "Thailand",
  "Iran",
  "Egypt",
  "Pakistan",
  "Argentina",
].sort()

export async function GET() {
  return NextResponse.json({ countries })
}
