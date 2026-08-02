# Lumera — Checklist para publicar en Google Play

Ya tienes: cuenta de Play Console pagada, keystore, y el proyecto Android/TWA completo. Esto es lo que falta y cómo resolverlo.

## ⚠️ Riesgo real que puede bloquear la revisión: pagos con Lemon Squeezy

Hoy el Premium se paga a través de Lemon Squeezy (fuera de la app). La política de Google Play obliga a usar **Google Play Billing** para cualquier contenido digital que se "consuma dentro de la app" (suscripciones, funciones premium, etc.) — no se puede cobrar por fuera con Stripe/Lemon Squeezy/etc. salvo excepciones muy concretas (por ejemplo apps de lectura tipo Kindle, o si el pago es por un servicio prestado fuera de la app).

Con la app tal cual está ahora (paywall de Nutrición/Ejercicio + límite de LUMI, desbloqueado pagando en Lemon Squeezy), es muy probable que Google la rechace en revisión por esto. Antes de invertir tiempo en el resto de la ficha, conviene decidir:

1. **Integrar Google Play Billing** para la suscripción Premium en la versión Android (manteniendo Lemon Squeezy para web/iOS si quieres) — es la opción más segura para que la apruebe, pero es desarrollo adicional real (no es solo configuración).
2. **Publicar la versión Android como "freemium sin paywall visible"** — quitar o esconder el flujo de pago del lado Android y dejar que la suscripción solo se gestione desde la web, mientras la app de Android se centra en el contenido gratuito. Esto es más rápido pero limita lo que la usuaria puede hacer desde el móvil.
3. **Consultar directamente con soporte de Play Console** antes de enviar, explicando el caso — a veces aceptan modelos híbridos si el contenido no se "consume" estrictamente en la app (esto no lo puedo verificar yo, es una decisión de política de Google caso por caso).

Te recomiendo decidir esto ANTES de construir el AAB final, porque cambia bastante qué pantallas puede ver una usuaria de Android.

## ⏱️ Reloj que corre en paralelo: prueba cerrada de 14 días con 12 testers

Confirmado en tu Play Console (cuenta personal): antes de poder pedir acceso a producción, Google exige publicar una prueba cerrada con al menos 12 testers que acepten participar, y mantenerla activa 14 días seguidos como mínimo. El contador de los 14 días no arranca hasta que tengas los 12 apuntados.

Decidiste dejarlo para el final — tiene sentido ir rellenando primero lo demás — pero en cuanto tengas a quién pedírselo, conviene lanzar la prueba cerrada cuanto antes, porque esos 14 días corren aparte de todo el resto del trabajo. Cuando llegue el momento, dime y te ayudo a redactar el mensaje/enlace de invitación para tus 12 testers.

## 1. Construir el AAB firmado

En la carpeta de tu proyecto Android/TWA (la que ya tienes con Bubblewrap):

```
bubblewrap build
```

Te pedirá la contraseña del keystore. Al terminar, genera `app-release-bundle.aab` (o similar, según la versión de Bubblewrap). Antes de subirlo, comprueba dos cosas:

- Que el `applicationId` del proyecto sea `app.getlumera.twa` (tiene que coincidir exactamente con el `package_name` de `public/.well-known/assetlinks.json`).
- Que la huella SHA256 de tu keystore coincida con la que ya está en `assetlinks.json`:
  `9B:59:2D:DB:74:2D:87:10:D3:F5:5B:A5:22:D8:58:B0:A0:8A:C1:B1:F9:4B:52:07:1C:B6:C4:98:C1:9D:B7:AC`
  (puedes verificarlo con `keytool -list -v -keystore tu-keystore.jks`). Si no coincide, la verificación de "Digital Asset Links" fallará y la barra de navegador aparecerá dentro de la app en vez de pantalla completa.
- Sube también el `versionCode`/`versionName` en `twa-manifest.json` si ya habías subido una versión antes.

## 2. Ficha de la tienda (Store Listing)

**Nombre de la app:** Lumera

### Español (es-ES) — idioma predeterminado

**Descripción corta** (máx. 80 caracteres):
> Tu guía diaria para la menopausia, con LUMI a tu lado.

**Descripción completa:**

> Lumera es tu guía personalizada de bienestar hormonal para mujeres 40+. Cada día te acompaña, y genera un plan hecho a tu medida según tu objetivo y tus restricciones.
>
> Cada mañana le cuentas a LUMI cómo estás — tu energía, tu sueño, tu ánimo — y ella ajusta tu plan del día: qué comer, cómo moverte, y un momento de calma, todo pensado para tu cuerpo ahora mismo.
>
> Qué encontrarás en Lumera:
> • Un plan personalizado según tu objetivo y tus restricciones alimentarias
> • Registro diario de síntomas, con gráficas que muestran tu evolución real
> • Menús semanales adaptados a ti
> • Rutinas de ejercicio según tu energía del día
> • LUMI, tu asesora de bienestar, disponible para resolver tus dudas cada día
> • Recordatorios para comidas, bebida, ejercicio o citas importantes
> • Seguimiento de tu ciclo
> • Una comunidad de mujeres 40+ que están viviendo lo mismo que tú
>
> Lumera no diagnostica ni sustituye a tu médico — es tu acompañante diario, personalizado, para entender qué te pasa y qué puedes hacer hoy.
>
> Prueba gratis los primeros 3 días.

