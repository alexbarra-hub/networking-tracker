'use client'

import { useEffect, useRef, useState } from 'react'
import { Contact, ContactFormData, Priority } from '@/types/contact'

const EMPTY_FORM: ContactFormData = {
  name: '',
  company: null,
  role: null,
  where_met: null,
  notes: null,
  priority: 'medium',
}

interface Props {
  contact: Contact | null
  onClose: () => void
  onSave: (contact: Contact) => void
}

export default function ContactModal({ contact, onClose, onSave }: Props) {
  const [form, setForm] = useState<ContactFormData>(
    contact
      ? {
          name: contact.name,
          company: contact.company,
          role: contact.role,
          where_met: contact.where_met,
          notes: contact.notes,
          priority: contact.priority,
        }
      : EMPTY_FORM
  )
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose()
  }

  const set = (field: keyof ContactFormData, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value || null }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) { setError('Name is required'); return }
    setSaving(true)
    setError(null)
    try {
      const url = contact ? `/api/contacts/${contact.id}` : '/api/contacts'
      const method = contact ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error(await res.text())
      const saved: Contact = await res.json()
      onSave(saved)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  const inputCls = 'w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
  const labelCls = 'block text-xs font-medium text-gray-500 mb-1'

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
    >
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="text-base font-semibold text-gray-900">
            {contact ? 'Edit Contact' : 'Add Contact'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className={labelCls}>Name *</label>
              <input
                className={inputCls}
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                placeholder="Jane Smith"
                autoFocus
              />
            </div>
            <div>
              <label className={labelCls}>Company</label>
              <input className={inputCls} value={form.company ?? ''} onChange={(e) => set('company', e.target.value)} placeholder="Acme Corp" />
            </div>
            <div>
              <label className={labelCls}>Role</label>
              <input className={inputCls} value={form.role ?? ''} onChange={(e) => set('role', e.target.value)} placeholder="Product Manager" />
            </div>
            <div>
              <label className={labelCls}>Where Met</label>
              <input className={inputCls} value={form.where_met ?? ''} onChange={(e) => set('where_met', e.target.value)} placeholder="NeurIPS 2024" />
            </div>
            <div>
              <label className={labelCls}>Priority</label>
              <select
                className={inputCls}
                value={form.priority}
                onChange={(e) => setForm((p) => ({ ...p, priority: e.target.value as Priority }))}
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className={labelCls}>Notes</label>
              <textarea
                className={`${inputCls} resize-none`}
                rows={3}
                value={form.notes ?? ''}
                onChange={(e) => set('notes', e.target.value)}
                placeholder="Follow up about the ML infra role..."
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
