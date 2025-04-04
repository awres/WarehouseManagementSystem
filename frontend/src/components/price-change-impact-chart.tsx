"use client"

import { useEffect, useState } from "react"

import { getPriceChangeImpactData } from "@/lib/api"
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "@/components/ui/chart"

export function PriceChangeImpactChart() {
  const [data, setData] = useState<
    {
      name: string
      beforePrice: number
      afterPrice: number
      beforeSales: number
      afterSales: number
    }[]
  >([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const impactData = await getPriceChangeImpactData()
        setData(impactData)
        setError(null)
      } catch (err) {
        console.error("Error fetching price impact data:", err)
        setError("Failed to load price impact data. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return <div className="flex items-center justify-center h-[300px]">Loading price impact data...</div>
  }

  if (error) {
    return <div className="flex items-center justify-center h-[300px] text-red-500">{error}</div>
  }

  if (data.length === 0) {
    return <div className="flex items-center justify-center h-[300px]">No price impact data available.</div>
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 60,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} tick={{ fontSize: 12 }} />
          <YAxis
            yAxisId="left"
            orientation="left"
            stroke="#8884d8"
            label={{ value: "Sales (units)", angle: -90, position: "insideLeft" }}
            tick={{ fontSize: 12 }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            stroke="#82ca9d"
            label={{ value: "Price ($)", angle: 90, position: "insideRight" }}
            tick={{ fontSize: 12 }}
          />
          <Tooltip />
          <Legend />
          <Bar yAxisId="left" dataKey="beforeSales" name="Sales Before" fill="#8884d8" />
          <Bar yAxisId="left" dataKey="afterSales" name="Sales After" fill="#82ca9d" />
          <Bar yAxisId="right" dataKey="beforePrice" name="Price Before" fill="#ff8042" />
          <Bar yAxisId="right" dataKey="afterPrice" name="Price After" fill="#ffc658" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

