import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const formData = await request.formData()
  const file = formData.get("file") as File

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 })
  }

  // Generate unique filename
  const ext = file.name.split(".").pop()
  const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${ext}`
  const filePath = `${user.id}/${fileName}`

  // Upload to Supabase Storage
  const { data, error } = await supabase.storage.from("book_covers").upload(filePath, file, {
    cacheControl: "3600",
    upsert: false,
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Get public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from("book_covers").getPublicUrl(filePath)

  return NextResponse.json({ url: publicUrl, path: filePath })
}
