import { NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'
import { ContactFormData } from '@/types/contact'

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body: ContactFormData = await request.json()

  if (!body.name?.trim()) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 })
  }

  const { data, error } = await getSupabase()
    .from('contacts')
    .update({
      name: body.name.trim(),
      company: body.company || null,
      role: body.role || null,
      where_met: body.where_met || null,
      notes: body.notes || null,
      priority: body.priority ?? 'medium',
    })
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const { error } = await getSupabase().from('contacts').delete().eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return new NextResponse(null, { status: 204 })
}
