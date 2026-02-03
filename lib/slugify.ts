export function slugify(text: string) {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')   // remove symbols
      .replace(/\s+/g, '-')           // spaces → dash
      .replace(/-+/g, '-');           // collapse dashes
  }