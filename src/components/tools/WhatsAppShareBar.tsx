import React, { useState } from 'react';
import { Check, Copy, MessageCircle, Share2 } from 'lucide-react';
import { ToolRoute } from '../../utils/routes';
import { UiLang } from '../../utils/siteI18n';

interface WhatsAppShareBarProps {
  uiLang: UiLang;
  route: ToolRoute | '/';
  toolTitle?: string;
  compact?: boolean;
}

const SHARE_COPY: Record<
  UiLang,
  {
    prompt: string;
    whatsappBtn: string;
    copyBtn: string;
    copiedBtn: string;
    messagePrefix: string;
    messageSuffix: string;
  }
> = {
  en: {
    prompt: 'Found this helpful? Share this free browser tool with friends & family:',
    whatsappBtn: 'Share on WhatsApp',
    copyBtn: 'Copy Link',
    copiedBtn: 'Copied!',
    messagePrefix: 'Check out this free & private online tool on SadhanBox',
    messageSuffix: '100% browser-based, no sign-up needed:',
  },
  mr: {
    prompt: 'हे टूल उपयुक्त वाटले का? मित्र व कुटुंबियांसोबत WhatsApp वर शेअर करा:',
    whatsappBtn: 'WhatsApp वर शेअर करा',
    copyBtn: 'लिंक कॉपी करा',
    copiedBtn: 'कॉपी झाले!',
    messagePrefix: 'SadhanBox वरील हे मोफत व सुरक्षित ऑनलाइन टूल नक्की वापरून पहा',
    messageSuffix: '१००% ब्राउझर-आधारित, लॉगिनची गरज नाही:',
  },
  hi: {
    prompt: 'यह टूल उपयोगी लगा? दोस्तों और परिवार के साथ WhatsApp पर शेयर करें:',
    whatsappBtn: 'WhatsApp पर शेयर करें',
    copyBtn: 'लिंक कॉपी करें',
    copiedBtn: 'कॉपी हुआ!',
    messagePrefix: 'SadhanBox पर यह मुफ्त और सुरक्षित ऑनलाइन टूल जरूर आजमाएं',
    messageSuffix: '१००% ब्राउज़र-आधारित, बिना साइन-अप के:',
  },
};

export const WhatsAppShareBar: React.FC<WhatsAppShareBarProps> = ({
  uiLang,
  route,
  toolTitle,
  compact = false,
}) => {
  const c = SHARE_COPY[uiLang];
  const [copied, setCopied] = useState(false);

  const shareUrl =
    typeof window !== 'undefined' && window.location.origin
      ? `${window.location.origin}${route === '/' ? '' : route}`
      : `https://sadhanbox.pages.dev${route === '/' ? '' : route}`;

  const titlePart = toolTitle ? ` — ${toolTitle}` : '';
  const shareText = `${c.messagePrefix}${titlePart}. ${c.messageSuffix} ${shareUrl}`;
  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(shareText)}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Ignore clipboard failures
    }
  };

  return (
    <div
      lang={uiLang}
      dir="ltr"
      className={`rounded-xl border border-emerald-200/80 bg-emerald-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 ${
        compact ? 'px-3 py-2.5' : 'px-4 py-3'
      }`}
    >
      <div className="flex items-center gap-2 text-xs font-medium text-slate-700 min-w-0">
        <Share2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" aria-hidden="true" />
        <span className="leading-snug">{c.prompt}</span>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-[#16A34A] hover:bg-[#15803D] rounded-lg transition-colors whitespace-nowrap shrink-0"
        >
          <MessageCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{c.whatsappBtn}</span>
        </a>

        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>{c.copiedBtn}</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>{c.copyBtn}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
