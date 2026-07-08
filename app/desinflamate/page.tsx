// app/desinflamate/page.tsx
// Página de descarga directa del lead magnet — sin login, sin gate, sin fricción.

export default function Desinflamate() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#FAF7F1",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 20px",
        textAlign: "center",
        fontFamily: "'Montserrat', sans-serif",
      }}
    >
      <p
        style={{
          color: "#C9935A",
          fontWeight: 700,
          fontSize: 13,
          letterSpacing: 1.5,
          marginBottom: 8,
        }}
      >
        GUÍA GRATUITA · LUMERA
      </p>

      <h1
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 32,
          lineHeight: 1.25,
          color: "#2B2420",
          maxWidth: 480,
          marginBottom: 16,
        }}
      >
        7 días para sentirte menos hinchada y con menos antojos
      </h1>

      <p
        style={{
          color: "#2B2420",
          fontSize: 16,
          maxWidth: 420,
          marginBottom: 28,
          opacity: 0.85,
        }}
      >
        Un plan simple, día a día, para empezar a notar el cambio esta semana.
        Sin dietas extremas.
      </p>

      <a
        href="/downloads/plan-7-dias-desinflamate.pdf"
        download
        style={{
          background: "#C9935A",
          color: "#FAF7F1",
          fontWeight: 700,
          fontSize: 16,
          padding: "16px 36px",
          borderRadius: 14,
          textDecoration: "none",
          boxShadow: "0 4px 14px rgba(201,147,90,0.35)",
        }}
      >
        Descargar guía gratis
      </a>

      <div
        style={{
          marginTop: 48,
          paddingTop: 28,
          borderTop: "1px solid rgba(43,36,32,0.12)",
          maxWidth: 420,
        }}
      >
        <p style={{ color: "#2B2420", fontSize: 14, marginBottom: 12 }}>
          Este plan es una muestra. Lumera es tu acompañante diario para
          sostener estos cambios a largo plazo.
        </p>
        <a
          href="https://getlumera.app"
          style={{
            color: "#C9935A",
            fontWeight: 700,
            fontSize: 14,
            textDecoration: "underline",
          }}
        >
          Probar Lumera gratis →
        </a>
      </div>
    </main>
  );
}
