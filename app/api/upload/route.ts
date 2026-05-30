import { NextResponse } from "next/server";
import { StorageSharedKeyCredential, generateBlobSASQueryParameters, BlobSASPermissions } from "@azure/storage-blob";
import path from "path";

/**
 * POST /api/upload
 * Body: { fileName: string, contentType?: string, uploaderName?: string }
 * Response: { uploadUrl, blobUrl, blobName, contentType }
 */

// Dane Azure wpisane na stałe jako fallback, jeśli Vercel ich nie przekaże
const account = process.env.AZURE_STORAGE_ACCOUNT_NAME || process.env.AZURE_STORAGE_ACCOUNT || "weselezdjecia2026";
const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY || ""; // USUNIĘTO KLUCZ - MA BYĆ PUSTY STRING
const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME || process.env.AZURE_STORAGE_CONTAINER || "zdjecia";
const prefix = process.env.UPLOAD_PREFIX || "wesele-2026-06-06/";

// Logowanie pomocnicze na serwerze (zobaczysz to w zakładce Logs na Vercelu)
console.log("ENV CHECK ON STARTUP:", {
  account: account ? `Loaded (${account})` : "MISSING",
  accountKey: accountKey ? "Loaded (PROTECTED)" : "MISSING",
  containerName: containerName ? `Loaded (${containerName})` : "MISSING",
});

function sanitizeFileName(name = "") {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_");
}

export async function POST(req: Request) {
  try {
    // Walidacja obecności danych logowania
    if (!account || !accountKey || !containerName) {
      console.error("CRITICAL: Missing Azure configuration", { 
        account: !!account, 
        accountKey: !!accountKey, 
        containerName: !!containerName 
      });
      return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
    }

    const body = await req.json().catch(() => null);
    if (!body || !body.fileName) {
      return NextResponse.json({ error: "Missing fileName" }, { status: 400 });
    }

    // Przygotowanie bezpiecznej nazwy pliku i ścieżki blob
    const originalName = String(body.fileName);
    const safeName = sanitizeFileName(path.basename(originalName));
    const uploader = body.uploaderName ? sanitizeFileName(String(body.uploaderName)) : null;
    const timestamp = Date.now();
    const date = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

    const uploaderPart = uploader ? `-${uploader}` : "";
    const blobName = `${prefix}${date}${uploaderPart}-${timestamp}-${safeName}`;

   // Generowanie uwierzytelnienia Azure SAS Token
    const sharedKeyCredential = new StorageSharedKeyCredential(account, accountKey);
    const permissions = BlobSASPermissions.parse("cw"); // c = create, w = write

    // Poprawne ustawienie okna czasowego (zapobiega błędom stref czasowych)
    const now = new Date();
    const startsOn = new Date(now.getTime() - 1000 * 60 * 15);  // 15 minut wstecz
    const expiresOn = new Date(now.getTime() + 1000 * 60 * 60); // 1 godzina w przód

    const sasToken = generateBlobSASQueryParameters(
      {
        containerName,
        blobName,
        permissions,
        startsOn,
        expiresOn
      },
      sharedKeyCredential
    ).toString();
    

    // Budowanie adresów URL do uploadu
    const blobUrl = `https://${account}.blob.core.windows.net/${containerName}/${encodeURIComponent(blobName)}`;
    const uploadUrl = `${blobUrl}?${sasToken}`;

    console.log("Successfully generated SAS for blob:", blobName);

    return NextResponse.json({
      uploadUrl,
      blobUrl,
      blobName,
      contentType: body.contentType || "application/octet-stream"
    });

  } catch (err) {
    console.error("Error in /api/upload runtime:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}