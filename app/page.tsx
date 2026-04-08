'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import ContactTable from '@/components/ContactTable'
import ContactModal from '@/components/ContactModal'
import { Contact } from '@/types/contact'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { PlusIcon, LogOutIcon } from 'lucide-react'

export default function Home() {
  const router = useRouter()
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingContact, setEditingContact] = useState<Contact | null>(null)

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

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
    <main className="bg-background min-h-screen">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Networking Tracker</h1>
            <p className="text-muted-foreground mt-0.5 text-sm">
              {contacts.length} {contacts.length === 1 ? 'contact' : 'contacts'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={openAdd} size="sm">
              <PlusIcon />
              Add Contact
            </Button>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOutIcon />
              Sign out
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="text-muted-foreground py-24 text-center text-sm">Loading…</div>
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
