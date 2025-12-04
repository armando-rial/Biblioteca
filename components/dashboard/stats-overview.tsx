"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, TrendingUp, Clock, Star } from "lucide-react"
import type { Book } from "@/lib/hooks/use-books"
import type { Reading } from "@/lib/hooks/use-readings"

interface StatsOverviewProps {
  books: Book[]
  readings: Reading[]
}

export function StatsOverview({ books, readings }: StatsOverviewProps) {
  const totalBooks = books.length
  const completedReadings = readings.filter((r) => r.status === "concluido").length
  const inProgressReadings = readings.filter((r) => r.status === "em-andamento").length

  const averageRating =
    readings.length > 0 ? (readings.reduce((sum, r) => sum + (r.rating || 0), 0) / readings.length).toFixed(1) : 0

  const totalPages = books.reduce((sum, book) => sum + (book.pages || 0), 0)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Livros</CardTitle>
          <BookOpen className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalBooks}</div>
          <p className="text-xs text-muted-foreground">livros na biblioteca</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Livros Concluídos</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{completedReadings}</div>
          <p className="text-xs text-muted-foreground">leituras concluídas</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Em Andamento</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{inProgressReadings}</div>
          <p className="text-xs text-muted-foreground">leituras em progresso</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avaliação Média</CardTitle>
          <Star className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{averageRating}</div>
          <p className="text-xs text-muted-foreground">de 5 estrelas</p>
        </CardContent>
      </Card>
    </div>
  )
}
