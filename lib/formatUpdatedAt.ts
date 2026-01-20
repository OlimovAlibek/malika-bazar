export function formatUpdatedAt(dateString: string) {
    const updated = new Date(dateString);
    const now = new Date();
  
    const diffMs = now.getTime() - updated.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
  
    if (diffHours < 24) {
      return '🟢 Yangilandi bugun';
    }
  
    if (diffHours < 48) {
      return '🟡 Kecha yangilangan';
    }
  
    return updated.toLocaleDateString('uz-UZ', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }