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
        
        // Budujemy obiekt ze wszystkimi możliwymi kombinacjami kluczy (wielkie/małe litery)
        // Dzięki temu niezależnie od tego, jak napisany jest backend - zapytanie przejdzie.
        const payload = {
          filename: file.name,
          fileName: file.name,
          name: file.name,
          contentType: file.type,
          contentTypeName: file.type,
          fileType: file.type,
          type: file.type
        };

        const res = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        // Jeśli serwer odrzuci obiekt JSON, spróbujemy wysłać tradycyjny FormData (jako plan awaryjny)
        if (!res.ok && res.status === 400) {
          console.log("JSON odrzucony, próba wysłania przez FormData...");
          const formData = new FormData();
          formData.append("file", file);
          formData.append("filename", file.name);
          formData.append("fileName", file.name);
          formData.append("contentType", file.type);
          
          const retryRes = await fetch("/api/upload", {
            method: "POST",
            body: formData, // Brak nagłówka Content-Type, przeglądarka ustawi go automatycznie
          });

          if (!retryRes.ok) throw new Error("Problem z konfiguracją serwera (400 FormData).");
          
          const { uploadUrl } = await retryRes.json();
          await uploadToAzure(uploadUrl, file);
        } else if (!res.ok) {
          throw new Error("Problem z konfiguracją serwera.");
        } else {
          const { uploadUrl } = await res.json();
          await uploadToAzure(uploadUrl, file);
        }
      }

      setUploadSuccess(true);
    } catch (error) {
      console.error("Wykryty błąd:", error);
      setStatusMessage("Nie udało się przesłać zdjęć. Sprawdź poprawność pól API.");
    } finally {
      setUploading(false);
    }
  };

  // Pomocnicza funkcja realizująca bezpośredni upload do chmury Azure
  const uploadToAzure = async (url: string, file: File) => {
    const uploadRes = await fetch(url, {
      method: "PUT",
      headers: {
        "x-ms-blob-type": "BlockBlob",
        "Content-Type": file.type
      },
      body: file,
    });

    if (!uploadRes.ok) {
      throw new Error("Azure Storage odrzucił połączenie.");
    }
  };