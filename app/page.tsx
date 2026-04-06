'use client'

import { useCallback, useEffect, useState } from 'react'
import ContactTable from '@/components/ContactTable'
import ContactModal from '@/components/ContactModal'
import { Contact } from '@/types/contact'

export default function Home() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingContact, setEditingContact] = useState<Contact | null>(null)

  const fetchContacts = useCallback(async () => {
    const res = await fetch('/api/contacts')
    if (res.ok) setContacts(await res.json())
    setLoading(false)
  }, [])

  useEffect(() => { fetchContacts() }, [fetchContacts])

  const openAdd = () => { setEditingContact(null); setModalOpen(true) }
  const openEdit = (c: Contact) => { setEditingContact(c); setModalOpen(true) }
  const closeModal = () => setModalOpen(false)

  const handleSave = (saved: Contact) => {
    setContacts((prev) => {
      const exists = prev.find((c) => c.id === saved.id)
      return exists
        ? prev.map((c) => (c.id === saved.id ? saved : c))
        : [saved, ...prev]
    })
    setModalOpen(false)
  }

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/contacts/${id}`, { method: 'DELETE' })
    if (res.ok) setContacts((prev) => prev.filter((c) => c.id !== id))
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Networking Tracker</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {contacts.length} {contacts.length === 1 ? 'contact' : 'contacts'}
            </p>
          </div>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Contact
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-20 text-gray-400 text-sm">Loading…</div>
        ) : (
          <ContactTable contacts={contacts} onEdit={openEdit} onDelete={handleDelete} />
        )}
      </div>

      {modalOpen && (
        <ContactModal
          contact={editingContact}
          onClose={closeModal}
          onSave={handleSave}
        />
      )}
    </main>
  )
}
