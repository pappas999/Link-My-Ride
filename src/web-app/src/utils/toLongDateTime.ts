import { format } from "date-fns"

export const toLongDateTime = (date: Date) => format(date, "dd MMM yyyy haaa")