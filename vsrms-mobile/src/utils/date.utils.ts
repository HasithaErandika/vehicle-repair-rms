export function formatDate(iso: string | Date, formatStr: string = 'PPP'): string {
  const d = typeof iso === 'string' ? new Date(iso) : iso;
  
  if (isNaN(d.getTime())) return 'Invalid date';

  if (formatStr === 'PPP') {
    return d.toLocaleDateString('en-LK', { month: 'long', day: 'numeric', year: 'numeric' });
  }
  
  return d.toLocaleDateString('en-LK', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
}
