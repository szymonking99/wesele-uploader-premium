"use client";

import { useState } from "react";

export default function Home() {
  const [files, setFiles] = useState<FileList | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(e.target.files);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!files || files.length === 0) {
      setStatusMessage("Prosimy wybrać przynajmniej jedno zdjęcie przed wysyłką.");
      return;
    }

    setUploading(true);
    setStatusMessage("");

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        const res = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ filename: file.name, contentType: file.type }),
        });

        if (!res.ok) throw new Error("Problem z konfiguracją serwera.");

        const { uploadUrl } = await res.json();

        const uploadRes = await fetch(uploadUrl, {
          method: "PUT",
          headers: {
            "x-ms-blob-type": "BlockBlob",
            "Content-Type": file.type,
          },
          body: file,
        });

        if (!uploadRes.ok) throw new Error("Błąd podczas wysyłania pliku.");
      }

      setUploadSuccess(true);
    } catch (error) {
      console.error(error);
      setStatusMessage("Nie udało się przesłać zdjęć. Spróbuj ponownie za chwilę.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: "20px" }}>
      {/* Centralna karta - styl luksusowej papeterii weselnej */}
      <div className="wedding-card" style={{ width: "100%", maxWidth: "460px", padding: "40px 30px", textAlign: "center", boxSizing: "border-box" }}>
        
        {/* Górny ozdobny detal */}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
          <div style={{ width: "40px", height: "1px", backgroundColor: "rgba(212, 175, 55, 0.6)" }} />
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#123520" }} />
          <div style={{ width: "40px", height: "1px", backgroundColor: "rgba(212, 175, 55, 0.6)" }} />
        </div>

        {/* Nagłówek z imionami */}
        <h1 className="wedding-title" style={{ fontSize: "36px", margin: "0 0 8px 0", letterSpacing: "0.02em" }}>
          Paulina & Szymon
        </h1>
        
        {/* Złota szlachetna data - TUTAJ POPRAWIONE */}
        <p style={{ color: "#AA7C11", letterSpacing: "0.2em", fontSize: "12px", textTransform: "uppercase", fontWeight: "600", margin: "0 0 32px 0" }}>
          06.06.2026
        </p>

        {!uploadSuccess ? (
          <>
            <p style={{ color: "#2C3E35", fontSize: "16px", fontWeight: "300", lineHeight: "1.6", margin: "0 0 4px 0" }}>
              Będziemy bardzo wdzięczni za przesłanie zdjęć z naszego wesela!
            </p>
            <p style={{ color: "rgba(18, 53, 32, 0.6)", fontSize: "12px", fontWeight: "300", letterSpacing: "0.05em", margin: "0 0 40px 0" }}>
              Zdjęcia trafiają prosto do nas!
            </p>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              {/* Ekskluzywne pole wyboru plików */}
              <div style={{ position: "relative", width: "100%" }}>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0, cursor: "pointer", zIndex: 10 }}
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="wedding-upload-area"
                  style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "35px 20px", borderRadius: "12px", cursor: "pointer", boxSizing: "border-box" }}
                >
                  {/* Ikona aparatu */}
                  <svg style={{ width: "40px", height: "40px", color: "rgba(18, 53, 32, 0.7)", marginBottom: "12px" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <circle cx="12" cy="13" r="3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
                  </svg>
                  
                  <span style={{ color: "#123520", fontSize: "14px", fontWeight: "500", letterSpacing: "0.02em" }}>
                    {files && files.length > 0 ? `Wybrano pamiątek: ${files.length}` : "Wybierz zdjęcia z telefonu"}
                  </span>
                </label>
              </div>

              {/* Główny przycisk premium */}
              <button
                type="submit"
                disabled={uploading}
                className="wedding-btn"
                style={{ width: "100%", border: "1px solid rgba(212, 175, 55, 0.2)", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: "500", padding: "16px 20px", borderRadius: "12px", cursor: "pointer", boxShadow: "0 4px 15px rgba(18, 53, 32, 0.1)", opacity: uploading ? 0.5 : 1 }}
              >
                {uploading ? "Trwa zapisywanie wspomnień..." : "Wyślij zdjęcia"}
              </button>
            </form>

            {statusMessage && (
              <p style={{ marginTop: "16px", fontSize: "12px", color: "#991b1b", backgroundColor: "#fef2f2", border: "1px solid #fee2e2", padding: "10px", borderRadius: "10px" }}>
                {statusMessage}
              </p>
            )}
          </>
        ) : (
          /* Ekran sukcesu */
          <div style={{ padding: "30px 0" }}>
            <div style={{ width: "56px", height: "56px", margin: "0 auto 16px auto", backgroundColor: "rgba(18, 53, 32, 0.05)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(212, 175, 55, 0.5)" }}>
              <span style={{ fontSize: "20px" }}>❤️</span>
            </div>
            
            <h2 className="wedding-title" style={{ fontSize: "24px", margin: "0 0 8px 0" }}>
              Dziękujemy za przesłane zdjęcia!
            </h2>
            
            <p style={{ color: "#2C3E35", fontSize: "16px", fontWeight: "300", margin: "0 0 24px 0" }}>
              Pozdrawiamy serdecznie <span style={{ color: "#AA7C11" }}>❤️</span>
            </p>
            
            <button
              onClick={() => {
                setUploadSuccess(false);
                setFiles(null);
                setStatusMessage("");
              }}
              style={{ background: "none", border: "none", color: "#AA7C11", fontSize: "10px", fontWeight: "600", letterSpacing: "0.2em", textTransform: "uppercase", textDecoration: "underline", cursor: "pointer" }}
            >
              Dodaj kolejne zdjęcia
            </button>
          </div>
        )}

        {/* Dolny ozdobny detal */}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "12px", marginTop: "32px" }}>
          <div style={{ width: "40px", height: "1px", backgroundColor: "rgba(212, 175, 55, 0.6)" }} />
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#123520" }} />
          <div style={{ width: "40px", height: "1px", backgroundColor: "rgba(212, 175, 55, 0.6)" }} />
        </div>

      </div>
    </div>
  );
}