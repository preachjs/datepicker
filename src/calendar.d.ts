type CalendarValues = {
  single: Date
  range: [Date, Date]
}

export type CalendarValue<M extends CalendarMode = CalendarMode> =
  CalendarValues[M]

export type CalendarMode = 'single' | 'range'

export type CalendarProps<M extends CalendarMode = CalendarMode> = {
  value?: CalendarValue<M>
  weekdayFormat?: 'narrow' | 'short' | 'long'
  arrowLeft?: () => any
  arrowRight?: () => any
  mode?: M
  readOnly: boolean
  onSelect?: (nextValue: CalendarValue<M>) => void
}
