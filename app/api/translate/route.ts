import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import Groq from "groq-sdk"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });


export async function POST(request: Request) {
  try {
    const { text, targetLanguage } = await request.json()
    
    // Map language codes to full names for clearer prompt
    const languageMap: { [key: string]: string } = {
      es: "Spanish",
      ko: "Korean (don't use 입니다, 습니다, or 요)",
      fr: "French",
      de: "German",
      it: "Italian",
      pt: "Portuguese",
      ru: "Russian",
      ja: "Japanese",
      zh: "Chinese (Simplified)",
      kh: "Khmer",
    }

    const completion = await groq.chat.completions.create({
      // model: "gpt-3.5-turbo",
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "You are a professional translator. Translate the given text accurately while maintaining its meaning and tone. Only respond with the translation, nothing else."
        },
        {
          role: "user",
          content: `Translate this text to ${languageMap[targetLanguage]}: "${text}"`
        }
      ],
      temperature: 0.3,
    })

    const translatedText = completion.choices[0]?.message?.content || ''

    return NextResponse.json({ translatedText })
  } catch (error) {
    console.error('Translation error:', error)
    return NextResponse.json(
      { error: 'Translation failed' },
      { status: 500 }
    )
  }
}