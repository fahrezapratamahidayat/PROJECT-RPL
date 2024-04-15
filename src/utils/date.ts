import { format, isValid, parseISO } from 'date-fns';


export function formatDate(datetime: string) {
    const date = new Date(datetime);
    return format(date, 'dd MMMM yyyy HH:mm:ss')
}

/**
 * Fungsi untuk memformat tanggal. Jika tanggal tidak valid, mengembalikan "Tanggal tidak valid".
 * 
 * @param {string} dateString - String tanggal yang akan diformat.
 * @param {string} formatString - Format string yang diinginkan untuk output.
 * @returns {string} Tanggal yang sudah diformat atau "Tanggal tidak valid".
 */
export const formatDateString = (dateString: string | undefined, formatString: string = 'PPP'): string => { // Tambahkan log untuk input
  if (!dateString) {
    return 'Tanggal tidak valid';
  }
  const date = parseISO(dateString); // Cek apakah tanggal valid
  if (isValid(date)) {
    return format(date, formatString);
  }
  return 'Tanggal tidak valid';
};