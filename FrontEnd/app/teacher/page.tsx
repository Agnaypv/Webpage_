'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface Note {
  id: number
  title: string
  subject: string
  filename: string
}

export default function TeacherDashboard() {
  const [title, setTitle] = useState('')
  const [subject, setSubject] = useState('Mathematics')
  const [file, setFile] = useState<File | null>(null)
  const [notes, setNotes] = useState<Note[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const subjects = [
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'Literature',
    'History',
    'Computer Science',
  ]

  // ✅ Load notes from backend
  const fetchNotes = async () => {
    const res = await fetch('https://webpage-uq00.onrender.com/api/notes')
    const data = await res.json()
    setNotes(data)
  }

  useEffect(() => {
    fetchNotes()
  }, [])

  // ✅ Upload to Flask
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!file) {
      alert('Please select a file')
      return
    }

    setIsLoading(true)

    const formData = new FormData()
    formData.append('title', title)
    formData.append('subject', subject)
    formData.append('file', file)

    try {
      const res = await fetch('https://webpage-uq00.onrender.com/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (data.success) {
        alert('Upload successful ✅')
        setTitle('')
        setFile(null)
        fetchNotes()
      } else {
        alert('Upload failed ❌')
      }
    } catch (err) {
      console.error(err)
      alert('Server error')
    }

    setIsLoading(false)
  }

  // ✅ Drag handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      setFile(files[0])
    }
  }

  const handleDelete = async (id: number) => {
  console.log("Deleting note id:", id)

  if (!confirm("Delete this note?")) return

  try {
    const res = await fetch(
      `https://webpage-uq00.onrender.com/api/delete/${id}`,
      {
        method: "DELETE",
      }
    )

    const data = await res.json()

    if (data.success) {
      fetchNotes()
    } else {
      alert("Delete failed")
    }
  } catch (err) {
    console.error("Delete error:", err)
    alert("Server error")
  }
}

  const handleLogout = () => {
    window.location.href = '/'
  }

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
        <div className="grid md:grid-cols-3 gap-8">
          {/* Upload section */}
          <div className="md:col-span-1">
            <form
              onSubmit={handleUpload}
              className="backdrop-blur-xl bg-white/30 border border-white/40 rounded-2xl p-6 shadow-xl sticky top-24"
            >
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                📤 Upload Notes
              </h3>

              {/* Title */}
              <Input
                placeholder="Note title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mb-4"
              />

              {/* Subject */}
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full mb-4 px-4 py-2 rounded-lg border"
              >
                {subjects.map((subj) => (
                  <option key={subj}>{subj}</option>
                ))}
              </select>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={(e) =>
                  setFile(e.target.files?.[0] || null)
                }
              />

              {/* Drag & drop area */}
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer mb-4 ${
                  isDragging
                    ? 'border-blue-400 bg-blue-100/50'
                    : 'border-white/50 bg-white/20'
                }`}
              >
                <div className="text-4xl mb-2">📁</div>
                <p className="text-sm font-medium">
                  {file ? file.name : 'Drag & drop or click'}
                </p>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={!title || !file || isLoading}
                className="w-full"
              >
                {isLoading ? 'Uploading...' : '🚀 Upload Note'}
              </Button>
            </form>
          </div>

          {/* Notes list */}
          <div className="md:col-span-2 space-y-4">
            {notes.map((note) => (
              <div
                key={note.id}
                className="bg-white/40 rounded-xl p-4 flex justify-between"
              >
                <div>
                  <h4 className="font-bold">{note.title}</h4>
                  <p className="text-sm text-gray-600">
                    {note.filename}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => handleDelete(note.id)}
                >
                  🗑️
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}