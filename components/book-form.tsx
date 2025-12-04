"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Book } from "@/app/page"

interface BookFormProps {
  book?: Book | null
  onSubmit: (book: Omit<Book, "id" | "createdAt">) => void
  onCancel: () => void
}

export function BookForm({ book, onSubmit, onCancel }: BookFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    genre: "",
    pages: 0,
  })

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title,
        author: book.author,
        genre: book.genre,
        pages: book.pages,
      })
    }
  }, [book])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim() || !formData.author.trim()) return

    onSubmit(formData)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{book ? "Editar Livro" : "Novo Livro"}</CardTitle>
              <CardDescription>
                {book ? "Atualize as informações do livro" : "Adicione um novo livro à sua biblioteca"}
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
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Digite o título do livro"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="author">Autor *</Label>
              <Input
                id="author"
                value={formData.author}
                onChange={(e) => setFormData((prev) => ({ ...prev, author: e.target.value }))}
                placeholder="Digite o nome do autor"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="genre">Gênero</Label>
              <Input
                id="genre"
                value={formData.genre}
                onChange={(e) => setFormData((prev) => ({ ...prev, genre: e.target.value }))}
                placeholder="Ex: Romance, Ficção, Biografia"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pages">Número de Páginas</Label>
              <Input
                id="pages"
                type="number"
                min="1"
                value={formData.pages || ""}
                onChange={(e) => setFormData((prev) => ({ ...prev, pages: Number.parseInt(e.target.value) || 0 }))}
                placeholder="Digite o número de páginas"
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" className="flex-1">
                {book ? "Atualizar" : "Adicionar"} Livro
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
