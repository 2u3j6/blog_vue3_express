import dayjs from 'dayjs'
import utc from 'dayjs-plugin-utc'
import { computed } from 'vue'
dayjs.extend(utc)
export const useFormatTime = (time) => {
  return computed(() => {
    return dayjs.utc(time).utcOffset(8).format('YYYY-MM-DD HH:mm:ss')
  })
}
