import { NextResponse } from 'next/server'

const CLOUD  = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!
const KEY    = process.env.CLOUDINARY_API_KEY!
const SECRET = process.env.CLOUDINARY_API_SECRET!

async function sha256hex(msg: string) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(msg))
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
}

export async function POST(req: Request) {
  const form = await req.formData()
  const file = form.get('file') as File | null
  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })

  const ts = Math.round(Date.now() / 1000)
  // Parameters must be in alphabetical order for Cloudinary signature
  // folder < format < timestamp
  const sig = await sha256hex(`folder=tezku_products&format=webp&timestamp=${ts}${SECRET}`)

  const cf = new FormData()
  cf.append('file', file)
  cf.append('api_key', KEY)
  cf.append('timestamp', String(ts))
  cf.append('signature', sig)
  cf.append('folder', 'tezku_products')
  cf.append('format', 'webp')

  const r = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD}/image/upload`, {
    method: 'POST',
    body: cf,
  })

  if (!r.ok) {
    const err = await r.text()
    console.error('[upload] Cloudinary error:', err)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }

  const d = await r.json()
  return NextResponse.json({ url: d.secure_url as string, public_id: d.public_id as string })
}
