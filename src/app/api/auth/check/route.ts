import { NextResponse } from 'next/server'
import { serviceClient } from '@/lib/supabase/service'
import { TOKEN_TTL_MS } from '@/app/api/auth/login/route'

export const dynamic = 'force-dynamic'

const TOKEN_RE = /^[0-9a-f]{32}$/

// GET /api/auth/check?token={token}
// Token tasdiqlangan (user_id bor) va muddati o'tmagan yoki yo'qligini tekshiradi
export async function GET(req: Request) {
  const token = new URL(req.url).searchParams.get('token')
  if (!token || !TOKEN_RE.test(token)) return NextResponse.json({ ready: false })

  const minCreatedAt = new Date(Date.now() - TOKEN_TTL_MS).toISOString()

  const { data } = await serviceClient
    .from('auth_tokens')
    .select('user_id')
    .eq('token', token)
    .not('user_id', 'is', null)
    .gte('created_at', minCreatedAt)
    .maybeSingle()

  return NextResponse.json({ ready: !!data?.user_id })
}
