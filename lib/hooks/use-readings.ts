import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export interface Reading {
  id: string
  user_id: string
  book_id: string
  status: "em-andamento" | "concluido"
  start_date: string
  end_date: string | null
  notes: string | null
  rating: number | null
  pages_read: number | null
  created_at: string
  updated_at: string
  books?: {
    id: string
    title: string
    author: string
    pages: number | null
  }
}

export function useReadings() {
  const { data, error, isLoading, mutate } = useSWR<Reading[]>("/api/readings", fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 5000,
  })

  const addReading = async (reading: Omit<Reading, "id" | "user_id" | "created_at" | "updated_at">) => {
    try {
      const response = await fetch("/api/readings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reading),
      })
      const result = await response.json()
      await mutate()
      return result
    } catch (error) {
      console.error("Error adding reading:", error)
      throw error
    }
  }

  const updateReading = async (
    id: string,
    reading: Partial<Omit<Reading, "id" | "user_id" | "created_at" | "updated_at">>,
  ) => {
    try {
      const response = await fetch(`/api/readings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reading),
      })
      const result = await response.json()
      await mutate()
      return result
    } catch (error) {
      console.error("Error updating reading:", error)
      throw error
    }
  }

  const deleteReading = async (id: string) => {
    try {
      await fetch(`/api/readings/${id}`, {
        method: "DELETE",
      })
      await mutate()
    } catch (error) {
      console.error("Error deleting reading:", error)
      throw error
    }
  }

  return {
    readings: data || [],
    isLoading,
    error,
    addReading,
    updateReading,
    deleteReading,
  }
}
