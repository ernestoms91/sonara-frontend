// libs/formatText.ts
export function formatBoletinText(text: string): string {
  // Reemplazar [P1], [P2], etc. con saltos de línea y negritas
  const formattedText = text
    // Reemplazar [Dueto: ...] al inicio
    .replace(/\[Dueto:.*?\]\s*/g, "")
    // Reemplazar [P1], [P2], etc. con saltos de línea y estilo
    .replace(/\[P(\d+)\]/g, "\n\n📌 $1. ")
    // Limpiar espacios dobles
    .replace(/\n{3,}/g, "\n\n")
    // Asegurar espacio después de punto
    .replace(/\.([A-Z])/g, ". $1")
    .trim();

  return formattedText;
}

// Función para renderizar el texto con HTML (si usas dangerouslySetInnerHTML)
export function renderBoletinText(text: string): string {
  const formattedText = text
    .replace(/\[Dueto:.*?\]\s*/g, "")
    .replace(
      /\[P(\d+)\]/g,
      '<br/><br/><strong class="text-primary">📌 $1.</strong> ',
    )
    .replace(/\n/g, "<br/>")
    .trim();

  return formattedText;
}
