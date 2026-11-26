import React, { useMemo, useRef, useState } from 'react';
import {
  Check,
  Copy,
  Download,
  FileText,
  Languages,
  Sparkles,
  Trash2,
  Wand2,
} from 'lucide-react';
import { ToolShell } from './ToolShell';
import {
  TypingPadLang,
  getTransliterationSuggestions,
  transliterateFullText,
  transliterateWordRuleBased,
} from '../../utils/devanagariTransliteration';
import { pushDataLayerEvent } from '../../utils/gtm';
import { TOOL_CATALOG } from '../../utils/routes';
import { UiLang, getSiteStrings } from '../../utils/siteI18n';

interface WordCounterTypingToolProps {
  uiLang: UiLang;
  isPro: boolean;
  onBackHome: () => void;
  onOpenProModal: () => void;
  onToolDownload: () => void;
}

const QUICK_DEVANAGARI_CHARS = ['ळ', 'क्ष', 'ज्ञ', 'श्र', 'ॲ', 'ऑ', 'ॐ', '।', 'ँ', 'ं'];

const SAMPLE_TEXTS: Record<TypingPadLang, string> = {
  en: 'SadhanBox provides fast, free, and 100% private browser tools for everyday tasks. Count words, characters, and sentences accurately right inside your browser.',
  mr: 'नमस्कार! SadhanBox वर तुमचे स्वागत आहे. येथे तुम्ही इंग्रजी अक्षरांतून मराठी आणि हिंदी सहज टाईप करू शकता, तसेच मजकुरातील शब्द व अक्षरे अचूक मोजू शकता.',
  hi: 'नमस्ते! SadhanBox पर आपका स्वागत है। यहाँ आप अंग्रेजी अक्षरों से हिंदी और मराठी आसानी से टाइप कर सकते हैं, और शब्दों व अक्षरों की सटीक गिनती देख सकते हैं।',
};

function computeTextStats(text: string) {
  const charsWithSpaces = text.length;
  const charsNoSpaces = text.replace(/\s/g, '').length;
  const trimmed = text.trim();
  const words = trimmed ? trimmed.split(/\s+/).filter(Boolean).length : 0;

  // Count sentences ending in English (. ! ?) or Devanagari Danda (। ॥)
  const sentenceSegments = trimmed
    ? trimmed
        .split(/[.!?।॥]+/)
        .map((s) => s.trim())
        .filter(Boolean)
    : [];
  const sentences = trimmed ? Math.max(1, sentenceSegments.length) : 0;

  const paragraphs = trimmed
    ? text
        .split(/\n+/)
        .map((p) => p.trim())
        .filter(Boolean).length
    : 0;

  const readingMinutes = words > 0 ? Math.max(1, Math.ceil(words / 200)) : 0;

  return {
    words,
    charsWithSpaces,
    charsNoSpaces,
    sentences,
    paragraphs,
    readingMinutes,
  };
}

function getActiveRomanToken(text: string, cursorPos: number): {
  token: string;
  start: number;
  end: number;
} | null {
  if (cursorPos <= 0 || cursorPos > text.length) return null;
  const before = text.slice(0, cursorPos);
  const match = before.match(/([A-Za-z^~]+)$/);
  if (!match) return null;
  const token = match[1];
  return {
    token,
    start: cursorPos - token.length,
    end: cursorPos,
  };
}

