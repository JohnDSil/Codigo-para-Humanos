// app/api/explain/route.ts
// Endpoint principal — recibe código + opciones, llama a Claude, devuelve explicación estructurada

import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getSystemPrompt, buildUserPrompt, Level, Mode } from "@/lib/prompts";
import { parseExplanationResponse } from "@/lib/parseResponse";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    // ── 1. Parsear y validar entrada ─────────────────────────────────────
    const body = await req.json();
    const { code, level, language = "auto", mode = "explicar" } = body;

    if (!code || typeof code !== "string" || code.trim().length === 0) {
      return NextResponse.json(
        { error: "No se proporcionó código. Por favor incluye un campo 'code'." },
        { status: 400 }
      );
    }

    if (!level || !["nino", "junior", "senior"].includes(level)) {
      return NextResponse.json(
        { error: "Nivel inválido. Debe ser 'nino', 'junior' o 'senior'." },
        { status: 400 }
      );
    }

    if (!["explicar", "depurar"].includes(mode)) {
      return NextResponse.json(
        { error: "Modo inválido. Debe ser 'explicar' o 'depurar'." },
        { status: 400 }
      );
    }

    if (code.trim().length > 10000) {
      return NextResponse.json(
        { error: "El fragmento de código es demasiado largo. Máximo 10.000 caracteres." },
        { status: 400 }
      );
    }

    // ── 2. Construir prompts ──────────────────────────────────────────────
    const systemPrompt = getSystemPrompt(level as Level, mode as Mode);
    const userPrompt = buildUserPrompt(code, language, mode as Mode);

    // ── 3. Llamar a Claude ────────────────────────────────────────────────
    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: userPrompt,
        },
      ],
    });

    // ── 4. Extraer texto de la respuesta ──────────────────────────────────
    const rawText = response.content
      .filter((block) => block.type === "text")
      .map((block) => (block as { type: "text"; text: string }).text)
      .join("");

    // ── 5. Parsear salida estructurada ────────────────────────────────────
    const parsed = parseExplanationResponse(rawText);

    if (!parsed) {
      return NextResponse.json(
        { error: "No se pudo parsear la respuesta de la IA. Por favor inténtalo de nuevo." },
        { status: 500 }
      );
    }

    return NextResponse.json(parsed, { status: 200 });
  } catch (error: unknown) {
    console.error("Error en la API:", error);

    // Errores de la API de Anthropic
    if (
      error &&
      typeof error === "object" &&
      "status" in error &&
      (error as { status: number }).status === 401
    ) {
      return NextResponse.json(
        { error: "API key inválida. Revisa tu ANTHROPIC_API_KEY." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Error interno del servidor. Por favor inténtalo de nuevo." },
      { status: 500 }
    );
  }
}

// Health check
export async function GET() {
  return NextResponse.json({ estado: "ok", version: "1.0.0" });
}
