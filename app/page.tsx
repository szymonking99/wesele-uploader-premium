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
      setStatusMessage("Wybierz przynajmniej jedno zdjęcie.");
      return;
    }

    setUploading(true);
    setStatusMessage("");

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // 1. Pobranie pre-signed URL z Twojego API
        const res = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ filename: file.name, contentType: file.type }),
        });

        if (!res.ok) throw new Error("Błąd konfiguracji serwera.");

        const { uploadUrl } = await res.json();

        // 2. Bezpośrednia wysyłka do Azure Storage Blob przez PUT
        const uploadRes = await fetch(uploadUrl, {
          method: "PUT",
          headers: {
            "x-ms-blob-type": "BlockBlob",
            "Content-Type": file.type,
          },
          body: file,
        });

        if (!uploadRes.ok) throw new Error("Błąd podczas przesyłania pliku do Azure.");
      }

      setUploadSuccess(true);
    } catch (error) {
      console.error(error);
      setStatusMessage("Wystąpił błąd połączenia. Spróbuj ponownie lub sprawdź ustawienia sieci.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0B2516] via-[#123520] to-[#0B2516] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Ekskluzywne subtelne złote blaski w tle */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#D4AF37] opacity-[0.06] blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#D4AF37] opacity-[0.06] blur-[120px] pointer-events-none" />

      <div className="w-full max-w-xl bg-white/[0.04] backdrop-blur-md border border-[#D4AF37]/20 rounded-2xl p-8 md:p-12 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] text-center relative">
        {/* Złoty detal dekoracyjny */}
        <div className="mx-auto w-16 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mb-6" />

        {/* Nagłówek Imion */}
        <h1 className="text-4xl md:text-5xl font-serif tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[#F3E5AB] via-[#D4AF37] to-[#AA7C11] drop-shadow-sm font-light mb-2">
          Paulina & Szymon
        </h1>
        
        <p className="text-[#D4AF37] tracking-widest text-xs uppercase font-medium mb-8">
          06.06.2026
        </p>

        {!uploadSuccess ? (
          <>
            <p className="text-white text-lg font-light leading-relaxed mb-2">
              Będziemy bardzo wdzięczni za przesłanie zdjęć z naszego wesela!
            </p>
            <p className="text-white/60 text-sm font-light mb-10">
              Zdjęcia trafiają prosto do nas!
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Customowy ekskluzywny przycisk wyboru plików */}
              <div className="relative group">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="flex flex-col items-center justify-center w-full px-6 py-8 border border-dashed border-[#D4AF37]/40 rounded-xl bg-white/[0.02] group-hover:bg-white/[0.05] group-hover:border-[#D4AF37] transition-all duration-300 cursor-pointer"
                >
                  <svg className="w-8 h-8 text-[#D4AF37] mb-3 opacity-80 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-white text-sm font-medium tracking-wide">
                    {files && files.length > 0 ? `Wybrano plików: ${files.length}` : "Wybierz zdjęcia z telefonu lub komputera"}
                  </span>
                  {files && files.length > 0 && (
                    <span className="text-white/40 text-xs mt-2 max-w-[250px] truncate">
                      {Array.from(files).map(f => f.name).join(", ")}
                    </span>
                  )}
                </label>
              </div>

              {/* Główny złoty przycisk wysyłania */}
              <button
                type="submit"
                disabled={uploading}
                className="w-full relative overflow-hidden bg-gradient-to-r from-[#AA7C11] via-[#D4AF37] to-[#AA7C11] hover:from-[#D4AF37] hover:to-[#AA7C11] text-[#0B2516] font-medium tracking-wider text-sm uppercase py-4 px-6 rounded-xl shadow-[0_4px_20px_rgba(212,175,55,0.25)] hover:shadow-[0_4px_25px_rgba(212,175,55,0.4)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform active:scale-[0.99]"
              >
                {uploading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-[#0B2516]" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Trwa przesyłanie pamiątek...
                  </span>
                ) : (
                  "Wyślij zdjęcia"
                )}
              </button>
            </form>

            {statusMessage && (
              <p className="mt-4 text-xs font-light text-rose-300 bg-rose-950/30 border border-rose-500/20 py-2 px-4 rounded-lg">
                {statusMessage}
              </p>
            )}
          </>
        ) : (
          /* Piękny Ekran Podziękowania w wersji Premium */
          <div className="py-6 animate-fadeIn">
            <div className="w-16 h-16 mx-auto mb-6 bg-[#D4AF37]/10 rounded-full flex items-center justify-center border border-[#D4AF37]/30">
              <svg className="w-8 h-8 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-serif text-[#F3E5AB] mb-4">
              Dziękujemy za przesłane zdjęcia!
            </h2>
            <p className="text-white/80 font-light text-base tracking-wide">
              Pozdrawiamy serdecznie <span className="text-[#D4AF37]">❤️</span>
            </p>
            
            <button
              onClick={() => {
                setUploadSuccess(false);
                setFiles(null);
                setStatusMessage("");
              }}
              className="mt-8 text-xs text-[#D4AF37] hover:text-white underline tracking-widest uppercase transition-colors"
            >
              Prześlij kolejne pliki
            </button>
          </div>
        )}

        {/* Dolny złoty detal ozdobny */}
        <div className="mx-auto w-16 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mt-8" />
      </div>
    </main>
  );
}