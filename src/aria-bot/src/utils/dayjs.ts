import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";
import dayjs from "dayjs";

dayjs.extend(utc);
dayjs.extend(timezone);

export const dayjsCustom = dayjs;
