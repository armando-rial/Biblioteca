"use client"

import { BookOpen, Clock, CheckCircle, Star } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Book, Reading } from "@/app/page"

interface StatsCardsProps {
  books: Book[]
  readings: Reading[]
}

export function StatsCards({ books, readings }: StatsCardsProps) {
  const currentlyReading = readings.filter((r) => r.status === "em-andamento").length
  const completedReadings = readings.filter((r) => r.status === "concluido").length
  const totalPages = readings
    .filter((r) => r.status === "concluido")
    .reduce((total, reading) => {
      const book = books.find((b) => b.id === reading.bookId)
      return total + (book?.pages || 0)
    }, 0)

  const averageRating = readings
    .filter((r) => r.rating && r.rating > 0)
    .reduce((sum, reading, _, arr) => {
      return sum + reading.rating! / arr.length
    }, 0)

  const stats = [
    {
      title: "Total de Livros",
      value: books.length,
      description: "na sua biblioteca",
      icon: BookOpen,
      color: "text-blue-600",
    },
    {
      title: "Lendo Agora",
      value: currentlyReading,
      description: "leituras em andamento",
      icon: Clock,
      color: "text-orange-600",
    },
    {
      title: "Livros Concluídos",
      value: completedReadings,
      description: "leituras finalizadas",
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      title: "Páginas Lidas",
      value: totalPages.toLocaleString("pt-BR"),
      description: "total de páginas",
      icon: BookOpen,
      color: "text-purple-600",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}

      {averageRating > 0 && (
        <Card className="md:col-span-2 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avaliação Média</CardTitle>
            <Star className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageRating.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">de 5 estrelas</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
