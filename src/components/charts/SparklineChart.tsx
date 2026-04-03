import {
  Line,
  LineChart,
  ResponsiveContainer,
  YAxis,
} from 'recharts'

interface SparklineChartProps {
  data: number[]
  color: string
}

export function SparklineChart({ data, color }: SparklineChartProps) {
  const chartData = data.map((v, i) => ({ i, v }))
  return (
    <div className="h-[40px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
          <YAxis hide domain={['dataMin', 'dataMax']} />
          <Line
            type="monotone"
            dataKey="v"
            stroke={color}
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
