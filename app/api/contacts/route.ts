import { NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'
import { ContactFormData } from '@/types/contact'

export async function GET() {
  const { data, error } = await getSupabase()
    .from('contacts')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request: Request) {
  const body: ContactFormData = await request.json()

  if (!body.name?.trim()) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 })
  }

  const { data, error } = await getSupabase()
    .from('contacts')
    .insert({
      name: body.name.trim(),
      company: body.company || null,
      role: body.role || null,
      where_met: body.where_met || null,
      notes: body.notes || null,
      priority: body.priority ?? 'medium',
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
