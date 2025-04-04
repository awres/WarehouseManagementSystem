"use client"

import { useEffect, useState } from "react"

import { getSalesData } from "@/lib/api"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "@/components/ui/chart"

interface SalesOverTimeChartProps {
  timeframe: string
}

export function SalesOverTimeChart({ timeframe }: SalesOverTimeChartProps) {
  const [data, setData] = useState<{ date: string; sales: number }[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const salesData = await getSalesData(timeframe)
        setData(salesData)
        setError(null)
      } catch (err) {
        console.error("Error fetching sales data:", err)
        setError("Failed to load sales data. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [timeframe])

  if (loading) {
    return <div className="flex items-center justify-center h-[300px]">Loading sales data...</div>
  }

  if (error) {
    return <div className="flex items-center justify-center h-[300px] text-red-500">{error}</div>
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px]">No sales data available for the selected period.</div>
    )
  }

  // Add fallback data if the API returns empty data
  if (data.every((item) => item.sales === 0)) {
    // Generate some sample data for visualization
    const sampleData = data.map((item, index) => ({
      date: item.date,
      sales: 500 + Math.random() * 1000 * (1 + index / data.length),
    }))

    return (
      <div className="h-[300px] w-full">
        <div className="text-amber-500 text-xs mb-2 text-center">
          No real sales data available. Showing sample data for visualization.
        </div>
        <ResponsiveContainer width="100%" height="90%">
          <AreaChart
            data={sampleData}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={(date) => {
                const d = new Date(date)
                return d.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
              tick={{ fontSize: 12 }}
            />
            <YAxis tickFormatter={(value) => `$${value}`} tick={{ fontSize: 12 }} />
            <Tooltip
              formatter={(value) => [`$${value}`, "Sales (Sample)"]}
              labelFormatter={(label) => {
                const date = new Date(label)
                return date.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              }}
            />
            <Area type="monotone" dataKey="sales" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.3} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    )
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickFormatter={(date) => {
              const d = new Date(date)
              return d.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })
            }}
            tick={{ fontSize: 12 }}
          />
          <YAxis tickFormatter={(value) => `$${value}`} tick={{ fontSize: 12 }} />
          <Tooltip
            formatter={(value) => [`$${value}`, "Sales"]}
            labelFormatter={(label) => {
              const date = new Date(label)
              return date.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            }}
          />
          <Area type="monotone" dataKey="sales" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

