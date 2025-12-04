"use client"

import { Edit, Trash2, BookOpen, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Book, Reading } from "@/app/page"

interface BookCardProps {
  book: Book
  readings: Reading[]
  onEdit: (book: Book) => void
  onDelete: (bookId: string) => void
}

export function BookCard({ book, readings, onEdit, onDelete }: BookCardProps) {
  const currentReading = readings.find((r) => r.status === "em-andamento")
  const completedReadings = readings.filter((r) => r.status === "concluido")

  const handleDelete = () => {
    if (confirm("Tem certeza que deseja excluir este livro? Todas as leituras relacionadas também serão removidas.")) {
      onDelete(book.id)
    }
  }

  return (
    <Card className="group hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg leading-tight text-balance">{book.title}</CardTitle>
            <CardDescription className="mt-1">por {book.author}</CardDescription>
          </div>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button variant="ghost" size="icon" onClick={() => onEdit(book)} className="h-8 w-8">
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              className="h-8 w-8 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          {book.genre && <Badge variant="secondary">{book.genre}</Badge>}
          {book.pages > 0 && (
            <span className="text-muted-foreground flex items-center gap-1">
              <BookOpen className="h-3 w-3" />
              {book.pages} páginas
            </span>
          )}
        </div>

        <div className="space-y-2">
          {currentReading && (
            <div className="flex items-center gap-2 text-sm">
              <Badge variant="default" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                Lendo agora
              </Badge>
              <span className="text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                desde {currentReading.startDate.toLocaleDateString("pt-BR")}
              </span>
            </div>
          )}

          {completedReadings.length > 0 && (
            <div className="text-sm text-muted-foreground">
              Lido {completedReadings.length} vez{completedReadings.length > 1 ? "es" : ""}
            </div>
          )}

          {readings.length === 0 && <div className="text-sm text-muted-foreground">Ainda não foi lido</div>}
        </div>
      </CardContent>
    </Card>
  )
}
