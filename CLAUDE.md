# Lumera

PWA construida con Next.js + Supabase, deploy automático en Vercel al hacer push a `main` (no hay paso de staging intermedio).

App de bienestar hormonal para mujeres 40+. Bilingüe ES/EN, controlado por la variable `is_es`.

## Reglas de trabajo

- **Un cambio = un commit.** No agrupar cambios sin relación en el mismo commit.
- **Mostrar siempre el diff antes de aplicar** un cambio, para revisión previa.
- **No refactorizar código que no se pidió tocar.** Si algo parece mejorable pero está fuera del pedido, mencionarlo, no cambiarlo.
- Las claves de Supabase están hardcodeadas en el cliente **a propósito** (decisión ya tomada). No "arreglar" esto ni proponerlo como fix.
- Como el deploy a `main` es automático vía Vercel, tratar todo push a `main` como una acción de producción: confirmar antes de pushear salvo que el usuario ya lo haya autorizado explícitamente para ese cambio.

## Marca

- Colores: cobre `#C9935A` / `#A06030`, teal `#0D3D3D`, marfil `#FAF7F1`.
- Tipografías: Cormorant Garamond + Montserrat.

## Voz y contenido

- **Nunca usar la palabra "perimenopausia"** en textos visibles al usuario.
- **Nunca llamar "IA" a LUMI** (ni "inteligencia artificial", ni términos equivalentes) en textos visibles.
- Tono cálido y científico, sin culpar a la usuaria.
- Sin claims médicos.

## Pendiente prioritario

- Notificación push diaria de LUMI.
