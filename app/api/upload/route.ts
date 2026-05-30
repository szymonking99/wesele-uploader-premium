import { NextResponse } from "next/server";
import { StorageSharedKeyCredential, generateBlobSASQueryParameters, BlobSASPermissions } from "@azure/storage-blob";
import path from "path";

/**
 * POST /api/upload
 * Body: { fileName: string, contentType?: string, uploaderName?: string }
 * Response: { uploadUrl, blobUrl, blobName, contentType }
 */

const account = process.env.AZURE_STORAGE_ACCOUNT || "";
const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY || "";
const containerName = process.env.AZURE_STORAGE_CONTAINER || "";
const prefix = process.env.UPLOAD_PREFIX || "wesele-2026-06-06/";

function sanitizeFileName(name = "") {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_");
}

export async function POST(req: Request) {
  try {
    if (!account || !accountKey || !containerName) {
      console.error("Missing Azure env vars", { account: !!account, accountKey: !!accountKey, containerName: !!containerName });
      return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
    }

    const body = await req.json().catch(() => null);
    if (!body || !body.fileName) {
      return NextResponse.json({ error: "Missing fileName" }, { status: 400 });
    }

    const originalName = String(body.fileName);
    const safeName = sanitizeFileName(path.basename(originalName));
    const uploader = body.uploaderName ? sanitizeFileName(String(body.uploaderName)) : null;
    const timestamp = Date.now();
    const date = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

    const uploaderPart = uploader ? `-${uploader}` : "";
    const blobName = `${prefix}${date}${uploaderPart}-${timestamp}-${safeName}`;

    const sharedKeyCredential = new StorageSharedKeyCredential(account, accountKey);
    const permissions = BlobSASPermissions.parse("cw"); // create + write
    const expiresOn = new Date(Date.now() + 1000 * 60 * 15); // 15 minutes

    const sasToken = generateBlobSASQueryParameters(
      {
        containerName,
        blobName,
        permissions,
        expiresOn
      },
      sharedKeyCredential
    ).toString();

    const blobUrl = `https://${account}.blob.core.windows.net/${containerName}/${encodeURIComponent(blobName)}`;
    const uploadUrl = `${blobUrl}?${sasToken}`;

    console.log("Generated SAS for blob:", blobName);

    return NextResponse.json({
      uploadUrl,
      blobUrl,
      blobName,
      contentType: body.contentType || "application/octet-stream"
    });
  } catch (err) {
    console.error("Error in /api/upload", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
