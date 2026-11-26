import React, { useEffect, useRef, useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  Check,
  Download,
  FilePlus2,
  Files,
  ImagePlus,
  Loader2,
  Scissors,
  Trash2,
} from 'lucide-react';
import { ToolShell } from './ToolShell';
import { pushDataLayerEvent } from '../../utils/gtm';
import { TOOL_CATALOG } from '../../utils/routes';
import { UiLang, getSiteStrings } from '../../utils/siteI18n';

interface PdfToolsToolProps {
  uiLang: UiLang;
  isPro: boolean;
  onBackHome: () => void;
  onOpenProModal: () => void;
  onToolDownload: () => void;
}

type PdfToolTab = 'merge' | 'split' | 'images';

interface PdfFileEntry {
  id: string;
  file: File;
  pageCount: number;
}

interface ImageEntry {
  id: string;
  file: File;
  previewUrl: string;
}

function downloadUint8ArrayAsPdf(bytes: Uint8Array, filename: string) {
  const safeBuffer = new Uint8Array(bytes).buffer;
  const blob = new Blob([safeBuffer], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function parsePageRanges(input: string, maxPages: number, invalidPrefix: string): number[] {
  const trimmed = input.trim();
  if (!trimmed) return [];
  const indices = new Set<number>();

  for (const part of trimmed.split(',')) {
    const token = part.trim();
    if (!token) continue;
    if (token.includes('-')) {
      const [startStr, endStr] = token.split('-').map((s) => s.trim());
      const start = Number(startStr);
      const end = Number(endStr);
      if (!Number.isInteger(start) || !Number.isInteger(end) || start < 1 || end < start || end > maxPages) {
        throw new Error(`${invalidPrefix} 1-${maxPages}`);
      }
      for (let p = start; p <= end; p++) {
        indices.add(p - 1);
      }
    } else {
      const pageNum = Number(token);
      if (!Number.isInteger(pageNum) || pageNum < 1 || pageNum > maxPages) {
        throw new Error(`${invalidPrefix} 1-${maxPages}`);
      }
      indices.add(pageNum - 1);
    }
  }

  return Array.from(indices).sort((a, b) => a - b);
}

async function fileToPngBytes(file: File): Promise<Uint8Array> {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error('Image decode error'));
      el.src = url;
    });
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth || img.width;
    canvas.height = img.naturalHeight || img.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas unavailable');
    ctx.drawImage(img, 0, 0);
    const pngBlob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Blob failed'))), 'image/png', 1);
    });
    return new Uint8Array(await pngBlob.arrayBuffer());
  } finally {
    URL.revokeObjectURL(url);
  }
}

