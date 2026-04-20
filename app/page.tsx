"use client";

import { useState } from "react";

type Level = "nino" | "junior" | "senior";
type Mode = "explicar" | "depurar";

interface ExplanationResult {
  simple: string;
  tecnico: string;
  mejoras: string[];
  lenguajeDetectado: string;
}

const NIVELES: { value: Level; label: string; desc: string }[] = [
  { value: "nino", label: "Niño 🍼", desc: "Analogías simples, cero jerga" },
  { value: "junior", label: "Junior 🧑‍💻", desc: "Contexto y buenas prácticas" },
  { value: "senior", label: "Senior ⚡", desc: "Análisis profundo y trade-offs" },
];

const MODOS: { value: Mode; label: string }[] = [
  { value: "explicar", label: "💡 Explicar" },
  { value: "depurar", label: "🐛 Depurar" },
];

const LENGUAJES = [
  "auto", "python", "javascript", "typescript", "go",
  "rust", "java", "c", "cpp", "ruby", "php", "swift", "kotlin", "bash", "sql",
];

const EJEMPLOS = [
  {
    label: "Fibonacci (Python)",
    code: `def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)`,
    language: "python",
  },
  {
    label: "Reduce (JS)",
    code: `const total = arr.reduce((acc, val) => acc + val, 0);`,
    language: "javascript",
  },
  {
    label: "Goroutine (Go)",
    code: `go func() {
    defer wg.Done()
    result <- heavyComputation()
}()`,
    language: "go",
  },
];

