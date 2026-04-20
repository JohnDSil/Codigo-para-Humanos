import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getSystemPrompt, buildUserPrompt, Level, Mode } from "@/lib/prompts";
import { parseExplanationResponse } from "@/lib/parseResponse";

// 1. Verificación de seguridad de la variable de entorno
const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

if (!apiKey) {
  console.error("ERROR CRÍTICO: La variable GOOGLE_GENERATIVE_AI_API_KEY no está definida en el entorno de Vercel.");
}

// Inicialización segura del cliente
const genAI = new GoogleGenerativeAI(apiKey || "");

export async function POST(req: NextRequest) {
  try {
    // 2. Verificar existencia de la API Key en tiempo de ejecución
    if (!apiKey) {
      return NextResponse.json(
        { error: "Error de configuración: API Key no encontrada en el servidor." },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { code, level, language = "auto", mode = "explicar" } = body;

    if (!code || typeof code !== "string" || code.trim().length === 0) {
      return NextResponse.json({ error: "No se proporcionó código." }, { status: 400 });
    }

    const systemInstruction = getSystemPrompt(level as Level, mode as Mode);
    const userPrompt = buildUserPrompt(code, language, mode as Mode);

    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: systemInstruction, 
    });

    const result = await model.generateContent(userPrompt);
    const responseText = result.response.text();

    const parsed = parseExplanationResponse(responseText);

    if (!parsed) {
      console.error("Error de parseo. Respuesta cruda de la IA:", responseText);
      return NextResponse.json(
        { error: "No se pudo parsear la respuesta de la IA." },
        { status: 500 }
      );
    }

    return NextResponse.json(parsed, { status: 200 });

  } catch (error: any) {
    console.error("Error en la API de Gemini:", error.message);
    return NextResponse.json(
      { error: "Error interno del servidor: " + error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ estado: "ok", version: "2.0.0-gemini" });
}
