import type { Area } from 'react-easy-crop';

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.addEventListener('load', () => resolve(img));
    img.addEventListener('error', (error) => reject(error));
    img.setAttribute('crossOrigin', 'anonymous');
    img.src = url;
  });
}

function getRadianAngle(degreeValue: number): number {
  return (degreeValue * Math.PI) / 180;
}

function rotateSize(width: number, height: number, rotation: number) {
  const rotRad = getRadianAngle(rotation);
  return {
    width: Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    height: Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
  };
}

/**
 * Crops and optionally rotates an image into a crisp Data URL (default 600x900 portrait)
 * so it fits cleanly inside portrait (600x900) and circular biodata frames (and html2pdf.js).
 */
export async function getCroppedImageDataUrl(
  imageSrc: string,
  pixelCrop: Area,
  rotation = 0,
  outputWidth = 600,
  outputHeight = 900
): Promise<string> {
  const image = await loadImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Canvas context unavailable');
  }

  const rotRad = getRadianAngle(rotation);
  const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
    image.width,
    image.height,
    rotation
  );

  canvas.width = bBoxWidth;
  canvas.height = bBoxHeight;

  ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
  ctx.rotate(rotRad);
  ctx.translate(-image.width / 2, -image.height / 2);
  ctx.drawImage(image, 0, 0);

  const croppedCanvas = document.createElement('canvas');
  const croppedCtx = croppedCanvas.getContext('2d');
  if (!croppedCtx) {
    throw new Error('Cropped canvas context unavailable');
  }

  croppedCanvas.width = outputWidth;
  croppedCanvas.height = outputHeight;

  croppedCtx.fillStyle = '#ffffff';
  croppedCtx.fillRect(0, 0, outputWidth, outputHeight);
  croppedCtx.imageSmoothingEnabled = true;
  croppedCtx.imageSmoothingQuality = 'high';

  croppedCtx.drawImage(
    canvas,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    outputWidth,
    outputHeight
  );

  return croppedCanvas.toDataURL('image/jpeg', 0.92);
}

/**
 * Rotates an image File by multiples of 90 degrees at native resolution
 * and returns a fresh File ready for preview and PDF embedding.
 */
export async function rotateImageFile(
  file: File,
  degrees: number = 90
): Promise<File> {
  const objectUrl = URL.createObjectURL(file);
  try {
    const image = await loadImage(objectUrl);
    const normalized = ((degrees % 360) + 360) % 360;
    const swapDims = normalized === 90 || normalized === 270;
    const outW = swapDims ? image.naturalHeight || image.height : image.naturalWidth || image.width;
    const outH = swapDims ? image.naturalWidth || image.width : image.naturalHeight || image.height;

    const canvas = document.createElement('canvas');
    canvas.width = outW;
    canvas.height = outH;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas context unavailable');

    const isPng = file.type === 'image/png' || /\.png$/i.test(file.name);
    if (!isPng) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, outW, outH);
    }

    ctx.translate(outW / 2, outH / 2);
    ctx.rotate(getRadianAngle(normalized));
    ctx.drawImage(image, -(image.naturalWidth || image.width) / 2, -(image.naturalHeight || image.height) / 2);

    const mime = isPng ? 'image/png' : 'image/jpeg';
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error('Failed to encode rotated image'))),
        mime,
        0.94
      );
    });

    const baseName = file.name.replace(/\.[^.]+$/, '');
    const ext = isPng ? 'png' : 'jpg';
    return new File([blob], `${baseName}.${ext}`, { type: mime });
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

/**
 * Crops and rotates an image source at native cropped pixel resolution (capped at 3600px max side)
 * and returns a fresh File ready for preview and PDF embedding.
 */
