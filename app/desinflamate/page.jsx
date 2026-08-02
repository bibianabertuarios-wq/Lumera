'use client';
// app/desinflamate/page.tsx
// Página de descarga del lead magnet. Antes era descarga directa sin ningún
// registro (sin login, sin gate) — ahora pide nombre + email antes de dar el
// PDF, igual que /guia-glp1 y /duerme, para poder saber quién se lo descarga
// y hacer seguimiento por email.
import { useState } from "react";

export default function Desinflamate() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !name) return;
    setLoading(true);
    try {
      await fetch("/api/desinflamate-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name }),
      });
    } catch (e) {}
    setSubmitted(true);
    setLoading(false);
  };

  const inputStyle = {
    width: "100%",
    padding: "14px 16px",
    marginBottom: 12,
    borderRadius: 12,
    border: "1px solid rgba(43,36,32,0.15)",
    fontSize: 15,
    fontFamily: "'Montserrat', sans-serif",
    outline: "none",
    color: "#2B2420",
    background: "white",
  };

  const buttonStyle = {
    width: "100%",
    background: "#C9935A",
    color: "#FAF7F1",
    fontWeight: 700,
    fontSize: 16,
    padding: "16px 36px",
    borderRadius: 14,
    border: "none",
    cursor: "pointer",
    textDecoration: "none",
    boxShadow: "0 4px 14px rgba(201,147,90,0.35)",
    display: "block",
    textAlign: "center",
    opacity: 1,
  };

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

      {!submitted ? (
        <div style={{ width: "100%", maxWidth: 340 }}>
          <input
            type="text"
            placeholder="Tu nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={inputStyle}
          />
          <input
            type="email"
            placeholder="Tu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
          />
          <button
            onClick={handleSubmit}
            disabled={loading || !name || !email}
            style={{ ...buttonStyle, opacity: !name || !email ? 0.6 : 1 }}
          >
            {loading ? "..." : "Descargar guía gratis"}
          </button>
        </div>
      ) : (
        <a
          href="/downloads/plan-7-dias-desinflamate.pdf"
          download
          style={buttonStyle}
        >
          Descargar guía gratis
        </a>
      )}

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