export default function Home() {
  const [code, setCode] = useState("");
  const [level, setLevel] = useState<Level>("junior");
  const [mode, setMode] = useState<Mode>("explicar");
  const [language, setLanguage] = useState("auto");
  const [resultado, setResultado] = useState<ExplanationResult | null>(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [historial, setHistorial] = useState<
    { code: string; level: Level; mode: Mode; result: ExplanationResult; lenguaje: string }[]
  >([]);

  async function analizar() {
    if (!code.trim()) return;
    setCargando(true);
    setError(null);
    setResultado(null);

    try {
      const res = await fetch("/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, level, language, mode }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Error desconocido");
        return;
      }
      setResultado(data);
      setHistorial((prev) => [
        { code, level, mode, result: data, lenguaje: data.lenguajeDetectado },
        ...prev.slice(0, 9),
      ]);
    } catch {
      setError("No se pudo conectar con el servidor.");
    } finally {
      setCargando(false);
    }
  }

  function cargarEjemplo(ej: (typeof EJEMPLOS)[0]) {
    setCode(ej.code);
    setLanguage(ej.language);
    setResultado(null);
    setError(null);
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0f0f0f", color: "#f0f0f0" }}>
      {/* Header */}
      <header style={{
        borderBottom: "1px solid #2a2a2a",
        padding: "1.5rem 2rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "1.4rem", fontWeight: 700, letterSpacing: "-0.02em" }}>
            🧠 code-for-humans
          </h1>
          <p style={{ margin: "4px 0 0", fontSize: "0.8rem", color: "#888" }}>
            Pega cualquier código. Entiéndelo al instante.
          </p>
        </div>
        <span style={{
          fontSize: "0.7rem",
          padding: "4px 10px",
          border: "1px solid #f0e040",
          color: "#f0e040",
          borderRadius: "4px",
          fontFamily: "monospace",
        }}>
          v1.0.0
        </span>
      </header>

      <main style={{ maxWidth: "1100px", margin: "0 auto", padding: "2rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "2rem" }}>

          {/* Columna izquierda */}
          <div>
            {/* Ejemplos rápidos */}
            <div style={{ marginBottom: "1.2rem" }}>
              <p style={{ fontSize: "0.75rem", color: "#888", marginBottom: "8px" }}>
                EJEMPLOS RÁPIDOS
              </p>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {EJEMPLOS.map((ej) => (
                  <button
                    key={ej.label}
                    onClick={() => cargarEjemplo(ej)}
                    style={{
                      padding: "5px 12px",
                      background: "transparent",
                      border: "1px solid #2a2a2a",
                      color: "#aaa",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "0.75rem",
                      fontFamily: "monospace",
                      transition: "all 0.15s",
                    }}
                    onMouseEnter={(e) => {
                      (e.target as HTMLButtonElement).style.borderColor = "#f0e040";
                      (e.target as HTMLButtonElement).style.color = "#f0e040";
                    }}
                    onMouseLeave={(e) => {
                      (e.target as HTMLButtonElement).style.borderColor = "#2a2a2a";
                      (e.target as HTMLButtonElement).style.color = "#aaa";
                    }}
                  >
                    {ej.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Editor de código */}
            <div style={{
              border: "1px solid #2a2a2a",
              borderRadius: "8px",
              overflow: "hidden",
              marginBottom: "1rem",
            }}>
              <div style={{
                background: "#1a1a1a",
                padding: "8px 16px",
                fontSize: "0.75rem",
                color: "#888",
                borderBottom: "1px solid #2a2a2a",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}>
                <span>FRAGMENTO DE CÓDIGO</span>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  style={{
                    background: "#0f0f0f",
                    border: "1px solid #2a2a2a",
                    color: "#aaa",
                    padding: "3px 8px",
                    borderRadius: "4px",
                    fontSize: "0.75rem",
                    fontFamily: "monospace",
                    cursor: "pointer",
                  }}
                >
                  {LENGUAJES.map((l) => (
                    <option key={l} value={l}>{l === "auto" ? "🔍 auto-detectar" : l}</option>
                  ))}
                </select>
              </div>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="// Pega tu código aquí..."
                rows={14}
                style={{
                  width: "100%",
                  background: "#0d0d0d",
                  border: "none",
                  color: "#e0e0e0",
                  padding: "16px",
                  fontSize: "0.85rem",
                  lineHeight: 1.7,
                  outline: "none",
                  fontFamily: "monospace",
                }}
              />
            </div>

            {/* Controles */}
            <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem", flexWrap: "wrap" }}>
              {/* Nivel */}
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: "0.7rem", color: "#888", marginBottom: "8px" }}>NIVEL</p>
                <div style={{ display: "flex", gap: "8px" }}>
                  {NIVELES.map((n) => (
                    <button
                      key={n.value}
                      onClick={() => setLevel(n.value)}
                      title={n.desc}
                      style={{
                        flex: 1,
                        padding: "8px",
                        background: level === n.value ? "#f0e040" : "transparent",
                        border: `1px solid ${level === n.value ? "#f0e040" : "#2a2a2a"}`,
                        color: level === n.value ? "#0f0f0f" : "#aaa",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontSize: "0.78rem",
                        fontWeight: level === n.value ? 700 : 400,
                        fontFamily: "monospace",
                        transition: "all 0.15s",
                      }}
                    >
                      {n.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Modo */}
              <div>
                <p style={{ fontSize: "0.7rem", color: "#888", marginBottom: "8px" }}>MODO</p>
                <div style={{ display: "flex", gap: "8px" }}>
                  {MODOS.map((m) => (
                    <button
                      key={m.value}
                      onClick={() => setMode(m.value)}
                      style={{
                        padding: "8px 16px",
                        background: mode === m.value ? "#1e1e1e" : "transparent",
                        border: `1px solid ${mode === m.value ? "#555" : "#2a2a2a"}`,
                        color: mode === m.value ? "#f0f0f0" : "#aaa",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontSize: "0.78rem",
                        fontFamily: "monospace",
                        transition: "all 0.15s",
                      }}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Botón principal */}
            <button
              onClick={analizar}
              disabled={cargando || !code.trim()}
              style={{
                width: "100%",
                padding: "14px",
                background: cargando || !code.trim() ? "#1a1a1a" : "#f0e040",
                color: cargando || !code.trim() ? "#555" : "#0f0f0f",
                border: "none",
                borderRadius: "8px",
                fontSize: "1rem",
                fontWeight: 700,
                fontFamily: "monospace",
                cursor: cargando || !code.trim() ? "not-allowed" : "pointer",
                transition: "all 0.2s",
                letterSpacing: "0.05em",
              }}
            >
              {cargando ? "⏳ Analizando..." : "→ ANALIZAR CÓDIGO"}
            </button>

            {/* Error */}
            {error && (
              <div style={{
                marginTop: "1rem",
                padding: "12px 16px",
                background: "#1a0a0a",
                border: "1px solid #5a1a1a",
                borderRadius: "6px",
                color: "#ff6b6b",
                fontSize: "0.85rem",
                fontFamily: "monospace",
              }}>
                ⚠ {error}
              </div>
            )}

            {/* Resultado */}
            {resultado && (
              <div style={{ marginTop: "1.5rem" }}>
                {/* Badge lenguaje */}
                <div style={{ marginBottom: "1rem", display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{
                    fontSize: "0.7rem",
                    padding: "3px 10px",
                    background: "#1a1a1a",
                    border: "1px solid #2a2a2a",
                    borderRadius: "4px",
                    color: "#888",
                    fontFamily: "monospace",
                  }}>
                    {resultado.lenguajeDetectado}
                  </span>
                  <span style={{ fontSize: "0.7rem", color: "#555" }}>
                    nivel: {level} · modo: {mode}
                  </span>
                </div>

                {/* Simple */}
                <div style={{
                  background: "#111",
                  border: "1px solid #2a2a2a",
                  borderLeft: "3px solid #f0e040",
                  borderRadius: "6px",
                  padding: "16px",
                  marginBottom: "12px",
                }}>
                  <p style={{ fontSize: "0.7rem", color: "#f0e040", marginBottom: "8px", fontFamily: "monospace" }}>
                    EXPLICACIÓN SIMPLE
                  </p>
                  <p style={{ margin: 0, lineHeight: 1.7, fontSize: "0.95rem" }}>{resultado.simple}</p>
                </div>

                {/* Técnico */}
                <div style={{
                  background: "#111",
                  border: "1px solid #2a2a2a",
                  borderRadius: "6px",
                  padding: "16px",
                  marginBottom: "12px",
                }}>
                  <p style={{ fontSize: "0.7rem", color: "#888", marginBottom: "8px", fontFamily: "monospace" }}>
                    ANÁLISIS TÉCNICO
                  </p>
                  <p style={{ margin: 0, lineHeight: 1.7, fontSize: "0.9rem", color: "#ccc" }}>{resultado.tecnico}</p>
                </div>

                {/* Mejoras */}
                {resultado.mejoras.length > 0 && (
                  <div style={{
                    background: "#111",
                    border: "1px solid #2a2a2a",
                    borderRadius: "6px",
                    padding: "16px",
                  }}>
                    <p style={{ fontSize: "0.7rem", color: "#888", marginBottom: "12px", fontFamily: "monospace" }}>
                      SUGERENCIAS DE MEJORA
                    </p>
                    <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                      {resultado.mejoras.map((m, i) => (
                        <li key={i} style={{
                          display: "flex",
                          gap: "10px",
                          marginBottom: "10px",
                          fontSize: "0.88rem",
                          color: "#bbb",
                          lineHeight: 1.6,
                        }}>
                          <span style={{ color: "#f0e040", flexShrink: 0, fontFamily: "monospace" }}>
                            {String(i + 1).padStart(2, "0")}.
                          </span>
                          {m}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Columna derecha — Historial */}
          <div>
            <p style={{ fontSize: "0.7rem", color: "#888", marginBottom: "12px", fontFamily: "monospace" }}>
              HISTORIAL
            </p>
            {historial.length === 0 ? (
              <div style={{
                border: "1px dashed #2a2a2a",
                borderRadius: "8px",
                padding: "2rem",
                textAlign: "center",
                color: "#444",
                fontSize: "0.8rem",
              }}>
                Tus análisis anteriores aparecerán aquí
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {historial.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setCode(item.code);
                      setLevel(item.level);
                      setMode(item.mode);
                      setResultado(item.result);
                      setError(null);
                    }}
                    style={{
                      background: "#111",
                      border: "1px solid #2a2a2a",
                      borderRadius: "6px",
                      padding: "10px 12px",
                      textAlign: "left",
                      cursor: "pointer",
                      width: "100%",
                      transition: "border-color 0.15s",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.borderColor = "#444";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.borderColor = "#2a2a2a";
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                      <span style={{ fontSize: "0.7rem", color: "#f0e040", fontFamily: "monospace" }}>
                        {item.lenguaje}
                      </span>
                      <span style={{ fontSize: "0.65rem", color: "#555", fontFamily: "monospace" }}>
                        {item.level} · {item.mode}
                      </span>
                    </div>
                    <p style={{
                      margin: 0,
                      fontSize: "0.75rem",
                      color: "#888",
                      fontFamily: "monospace",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}>
                      {item.code.trim().slice(0, 60)}...
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        borderTop: "1px solid #1a1a1a",
        padding: "1.5rem 2rem",
        textAlign: "center",
        color: "#444",
        fontSize: "0.75rem",
        fontFamily: "monospace",
        marginTop: "4rem",
      }}>
        code-for-humans · construido con Claude API · MIT License
      </footer>
    </div>
  );
}
