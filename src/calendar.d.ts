export type CalendarProps = {
    value?: Date | undefined;
    mode?: string | undefined;
    onSelect?: (() => void) | undefined;
    weekdayFormat?: string | undefined;
    arrowLeft?: (() => any) | undefined;
    arrowRight?: (() => any) | undefined;
}