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
    /* NOWOŚĆ: Głębokie, butelkowo-zielone tło ślubne z delikatnym radialnym poświatem starego złota */
    <div style={{ 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center", 
      minHeight: "100vh", 
      padding: "20px",
      backgroundColor: "#0F261A",
      backgroundImage: "radial-gradient(circle at 50% 50%, #163B28 0%, #0B1D14 100%)",
      boxSizing: "border-box"
    }}>
      {/* Centralna karta - styl luksusowej, jasnokremowej papeterii (Ivory) */}
      <div className="wedding-card" style={{ 
        width: "100%", 
        maxWidth: "480px", 
        padding: "40px 30px", 
        textAlign: "center", 
        boxSizing: "border-box",
        backgroundColor: "#FCFAF5",
        border: "1px solid rgba(212, 175, 55, 0.4)",
        borderRadius: "16px",
        boxShadow: "0 20px 50px rgba(0, 0, 0, 0.3)"
      }}>
        
        {/* Górny ozdobny detal */}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
          <div style={{ width: "40px", height: "1px", backgroundColor: "rgba(212, 175, 55, 0.6)" }} />
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#123520" }} />
          <div style={{ width: "40px", height: "1px", backgroundColor: "rgba(212, 175, 55, 0.6)" }} />
        </div>

        {/* Nagłówek z imionami - Złoty gradient */}
        <h1 style={{ 
          fontFamily: "Georgia, Cambria, 'Times New Roman', Times, serif",
          fontSize: "36px", 
          margin: "0 0 8px 0", 
          letterSpacing: "0.02em",
          fontWeight: "400",
          background: "linear-gradient(to right, #AA7C11 0%, #D4AF37 50%, #AA7C11 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent"
        }}>
          Paulina & Szymon
        </h1>
        
        {/* Szlachetna złota data */}
        <p style={{ color: "#AA7C11", letterSpacing: "0.2em", fontSize: "12px", textTransform: "uppercase", fontWeight: "600", margin: "0 0 32px 0" }}>
          06.06.2026
        </p>

        {!uploadSuccess ? (
          <>
            <p style={{ color: "#1C3026", fontSize: "16px", fontWeight: "300", lineHeight: "1.6", margin: "0 0 4px 0" }}>
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
                  style={{ 
                    display: "flex", 
                    flexDirection: "column", 
                    alignItems: "center", 
                    justifyContent: "center", 
                    padding: "35px 20px", 
                    borderRadius: "12px", 
                    cursor: "pointer", 
                    boxSizing: "border-box",
                    border: "1px dashed rgba(18, 53, 32, 0.2)",
                    backgroundColor: "#FAF8F2"
                  }}
                  className="wedding-upload-area"
                >
                  {/* Ikona aparatu w kolorze ciemnej zieleni */}
                  <svg style={{ width: "40px", height: "40px", color: "#123520", opacity: 0.8, marginBottom: "12px" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <circle cx="12" cy="13" r="3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
                  </svg>
                  
                  <span style={{ color: "#123520", fontSize: "14px", fontWeight: "500", letterSpacing: "0.02em" }}>
                    {files && files.length > 0 ? `Wybrano pamiątek: ${files.length}` : "Wybierz zdjęcia"}
                  </span>
                </label>
              </div>

              {/* Sekcja eleganckiego podglądu zdjęć */}
              {files && files.length > 0 && (
                <div style={{ backgroundColor: "#F4F1E9", border: "1px solid rgba(18, 53, 32, 0.08)", borderRadius: "12px", padding: "16px", boxSizing: "border-box" }}>
                  <p style={{ fontSize: "11px", color: "rgba(18, 53, 32, 0.6)", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: "600", margin: "0 0 12px 0", textAlign: "left" }}>
                    Podgląd wybranych plików ({files.length}):
                  </p>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px", maxHeight: "180px", overflowY: "auto", paddingRight: "4px" }}>
                    {Array.from(files).map((file, index) => {
                      const imageUrl = URL.createObjectURL(file);
                      return (
                        <div key={index} style={{ position: "relative", width: "100%", paddingTop: "100%", borderRadius: "8px", overflow: "hidden", border: "1px solid rgba(212, 175, 55, 0.4)", backgroundColor: "#EFECE4" }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img 
                            src={imageUrl} 
                            alt={file.name} 
                            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover" }}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Główny przycisk premium w kolorze butelkowej zieleni ze złotym tekstem */}
              <button
                type="submit"
                disabled={uploading}
                style={{ 
                  width: "100%", 
                  backgroundColor: "#123520",
                  color: "#F3E5AB",
                  border: "1px solid rgba(212, 175, 55, 0.3)", 
                  fontSize: "12px", 
                  textTransform: "uppercase", 
                  letterSpacing: "0.15em", 
                  fontWeight: "500", 
                  padding: "16px 20px", 
                  borderRadius: "12px", 
                  cursor: "pointer", 
                  boxShadow: "0 4px 15px rgba(18, 53, 32, 0.2)", 
                  opacity: uploading ? 0.5 : 1 
                }}
                className="wedding-btn"
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
            
            <h2 style={{ 
              fontFamily: "Georgia, Cambria, 'Times New Roman', Times, serif",
              fontSize: "24px", 
              margin: "0 0 8px 0",
              color: "#123520"
            }}>
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