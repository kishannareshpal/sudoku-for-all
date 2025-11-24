
const DAY_IN_SECONDS = 86400
const HOUR_IN_SECONDS = 3600
const MINUTE_IN_SECONDS = 60

export class TimeHelper {
    static formatInterval(seconds: number): string {
        const negative = seconds < 0

        let total = Math.abs(Math.floor(seconds))

        const days = Math.floor(total / DAY_IN_SECONDS)
        total %= DAY_IN_SECONDS

        const hours = Math.floor(total / HOUR_IN_SECONDS)
        total %= HOUR_IN_SECONDS

        const minutes = Math.floor(total / MINUTE_IN_SECONDS)
        const remainingSeconds = total % MINUTE_IN_SECONDS

        const hh = String(hours).padStart(2, '0')
        const mm = String(minutes).padStart(2, '0')
        const ss = String(remainingSeconds).padStart(2, '0')

        return (negative ? '-' : '') +
            (days > 0 ? `${days}:${hh}:${mm}:${ss}` : `${hh}:${mm}:${ss}`)
    }
}