export const WordCounterTypingTool: React.FC<WordCounterTypingToolProps> = ({
  uiLang,
  isPro,
  onBackHome,
  onOpenProModal,
  onToolDownload,
}) => {
  const s = getSiteStrings(uiLang);
  const toolMeta = TOOL_CATALOG.find((t) => t.route === '/word-counter-typing')!;
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const [typingMode, setTypingMode] = useState<TypingPadLang>(() =>
    uiLang === 'mr' ? 'mr' : uiLang === 'hi' ? 'hi' : 'mr'
  );
  const [text, setText] = useState<string>('');
  const [cursorPos, setCursorPos] = useState<number>(0);
  const [copied, setCopied] = useState(false);

  const stats = useMemo(() => computeTextStats(text), [text]);

  const activeRoman = useMemo(() => {
    if (typingMode === 'en') return null;
    return getActiveRomanToken(text, cursorPos);
  }, [text, cursorPos, typingMode]);

  const suggestions = useMemo(() => {
    if (!activeRoman || typingMode === 'en') return [];
    return getTransliterationSuggestions(activeRoman.token, typingMode);
  }, [activeRoman, typingMode]);

  const syncCursor = () => {
    const el = textareaRef.current;
    if (el) {
      setCursorPos(el.selectionStart ?? text.length);
    }
  };

  const replaceRangeWithText = (
    start: number,
    end: number,
    replacement: string,
    trailingStr = ''
  ) => {
    const nextVal = text.slice(0, start) + replacement + trailingStr + text.slice(end);
    const nextCaret = start + replacement.length + trailingStr.length;
    setText(nextVal);
    setCursorPos(nextCaret);
    window.requestAnimationFrame(() => {
      const el = textareaRef.current;
      if (el) {
        el.focus();
        el.setSelectionRange(nextCaret, nextCaret);
      }
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (typingMode === 'en') return;

    const boundaryKeys = [' ', 'Enter', 'Tab', '.', ',', '?', '!', ';', ':'];
    if (!boundaryKeys.includes(e.key)) return;

    const el = e.currentTarget;
    const caret = el.selectionStart ?? text.length;
    const selEnd = el.selectionEnd ?? caret;
    if (caret !== selEnd) return;

    const tokenInfo = getActiveRomanToken(text, caret);
    if (!tokenInfo) return;

    e.preventDefault();
    const converted = transliterateWordRuleBased(tokenInfo.token, typingMode);
    let delimiter = '';
    if (e.key === ' ') delimiter = ' ';
    else if (e.key === 'Enter') delimiter = '\n';
    else if (e.key === 'Tab') delimiter = ' ';
    else delimiter = e.key;

    replaceRangeWithText(tokenInfo.start, tokenInfo.end, converted, delimiter);
  };

  const handleInsertChar = (ch: string) => {
    const el = textareaRef.current;
    const start = el ? el.selectionStart ?? text.length : text.length;
    const end = el ? el.selectionEnd ?? start : start;
    replaceRangeWithText(start, end, ch);
  };

  const handleConvertAllEnglish = () => {
    const targetLang: 'mr' | 'hi' = typingMode === 'hi' ? 'hi' : 'mr';
    const converted = transliterateFullText(text, targetLang);
    setText(converted);
    setCursorPos(converted.length);
  };

  const handleCleanSpaces = () => {
    const cleaned = text
      .replace(/[ \t]+/g, ' ')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
    setText(cleaned);
    setCursorPos(cleaned.length);
  };

  const handleCopy = async () => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Ignore clipboard failures
    }
  };

  const handleDownloadTxt = () => {
    if (!text.trim()) return;
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sadhanbox-text-${typingMode}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);

    pushDataLayerEvent('file_download', {
      document_type: 'typing_pad_txt',
      typing_mode: typingMode,
      word_count: stats.words,
    });
    onToolDownload();
  };

  const placeholderText =
    typingMode === 'mr'
      ? s.wordPlaceholderMr
      : typingMode === 'hi'
        ? s.wordPlaceholderHi
        : s.wordPlaceholderEn;

  return (
    <ToolShell
      route="/word-counter-typing"
      title={toolMeta.title[uiLang]}
      subtitle={toolMeta.shortDesc[uiLang]}
      uiLang={uiLang}
      isPro={isPro}
      onBackHome={onBackHome}
      onOpenProModal={onOpenProModal}
    >
      <div className="space-y-5">
        {/* Live Word & Character KPI Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: s.wordCountLabel, val: stats.words, accent: 'text-[#1E40AF]' },
            { label: s.wordCharsWithSpaceLabel, val: stats.charsWithSpaces, accent: 'text-slate-900' },
            { label: s.wordCharsNoSpaceLabel, val: stats.charsNoSpaces, accent: 'text-slate-900' },
            { label: s.wordSentencesLabel, val: stats.sentences, accent: 'text-slate-900' },
            { label: s.wordParagraphsLabel, val: stats.paragraphs, accent: 'text-slate-900' },
            {
              label: s.wordReadTimeLabel,
              val: `${stats.readingMinutes} ${s.wordMinUnit}`,
              accent: 'text-[#16A34A]',
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-center"
            >
              <div className={`text-xl sm:text-2xl font-extrabold tabular-nums ${stat.accent}`}>
                {stat.val}
              </div>
              <div className="text-[11px] font-semibold text-slate-600 mt-1 leading-tight">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Typing Mode Bar + Quick Actions */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 sm:p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 mr-1">
              <Languages className="w-4 h-4 text-[#1E40AF]" />
              <span>{s.wordModeLabel}:</span>
            </span>
            <div className="inline-flex flex-wrap p-1 bg-white border border-slate-200 rounded-xl gap-1">
              {(
                [
                  { id: 'mr', label: s.wordModeMr },
                  { id: 'hi', label: s.wordModeHi },
                  { id: 'en', label: s.wordModeEn },
                ] as { id: TypingPadLang; label: string }[]
              ).map((m) => {
                const active = typingMode === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      setTypingMode(m.id);
                      textareaRef.current?.focus();
                    }}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                      active
                        ? 'bg-[#1E40AF] text-white'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {m.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                const sample = SAMPLE_TEXTS[typingMode];
                setText(sample);
                setCursorPos(sample.length);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              <span>{s.wordSampleBtn}</span>
            </button>

            {typingMode !== 'en' && (
              <button
                type="button"
                onClick={handleConvertAllEnglish}
                disabled={!text.trim()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#1E40AF] bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg cursor-pointer disabled:opacity-50"
              >
                <Wand2 className="w-3.5 h-3.5" />
                <span>{s.wordConvertAllBtn}</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleCleanSpaces}
              disabled={!text.trim()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>{s.wordCleanSpacesBtn}</span>
            </button>
          </div>
        </div>

        {/* Live Transliteration Suggestion Strip & Quick Devanagari Characters */}
        {typingMode !== 'en' && (
          <div className="space-y-2">
            {activeRoman && suggestions.length > 0 ? (
              <div className="flex flex-wrap items-center gap-2 bg-blue-50/90 border border-blue-200 rounded-xl px-3.5 py-2.5">
                <span className="text-xs font-semibold text-slate-600">
                  {s.wordLiveHintPrefix}{' '}
                  <code className="font-bold text-[#1E40AF]">{activeRoman.token}</code>
                </span>
                <span className="text-xs text-slate-500">{s.wordLiveHintSpace}</span>
                <div className="flex flex-wrap items-center gap-1.5">
                  {suggestions.map((cand, idx) => (
                    <button
                      key={`${cand}-${idx}`}
                      type="button"
                      onClick={() =>
                        replaceRangeWithText(activeRoman.start, activeRoman.end, cand, ' ')
                      }
                      className={`px-3 py-1 text-sm font-bold rounded-lg border cursor-pointer transition-colors ${
                        idx === 0
                          ? 'bg-[#1E40AF] text-white border-[#1E40AF]'
                          : 'bg-white text-slate-900 border-blue-200 hover:bg-blue-100'
                      }`}
                    >
                      {cand}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2">
                <span className="text-xs text-slate-600">{s.wordExamplesTitle}</span>
              </div>
            )}

            {/* Quick Insert Special Marathi / Hindi Characters */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-bold text-slate-500 mr-1">
                {s.wordQuickCharsLabel}
              </span>
              {QUICK_DEVANAGARI_CHARS.map((ch) => (
                <button
                  key={ch}
                  type="button"
                  onClick={() => handleInsertChar(ch)}
                  className="min-w-[34px] h-8 px-2 text-sm font-bold text-slate-800 bg-white hover:bg-blue-50 border border-slate-300 hover:border-blue-400 rounded-lg transition-colors cursor-pointer"
                >
                  {ch}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Main Typing & Counting Textarea */}
        <div>
          <textarea
            ref={textareaRef}
            lang={typingMode}
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              setCursorPos(e.target.selectionStart ?? e.target.value.length);
            }}
            onClick={syncCursor}
            onKeyUp={syncCursor}
            onKeyDown={handleKeyDown}
            rows={9}
            placeholder={placeholderText}
            style={{
              fontFamily: "'Noto Sans Devanagari', 'Plus Jakarta Sans', sans-serif",
            }}
            className="w-full p-4 sm:p-5 text-sm sm:text-base leading-relaxed text-[#0F172A] bg-white border border-slate-300 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 rounded-2xl focus:outline-none resize-y"
          />
        </div>

        {/* Bottom Copy, Download TXT & Clear Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              disabled={!text}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold text-white bg-[#1E40AF] hover:bg-[#2563EB] rounded-xl transition-colors cursor-pointer disabled:opacity-50"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? s.wordCopiedBtn : s.wordCopyBtn}</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadTxt}
              disabled={!text.trim()}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold text-white bg-[#16A34A] hover:bg-[#15803D] rounded-xl transition-colors cursor-pointer disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{s.wordDownloadTxtBtn}</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              setText('');
              setCursorPos(0);
              textareaRef.current?.focus();
            }}
            disabled={!text}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{s.wordClearBtn}</span>
          </button>
        </div>
      </div>
    </ToolShell>
  );
};
