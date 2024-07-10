import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import "dayjs/locale/pt"

dayjs.locale("pt");
dayjs.extend(localizedFormat);

export function formatDate(date: Date) {
  return dayjs(date).format("LL")
}

export { dayjs };