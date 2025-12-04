"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useStorage } from "@/lib/hooks/use-storage"
import type { Book } from "@/lib/hooks/use-books"

interface BookFormModalProps {
  book: Book | null
  onSubmit: (data: any) => Promise<void>
  onCancel: () => void
}

export function BookFormModal({ book, onSubmit, onCancel }: BookFormModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    genre: "",
    pages: "",
    isbn: "",
    synopsis: "",
    cover_image_url: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const { uploadCover, isUploading } = useStorage()

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title || "",
        author: book.author || "",
        genre: book.genre || "",
        pages: book.pages?.toString() || "",
        isbn: book.isbn || "",
        synopsis: book.synopsis || "",
        cover_image_url: book.cover_image_url || "",
      })
    }
  }, [book])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      try {
        const url = await uploadCover(file)
        setFormData((prev) => ({
          ...prev,
          cover_image_url: url,
        }))
      } catch (error) {
        console.error("Error uploading cover:", error)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await onSubmit({
        ...formData,
        pages: formData.pages ? Number.parseInt(formData.pages) : null,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{book ? "Editar Livro" : "Novo Livro"}</DialogTitle>
          <DialogDescription>
            {book ? "Atualize as informações do livro" : "Adicione um novo livro à sua biblioteca"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Título do livro"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="author">Autor *</Label>
              <Input
                id="author"
                name="author"
                value={formData.author}
                onChange={handleInputChange}
                placeholder="Nome do autor"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="genre">Gênero</Label>
              <Input
                id="genre"
                name="genre"
                value={formData.genre}
                onChange={handleInputChange}
                placeholder="ex: Romance, Ficção Científica, Mistério"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pages">Páginas</Label>
              <Input
                id="pages"
                name="pages"
                type="number"
                value={formData.pages}
                onChange={handleInputChange}
                placeholder="Número de páginas"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="isbn">ISBN</Label>
              <Input
                id="isbn"
                name="isbn"
                value={formData.isbn}
                onChange={handleInputChange}
                placeholder="ISBN do livro"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="synopsis">Sinopse</Label>
              <Textarea
                id="synopsis"
                name="synopsis"
                value={formData.synopsis}
                onChange={handleInputChange}
                placeholder="Descrição ou resumo do livro"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cover">Capa do Livro</Label>
              <div className="flex items-center gap-2">
                <Input id="cover" type="file" accept="image/*" onChange={handleImageUpload} disabled={isUploading} />
                {isUploading && <span className="text-sm text-muted-foreground">Carregando...</span>}
              </div>
              {formData.cover_image_url && (
                <img
                  src={formData.cover_image_url || "/placeholder.svg"}
                  alt="Capa"
                  className="w-24 h-36 object-cover rounded"
                />
              )}
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
