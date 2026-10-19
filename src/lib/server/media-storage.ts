import "server-only";
import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { put } from "@vercel/blob";

const allowedTypes = new Map([["image/jpeg", "jpg"], ["image/png", "png"], ["image/webp", "webp"], ["image/avif", "avif"]]);
const maximumBytes = 5 * 1024 * 1024;

export async function storeAdminImage(file: File) {
  const extension = allowedTypes.get(file.type);
  if (!extension) throw new Error("Only JPEG, PNG, WebP, and AVIF images are accepted.");
  if (file.size < 1 || file.size > maximumBytes) throw new Error("Image size must be between 1 byte and 5 MB.");
  const pathname = `georgiano/${new Date().getUTCFullYear()}/${randomUUID()}.${extension}`;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(pathname, file, { access: "public", addRandomSuffix: false, contentType: file.type });
    return { url: blob.url, provider: "vercel-blob" as const };
  }

  if (process.env.NODE_ENV === "production") throw new Error("Persistent media storage is not configured.");
  const uploadRoot = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadRoot, { recursive: true });
  const fileName = `${randomUUID()}.${extension}`;
  await writeFile(path.join(uploadRoot, fileName), Buffer.from(await file.arrayBuffer()), { flag: "wx" });
  return { url: `/uploads/${fileName}`, provider: "development-local" as const };
}
