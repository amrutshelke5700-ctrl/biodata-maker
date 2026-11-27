import QRCode from 'qrcode';

export interface ResumeUrlValidationResult {
  isEmpty: boolean;
  isValid: boolean;
  normalizedUrl: string;
}

export function normalizeAndValidateResumeUrl(rawInput: string): ResumeUrlValidationResult {
  const trimmed = (rawInput || '').trim();
  if (!trimmed) {
    return { isEmpty: true, isValid: false, normalizedUrl: '' };
  }

  if (/\s/.test(trimmed)) {
    return { isEmpty: false, isValid: false, normalizedUrl: '' };
  }

  const hasScheme = /^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(trimmed);
  if (hasScheme && !/^https?:\/\//i.test(trimmed)) {
    return { isEmpty: false, isValid: false, normalizedUrl: '' };
  }

  const candidate = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

  try {
    const parsed = new URL(candidate);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return { isEmpty: false, isValid: false, normalizedUrl: '' };
    }

    const hostname = parsed.hostname;
    if (!hostname || !/^[a-z0-9-]+(\.[a-z0-9-]+)*\.[a-z]{2,}$/i.test(hostname)) {
      return { isEmpty: false, isValid: false, normalizedUrl: '' };
    }

    return {
      isEmpty: false,
      isValid: true,
      normalizedUrl: parsed.toString(),
    };
  } catch {
    return { isEmpty: false, isValid: false, normalizedUrl: '' };
  }
}

export function createCrispQrDataUrl(url: string, darkColor = '#0F172A'): string {
  if (!url || typeof document === 'undefined') return '';

  try {
    const qr = QRCode.create(url, { errorCorrectionLevel: 'M' });
    const modules = qr.modules;
    const moduleCount = modules.size;
    const quietZone = 2;
    const totalModules = moduleCount + quietZone * 2;
    const scale = Math.max(4, Math.floor(256 / totalModules));
    const canvasSize = totalModules * scale;

    const canvas = document.createElement('canvas');
    canvas.width = canvasSize;
    canvas.height = canvasSize;

    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvasSize, canvasSize);

    ctx.fillStyle = darkColor;
    for (let row = 0; row < moduleCount; row++) {
      for (let col = 0; col < moduleCount; col++) {
        if (modules.get(row, col)) {
          ctx.fillRect((col + quietZone) * scale, (row + quietZone) * scale, scale, scale);
        }
      }
    }

    return canvas.toDataURL('image/png');
  } catch {
    return '';
  }
}
