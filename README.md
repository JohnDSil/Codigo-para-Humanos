# 🧠 code-for-humans

> Pega cualquier código. Entiéndelo al instante — a tu nivel.

![Estado](https://img.shields.io/badge/estado-activo-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![Licencia](https://img.shields.io/badge/licencia-MIT-blue)

**code-for-humans** toma cualquier fragmento de código y lo explica en lenguaje sencillo, adaptado a tu nivel de experiencia. Diseñado para desarrolladores que quieren aprender, revisar o depurar código sin perder tiempo.

---

## ✨ Funcionalidades

- **3 niveles de explicación** — niño 🍼, junior 🧑‍💻, senior ⚡
- **Soporte multi-lenguaje** — Python, JavaScript, TypeScript, Go, Rust, Java y más
- **Modo depuración** — detecta errores comunes y anti-patrones en tu fragmento
- **Sugerencias de mejora** — consejos de refactorización accionables por nivel
- **Historial de snippets** — revisa tus explicaciones anteriores
- **API REST** — úsalo en tus propias herramientas o pipelines de CI

---

## 🚀 Inicio rápido

### Requisitos

- Node.js 18+
- Una API key de Anthropic → [consíguela aquí](https://console.anthropic.com)

### Instalación

```bash
git clone https://github.com/tu-usuario/code-for-humans
cd code-for-humans
npm install
```

### Variables de entorno

```bash
cp .env.example .env.local
```

Edita `.env.local` y añade tu clave:

```
ANTHROPIC_API_KEY=sk-ant-...
```

### Ejecutar en local

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

---

## 🧩 Cómo funciona

```
El usuario pega código
        ↓
Se detecta el lenguaje automáticamente
        ↓
Se construye el prompt según nivel + modo
        ↓
Se llama a la API de Claude
        ↓
La respuesta se parsea en secciones estructuradas
        ↓
La UI muestra: explicación + análisis técnico + sugerencias
```

---

## 📡 Uso de la API

Puedes llamar al endpoint directamente:

```bash
curl -X POST http://localhost:3000/api/explain \
  -H "Content-Type: application/json" \
  -d '{
    "code": "const x = arr.reduce((a, b) => a + b, 0)",
    "language": "javascript",
    "level": "junior",
    "mode": "explicar"
  }'
```

**Respuesta:**

```json
{
  "simple": "Esto suma todos los números de un array...",
  "tecnico": "Array.prototype.reduce itera sobre arr...",
  "mejoras": ["Considera nombrar el acumulador claramente", "..."],
  "lenguajeDetectado": "javascript"
}
```

**Parámetros:**

| Campo | Tipo | Valores | Requerido |
|-------|------|---------|-----------|
| `code` | string | cualquier fragmento de código | ✅ |
| `level` | string | `nino`, `junior`, `senior` | ✅ |
| `language` | string | `python`, `javascript`, `auto`... | opcional |
| `mode` | string | `explicar`, `depurar` | opcional (por defecto: `explicar`) |

---

## 🗂 Estructura del proyecto

```
code-for-humans/
├── app/
│   ├── page.tsx                  # UI principal
│   ├── layout.tsx                # Layout raíz
│   ├── globals.css               # Estilos globales
│   └── api/
│       └── explain/
│           └── route.ts          # Endpoint de la API
├── lib/
│   ├── prompts.ts                # Todas las plantillas de prompts
│   └── parseResponse.ts          # Parseo de la respuesta estructurada de Claude
├── types/
│   └── index.ts                  # Tipos TypeScript
├── .env.example
├── .env.local                    # (en .gitignore)
└── README.md
```

---

## 🛠 Stack

| Capa | Tecnología |
|------|-----------|
| Frontend | Next.js 14 (App Router) |
| Estilos | Tailwind CSS |
| IA | API de Anthropic Claude |
| Estado | React hooks + memoria de sesión |
| Deploy | Vercel (un clic) |

---

## 🧠 Filosofía de prompts

Los prompts en `lib/prompts.ts` son el corazón del proyecto. Cada nivel recibe un conjunto de instrucciones diferente:

- **Niño**: analogías, cero jerga, un concepto a la vez
- **Junior**: terminología correcta, contexto práctico, conecta conceptos con patrones
- **Senior**: análisis de complejidad, trade-offs, implementaciones alternativas

Consulta [PROMPTS.md](./PROMPTS.md) para la documentación completa.

---

## 🗺 Roadmap

- [x] Flujo de explicación principal (3 niveles)
- [x] Modo depuración
- [x] Historial de snippets
- [ ] Extensión para VS Code
- [ ] Links compartibles de snippets
- [ ] Detección de lenguaje basada en AST
- [ ] Modo equipo / organización
- [ ] Herramienta CLI (`npx code-for-humans`)

---

## 🤝 Contribuir

Las contribuciones son bienvenidas. Lee [CONTRIBUTING.md](./CONTRIBUTING.md) antes de abrir un PR.

```bash
# Lint
npm run lint

# Build
npm run build
```

---

## 📄 Licencia

MIT — ver [LICENSE](./LICENSE)

---

<p align="center">Construido con ❤️ y demasiada curiosidad</p>
