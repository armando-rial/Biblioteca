"use client"

import { createClient } from "@/lib/supabase/client"
import { useState } from "react"

export function useStorage() {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const uploadCover = async (file: File) => {
    setIsUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Upload failed")
      }

      const data = await response.json()
      return data.url
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Upload failed"
      setError(errorMessage)
      throw err
    } finally {
      setIsUploading(false)
    }
  }

  const deleteFile = async (path: string) => {
    const supabase = createClient()

    try {
      const { error } = await supabase.storage.from("book_covers").remove([path])

      if (error) throw error
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Delete failed"
      setError(errorMessage)
      throw err
    }
  }

  return {
    uploadCover,
    deleteFile,
    isUploading,
    error,
  }
}
