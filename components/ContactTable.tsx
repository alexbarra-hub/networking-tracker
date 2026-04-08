'use client'

import { useState } from 'react'
import { Contact, Priority } from '@/types/contact'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PencilIcon, Trash2Icon, ArrowUpDownIcon, ArrowUpIcon, ArrowDownIcon } from 'lucide-react'

type SortKey = keyof Pick<Contact, 'name' | 'company' | 'role' | 'where_met' | 'priority' | 'created_at'>
type SortDir = 'asc' | 'desc'

const PRIORITY_ORDER: Record<Priority, number> = { high: 0, medium: 1, low: 2 }

const priorityVariant: Record<Priority, 'destructive' | 'default' | 'secondary'> = {
  high: 'destructive',
  medium: 'default',
  low: 'secondary',
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
    if (sortKey !== col) return <ArrowUpDownIcon className="ml-1 inline size-3 opacity-40" />
    return sortDir === 'asc'
      ? <ArrowUpIcon className="ml-1 inline size-3" />
      : <ArrowDownIcon className="ml-1 inline size-3" />
  }

  const th = (label: string, key: SortKey) => (
    <TableHead
      onClick={() => handleSort(key)}
      className="cursor-pointer select-none whitespace-nowrap hover:text-foreground"
    >
      {label}<SortIcon col={key} />
    </TableHead>
  )

  if (contacts.length === 0) {
    return (
      <div className="text-muted-foreground flex flex-col items-center justify-center py-24 text-sm">
        <div className="bg-muted mb-4 flex size-12 items-center justify-center rounded-full text-xl">👥</div>
        <p className="font-medium">No contacts yet</p>
        <p className="mt-1 text-xs">Add your first contact to get started.</p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow>
            {th('Name', 'name')}
            {th('Company', 'company')}
            {th('Role', 'role')}
            {th('Where Met', 'where_met')}
            {th('Priority', 'priority')}
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((c) => (
            <TableRow key={c.id}>
              <TableCell>
                <span className="font-medium">{c.name}</span>
                {c.notes && (
                  <p className="text-muted-foreground mt-0.5 max-w-[200px] truncate text-xs">{c.notes}</p>
                )}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {c.company ?? <span className="opacity-30">—</span>}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {c.role ?? <span className="opacity-30">—</span>}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {c.where_met ?? <span className="opacity-30">—</span>}
              </TableCell>
              <TableCell>
                <Badge variant={priorityVariant[c.priority]} className="capitalize">
                  {c.priority}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => onEdit(c)}
                    title="Edit"
                  >
                    <PencilIcon />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => { if (confirm(`Delete ${c.name}?`)) onDelete(c.id) }}
                    title="Delete"
                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2Icon />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
