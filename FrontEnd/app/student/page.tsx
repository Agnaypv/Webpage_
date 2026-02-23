'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'

interface Note {
  id: number
  title: string
  subject: string
  filename: string
}

export default function StudentDashboard() {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)

  // ✅ NEW: search + filter state
  const [search, setSearch] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('All')

  const subjects = [
    'All',
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'Literature',
    'History',
    'Computer Science',
  ]

  // ✅ Fetch notes from Flask
  const fetchNotes = async () => {
    try {
      const res = await fetch('https://webpage-uq00.onrender.com/api/notes')
      const data = await res.json()
      setNotes(data)
    } catch (err) {
      console.error('Failed to fetch notes', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNotes()
  }, [])

  const handleLogout = () => {
    window.location.href = '/'
  }

  // ✅ NEW: filtered notes logic
  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(search.toLowerCase())

    const matchesSubject =
      selectedSubject === 'All' ||
      note.subject === selectedSubject

    return matchesSearch && matchesSubject
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Navbar */}
      <nav className="backdrop-blur-xl bg-white/30 border-b border-white/40 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-3xl">📚</div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Class Notes
            </h1>
          </div>
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          📥 Available Notes
        </h2>

        {/* ✅ NEW: Search + Filter UI */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            placeholder="🔍 Search notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 rounded-lg border w-full md:w-1/2"
          />

          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-4 py-2 rounded-lg border w-full md:w-1/3"
          >
            {subjects.map((subj) => (
              <option key={subj}>{subj}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <p className="text-gray-600">Loading notes...</p>
        ) : filteredNotes.length === 0 ? (
          <div className="bg-white/40 rounded-xl p-8 text-center">
            <div className="text-5xl mb-3">📚</div>
            <p className="text-gray-600 font-medium">
              No matching notes found
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {filteredNotes.map((note) => (
              <div
                key={note.id}
                className="bg-white/40 rounded-xl p-5 flex justify-between items-center hover:shadow-lg transition"
              >
                <div>
                  <h4 className="font-bold text-gray-800">
                    {note.title}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {note.subject}
                  </p>
                  <p className="text-xs text-gray-500">
                    {note.filename}
                  </p>
                </div>

                <a
                  href={`https://webpage-uq00.onrender.com/api/download/${note.filename}`}
                  target="_blank"
                >
                  <Button>⬇ Download</Button>
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}