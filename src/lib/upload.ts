export async function uploadImage(file: File): Promise<{ url: string; public_id: string }> {
  const fd = new FormData()
  fd.append('file', file)
  const res = await fetch('/api/upload', { method: 'POST', body: fd })
  if (!res.ok) throw new Error('Rasm yuklashda xatolik')
  return res.json()
}
