# Contribuir a code-for-humans

Gracias por querer contribuir. Aquí tienes cómo empezar.

---

## Configuración

```bash
git clone https://github.com/tu-usuario/code-for-humans
cd code-for-humans
npm install
cp .env.example .env.local
# Añade tu ANTHROPIC_API_KEY a .env.local
npm run dev
```

---

## Áreas donde se agradece ayuda

- **Soporte de nuevos lenguajes** — mejorar la detección y sugerencias específicas por lenguaje
- **Extensión para VS Code** — se planea una extensión complementaria
- **Mejoras de UI** — mejor editor de código, botones de copiar, links para compartir
- **Calidad de prompts** — si encuentras un caso donde la explicación es incorrecta o confusa, abre un issue
- **Tests** — más cobertura en `lib/parseResponse.ts` y el route de la API

---

## Antes de abrir un PR

1. Ejecuta `npm run lint` — sin errores de lint
2. Ejecuta `npm run build` — debe compilar limpiamente
3. Mantén los cambios enfocados — una cosa por PR
4. Si cambias un prompt, incluye ejemplos antes/después en la descripción del PR

---

## Reportar problemas con los prompts

Si Claude da una explicación incorrecta o confusa, abre un issue con:

- El fragmento de código que usaste
- El nivel y modo seleccionados
- Cuál fue la respuesta
- Qué esperabas en su lugar

Esto ayuda a mejorar los prompts en `lib/prompts.ts`.

---

## Estilo de código

- TypeScript en todos lados
- Sin tipos `any` sin un comentario explicando por qué
- Componentes pequeños — una responsabilidad por archivo
- Los prompts viven en `lib/prompts.ts`, no inline en componentes o routes
