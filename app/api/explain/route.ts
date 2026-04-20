// app/api/explain/route.ts
// Endpoint principal — recibe código + opciones, llama a Claude, devuelve explicación estructurada
// Añade esto justo al empezar el POST
if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
  console.error("ERROR CRÍTICO: La variable GOOGLE_GENERATIVE_AI_API_KEY no está definida en Vercel");
}

import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getSystemPrompt, buildUserPrompt, Level, Mode } from "@/lib/prompts";
import { parseExplanationResponse } from "@/lib/parseResponse";

// Inicializamos el cliente de Gemini
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code, level, language = "auto", mode = "explicar" } = body;

    // Validaciones (mantienen tu lógica original)
    if (!code || typeof code !== "string" || code.trim().length === 0) {
      return NextResponse.json({ error: "No se proporcionó código." }, { status: 400 });
    }

    // 1. Construir prompts
    const systemInstruction = getSystemPrompt(level as Level, mode as Mode);
    const userPrompt = buildUserPrompt(code, language, mode as Mode);

    // 2. Configurar modelo (usamos gemini-1.5-flash por ser rápido y eficiente)
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: systemInstruction, 
    });

    // 3. Generar respuesta
    const result = await model.generateContent(userPrompt);
    const responseText = result.response.text();

    // 4. Parsear salida (usa tu función original de parseResponse.ts)
    const parsed = parseExplanationResponse(responseText);

    if (!parsed) {
      return NextResponse.json(
        { error: "No se pudo parsear la respuesta de la IA." },
        { status: 500 }
      );
    }

    return NextResponse.json(parsed, { status: 200 });

  } catch (error) {
    console.error("Error en la API de Gemini:", error);
    return NextResponse.json(
      { error: "Error interno del servidor." },
      { status: 500 }
    );
  }
}
