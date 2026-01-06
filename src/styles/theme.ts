import { red } from '@ant-design/colors'
import { ThemeConfig } from 'antd/es/config-provider/context'

import { getCSSValue, removePx } from 'utils/generalHelpers'

import { EChartsOption } from 'echarts'

export const clrBlue = getCSSValue('--clr-blue')
export const clrBlue400 = getCSSValue('--clr-blue-400')
export const clrGreen400 = getCSSValue('--clr-green-400')
export const clrErrorRed = red[4]
export const clrRed100 = getCSSValue('--clr-red-100')
export const clrRed200 = getCSSValue('--clr-red-200')
export const clrNHKRed = getCSSValue('--clr-nhk-red')
export const clrBlack = getCSSValue('--clr-black')
export const clrBlack200 = getCSSValue('--clr-black-200')
export const clrBlack300 = getCSSValue('--clr-black-300')
export const clrBlack500 = getCSSValue('--clr-black-500')
export const clrBlack1000 = getCSSValue('--clr-black-1000')
export const clrWhite = getCSSValue('--clr-white')
export const clrWhite700 = getCSSValue('--clr-white-700')
export const clrWhite1000 = getCSSValue('--clr-white-1000')
export const clrWhite1100 = getCSSValue('--clr-white-1100')
export const clrYellow = getCSSValue('--clr-yellow')
export const clrPdfBlue = getCSSValue('--clr-pdf-blue')
export const clrNeutralLight = getCSSValue('--clr-neutral-light')
export const clrPrimary = getCSSValue('--clr-primary')
export const ffSerif = getCSSValue('--ff-serif')
export const fsPrimary = getCSSValue('--fs-primary')

// ------------------------------------
// Antd theme
// ------------------------------------
export const theme: ThemeConfig = {
  token: {
    fontSize: removePx(getCSSValue('--fs-primary')),
    colorText: getCSSValue('--clr-black'),
    fontFamily: getCSSValue('--ff-serif'),
    colorPrimary: getCSSValue('--clr-primary'),
    colorLink: getCSSValue('--clr-blue'),
    colorInfo: getCSSValue('--clr-blue'),
    controlItemBgHover: getCSSValue('--clr-neutral-light'),
    borderRadiusLG: removePx(getCSSValue('--border-radius')),
  },
  components: {
    Menu: {
      colorText: getCSSValue('--clr-primary'),
      itemSelectedColor: getCSSValue('--clr-primary'),
      itemSelectedBg: getCSSValue('--clr-neutral-light'),
      itemHoverBg: getCSSValue('--clr-secondary'),
      itemHoverColor: getCSSValue('--clr-neutral-light'),
      itemBorderRadius: 0,
    },
    Layout: {
      headerBg: getCSSValue('--clr-white'),
    },
    Table: {
      headerBg: getCSSValue('--clr-neutral-light'),
      headerColor: getCSSValue('--clr-neutral-dark'),
      borderColor: getCSSValue('--clr-border'),
      cellPaddingBlockSM: 4,
      cellPaddingInlineSM: 4,
      rowHoverBg: getCSSValue('--clr-blue-200'),
    },
    Form: {
      itemMarginBottom: 2,
      verticalLabelPadding: '0 0 2px',
      labelColor: getCSSValue('--clr-primary'),
    },
    Collapse: {
      headerBg: getCSSValue('--clr-primary'),
      contentPadding: '8px 16px',
      headerPadding: '8px 16px',
    },
  },
}

// ------------------------------------
// echarts theme
// ------------------------------------
export const echartsTheme = {
  color: [
    {
      type: 'linear',
      x: 0,
      y: 0,
      x2: 0,
      y2: 1,
      colorStops: [
        {
          offset: 0,
          color: getCSSValue('--clr-blue-400'), // color at 0%
        },
        {
          offset: 1,
          color: 'rgba(67, 116, 248, 0.8)', // color at 100%
        },
      ],
      global: false, // default is false
    },
    {
      type: 'linear',
      x: 0,
      y: 0,
      x2: 0,
      y2: 1,
      colorStops: [
        {
          offset: 0,
          color: getCSSValue('--clr-green-400'), // color at 0%
        },
        {
          offset: 1,
          color: 'rgba(0, 164, 93, 0.8)', // color at 100%
        },
      ],
      global: false, // default is false
    },
    '#fac858',
    '#ee6666',
    '#73c0de',
    '#3ba272',
    '#fc8452',
    '#9a60b4',
    '#ea7ccc',
  ],
}

export const echartsOptions: Pick<
  EChartsOption,
  'textStyle' | 'legend' | 'xAxis' | 'yAxis' | 'tooltip'
> = {
  textStyle: {
    fontFamily: ffSerif,
    fontSize: fsPrimary,
  },
  legend: {
    itemHeight: 20,
    itemWidth: 24,
  },
  xAxis: {
    axisLine: {
      lineStyle: {
        type: 'dashed',
        color: clrBlack500,
      },
    },
    axisTick: { show: false },
    axisLabel: {
      // fontSize: fsPrimary,
    },
    type: 'category',
    data: [],
  },
  yAxis: {
    type: 'value',
    axisLabel: {
      fontSize: fsPrimary,
    },
    splitLine: {
      lineStyle: {
        type: 'dashed',
        color: clrBlack200,
      },
    },
    axisLine: {
      lineStyle: {
        color: clrBlack500,
      },
    },
  },
  tooltip: {
    trigger: 'axis',
  },
}
