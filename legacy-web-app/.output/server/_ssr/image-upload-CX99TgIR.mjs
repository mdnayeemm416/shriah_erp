import { s as supabase } from "./client-Bs6QIVWe.mjs";

import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/unenv.mjs";




import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "../_libs/tslib.mjs";
import "../_libs/supabase__functions-js.mjs";
const BUCKET = "shop-product-images";
const MAX_DIM = 1280;
const QUALITY = 0.85;
async function compressImage(file) {
  if (!file.type.startsWith("image/")) return file;
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise((resolve, reject) => {
      const i = new Image();
      i.onload = () => resolve(i);
      i.onerror = reject;
      i.src = url;
    });
    let { width, height } = img;
    if (width > MAX_DIM || height > MAX_DIM) {
      const scale = MAX_DIM / Math.max(width, height);
      width = Math.round(width * scale);
      height = Math.round(height * scale);
    }
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, width, height);
    const blob = await new Promise(
      (resolve, reject) => canvas.toBlob((b) => b ? resolve(b) : reject(new Error("Compression failed")), "image/jpeg", QUALITY)
    );
    return blob;
  } finally {
    URL.revokeObjectURL(url);
  }
}
async function uploadProductImage(file) {
  const compressed = await compressImage(file);
  const ext = "jpg";
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, compressed, {
    contentType: "image/jpeg",
    cacheControl: "31536000",
    upsert: false
  });
  if (error) throw error;
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
async function uploadAttachmentFile(file) {
  const isImage = file.type.startsWith("image/");
  if (isImage) return uploadProductImage(file);
  const extMatch = /\.([a-zA-Z0-9]+)$/.exec(file.name);
  const ext = (extMatch?.[1] || "pdf").toLowerCase();
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    contentType: file.type || "application/pdf",
    cacheControl: "31536000",
    upsert: false
  });
  if (error) throw error;
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
export {
  compressImage,
  uploadAttachmentFile,
  uploadProductImage
};
