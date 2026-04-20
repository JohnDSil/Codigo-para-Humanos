// lib/parseResponse.ts
// Parsea de forma segura la respuesta JSON de Claude en una estructura tipada
// Claude tiene instrucciones de devolver solo JSON, pero sanitizamos por si acaso

export interface ExplanationResult {
  simple: string;
  tecnico: string;
  mejoras: string[];
  lenguajeDetectado: string;
}

export function parseExplanationResponse(
  raw: string
): ExplanationResult | null {
  try {
    // Eliminar backticks de markdown si Claude los incluyó a pesar de las instrucciones
    const cleaned = raw
      .trim()
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    const parsed = JSON.parse(cleaned);

    // Validar campos requeridos
    if (
      typeof parsed.simple !== "string" ||
      typeof parsed.tecnico !== "string" ||
      !Array.isArray(parsed.mejoras)
    ) {
      console.error("La respuesta parseada no tiene los campos requeridos:", parsed);
      return null;
    }

    return {
      simple: parsed.simple,
      tecnico: parsed.tecnico,
      mejoras: parsed.mejoras
        .filter((i: unknown) => typeof i === "string")
        .slice(0, 6), // máximo 6 sugerencias
      lenguajeDetectado: parsed.lenguajeDetectado ?? "desconocido",
    };
  } catch (err) {
    console.error("Error al parsear la respuesta de Claude como JSON:", err);
    console.error("La respuesta recibida fue:", raw);
    return null;
  }
}
