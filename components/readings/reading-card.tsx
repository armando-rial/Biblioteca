"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, Star, Calendar } from "lucide-react"
import type { Reading } from "@/lib/hooks/use-readings"
import type { Book } from "@/lib/hooks/use-books"
import { Badge } from "@/components/ui/badge"

interface ReadingCardProps {
  reading: Reading
  book: Book
  onEdit: (reading: Reading) => void
  onDelete: (id: string) => void
}

export function ReadingCard({ reading, book, onEdit, onDelete }: ReadingCardProps) {
  const startDate = new Date(reading.start_date).toLocaleDateString("pt-BR")
  const endDate = reading.end_date ? new Date(reading.end_date).toLocaleDateString("pt-BR") : "-"
  const isCompleted = reading.status === "concluido"

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <CardTitle className="truncate text-lg">{book.title}</CardTitle>
            <p className="text-sm text-muted-foreground truncate">{book.author}</p>
          </div>
          <Badge variant={isCompleted ? "default" : "secondary"}>{isCompleted ? "Concluído" : "Em andamento"}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <p className="text-xs text-muted-foreground">Início</p>
            <p className="text-sm font-medium flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {startDate}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Fim</p>
            <p className="text-sm font-medium flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {endDate}
            </p>
          </div>
        </div>

        {reading.rating && (
          <div>
            <p className="text-xs text-muted-foreground">Avaliação</p>
            <div className="flex items-center gap-1">
              {Array.from({ length: reading.rating }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-primary text-primary" />
              ))}
            </div>
          </div>
        )}

        {reading.notes && (
          <div>
            <p className="text-xs text-muted-foreground">Notas</p>
            <p className="text-sm line-clamp-2">{reading.notes}</p>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Button onClick={() => onEdit(reading)} variant="outline" size="sm" className="flex-1 gap-2">
            <Edit className="h-4 w-4" />
            Editar
          </Button>
          <Button onClick={() => onDelete(reading.id)} variant="destructive" size="sm" className="gap-2">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
