"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { BookOpen } from "lucide-react"

export interface Book {
  id: string
  title: string
  author: string
  genre: string
  pages: number
  createdAt: Date
}

export interface Reading {
  id: string
  bookId: string
  startDate: Date
  endDate?: Date
  status: "em-andamento" | "concluido"
  notes: string
  rating?: number
  createdAt: Date
}

export default function HomePage() {
  const router = useRouter()
  const [books, setBooks] = useState<Book[]>([])
  const [readings, setReadings] = useState<Reading[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [genreFilter, setGenreFilter] = useState<string>("todos")
  const [statusFilter, setStatusFilter] = useState<string>("todos")
  const [showBookForm, setShowBookForm] = useState(false)
  const [showReadingForm, setShowReadingForm] = useState(false)
  const [editingBook, setEditingBook] = useState<Book | null>(null)
  const [editingReading, setEditingReading] = useState<Reading | null>(null)

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        router.push("/biblioteca")
      } else {
        router.push("/auth/login")
      }
    }

    checkAuth()
  }, [router])

  // Load data from localStorage on mount
  useEffect(() => {
    const savedBooks = localStorage.getItem("biblioteca-books")
    const savedReadings = localStorage.getItem("biblioteca-readings")

    if (savedBooks) {
      const parsedBooks = JSON.parse(savedBooks).map((book: any) => ({
        ...book,
        createdAt: new Date(book.createdAt),
      }))
      setBooks(parsedBooks)
    }

    if (savedReadings) {
      const parsedReadings = JSON.parse(savedReadings).map((reading: any) => ({
        ...reading,
        startDate: new Date(reading.startDate),
        endDate: reading.endDate ? new Date(reading.endDate) : undefined,
        createdAt: new Date(reading.createdAt),
      }))
      setReadings(parsedReadings)
    }
  }, [])

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem("biblioteca-books", JSON.stringify(books))
  }, [books])

  useEffect(() => {
    localStorage.setItem("biblioteca-readings", JSON.stringify(readings))
  }, [readings])

  const addBook = (bookData: Omit<Book, "id" | "createdAt">) => {
    const newBook: Book = {
      ...bookData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    }
    setBooks((prev) => [...prev, newBook])
    setShowBookForm(false)
  }

  const updateBook = (bookData: Omit<Book, "id" | "createdAt">) => {
    if (!editingBook) return

    setBooks((prev) => prev.map((book) => (book.id === editingBook.id ? { ...book, ...bookData } : book)))
    setEditingBook(null)
    setShowBookForm(false)
  }

  const deleteBook = (bookId: string) => {
    setBooks((prev) => prev.filter((book) => book.id !== bookId))
    setReadings((prev) => prev.filter((reading) => reading.bookId !== bookId))
  }

  const addReading = (readingData: Omit<Reading, "id" | "createdAt">) => {
    const newReading: Reading = {
      ...readingData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    }
    setReadings((prev) => [...prev, newReading])
    setShowReadingForm(false)
  }

  const updateReading = (readingData: Omit<Reading, "id" | "createdAt">) => {
    if (!editingReading) return

    setReadings((prev) =>
      prev.map((reading) => (reading.id === editingReading.id ? { ...reading, ...readingData } : reading)),
    )
    setEditingReading(null)
    setShowReadingForm(false)
  }

  const deleteReading = (readingId: string) => {
    setReadings((prev) => prev.filter((reading) => reading.id !== readingId))
  }

  const getBookById = (bookId: string) => {
    return books.find((book) => book.id === bookId)
  }

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesGenre = genreFilter === "todos" || book.genre === genreFilter
    return matchesSearch && matchesGenre
  })

  const filteredReadings = readings.filter((reading) => {
    const book = getBookById(reading.bookId)
    if (!book) return false

    const matchesSearch =
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "todos" || reading.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const genres = Array.from(new Set(books.map((book) => book.genre))).filter(Boolean)

  // Show loading state while checking auth
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="p-3 bg-primary/10 rounded-lg">
          <BookOpen className="h-8 w-8 text-primary animate-pulse" />
        </div>
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    </div>
  )
}
