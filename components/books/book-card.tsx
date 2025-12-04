"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"
import type { Book } from "@/lib/hooks/use-books"

interface BookCardProps {
  book: Book
  onEdit: (book: Book) => void
  onDelete: (id: string) => void
}

export function BookCard({ book, onEdit, onDelete }: BookCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <CardTitle className="truncate text-lg">{book.title}</CardTitle>
            <p className="text-sm text-muted-foreground truncate">{book.author}</p>
          </div>
          {book.cover_image_url && (
            <img
              src={book.cover_image_url || "/placeholder.svg"}
              alt={book.title}
              className="w-12 h-16 object-cover rounded"
            />
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {book.genre && (
          <div>
            <p className="text-xs text-muted-foreground">Gênero</p>
            <p className="text-sm font-medium">{book.genre}</p>
          </div>
        )}
        {book.pages && (
          <div>
            <p className="text-xs text-muted-foreground">Páginas</p>
            <p className="text-sm font-medium">{book.pages}</p>
          </div>
        )}
        {book.synopsis && (
          <div>
            <p className="text-xs text-muted-foreground">Sinopse</p>
            <p className="text-sm line-clamp-2">{book.synopsis}</p>
          </div>
        )}
        <div className="flex gap-2 pt-2">
          <Button onClick={() => onEdit(book)} variant="outline" size="sm" className="flex-1 gap-2">
            <Edit className="h-4 w-4" />
            Editar
          </Button>
          <Button onClick={() => onDelete(book.id)} variant="destructive" size="sm" className="gap-2">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
