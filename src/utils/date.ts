import { format } from 'date-fns';


export function formatDate(datetime: string) {
    const date = new Date(datetime);
    return format(date, 'dd MMMM yyyy HH:mm:ss')
}