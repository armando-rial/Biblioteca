"use client"

import { Edit, Trash2, Calendar, Star, BookOpen, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Book, Reading } from "@/app/page"

interface ReadingCardProps {
  reading: Reading
  book: Book
  onEdit: (reading: Reading) => void
  onDelete: (readingId: string) => void
}

export function ReadingCard({ reading, book, onEdit, onDelete }: ReadingCardProps) {
  const handleDelete = () => {
    if (confirm("Tem certeza que deseja excluir este registro de leitura?")) {
      onDelete(reading.id)
    }
  }

  const getDaysReading = () => {
    const endDate = reading.endDate || new Date()
    const diffTime = Math.abs(endDate.getTime() - reading.startDate.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
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
            <Button variant="ghost" size="icon" onClick={() => onEdit(reading)} className="h-8 w-8">
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
        <div className="flex items-center justify-between">
          <Badge
            variant={reading.status === "concluido" ? "default" : "secondary"}
            className={
              reading.status === "concluido"
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
            }
          >
            {reading.status === "concluido" ? "Concluído" : "Em andamento"}
          </Badge>

          {book.genre && <Badge variant="outline">{book.genre}</Badge>}
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>Início: {reading.startDate.toLocaleDateString("pt-BR")}</span>
          </div>

          {reading.endDate && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>Término: {reading.endDate.toLocaleDateString("pt-BR")}</span>
            </div>
          )}

          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>
              {getDaysReading()} dias {reading.status === "em-andamento" ? "lendo" : "de leitura"}
            </span>
          </div>

          {book.pages > 0 && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <BookOpen className="h-3 w-3" />
              <span>{book.pages} páginas</span>
            </div>
          )}
        </div>

        {reading.rating && reading.rating > 0 && (
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-4 w-4 ${
                  star <= reading.rating! ? "text-yellow-500 fill-current" : "text-muted-foreground"
                }`}
              />
            ))}
          </div>
        )}

        {reading.notes && (
          <div className="pt-2 border-t">
            <p className="text-sm text-muted-foreground line-clamp-3">{reading.notes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
