"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Book, Reading } from "@/app/page"

interface ReadingFormProps {
  reading?: Reading | null
  books: Book[]
  onSubmit: (reading: Omit<Reading, "id" | "createdAt">) => void
  onCancel: () => void
}

export function ReadingForm({ reading, books, onSubmit, onCancel }: ReadingFormProps) {
  const [formData, setFormData] = useState({
    bookId: "",
    startDate: "",
    endDate: "",
    status: "em-andamento" as "em-andamento" | "concluido",
    notes: "",
    rating: 0,
  })

  useEffect(() => {
    if (reading) {
      setFormData({
        bookId: reading.bookId,
        startDate: reading.startDate.toISOString().split("T")[0],
        endDate: reading.endDate ? reading.endDate.toISOString().split("T")[0] : "",
        status: reading.status,
        notes: reading.notes,
        rating: reading.rating || 0,
      })
    }
  }, [reading])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.bookId || !formData.startDate) return

    const readingData: Omit<Reading, "id" | "createdAt"> = {
      bookId: formData.bookId,
      startDate: new Date(formData.startDate),
      endDate: formData.endDate ? new Date(formData.endDate) : undefined,
      status: formData.status,
      notes: formData.notes,
      rating: formData.rating > 0 ? formData.rating : undefined,
    }

    onSubmit(readingData)
  }

  const handleStatusChange = (status: "em-andamento" | "concluido") => {
    setFormData((prev) => ({
      ...prev,
      status,
      endDate: status === "concluido" && !prev.endDate ? new Date().toISOString().split("T")[0] : prev.endDate,
    }))
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{reading ? "Editar Leitura" : "Nova Leitura"}</CardTitle>
              <CardDescription>
                {reading ? "Atualize o registro da sua leitura" : "Registre uma nova leitura"}
              </CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={onCancel}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="book">Livro *</Label>
              <Select
                value={formData.bookId}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, bookId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um livro" />
                </SelectTrigger>
                <SelectContent>
                  {books.map((book) => (
                    <SelectItem key={book.id} value={book.id}>
                      {book.title} - {book.author}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="startDate">Data de Início *</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData((prev) => ({ ...prev, startDate: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select value={formData.status} onValueChange={handleStatusChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="em-andamento">Em andamento</SelectItem>
                  <SelectItem value="concluido">Concluído</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.status === "concluido" && (
              <div className="space-y-2">
                <Label htmlFor="endDate">Data de Término</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData((prev) => ({ ...prev, endDate: e.target.value }))}
                />
              </div>
            )}

            {formData.status === "concluido" && (
              <div className="space-y-2">
                <Label>Avaliação</Label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, rating: star }))}
                      className={`p-1 rounded ${
                        star <= formData.rating ? "text-yellow-500" : "text-muted-foreground hover:text-yellow-400"
                      }`}
                    >
                      <Star className={`h-5 w-5 ${star <= formData.rating ? "fill-current" : ""}`} />
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="notes">Notas Pessoais</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                placeholder="Suas impressões sobre o livro..."
                rows={3}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" className="flex-1">
                {reading ? "Atualizar" : "Registrar"} Leitura
              </Button>
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
