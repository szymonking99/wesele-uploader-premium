"use client";

import React, { useState } from "react";

export default function Page() {
  const [file, setFile] = useState<File | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function upload() {
    if (!file) {
      setMsg("Wybierz plik przed wysłaniem.");
      return;
    }

    setLoading(true);
    setMsg(null);

    try {
      // 1) Request presigned upload URL from our API
      const presignRes = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: file.name,
          contentType: file.type || "application/octet-stream"
        })
      });

      const presign = await presignRes.json();
      console.log("presign:", presign);

      if (!presignRes.ok || !presign.uploadUrl) {
        setMsg(presign?.error || "Błąd generowania SAS");
        setLoading(false);
        return;
      }

      // 2) Upload file directly to Azure using the SAS URL
      const uploadUrl: string = presign.uploadUrl;

      const uploadRes = await fetch(uploadUrl, {
        method: "PUT",
        headers: {
          "x-ms-blob-type": "BlockBlob",
          "Content-Type": file.type || "application/octet-stream"
        },
        body: file,
        mode: "cors"
      });

      if (!uploadRes.ok) {
        let text = "";
        try { text = await uploadRes.text(); } catch {}
        console.error("Upload failed", uploadRes.status, text);
        setMsg(`Błąd wysyłania pliku: ${uploadRes.status}`);
        setLoading(false);
        return;
      }

      setMsg("Plik wysłany pomyślnie. Dziękujemy!");
    } catch (err: any) {
      console.error("Upload error", err);
      setMsg("Błąd połączenia z serwerem. Sprawdź CORS i ustawienia Azure.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ padding: 24, fontFamily: "system-ui, sans-serif" }}>
      <header>
        <h1>P&S</h1>
        <h2>Paulina &amp; Szymon</h2>
        <p>06.06.2026 — Podziel się z nami zdjęciami</p>
      </header>

      <section style={{ marginTop: 20 }}>
        <p>Wybierz zdjęcie z telefonu lub komputera i kliknij Wyślij. Dziękujemy, że jesteś z nami 💛</p>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            setMsg(null);
            setFile(e.target.files?.[0] ?? null);
          }}
        />

        <div style={{ marginTop: 12 }}>
          <button
            onClick={upload}
            disabled={loading}
            style={{
              background: "#16a34a",
              color: "white",
              padding: "8px 16px",
              border: "none",
              borderRadius: 6,
              cursor: loading ? "not-allowed" : "pointer"
            }}
          >
            {loading ? "Wysyłanie..." : "Wyślij zdjęcie"}
          </button>
        </div>

        <div style={{ marginTop: 12, color: msg?.startsWith("Błąd") ? "crimson" : "green" }}>
          {msg || "Zdjęcia trafią bezpośrednio do młodej pary. Dziękujemy za udział w tym dniu."}
        </div>
      </section>
    </main>
  );
}
