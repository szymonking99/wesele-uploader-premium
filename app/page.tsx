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
        
        const res = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ filename: file.name, contentType: file.type }),
        });

        if (!res.ok) throw new Error("Błąd konfiguracji serwera.");

        const { uploadUrl } = await res.json();

        const uploadRes = await fetch(uploadUrl, {
          method: "PUT",
          headers: {
            "x-ms-blob-type": "BlockBlob",
            "Content-Type": file.type,
          },
          body: file,
        });

        if (!uploadRes.ok) throw new Error("Błąd podczas przesyłania pliku.");
      }

      setUploadSuccess(true);
    } catch (error) {
      console.error(error);
      setStatusMessage("Wystąpił błąd połączenia. Spróbuj ponownie.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FDFDFD] bg-gradient-to-tr from-[#F4F7F5] via-[#FFFFFF] to-[#F9FAF9] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Bardzo delikatne, ciepłe złote i zielone blaski rozświetlające jasne tło */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[#D4AF37]/5 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[#123520]/5 blur-[130px] pointer-events-none" />

      {/* Główna karta - czysta biel, luksusowy cień i delikatna złota obwódka */}
      <div className="w-full max-w-xl bg-white border border-[#D4AF37]/30 rounded-2xl p-8 md:p-12 shadow-[0_15px_40px_rgba(18,53,32,0.06)] text-center relative">
        
        {/* Górny akcent z butelkowej zieleni i złota */}
        <div className="flex justify-center items-center gap-2 mb-6">
          <div className="w-8 h-[1px] bg-[#D4AF37]" />
          <div className="w-2 h-2 rounded-full bg-[#123520]" />
          <div className="w-8 h-[1px] bg-[#D4AF37]" />
        </div>

        {/* Imiona Pary Młodej w kolorze głębokiej butelkowej zieleni ze złotym blaskiem */}
        <h1 className="text-4xl md:text-5xl font-serif tracking-wide text-[#123520] font-light mb-3">
          Paulina & Szymon
        </h1>
        
        {/* Złota data */}
        <p className="text-[#AA7C11] tracking-widest text-xs uppercase font-semibold mb-8">
          06.06.2026
        </p>

        {!uploadSuccess ? (
          <>
            <p className="text-[#2C3E35] text-lg font-light leading-relaxed mb-2">
              Będziemy bardzo wdzięczni za przesłanie zdjęć z naszego wesela!
            </p>
            <p className="text-[#123520]/60 text-sm font-light mb-10">
              Zdjęcia trafiają prosto do nas!
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Ekskluzywna strefa wyboru plików - jasne tło z zielono-złotym hoverem */}
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
                  className="flex flex-col items-center justify-center w-full px-6 py-10 border border-dashed border-[#123520]/20 rounded-xl bg-[#FBFDFB] group-hover:bg-[#123520]/5 group-hover:border-[#D4AF37] transition-all duration-300 cursor-pointer"
                >
                  {/* Ikona aparatu w kolorze butelkowej zieleni */}
                  <svg className="w-10 h-10 text-[#123520]/80 mb-3 group-hover:scale-110 group-hover:text-[#AA7C11] transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <circle cx="12" cy="13" r="3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
                  </svg>
                  <span className="text-[#123520] text-sm font-medium tracking-wide">
                    {files && files.length > 0 ? `Wybrano pamiątek: ${files.length}` : "Wybierz zdjęcia z telefonu lub komputera"}
                  </span>
                  {files && files.length > 0 && (
                    <span className="text-[#123520]/60 text-xs mt-2 max-w-[300px] truncate px-4">
                      {Array.from(files).map(f => f.name).join(", ")}
                    </span>
                  )}
                </label>
              </div>

              {/* Przycisk wysyłania - tło z butelkowej zieleni ze złotym tekstem/cieniami */}
              <button
                type="submit"
                disabled={uploading}
                className="w-full relative bg-[#123520] hover:bg-[#1a462b] text-white font-medium tracking-wider text-sm uppercase py-4 px-6 rounded-xl shadow-[0_4px_15px_rgba(18,53,32,0.15)] hover:shadow-[0_6px_20px_rgba(18,53,32,0.25)] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 transform active:scale-[0.99] border border-[#D4AF37]/30"
              >
                {uploading ? (
                  <span className="flex items-center justify-center gap-2 text-[#F3E5AB]">
                    <svg className="animate-spin h-5 w-5 text-[#F3E5AB]" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Trwa przesyłanie zdjęć...
                  </span>
                ) : (
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFF] via-[#F3E5AB] to-[#FFF]">
                    Wyślij zdjęcia
                  </span>
                )}
              </button>
            </form>

            {statusMessage && (
              <p className="mt-4 text-xs font-light text-rose-700 bg-rose-50 border border-rose-200 py-2 px-4 rounded-lg">
                {statusMessage}
              </p>
            )}
          </>
        ) : (
          /* Jasny, elegancki ekran podziękowania */
          <div className="py-6 space-y-4">
            <div className="w-16 h-16 mx-auto bg-[#123520]/5 rounded-full flex items-center justify-center border border-[#D4AF37]/40">
              <svg className="w-8 h-8 text-[#AA7C11]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-serif text-[#123520] font-normal">
              Dziękujemy za przesłane zdjęcia!
            </h2>
            <p className="text-[#2C3E35] font-light text-base tracking-wide">
              Pozdrawiamy serdecznie <span className="text-[#AA7C11]">❤️</span>
            </p>
            
            <button
              onClick={() => {
                setUploadSuccess(false);
                setFiles(null);
                setStatusMessage("");
              }}
              className="mt-8 inline-block text-xs text-[#AA7C11] hover:text-[#123520] underline tracking-widest uppercase transition-colors font-medium"
            >
              Prześlij kolejne zdjęcia
            </button>
          </div>
        )}

        {/* Dolny ozdobny akcent */}
        <div className="flex justify-center items-center gap-2 mt-8">
          <div className="w-8 h-[1px] bg-[#D4AF37]" />
          <div className="w-2 h-2 rounded-full bg-[#123520]" />
          <div className="w-8 h-[1px] bg-[#D4AF37]" />
        </div>
      </div>
    </main>
  );
}