import { generateText } from "ai"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    const systemPrompt = `Anda adalah asisten chatbot untuk sistem pakar penentuan jurusan kuliah. 
    Anda membantu siswa dengan:
    1. Menjawab pertanyaan tentang berbagai jurusan kuliah
    2. Memberikan saran tentang karir dan prospek kerja
    3. Menjelaskan proses tes minat dan bakat
    4. Memberikan motivasi dan bimbingan akademik
    
    Selalu berikan jawaban dalam bahasa Indonesia yang ramah dan membantu.`

    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      system: systemPrompt,
      prompt: message,
      maxTokens: 500,
    })

    return NextResponse.json({ response: text })
  } catch (error) {
    console.error("Error in chat:", error)
    return NextResponse.json({ error: "Failed to process chat message" }, { status: 500 })
  }
}