### English (en-US) — segundo idioma

**Short description** (max 80 characters):
> Your daily guide through menopause, with LUMI by your side.

**Full description:**

> Lumera is your personalized hormonal wellness guide for women 40+. It's with you every day, and builds a plan tailored to your goal and your restrictions.
>
> Every morning you tell LUMI how you're feeling — your energy, your sleep, your mood — and she adjusts your plan for the day: what to eat, how to move, and a moment of calm, all designed for your body right now.
>
> What you'll find in Lumera:
> • A personalized plan based on your goal and dietary restrictions
> • Daily symptom tracking, with charts showing your real progress
> • Weekly menus tailored to you
> • Exercise routines matched to your energy that day
> • LUMI, your wellness advisor, available to answer your questions every day
> • Reminders for meals, water, exercise, or important appointments
> • Cycle tracking
> • A community of women 40+ going through the same thing you are
>
> Lumera doesn't diagnose or replace your doctor — it's your daily, personalized companion to help you understand what's happening and what you can do today.
>
> Free trial for the first 3 days.

**Categoría:** Salud y forma física (Health & Fitness)

**Correo de contacto:** hola@getlumera.app (ya configurado, reenvía a bibianabertuarios@gmail.com)

**Sitio web:** https://getlumera.app

**Política de privacidad (URL):** https://getlumera.app/privacidad — ya está lista y actualizada (incluye ahora Anthropic, Meta Pixel y Vercel Analytics).

## 3. Recursos gráficos

Ya tienes en el repo: `icon-192.png` e `icon-512.png` (sirven para el icono de la ficha, 512×512).

Te falta:
- **Gráfico de funciones (feature graphic):** 1024×500 px. Es el banner ancho que aparece arriba de la ficha. Si quieres, te ayudo a diseñarlo con tu paleta de marca (cobre/teal/marfil).
- **Capturas de pantalla:** mínimo 2, recomendable 4-8. Las que ya tomaste probando la app en tu móvil (dashboard, chat con LUMI, plan semanal) sirven de base — solo habría que asegurarnos de que reflejen las últimas correcciones (el bloqueo de nutrición/ejercicio no debería aparecer en las capturas si quieres mostrar la experiencia premium completa).

## 4. Formulario de Data Safety

Basado en los datos reales que recopila la app (confirmado en el código):

| Categoría | ¿Se recopila? | Detalle | ¿Se comparte con terceros? |
|---|---|---|---|
| Nombre | Sí | Nombre de perfil | No |
| Email | Sí | Cuenta y autenticación | Supabase, Lemon Squeezy (pago) |
| ID de usuario | Sí | ID de cuenta | No |
| Información de salud | Sí | Síntomas, ciclo, peso/talla, condiciones de salud | Anthropic (solo para generar respuestas de LUMI/menús, no entrena modelos) |
| Información de pago | Sí | Gestionada por Lemon Squeezy, Lumera no la almacena | Lemon Squeezy |
| Datos de uso de la app | Sí | Páginas vistas, interacciones | Vercel Analytics |
| Identificadores publicitarios | Sí | Vía Meta Pixel, solo evento "PageView" | Meta/Facebook |
| Ubicación | No (solo región seleccionada manualmente, no GPS) | — | — |

**Preguntas clave del formulario y cómo responder:**
- "¿Los datos se cifran en tránsito?" → Sí (HTTPS/TLS).
- "¿Puede el usuario solicitar borrado de datos?" → Sí (ya lo dice la política de privacidad, 30 días).
- "¿Se comparten datos con fines publicitarios?" → Sí, vía Meta Pixel, pero solo datos técnicos básicos (nunca síntomas ni conversaciones).
- "¿Es esta una app dirigida a niños?" → No, mayores de 18.

## 5. Cuestionario de clasificación de contenido (IARC)

Es un cuestionario interactivo dentro de Play Console (no lo puedo rellenar yo, lo tienes que hacer tú ahí). Respuestas esperadas para Lumera (app de bienestar, sin contenido gráfico):

- Violencia: No
- Contenido sexual: No
- Lenguaje soez: No
- Sustancias controladas: No
- Juego/apuestas: No
- Interacción entre usuarios (la comunidad cuenta) → Sí, indicar que hay una sección de comunidad con publicaciones de usuarias (moderadas)
- Comparte ubicación: No

Con estas respuestas debería salir clasificación "Para todos los públicos" o equivalente más baja disponible.

## 6. Antes de enviar a revisión

- Confirmar el correo de contacto y región de disponibilidad (¿todos los países o solo algunos al principio?).
- Resolver el tema de pagos/Play Billing (ver arriba) — es lo más importante de toda esta lista.
