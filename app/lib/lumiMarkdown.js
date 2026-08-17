// Convierte el markdown ligero que puede devolver LUMI (negritas, encabezados con #,
// listas con - o *) a HTML simple, para que no se muestre en crudo en el chat.
// No se usa ninguna librería nueva: es un conversor propio y minimalista.
export function lumiMarkdownToHtml(text) {
  if (!text) return '';

  let s = String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Negrita **texto**
  s = s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

  // Encabezados al inicio de línea (### > ## > #)
  s = s.replace(/^### (.+)$/gm, '<strong style="display:block;margin:0.5rem 0 0.2rem;">$1</strong>');
  s = s.replace(/^## (.+)$/gm, '<strong style="display:block;font-size:1.05em;margin:0.6rem 0 0.25rem;">$1</strong>');
  s = s.replace(/^# (.+)$/gm, '<strong style="display:block;font-size:1.15em;margin:0.7rem 0 0.3rem;">$1</strong>');

  // Listas: agrupa líneas consecutivas que empiezan con "- " o "* "
  s = s.replace(/(^|\n)((?:[-*] .+(?:\n|$))+)/g, (match, pre, list) => {
    const items = list
      .trim()
      .split('\n')
      .map((l) => l.replace(/^[-*]\s+/, '').trim())
      .map((li) => `<li>${li}</li>`)
      .join('');
    return `${pre}<ul style="margin:0.3rem 0 0.3rem 1.1rem;padding:0;">${items}</ul>`;
  });

  // Saltos de línea restantes
  s = s.replace(/\n/g, '<br/>');

  return s;
}
