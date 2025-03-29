import type React from "react"
import { Chart as ChartJS, registerables } from "chart.js"
import { Line, Bar } from "react-chartjs-2"
import { forwardRef } from "react"

ChartJS.register(...registerables)

type ChartProps = {
  type: "line" | "bar"
  data: any
  options: any
  className?: string
}

export const Chart = forwardRef<ChartJS, ChartProps>(({ type, data, options, className }, ref) => {
  if (type === "line") {
    return <Line ref={ref} data={data} options={options} className={className} />
  }
  if (type === "bar") {
    return <Bar ref={ref} data={data} options={options} className={className} />
  }
  return null
})

Chart.displayName = "Chart"

export const ChartContainer = ({ children }: { children: React.ReactNode }) => {
  return <div>{children}</div>
}

export const ChartTooltip = ({ children }: { children: React.ReactNode }) => {
  return <div>{children}</div>
}

export const ChartTooltipContent = ({ children }: { children: React.ReactNode }) => {
  return <div>{children}</div>
}

export const ChartLegend = ({ children }: { children: React.ReactNode }) => {
  return <div>{children}</div>
}

export const ChartLegendContent = ({ children }: { children: React.ReactNode }) => {
  return <div>{children}</div>
}

export const ChartStyle = () => {
  return null
}

