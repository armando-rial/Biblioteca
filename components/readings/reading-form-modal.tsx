"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import type { Book } from "@/lib/hooks/use-books"
import type { Reading } from "@/lib/hooks/use-readings"

interface ReadingFormModalProps {
  reading: Reading | null
  books: Book[]
  onSubmit: (data: any) => Promise<void>
  onCancel: () => void
}

export function ReadingFormModal({ reading, books, onSubmit, onCancel }: ReadingFormModalProps) {
  const [formData, setFormData] = useState({
    book_id: "",
    status: "em-andamento" as const,
    start_date: "",
    end_date: "",
    notes: "",
    rating: "",
    pages_read: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (reading) {
      setFormData({
        book_id: reading.book_id,
        status: reading.status,
        start_date: reading.start_date,
        end_date: reading.end_date || "",
        notes: reading.notes || "",
        rating: reading.rating?.toString() || "",
        pages_read: reading.pages_read?.toString() || "",
      })
    }
  }, [reading])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await onSubmit({
        ...formData,
        rating: formData.rating ? Number.parseInt(formData.rating) : null,
        pages_read: formData.pages_read ? Number.parseInt(formData.pages_read) : null,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{reading ? "Editar Leitura" : "Registrar Nova Leitura"}</DialogTitle>
          <DialogDescription>
            {reading ? "Atualize as informações da leitura" : "Registre um novo livro que está lendo ou já leu"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="book_id">Livro *</Label>
              <Select value={formData.book_id} onValueChange={(value) => handleSelectChange("book_id", value)}>
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
              <Label>Status *</Label>
              <RadioGroup value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="em-andamento" id="status-in-progress" />
                  <Label htmlFor="status-in-progress" className="font-normal cursor-pointer">
                    Em andamento
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="concluido" id="status-completed" />
                  <Label htmlFor="status-completed" className="font-normal cursor-pointer">
                    Concluído
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="start_date">Data de Início *</Label>
              <Input
                id="start_date"
                name="start_date"
                type="date"
                value={formData.start_date}
                onChange={handleInputChange}
                required
              />
            </div>

            {formData.status === "concluido" && (
              <div className="space-y-2">
                <Label htmlFor="end_date">Data de Conclusão</Label>
                <Input
                  id="end_date"
                  name="end_date"
                  type="date"
                  value={formData.end_date}
                  onChange={handleInputChange}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="pages_read">Páginas Lidas</Label>
              <Input
                id="pages_read"
                name="pages_read"
                type="number"
                value={formData.pages_read}
                onChange={handleInputChange}
                placeholder="Número de páginas lidas"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rating">Avaliação (1-5 estrelas)</Label>
              <Select value={formData.rating} onValueChange={(value) => handleSelectChange("rating", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma avaliação" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Sem avaliação</SelectItem>
                  <SelectItem value="1">⭐ 1 estrela</SelectItem>
                  <SelectItem value="2">⭐ 2 estrelas</SelectItem>
                  <SelectItem value="3">⭐ 3 estrelas</SelectItem>
                  <SelectItem value="4">⭐ 4 estrelas</SelectItem>
                  <SelectItem value="5">⭐ 5 estrelas</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notas Pessoais</Label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Suas impressões, reflexões ou comentários sobre o livro"
                rows={3}
              />
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
