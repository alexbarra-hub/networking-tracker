'use client'

import { useState } from 'react'
import { Contact, Priority } from '@/types/contact'

type SortKey = keyof Pick<Contact, 'name' | 'company' | 'role' | 'where_met' | 'priority' | 'created_at'>
type SortDir = 'asc' | 'desc'

const PRIORITY_ORDER: Record<Priority, number> = { high: 0, medium: 1, low: 2 }

const priorityBadge: Record<Priority, string> = {
  high: 'bg-red-100 text-red-700',
  medium: 'bg-yellow-100 text-yellow-700',
  low: 'bg-green-100 text-green-700',
}

interface Props {
  contacts: Contact[]
  onEdit: (contact: Contact) => void
  onDelete: (id: string) => void
}

export default function ContactTable({ contacts, onEdit, onDelete }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>('created_at')
  const [sortDir, setSortDir] = useState<SortDir>('desc')

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const sorted = [...contacts].sort((a, b) => {
    let aVal: string | number | null
    let bVal: string | number | null

    if (sortKey === 'priority') {
      aVal = PRIORITY_ORDER[a.priority]
      bVal = PRIORITY_ORDER[b.priority]
    } else {
      aVal = a[sortKey] ?? ''
      bVal = b[sortKey] ?? ''
    }

    if (aVal < bVal) return sortDir === 'asc' ? -1 : 1
    if (aVal > bVal) return sortDir === 'asc' ? 1 : -1
    return 0
  })

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <span className="text-gray-300 ml-1">↕</span>
    return <span className="ml-1">{sortDir === 'asc' ? '↑' : '↓'}</span>
  }

  const th = (label: string, key: SortKey) => (
    <th
      onClick={() => handleSort(key)}
      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide cursor-pointer select-none hover:text-gray-700 whitespace-nowrap"
    >
      {label}<SortIcon col={key} />
    </th>
  )

  if (contacts.length === 0) {
    return (
      <div className="text-center py-20 text-gray-400">
        <p className="text-4xl mb-3">👥</p>
        <p className="text-sm">No contacts yet. Add your first one!</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="min-w-full divide-y divide-gray-100">
        <thead className="bg-gray-50">
          <tr>
            {th('Name', 'name')}
            {th('Company', 'company')}
            {th('Role', 'role')}
            {th('Where Met', 'where_met')}
            {th('Priority', 'priority')}
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wide">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {sorted.map((c) => (
            <tr key={c.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3">
                <span className="font-medium text-gray-900 text-sm">{c.name}</span>
                {c.notes && (
                  <p className="text-xs text-gray-400 truncate max-w-[200px] mt-0.5">{c.notes}</p>
                )}
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">{c.company ?? <span className="text-gray-300">—</span>}</td>
              <td className="px-4 py-3 text-sm text-gray-600">{c.role ?? <span className="text-gray-300">—</span>}</td>
              <td className="px-4 py-3 text-sm text-gray-600">{c.where_met ?? <span className="text-gray-300">—</span>}</td>
              <td className="px-4 py-3">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${priorityBadge[c.priority]}`}>
                  {c.priority}
                </span>
              </td>
              <td className="px-4 py-3 text-right">
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => onEdit(c)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                    title="Edit"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Delete ${c.name}?`)) onDelete(c.id)
                    }}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Delete"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
