import { JSX } from 'preact'
import { CalendarMode, CalendarProps } from './calendar'

export const Calendar: <M extends CalendarMode>(
  props: CalendarProps<M>
) => JSX.Element

export * from './calendar'
