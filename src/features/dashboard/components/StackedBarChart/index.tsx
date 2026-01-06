import ReactECharts from 'echarts-for-react'
import { useEffect, useMemo, useRef, useState } from 'react'

import {
  clrBlack,
  clrWhite,
  clrYellow,
  echartsOptions,
  echartsTheme,
} from 'styles/theme'

import * as echarts from 'echarts'
import { EChartsOption } from 'echarts'

echarts.registerTheme('nhk_theme', echartsTheme)

const data = [
  {
    siteName: 'DDS',
    amountPO: 4759750,
    remainAfterPO: 802525840,
    percentUse: 0.59,
  },
  {
    siteName: 'Precision',
    amountPO: 28354265,
    remainAfterPO: 209905305,
    percentUse: 11.9,
  },
  {
    siteName: 'Suspension',
    amountPO: 21487570,
    remainAfterPO: 163517050,
    percentUse: 11.61,
  },
  {
    siteName: 'Bangpoo',
    amountPO: 19384794,
    remainAfterPO: 125336806,
    percentUse: 13.39,
  },
  {
    siteName: 'Banpho',
    amountPO: 2595671,
    remainAfterPO: 131505829,
    percentUse: 1.94,
  },
  {
    siteName: 'Head Office',
    amountPO: 12519031,
    remainAfterPO: 67794949,
    percentUse: 15.59,
  },
  {
    siteName: 'Hemaraj',
    amountPO: 693088,
    remainAfterPO: 18330962,
    percentUse: 3.64,
  },
]

const SERIES: EChartsOption['series'] = [
  {
    name: 'Sum of Amount PO.',
    data: data.map((item) => item.amountPO),
    type: 'bar',
    stack: 'x',
    barWidth: '45px',
    label: {
      show: true,
      position: 'inside',
      color: clrWhite,
      formatter: (params) => {
        const value = params.value as number
        if (value >= 100000000) {
          return `${(value / 1000000).toFixed(1)}M`
        }
        return '' // Return empty string for values less than 100M
      },
    },
    itemStyle: {
      borderRadius: [0, 0, 5, 5],
    },
  },
  {
    name: 'Sum of Remain After PO.',
    data: data.map((item) => item.remainAfterPO),
    type: 'bar',
    stack: 'x',
    barWidth: '45px',
    label: {
      show: true,
      position: 'inside',
      color: clrBlack,
      formatter: (params) => {
        const value = params.value as number
        if (value >= 100000000) {
          return `${(value / 1000000).toFixed(1)}M`
        }
        return '' // Return empty string for values less than 100M
      },
    },
    itemStyle: {
      borderRadius: [5, 5, 0, 0],
    },
  },
  {
    name: '% Use',
    type: 'line',
    yAxisIndex: 1,
    data: data.map((item) => item.percentUse),
    label: {
      show: true,
      position: 'top',
      formatter: '{c}%',
    },
    itemStyle: {
      color: clrYellow, // You can choose any color you prefer
    },
  },
]

const StackedBarChart = () => {
  const [isLoading, setIsLoading] = useState(true)
  const timerRef = useRef<ReturnType<typeof setTimeout>>()

  const chartOptions = useMemo((): EChartsOption => {
    return {
      ...echartsOptions,
      legend: {
        ...echartsOptions.legend,
        data: ['Sum of Amount PO.', 'Sum of Remain After PO.', '% Use'],
      },
      xAxis: {
        ...echartsOptions.xAxis,
        type: 'category',
        data: data.map((item) => item.siteName),
      },
      yAxis: [
        {
          ...echartsOptions.yAxis,
          axisLabel: {
            formatter: (value: number) => {
              if (value >= 1000000) {
                return `${(value / 1000000).toFixed(0)}M`
              } else if (value >= 1000) {
                return `${(value / 1000).toFixed(0)}K`
              }
              return value.toString()
            },
          },
        } as echarts.YAXisComponentOption,
        {
          type: 'value',
          name: '% Use',
          min: 0,
          max: 20,
          interval: 5,
          axisLabel: {
            formatter: '{value}%',
          },
        },
      ],
      tooltip: {
        ...echartsOptions.tooltip,
        formatter: (
          params:
            | echarts.DefaultLabelFormatterCallbackParams
            | echarts.DefaultLabelFormatterCallbackParams[],
        ) => {
          const paramsArray = Array.isArray(params) ? params : [params]
          if (paramsArray.length < 3) {
            return '' // Return empty string if we don't have all series data
          }

          const totalUse = paramsArray[0].value as number
          const remaining = paramsArray[1].value as number
          const percentUse = paramsArray[2].value as number
          // const totalValue = totalUse + remaining

          return `${paramsArray[0].name}<br/>
                  Sum of Amount PO.: ${totalUse.toLocaleString()}<br/>
                  Sum of Remain After PO.: ${remaining.toLocaleString()}<br/>
                  % Use: ${percentUse.toFixed(2)}%`
        },
      } as echarts.TooltipComponentOption,
      series: SERIES,
    }
  }, [])

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      setIsLoading(false)
    }, 500)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  return isLoading ? (
    <div> Loading </div>
  ) : (
    <ReactECharts
      theme="nhk_theme"
      option={chartOptions}
      style={{ height: '400px', maxWidth: 1440 }}
    />
  )
}

export default StackedBarChart
