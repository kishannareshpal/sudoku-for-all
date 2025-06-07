import { intervalToDuration } from "date-fns";

export class TimeHelper {
    static formatInterval(seconds: number): string {
        const duration = intervalToDuration({ start: 0, end: seconds });

        const hh = this.zeroPad(duration.hours);
        const mm = this.zeroPad(duration.minutes);
        const ss = this.zeroPad(duration.seconds);

        return `${hh}:${mm}:${ss}`;
    }

    static zeroPad(timeUnit: number | string | undefined): string {
        const serializedTimeUnit = typeof timeUnit === 'number' ? timeUnit.toString() : timeUnit;

        if (!serializedTimeUnit) {
            return '00';
        }

        return serializedTimeUnit.toString().padStart(2, '0');
    }
}