export const PdfToolsTool: React.FC<PdfToolsToolProps> = ({
  uiLang,
  isPro,
  onBackHome,
  onOpenProModal,
  onToolDownload,
}) => {
  const s = getSiteStrings(uiLang);
  const toolMeta = TOOL_CATALOG.find((t) => t.route === '/pdf-tools')!;
  const [activeTab, setActiveTab] = useState<PdfToolTab>('merge');
  const [isWorking, setIsWorking] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Merge state
  const mergeInputRef = useRef<HTMLInputElement | null>(null);
  const [mergeFiles, setMergeFiles] = useState<PdfFileEntry[]>([]);

  // Split state
  const splitInputRef = useRef<HTMLInputElement | null>(null);
  const [splitFile, setSplitFile] = useState<PdfFileEntry | null>(null);
  const [splitRanges, setSplitRanges] = useState('1');

  // Images to PDF state
  const imgInputRef = useRef<HTMLInputElement | null>(null);
  const [imageEntries, setImageEntries] = useState<ImageEntry[]>([]);
  const [pageLayout, setPageLayout] = useState<'a4' | 'fit'>('a4');

  const imageEntriesRef = useRef<ImageEntry[]>([]);
  imageEntriesRef.current = imageEntries;

  useEffect(() => {
    return () => {
      for (const entry of imageEntriesRef.current) {
        URL.revokeObjectURL(entry.previewUrl);
      }
    };
  }, []);

  const clearFeedback = () => {
    setErrorMsg('');
    setSuccessMsg('');
  };

  // --- Merge handlers ---
  const handleAddMergeFiles = async (fileList: FileList | null) => {
    if (!fileList) return;
    clearFeedback();
    const added: PdfFileEntry[] = [];
    for (const file of Array.from(fileList)) {
      if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
        setErrorMsg(s.pdfOnlyError);
        continue;
      }
      try {
        const bytes = await file.arrayBuffer();
        const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
        added.push({
          id: `${file.name}-${Date.now()}-${Math.random()}`,
          file,
          pageCount: doc.getPageCount(),
        });
      } catch {
        setErrorMsg(`${s.pdfLoadError} "${file.name}"`);
      }
    }
    if (added.length > 0) {
      setMergeFiles((prev) => [...prev, ...added]);
    }
  };

  const moveMergeFile = (idx: number, dir: -1 | 1) => {
    const nextIdx = idx + dir;
    if (nextIdx < 0 || nextIdx >= mergeFiles.length) return;
    setMergeFiles((prev) => {
      const copy = [...prev];
      [copy[idx], copy[nextIdx]] = [copy[nextIdx], copy[idx]];
      return copy;
    });
  };

  const handleMergeAndDownload = async () => {
    if (mergeFiles.length < 2) {
      setErrorMsg(s.pdfMergeMinError);
      return;
    }
    clearFeedback();
    setIsWorking(true);
    try {
      const mergedPdf = await PDFDocument.create();
      for (const entry of mergeFiles) {
        const bytes = await entry.file.arrayBuffer();
        const srcDoc = await PDFDocument.load(bytes, { ignoreEncryption: true });
        const copied = await mergedPdf.copyPages(srcDoc, srcDoc.getPageIndices());
        copied.forEach((p) => mergedPdf.addPage(p));
      }
      const outBytes = await mergedPdf.save();
      downloadUint8ArrayAsPdf(outBytes, 'sadhanbox-merged.pdf');
      setSuccessMsg(`${s.pdfMergeSuccess} (${mergeFiles.length} PDF)`);
      pushDataLayerEvent('file_download', {
        document_type: 'pdf_merge',
        file_extension: 'pdf',
      });
      onToolDownload();
    } catch {
      setErrorMsg(s.pdfMergeFailed);
    } finally {
      setIsWorking(false);
    }
  };

  // --- Split handlers ---
  const handleSelectSplitFile = async (file: File | undefined) => {
    if (!file) return;
    clearFeedback();
    try {
      const bytes = await file.arrayBuffer();
      const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
      const count = doc.getPageCount();
      setSplitFile({
        id: `${file.name}-${Date.now()}`,
        file,
        pageCount: count,
      });
      setSplitRanges(count > 1 ? `1-${Math.min(2, count)}` : '1');
    } catch {
      setErrorMsg(`${s.pdfLoadError} "${file.name}"`);
    }
  };

  const handleSplitAndDownload = async () => {
    if (!splitFile) return;
    clearFeedback();
    setIsWorking(true);
    try {
      const indices = parsePageRanges(splitRanges, splitFile.pageCount, s.pdfSplitInvalidRange);
      if (indices.length === 0) {
        setErrorMsg(s.pdfSplitRangeRequired);
        setIsWorking(false);
        return;
      }
      const bytes = await splitFile.file.arrayBuffer();
      const srcDoc = await PDFDocument.load(bytes, { ignoreEncryption: true });
      const newDoc = await PDFDocument.create();
      const copied = await newDoc.copyPages(srcDoc, indices);
      copied.forEach((p) => newDoc.addPage(p));
      const outBytes = await newDoc.save();
      const base = splitFile.file.name.replace(/\.pdf$/i, '');
      downloadUint8ArrayAsPdf(outBytes, `${base}-pages.pdf`);
      setSuccessMsg(`${s.pdfSplitSuccess} (${indices.length} ${s.pdfMergePagesUnit})`);
      pushDataLayerEvent('file_download', {
        document_type: 'pdf_split',
        file_extension: 'pdf',
      });
      onToolDownload();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : s.pdfSplitFailed);
    } finally {
      setIsWorking(false);
    }
  };

  // --- Images to PDF handlers ---
  const handleAddImages = (fileList: FileList | null) => {
    if (!fileList) return;
    clearFeedback();
    const added: ImageEntry[] = [];
    for (const file of Array.from(fileList)) {
      const isImgMime = file.type.startsWith('image/');
      const isImgExt = /\.(jpe?g|png|webp)$/i.test(file.name);
      if (!isImgMime && !isImgExt) continue;
      added.push({
        id: `${file.name}-${Date.now()}-${Math.random()}`,
        file,
        previewUrl: URL.createObjectURL(file),
      });
    }
    if (added.length === 0) {
      setErrorMsg(s.pdfImgSelectError);
      return;
    }
    setImageEntries((prev) => [...prev, ...added]);
  };

  const moveImageEntry = (idx: number, dir: -1 | 1) => {
    const nextIdx = idx + dir;
    if (nextIdx < 0 || nextIdx >= imageEntries.length) return;
    setImageEntries((prev) => {
      const copy = [...prev];
      [copy[idx], copy[nextIdx]] = [copy[nextIdx], copy[idx]];
      return copy;
    });
  };

  const removeImageEntry = (id: string) => {
    setImageEntries((prev) => {
      const target = prev.find((item) => item.id === id);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((item) => item.id !== id);
    });
  };

  const handleImagesToPdfDownload = async () => {
    if (imageEntries.length === 0) {
      setErrorMsg(s.pdfImgMinError);
      return;
    }
    clearFeedback();
    setIsWorking(true);
    try {
      const pdfDoc = await PDFDocument.create();
      for (const item of imageEntries) {
        const lowerName = item.file.name.toLowerCase();
        const isJpeg =
          item.file.type === 'image/jpeg' ||
          item.file.type === 'image/jpg' ||
          lowerName.endsWith('.jpg') ||
          lowerName.endsWith('.jpeg');
        const isPng = item.file.type === 'image/png' || lowerName.endsWith('.png');

        let embeddedImg;
        if (isJpeg) {
          const jpgBytes = new Uint8Array(await item.file.arrayBuffer());
          embeddedImg = await pdfDoc.embedJpg(jpgBytes);
        } else if (isPng) {
          const pngBytes = new Uint8Array(await item.file.arrayBuffer());
          embeddedImg = await pdfDoc.embedPng(pngBytes);
        } else {
          const pngBytes = await fileToPngBytes(item.file);
          embeddedImg = await pdfDoc.embedPng(pngBytes);
        }

        if (pageLayout === 'a4') {
          const a4Width = 595.28;
          const a4Height = 841.89;
          const margin = 24;
          const maxW = a4Width - margin * 2;
          const maxH = a4Height - margin * 2;
          const scale = Math.min(maxW / embeddedImg.width, maxH / embeddedImg.height);
          const drawW = embeddedImg.width * scale;
          const drawH = embeddedImg.height * scale;
          const page = pdfDoc.addPage([a4Width, a4Height]);
          page.drawImage(embeddedImg, {
            x: (a4Width - drawW) / 2,
            y: (a4Height - drawH) / 2,
            width: drawW,
            height: drawH,
          });
        } else {
          const page = pdfDoc.addPage([embeddedImg.width, embeddedImg.height]);
          page.drawImage(embeddedImg, {
            x: 0,
            y: 0,
            width: embeddedImg.width,
            height: embeddedImg.height,
          });
        }
      }
      const outBytes = await pdfDoc.save();
      downloadUint8ArrayAsPdf(outBytes, 'sadhanbox-images.pdf');
      setSuccessMsg(`${s.pdfImgSuccess} (${imageEntries.length})`);
      pushDataLayerEvent('file_download', {
        document_type: 'images_to_pdf',
        file_extension: 'pdf',
      });
      onToolDownload();
    } catch {
      setErrorMsg(s.pdfImgFailed);
    } finally {
      setIsWorking(false);
    }
  };

  return (
    <ToolShell
      route="/pdf-tools"
      title={toolMeta.title[uiLang]}
      subtitle={toolMeta.shortDesc[uiLang]}
      uiLang={uiLang}
      isPro={isPro}
      onBackHome={onBackHome}
      onOpenProModal={onOpenProModal}
    >
      {/* 3 Sub-Tool Tabs */}
      <div
        role="tablist"
        aria-label="PDF Tools"
        className="inline-flex flex-wrap p-1 bg-slate-100 rounded-xl gap-1 mb-5"
      >
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'merge'}
          onClick={() => {
            setActiveTab('merge');
            clearFeedback();
          }}
          className={`inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
            activeTab === 'merge' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Files className="w-4 h-4 text-amber-600" />
          <span>{s.pdfTabMerge}</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'split'}
          onClick={() => {
            setActiveTab('split');
            clearFeedback();
          }}
          className={`inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
            activeTab === 'split' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Scissors className="w-4 h-4 text-rose-600" />
          <span>{s.pdfTabSplit}</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'images'}
          onClick={() => {
            setActiveTab('images');
            clearFeedback();
          }}
          className={`inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
            activeTab === 'images' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ImagePlus className="w-4 h-4 text-emerald-600" />
          <span>{s.pdfTabImages}</span>
        </button>
      </div>

      {/* Feedback alerts */}
      {errorMsg && (
        <div
          role="alert"
          className="mb-4 flex items-start gap-2 px-4 py-3 rounded-xl bg-rose-50 border border-rose-200 text-xs sm:text-sm font-medium text-rose-700"
        >
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}
      {successMsg && (
        <div className="mb-4 flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs sm:text-sm font-semibold text-emerald-800">
          <Check className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* TAB A: MERGE PDF */}
      {activeTab === 'merge' && (
        <div className="space-y-4">
          <input
            ref={mergeInputRef}
            type="file"
            accept="application/pdf"
            multiple
            onChange={(e) => {
              void handleAddMergeFiles(e.target.files);
              e.target.value = '';
            }}
            className="hidden"
          />

          <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center bg-slate-50/70">
            <p className="text-sm font-bold text-slate-900">{s.pdfMergeTitle}</p>
            <p className="text-xs text-slate-500 mt-1">{s.pdfMergeHint}</p>
            <button
              type="button"
              onClick={() => mergeInputRef.current?.click()}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              <FilePlus2 className="w-4 h-4" />
              <span>{s.pdfMergeAddBtn}</span>
            </button>
          </div>

          {mergeFiles.length > 0 && (
            <div className="space-y-2">
              {mergeFiles.map((item, idx) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-3 bg-white border border-slate-200 rounded-xl px-4 py-2.5"
                >
                  <div className="min-w-0">
                    <div className="text-xs sm:text-sm font-semibold text-slate-900 truncate">
                      {idx + 1}. {item.file.name}
                    </div>
                    <div className="text-[11px] text-slate-500 tabular-nums">
                      {item.pageCount} {s.pdfMergePagesUnit} · {formatBytes(item.file.size)}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => moveMergeFile(idx, -1)}
                      disabled={idx === 0}
                      aria-label="Move up"
                      className="p-1.5 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveMergeFile(idx, 1)}
                      disabled={idx === mergeFiles.length - 1}
                      aria-label="Move down"
                      className="p-1.5 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setMergeFiles((prev) => prev.filter((f) => f.id !== item.id))}
                      aria-label="Remove"
                      className="p-1.5 text-rose-500 hover:text-rose-700 rounded-lg hover:bg-rose-50 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleMergeAndDownload}
                  disabled={isWorking || mergeFiles.length < 2}
                  className="inline-flex items-center gap-2 px-5 py-3 text-sm font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isWorking ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{s.pdfMergeWorkingBtn}</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>
                        {s.pdfMergeActionBtn} ({mergeFiles.length})
                      </span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB B: SPLIT PDF */}
      {activeTab === 'split' && (
        <div className="space-y-4">
          <input
            ref={splitInputRef}
            type="file"
            accept="application/pdf"
            onChange={(e) => {
              void handleSelectSplitFile(e.target.files?.[0]);
              e.target.value = '';
            }}
            className="hidden"
          />

          <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center bg-slate-50/70">
            <p className="text-sm font-bold text-slate-900">
              {splitFile ? splitFile.file.name : s.pdfSplitTitle}
            </p>
            <p className="text-xs text-slate-500 mt-1 tabular-nums">
              {splitFile
                ? `${s.pdfSplitTotalPages} ${splitFile.pageCount} · ${formatBytes(splitFile.file.size)}`
                : s.pdfSplitHint}
            </p>
            <button
              type="button"
              onClick={() => splitInputRef.current?.click()}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              <FilePlus2 className="w-4 h-4" />
              <span>{splitFile ? s.pdfSplitChangeBtn : s.pdfSplitSelectBtn}</span>
            </button>
          </div>

          {splitFile && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
              <div>
                <label
                  htmlFor="split-page-ranges"
                  className="block text-xs font-bold text-slate-800 mb-1.5"
                >
                  {s.pdfSplitRangeLabel} (1–{splitFile.pageCount})
                </label>
                <input
                  id="split-page-ranges"
                  type="text"
                  value={splitRanges}
                  onChange={(e) => setSplitRanges(e.target.value)}
                  placeholder="1-3, 5"
                  className="w-full sm:max-w-sm rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none focus:border-slate-500 tabular-nums"
                />
              </div>

              <button
                type="button"
                onClick={handleSplitAndDownload}
                disabled={isWorking}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
              >
                {isWorking ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{s.pdfSplitWorkingBtn}</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>{s.pdfSplitActionBtn}</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB C: IMAGES TO PDF */}
      {activeTab === 'images' && (
        <div className="space-y-4">
          <input
            ref={imgInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            multiple
            onChange={(e) => {
              handleAddImages(e.target.files);
              e.target.value = '';
            }}
            className="hidden"
          />

          <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center bg-slate-50/70">
            <p className="text-sm font-bold text-slate-900">{s.pdfImgTitle}</p>
            <p className="text-xs text-slate-500 mt-1">{s.pdfImgHint}</p>
            <button
              type="button"
              onClick={() => imgInputRef.current?.click()}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              <ImagePlus className="w-4 h-4" />
              <span>{s.pdfImgAddBtn}</span>
            </button>
          </div>

          {imageEntries.length > 0 && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs font-bold text-slate-700">{s.pdfImgPageSizeLabel}</span>
                <button
                  type="button"
                  onClick={() => setPageLayout('a4')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg border cursor-pointer ${
                    pageLayout === 'a4'
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-700 border-slate-300'
                  }`}
                >
                  {s.pdfImgLayoutA4}
                </button>
                <button
                  type="button"
                  onClick={() => setPageLayout('fit')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg border cursor-pointer ${
                    pageLayout === 'fit'
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-700 border-slate-300'
                  }`}
                >
                  {s.pdfImgLayoutFit}
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {imageEntries.map((item, idx) => (
                  <div
                    key={item.id}
                    className="bg-white border border-slate-200 rounded-xl p-2 flex flex-col gap-2"
                  >
                    <img
                      src={item.previewUrl}
                      alt={item.file.name}
                      className="w-full h-32 object-cover rounded-lg bg-slate-100"
                    />
                    <div className="text-[11px] font-medium text-slate-700 truncate">
                      {idx + 1}. {item.file.name}
                    </div>
                    <div className="flex items-center justify-between gap-1">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => moveImageEntry(idx, -1)}
                          disabled={idx === 0}
                          aria-label="Move up"
                          className="p-1 text-slate-500 hover:text-slate-900 rounded hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveImageEntry(idx, 1)}
                          disabled={idx === imageEntries.length - 1}
                          aria-label="Move down"
                          className="p-1 text-slate-500 hover:text-slate-900 rounded hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImageEntry(item.id)}
                        aria-label="Remove"
                        className="p-1 text-rose-500 hover:text-rose-700 rounded hover:bg-rose-50 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={handleImagesToPdfDownload}
                disabled={isWorking}
                className="inline-flex items-center gap-2 px-5 py-3 text-sm font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
              >
                {isWorking ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{s.pdfImgWorkingBtn}</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>
                      {s.pdfImgActionBtn} ({imageEntries.length})
                    </span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </ToolShell>
  );
};
