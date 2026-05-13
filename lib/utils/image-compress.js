/**
 * Compresse une image File côté navigateur via Canvas API.
 *
 * - Redimensionne pour que le côté le plus long ne dépasse pas `maxSide` px.
 * - Réencode en JPEG avec la qualité `quality` (0..1).
 * - Conserve le nom original mais force l'extension .jpg.
 *
 * Retourne :
 *  - le File original si déjà < `passthroughBytes` (compression inutile)
 *  - un nouveau File compressé sinon
 *  - le File original aussi si ce n'est pas une image (ex. PDF — pas compressible)
 *
 * Aucun impact sur les types non-image (PDF par ex.) — ils passent tels quels.
 */
export async function compressImage(
  file,
  { maxSide = 1500, quality = 0.85, passthroughBytes = 400 * 1024 } = {}
) {
  if (!file || typeof window === "undefined") return file;
  if (!file.type?.startsWith("image/")) return file;
  if (file.size <= passthroughBytes) return file;

  const img = await loadImage(file);

  // Calcul de la nouvelle taille (préserve l'aspect ratio)
  const { width, height } = img;
  const longSide = Math.max(width, height);
  const scale = longSide > maxSide ? maxSide / longSide : 1;
  const targetW = Math.round(width * scale);
  const targetH = Math.round(height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = targetW;
  canvas.height = targetH;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, targetW, targetH);

  const blob = await new Promise((resolve) =>
    canvas.toBlob((b) => resolve(b), "image/jpeg", quality)
  );

  if (!blob) return file;

  // Si la "compression" a empiré la taille (ex. petite image PNG déjà optimisée),
  // on garde l'original.
  if (blob.size >= file.size) return file;

  const baseName = (file.name || "image").replace(/\.[^.]+$/, "") || "image";
  return new File([blob], `${baseName}.jpg`, {
    type: "image/jpeg",
    lastModified: Date.now(),
  });
}

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Image load failed"));
    };
    img.src = url;
  });
}
