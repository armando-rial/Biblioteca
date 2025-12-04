import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export interface Book {
  id: string
  user_id: string
  title: string
  author: string
  genre: string | null
  pages: number | null
  isbn: string | null
  cover_image_url: string | null
  synopsis: string | null
  created_at: string
  updated_at: string
}

export function useBooks() {
  const { data, error, isLoading, mutate } = useSWR<Book[]>("/api/books", fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 5000,
  })

  const addBook = async (book: Omit<Book, "id" | "user_id" | "created_at" | "updated_at">) => {
    try {
      const response = await fetch("/api/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(book),
      })
      const result = await response.json()
      await mutate()
      return result
    } catch (error) {
      console.error("Error adding book:", error)
      throw error
    }
  }

  const updateBook = async (id: string, book: Partial<Omit<Book, "id" | "user_id" | "created_at" | "updated_at">>) => {
    try {
      const response = await fetch(`/api/books/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(book),
      })
      const result = await response.json()
      await mutate()
      return result
    } catch (error) {
      console.error("Error updating book:", error)
      throw error
    }
  }

  const deleteBook = async (id: string) => {
    try {
      await fetch(`/api/books/${id}`, {
        method: "DELETE",
      })
      await mutate()
    } catch (error) {
      console.error("Error deleting book:", error)
      throw error
    }
  }

  return {
    books: data || [],
    isLoading,
    error,
    addBook,
    updateBook,
    deleteBook,
  }
}