export async function cropAndRotateImageFile(
  imageSrc: string,
  pixelCrop: Area,
  rotation: number,
  originalFile: File
): Promise<File> {
  const image = await loadImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas context unavailable');

  const imgW = image.naturalWidth || image.width;
  const imgH = image.naturalHeight || image.height;
  const rotRad = getRadianAngle(rotation);
  const { width: bBoxWidth, height: bBoxHeight } = rotateSize(imgW, imgH, rotation);

  canvas.width = Math.max(1, Math.round(bBoxWidth));
  canvas.height = Math.max(1, Math.round(bBoxHeight));

  const isPng = originalFile.type === 'image/png' || /\.png$/i.test(originalFile.name);
  if (!isPng) {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate(rotRad);
  ctx.translate(-imgW / 2, -imgH / 2);
  ctx.drawImage(image, 0, 0);

  const cropW = Math.max(1, Math.round(pixelCrop.width));
  const cropH = Math.max(1, Math.round(pixelCrop.height));
  const maxDim = 3600;
  const downscale = Math.min(1, maxDim / Math.max(cropW, cropH));
  const outW = Math.max(1, Math.round(cropW * downscale));
  const outH = Math.max(1, Math.round(cropH * downscale));

  const croppedCanvas = document.createElement('canvas');
  croppedCanvas.width = outW;
  croppedCanvas.height = outH;
  const croppedCtx = croppedCanvas.getContext('2d');
  if (!croppedCtx) throw new Error('Cropped canvas context unavailable');

  if (!isPng) {
    croppedCtx.fillStyle = '#ffffff';
    croppedCtx.fillRect(0, 0, outW, outH);
  }
  croppedCtx.imageSmoothingEnabled = true;
  croppedCtx.imageSmoothingQuality = 'high';

  croppedCtx.drawImage(
    canvas,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    outW,
    outH
  );

  const mime = isPng ? 'image/png' : 'image/jpeg';
  const blob = await new Promise<Blob>((resolve, reject) => {
    croppedCanvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error('Failed to encode cropped image'))),
      mime,
      0.94
    );
  });

  const baseName = originalFile.name.replace(/\.[^.]+$/, '');
  const ext = isPng ? 'png' : 'jpg';
  return new File([blob], `${baseName}.${ext}`, { type: mime });
}

export interface NormalizedCropRegion {
  x: number;
  y: number;
  w: number;
  h: number;
}

/**
 * Rotates an image source in 90-degree increments and crops the normalized [0..1] region
 * at native resolution (capped at 3600px max side), returning a File for PDF generation.
 */
export async function cropAndRotateRegionToFile(
  imageSrc: string,
  rotationDegrees: number,
  region: NormalizedCropRegion,
  originalFile: File
): Promise<File> {
  const image = await loadImage(imageSrc);
  const imgW = image.naturalWidth || image.width;
  const imgH = image.naturalHeight || image.height;
  const normalizedRot = ((rotationDegrees % 360) + 360) % 360;
  const swapDims = normalizedRot === 90 || normalizedRot === 270;
  const rotW = swapDims ? imgH : imgW;
  const rotH = swapDims ? imgW : imgH;

  const rotCanvas = document.createElement('canvas');
  rotCanvas.width = rotW;
  rotCanvas.height = rotH;
  const rotCtx = rotCanvas.getContext('2d');
  if (!rotCtx) throw new Error('Canvas context unavailable');

  const isPng = originalFile.type === 'image/png' || /\.png$/i.test(originalFile.name);
  if (!isPng) {
    rotCtx.fillStyle = '#ffffff';
    rotCtx.fillRect(0, 0, rotW, rotH);
  }

  rotCtx.translate(rotW / 2, rotH / 2);
  rotCtx.rotate(getRadianAngle(normalizedRot));
  rotCtx.drawImage(image, -imgW / 2, -imgH / 2);

  const sx = Math.max(0, Math.min(rotW - 1, Math.round(region.x * rotW)));
  const sy = Math.max(0, Math.min(rotH - 1, Math.round(region.y * rotH)));
  const sw = Math.max(1, Math.min(rotW - sx, Math.round(region.w * rotW)));
  const sh = Math.max(1, Math.min(rotH - sy, Math.round(region.h * rotH)));

  const maxDim = 3600;
  const downscale = Math.min(1, maxDim / Math.max(sw, sh));
  const outW = Math.max(1, Math.round(sw * downscale));
  const outH = Math.max(1, Math.round(sh * downscale));

  const outCanvas = document.createElement('canvas');
  outCanvas.width = outW;
  outCanvas.height = outH;
  const outCtx = outCanvas.getContext('2d');
  if (!outCtx) throw new Error('Output canvas context unavailable');

  if (!isPng) {
    outCtx.fillStyle = '#ffffff';
    outCtx.fillRect(0, 0, outW, outH);
  }
  outCtx.imageSmoothingEnabled = true;
  outCtx.imageSmoothingQuality = 'high';
  outCtx.drawImage(rotCanvas, sx, sy, sw, sh, 0, 0, outW, outH);

  const mime = isPng ? 'image/png' : 'image/jpeg';
  const blob = await new Promise<Blob>((resolve, reject) => {
    outCanvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error('Failed to encode cropped image'))),
      mime,
      0.94
    );
  });

  const baseName = originalFile.name.replace(/\.[^.]+$/, '');
  const ext = isPng ? 'png' : 'jpg';
  return new File([blob], `${baseName}.${ext}`, { type: mime });
}
