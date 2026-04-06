export type Priority = 'high' | 'medium' | 'low'

export interface Contact {
  id: string
  name: string
  company: string | null
  role: string | null
  where_met: string | null
  notes: string | null
  priority: Priority
  created_at: string
  updated_at: string
}

export type ContactFormData = Omit<Contact, 'id' | 'created_at' | 'updated_at'>
