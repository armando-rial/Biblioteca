"use client"

import { useBooks } from "@/lib/hooks/use-books"
import { useReadings } from "@/lib/hooks/use-readings"
import { BookOpen, Plus, Search, Clock, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { BookCard } from "@/components/books/book-card"
import { ReadingCard } from "@/components/readings/reading-card"
import { StatsOverview } from "@/components/dashboard/stats-overview"
import { BookFormModal } from "@/components/books/book-form-modal"
import { ReadingFormModal } from "@/components/readings/reading-form-modal"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export default function BibliotecaPage() {
  const { books, isLoading: booksLoading, addBook, updateBook, deleteBook } = useBooks()
  const { readings, isLoading: readingsLoading, addReading, updateReading, deleteReading } = useReadings()
  const [searchTerm, setSearchTerm] = useState("")
  const [genreFilter, setGenreFilter] = useState<string>("todos")
  const [statusFilter, setStatusFilter] = useState<string>("todos")
  const [showBookForm, setShowBookForm] = useState(false)
  const [showReadingForm, setShowReadingForm] = useState(false)
  const [editingBook, setEditingBook] = useState<any>(null)
  const [editingReading, setEditingReading] = useState<any>(null)
  const router = useRouter()

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesGenre = genreFilter === "todos" || book.genre === genreFilter
    return matchesSearch && matchesGenre
  })

  const filteredReadings = readings.filter((reading) => {
    const book = books.find((b) => b.id === reading.book_id)
    if (!book) return false

    const matchesSearch =
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "todos" || reading.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const genres = Array.from(new Set(books.map((book) => book.genre).filter(Boolean)))

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/auth/login")
  }

  const handleAddBook = async (bookData: any) => {
    if (editingBook) {
      await updateBook(editingBook.id, bookData)
      setEditingBook(null)
    } else {
      await addBook(bookData)
    }
    setShowBookForm(false)
  }

  const handleAddReading = async (readingData: any) => {
    if (editingReading) {
      await updateReading(editingReading.id, readingData)
      setEditingReading(null)
    } else {
      await addReading(readingData)
    }
    setShowReadingForm(false)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Biblioteca Pessoal</h1>
                <p className="text-sm text-muted-foreground">Organize suas leituras literárias</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={() => setShowBookForm(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Novo Livro
              </Button>
              <Button onClick={() => setShowReadingForm(true)} variant="outline" className="gap-2">
                <Clock className="h-4 w-4" />
                Nova Leitura
              </Button>
              <Button onClick={handleLogout} variant="ghost" size="icon">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Statistics Overview */}
        <StatsOverview books={books} readings={readings} />

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Buscar e Filtrar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Buscar por título ou autor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="flex gap-2">
                <Select value={genreFilter} onValueChange={setGenreFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filtrar por gênero" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os gêneros</SelectItem>
                    {genres.map((genre) => (
                      <SelectItem key={genre} value={genre || ""}>
                        {genre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filtrar por status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os status</SelectItem>
                    <SelectItem value="em-andamento">Em andamento</SelectItem>
                    <SelectItem value="concluido">Concluído</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content Tabs */}
        <Tabs defaultValue="livros" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="livros" className="gap-2">
              <BookOpen className="h-4 w-4" />
              Livros ({filteredBooks.length})
            </TabsTrigger>
            <TabsTrigger value="leituras" className="gap-2">
              <Clock className="h-4 w-4" />
              Leituras ({filteredReadings.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="livros" className="mt-6">
            {filteredBooks.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Nenhum livro encontrado</h3>
                  <p className="text-muted-foreground text-center mb-4">
                    {books.length === 0
                      ? "Comece adicionando seu primeiro livro à biblioteca"
                      : "Tente ajustar os filtros de busca"}
                  </p>
                  {books.length === 0 && (
                    <Button onClick={() => setShowBookForm(true)} className="gap-2">
                      <Plus className="h-4 w-4" />
                      Adicionar Primeiro Livro
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBooks.map((book) => (
                  <BookCard
                    key={book.id}
                    book={book}
                    onEdit={(book) => {
                      setEditingBook(book)
                      setShowBookForm(true)
                    }}
                    onDelete={deleteBook}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="leituras" className="mt-6">
            {filteredReadings.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Clock className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Nenhuma leitura encontrada</h3>
                  <p className="text-muted-foreground text-center mb-4">
                    {readings.length === 0
                      ? "Registre sua primeira leitura para começar"
                      : "Tente ajustar os filtros de busca"}
                  </p>
                  {readings.length === 0 && books.length > 0 && (
                    <Button onClick={() => setShowReadingForm(true)} className="gap-2">
                      <Plus className="h-4 w-4" />
                      Registrar Primeira Leitura
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredReadings.map((reading) => {
                  const book = books.find((b) => b.id === reading.book_id)
                  return book ? (
                    <ReadingCard
                      key={reading.id}
                      reading={reading}
                      book={book}
                      onEdit={(reading) => {
                        setEditingReading(reading)
                        setShowReadingForm(true)
                      }}
                      onDelete={deleteReading}
                    />
                  ) : null
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* Modals */}
      {showBookForm && (
        <BookFormModal
          book={editingBook}
          onSubmit={handleAddBook}
          onCancel={() => {
            setShowBookForm(false)
            setEditingBook(null)
          }}
        />
      )}

      {showReadingForm && (
        <ReadingFormModal
          reading={editingReading}
          books={books}
          onSubmit={handleAddReading}
          onCancel={() => {
            setShowReadingForm(false)
            setEditingReading(null)
          }}
        />
      )}
    </div>
  )
}
