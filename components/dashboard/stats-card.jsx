/**
 * @fileoverview Dashboard statistics card component
 * @type-check
 */

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card.tsx"

/**
 * Statistics card component
 * @param {Object} props - Component props
 * @param {string} props.title - Card title
 * @param {string|number} props.value - Main value to display
 * @param {string} [props.change] - Change percentage
 * @param {string} [props.icon] - Icon emoji
 * @param {string} [props.trend] - Trend direction ('up' | 'down' | 'neutral')
 * @returns {JSX.Element} Stats card component
 */
export function StatsCard({ title, value, change, icon, trend = "neutral" }) {
  const trendColors = {
    up: "text-green-600 dark:text-green-400",
    down: "text-red-600 dark:text-red-400",
    neutral: "text-muted-foreground",
  }

  return (
    <Card className="border-border">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {icon && <span className="text-lg">{icon}</span>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        {change && (
          <p className={`text-xs ${trendColors[trend]} mt-1`}>
            {trend === "up" && "↗️ "}
            {trend === "down" && "↘️ "}
            {change}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
