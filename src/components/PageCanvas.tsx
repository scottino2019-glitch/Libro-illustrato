import React, { useRef, useState, useEffect } from 'react';
import { BookItem, PageData, CharacterItem, ArtisticTextItem } from '../types';
import { PREMADE_BACKGROUNDS } from './PremadeAssets';
import { RotateCw, FlipHorizontal, Trash2, ArrowUp, ArrowDown, Move } from 'lucide-react';

// Helper to get emojis on the left and right sides of inline artistic text based on the word and style
const getInlineEmoji = (word: string, preset: string): { left: string; right: string } => {
  const w = word.toLowerCase();
  
  if (w.includes('drago')) return { left: '🐉', right: '🐉' };
  if (w.includes('fuoco') || w.includes('fiamm') || w.includes('brucia')) return { left: '🔥', right: '🔥' };
  if (w.includes('magi') || w.includes('fata') || w.includes('scintill') || w.includes('incant')) return { left: '✨', right: '✨' };
  if (w.includes('tesor') || w.includes('coppa') || w.includes('regn') || w.includes('regin') || w.includes('re ')) return { left: '👑', right: '👑' };
  if (w.includes('oro') || w.includes('soldi') || w.includes('gemm') || w.includes('diamant')) return { left: '💎', right: '💎' };
  if (w.includes('fantasm') || w.includes('spettr') || w.includes('paura') || w.includes('buio')) return { left: '👻', right: '👻' };
  if (w.includes('mostr') || w.includes('zombie') || w.includes('streg') || w.includes('orco')) return { left: '🧟', right: '🧟' };
  if (w.includes('boom') || w.includes('sboom') || w.includes('crash') || w.includes('colpo') || w.includes('esplod')) return { left: '💥', right: '💥' };
  if (w.includes('boll') || w.includes('acqua') || w.includes('sapone')) return { left: '🫧', right: '🫧' };
  if (w.includes('ors') || w.includes('gatto') || w.includes('cane') || w.includes('animal') || w.includes('cucciolo')) return { left: '🧸', right: '🧸' };
  if (w.includes('cavall') || w.includes('unicorn')) return { left: '🦄', right: '🦄' };

  // Fallbacks if no direct match but has preset
  switch (preset) {
    case 'comic': return { left: '⚡️', right: '⚡️' };
    case 'fairy': return { left: '✨', right: '✨' };
    case 'spooky': return { left: '🕷️', right: '🕷️' };
    case 'gold': return { left: '👑', right: '👑' };
    case 'antique': return { left: '📜', right: '📜' };
    case 'bubble': return { left: '🫧', right: '🫧' };
    default: return { left: '✨', right: '✨' };
  }
};

interface PageCanvasProps {
  page: PageData;
  selectedItemId: string | null;
  onSelectItem: (id: string | null) => void;
  onUpdateItem: (itemId: string, updatedFields: Partial<BookItem>) => void;
  onDeleteItem: (itemId: string) => void;
  isPrintMode?: boolean; // hides selection boxes for PDF rendering
  orientation?: 'landscape' | 'portrait';
}

export default function PageCanvas({
  page,
  selectedItemId,
  onSelectItem,
  onUpdateItem,
  onDeleteItem,
  isPrintMode = false,
  orientation = 'landscape',
}: PageCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [dragState, setDragState] = useState<{
    itemId: string;
    startX: number;
    startY: number;
    startItemX: number;
    startItemY: number;
  } | null>(null);

  // Get background continuous inline styles
  const getBackgroundStyle = (): React.CSSProperties => {
    if (page.backgroundType === 'color') {
      return { backgroundColor: page.backgroundValue || '#F3F4F6' };
    }
    if (page.backgroundType === 'image') {
      return {
        backgroundImage: `url(${page.backgroundValue})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      };
    }
    if (page.backgroundType === 'premade') {
      const premade = PREMADE_BACKGROUNDS.find((bg) => bg.id === page.backgroundValue);
      if (premade) {
        return {
          backgroundImage: `url("${premade.src}")`,
          backgroundSize: '100% 100%',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        };
      }
    }
    return { backgroundColor: '#F3F4F6' };
  };

  // Helper to determine CSS classes for styles of artistic text
  const getArtisticTextClass = (item: ArtisticTextItem): string => {
    switch (item.stylePreset) {
      case 'comic':
        return 'font-extrabold uppercase italic tracking-wider text-yellow-300 [text-shadow:_2px_2px_0_#000,-1px_-1px_0_#000,1px_-1px_0_#000,-1px_1px_0_#000,1px_1px_0_#000] filter drop-shadow-[3px_3px_0px_#e11d48] select-none';
      case 'fairy':
        return 'font-serif italic font-semibold text-pink-500 filter drop-shadow-[0_0_6px_rgba(236,72,153,0.8)] select-none animate-pulse';
      case 'spooky':
        return 'font-mono text-lime-400 tracking-widest font-extrabold uppercase [text-shadow:_2px_2px_0_#020617,_0_0_8px_#84cc16] select-none';
      case 'gold':
        return 'font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-100 to-amber-600 filter drop-shadow-[2px_2px_3px_rgba(0,0,0,0.6)] select-none';
      case 'antique':
        return 'font-serif text-amber-950 font-bold tracking-wide border-b-2 border-double border-amber-800 pb-0.5 select-none';
      case 'bubble':
        return 'font-extrabold rounded-2xl px-3 py-1.5 bg-gradient-to-tr from-sky-400 to-sky-200 text-white border-2 border-sky-600 shadow-[3px_3px_0_#0284c7] -rotate-1 select-none';
      case 'kablammo':
        return 'font-kablammo text-pink-500 [text-shadow:_2px_2px_0_#000] rotate-1 select-none';
      case 'nabla':
        return 'font-nabla select-none scale-110';
      case 'splash':
        return 'font-splash text-cyan-600 tracking-wider leading-none select-none';
      default:
        return 'font-sans font-bold select-none';
    }
  };

  // Mouse drag events
  const handleItemMouseDown = (e: React.MouseEvent, item: BookItem) => {
    if (isPrintMode) return;
    e.stopPropagation();
    onSelectItem(item.id);

    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const currentMouseX = e.clientX - rect.left;
      const currentMouseY = e.clientY - rect.top;

      setDragState({
        itemId: item.id,
        startX: currentMouseX,
        startY: currentMouseY,
        startItemX: item.x,
        startItemY: item.y,
      });
    }
  };

  // Touch drag events (mobile support)
  const handleItemTouchStart = (e: React.TouchEvent, item: BookItem) => {
    if (isPrintMode) return;
    e.stopPropagation();
    onSelectItem(item.id);

    if (canvasRef.current && e.touches.length > 0) {
      const rect = canvasRef.current.getBoundingClientRect();
      const touch = e.touches[0];
      const currentTouchX = touch.clientX - rect.left;
      const currentTouchY = touch.clientY - rect.top;

      setDragState({
        itemId: item.id,
        startX: currentTouchX,
        startY: currentTouchY,
        startItemX: item.x,
        startItemY: item.y,
      });
    }
  };

  const handleGlobalMouseMove = (e: MouseEvent) => {
    if (!dragState || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const currentMouseX = e.clientX - rect.left;
    const currentMouseY = e.clientY - rect.top;

    // Difference in pixels
    const deltaX = currentMouseX - dragState.startX;
    const deltaY = currentMouseY - dragState.startY;

    // Convert to percentage
    const percentDeltaX = (deltaX / rect.width) * 100;
    const percentDeltaY = (deltaY / rect.height) * 100;

    // Constrain position (keep centered/within bounds largely)
    const newX = Math.max(-20, Math.min(100, dragState.startItemX + percentDeltaX));
    const newY = Math.max(-20, Math.min(100, dragState.startItemY + percentDeltaY));

    onUpdateItem(dragState.itemId, { x: Math.round(newX * 10) / 10, y: Math.round(newY * 10) / 10 });
  };

  const handleGlobalTouchMove = (e: TouchEvent) => {
    if (!dragState || !canvasRef.current || e.touches.length === 0) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const currentTouchX = touch.clientX - rect.left;
    const currentTouchY = touch.clientY - rect.top;

    const deltaX = currentTouchX - dragState.startX;
    const deltaY = currentTouchY - dragState.startY;

    const percentDeltaX = (deltaX / rect.width) * 100;
    const percentDeltaY = (deltaY / rect.height) * 100;

    const newX = Math.max(-20, Math.min(100, dragState.startItemX + percentDeltaX));
    const newY = Math.max(-20, Math.min(100, dragState.startItemY + percentDeltaY));

    onUpdateItem(dragState.itemId, { x: Math.round(newX * 10) / 10, y: Math.round(newY * 10) / 10 });
  };

  const handleGlobalMouseUp = () => {
    if (dragState) setDragState(null);
  };

  useEffect(() => {
    if (dragState) {
      window.addEventListener('mousemove', handleGlobalMouseMove);
      window.addEventListener('mouseup', handleGlobalMouseUp);
      window.addEventListener('touchmove', handleGlobalTouchMove);
      window.addEventListener('touchend', handleGlobalMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
      window.removeEventListener('touchmove', handleGlobalTouchMove);
      window.removeEventListener('touchend', handleGlobalMouseUp);
    };
  }, [dragState]);

  const handleCanvasClick = (e: React.MouseEvent) => {
    // If we click raw space, deselect
    if (e.target === canvasRef.current || (e.target as HTMLElement).id === 'narrative-block') {
      onSelectItem(null);
    }
  };

  // Quick transforms for active item
  const selectedItemObj = page.items.find((it) => it.id === selectedItemId);

  const isPortrait = orientation === 'portrait';

  return (
    <div className={`w-full flex flex-col gap-3 ${isPortrait ? 'max-w-md mx-auto' : ''}`}>
      {/* Container aspect-ratio strictly tailored to orientation */}
      <div
        id={`page-stage-${page.id}`}
        ref={canvasRef}
        onClick={handleCanvasClick}
        style={getBackgroundStyle()}
        className={`relative w-full ${isPortrait ? 'aspect-[3/4]' : 'aspect-[4/3]'} rounded-none overflow-hidden border border-[#D1CEC7] shadow-lg transition-all duration-300 select-none bg-white`}
      >
        {/* Narrative text block integrated directly with writing! */}
        {page.narrativeText && page.narrativePosition !== 'floating-hidden' && (
          <div
            id="narrative-block"
            className={`absolute left-0 right-0 p-4 md:p-5 z-20 transition-all duration-300 ${
              page.narrativePosition === 'top' ? 'top-0' : 'bottom-0'
            } ${
              page.narrativeStyle === 'parchment'
                ? `bg-[#FCF6E4]/90 border-[#B58D3D] ${page.narrativePosition === 'top' ? 'border-b-4' : 'border-t-4'} border-double shadow-md`
                : page.narrativeStyle === 'banner'
                ? `bg-white/90 backdrop-blur-sm text-gray-800 border-[#D1CEC7] ${page.narrativePosition === 'top' ? 'border-b shadow-sm' : 'border-t shadow-inner'}`
                : 'bg-transparent border-none'
            }`}
          >
            <p 
              className="text-xs sm:text-sm md:text-base font-serif italic text-center leading-relaxed font-bold animate-fade-in flex flex-wrap items-center justify-center gap-y-1"
              style={{
                color: page.narrativeColor || (page.narrativeStyle === 'parchment' ? '#3E2723' : '#1A1A1A'),
                textShadow: (page.narrativeStyle === 'parchment' || page.narrativeStyle === 'banner')
                  ? undefined
                  : (() => {
                      const textColor = page.narrativeColor || '#1A1A1A';
                      const isLight = textColor.toUpperCase() === '#FFFFFF' || textColor.toLowerCase() === 'white' || 
                        (textColor.startsWith('#') && textColor.length === 7 && 
                          (parseInt(textColor.substring(1, 3), 16) * 0.299 + 
                           parseInt(textColor.substring(3, 5), 16) * 0.587 + 
                           parseInt(textColor.substring(5, 7), 16) * 0.114) > 170);
                      return isLight 
                        ? '1px 1px 0px #000, -1px -1px 0px #000, 1px -1px 0px #000, -1px 1px 0px #000, 0px 1px 0px #000, 0px -1px 0px #000, 1px 0px 0px #000, -1px 0px 0px #000, 0px 0px 8px rgba(0, 0, 0, 1)'
                        : '1px 1px 0px #fff, -1px -1px 0px #fff, 1px -1px 0px #fff, -1px 1px 0px #fff, 0px 1px 0px #fff, 0px -1px 0px #fff, 1px 0px 0px #fff, -1px 0px 0px #fff, 0px 0px 8px rgba(255, 255, 255, 1), 0px 0px 15px rgba(255, 255, 255, 0.9)';
                    })()
              }}
            >
              {(() => {
                const parts = page.narrativeText.split(/(\*[^*]+\*)/g);
                return parts.map((part, index) => {
                  if (part.startsWith('*') && part.endsWith('*')) {
                    const inner = part.slice(1, -1);
                    let stylePreset = 'holo'; // default if no colon prefix
                    let cleanText = inner;
                    
                    if (inner.includes(':')) {
                      const colonIndex = inner.indexOf(':');
                      const prefix = inner.substring(0, colonIndex).trim().toLowerCase();
                      if (['comic', 'fairy', 'spooky', 'gold', 'antique', 'bubble', 'kablammo', 'nabla', 'splash'].includes(prefix)) {
                        stylePreset = prefix;
                        cleanText = inner.substring(colonIndex + 1);
                      }
                    }

                    let classes = "";
                    let customStyleObj: React.CSSProperties = { fontStyle: 'normal' };
                    let wrapperElement: React.ReactNode = null;

                    const em = getInlineEmoji(cleanText, stylePreset);
                    const leftEm = em.left;
                    const rightEm = em.right;

                    switch (stylePreset) {
                      case 'comic':
                        classes = 'font-sans font-black tracking-wide uppercase px-2.5 py-1 rounded bg-[#FF5722] text-yellow-305 border-2 border-black inline-flex items-center gap-1.5 select-none transform rotate-[-2deg] hover:rotate-[3deg] duration-200 transition-all shadow-[3px_3px_0px_#000]';
                        customStyleObj = {
                          fontSize: '110%',
                          textShadow: '2px 2px 0px #000',
                          display: 'inline-flex',
                          margin: '2px 6px',
                          verticalAlign: 'middle',
                          fontStyle: 'italic'
                        };
                        wrapperElement = (
                          <span className={classes} style={customStyleObj}>
                            {leftEm && <span className="mr-0.5">{leftEm}</span>}
                            <span>{cleanText}</span>
                            {rightEm && <span className="ml-0.5">{rightEm}</span>}
                          </span>
                        );
                        break;
                      case 'fairy':
                        classes = 'font-serif italic font-extrabold px-3 py-1 rounded-full bg-gradient-to-r from-pink-400 via-fuchsia-400 to-indigo-400 text-white inline-flex items-center gap-1.5 select-none transform hover:scale-110 hover:-rotate-1 duration-200 transition-all shadow-[0_0_12px_rgba(236,72,153,0.85)] border border-pink-100/40 animate-pulse';
                        customStyleObj = {
                          fontSize: '105%',
                          textShadow: '1px 1px 2px rgba(131,24,67,0.4)',
                          display: 'inline-flex',
                          margin: '2px 6px',
                          verticalAlign: 'middle'
                        };
                        wrapperElement = (
                          <span className={classes} style={customStyleObj}>
                            {leftEm && <span className="mr-0.5">{leftEm}</span>}
                            <span>{cleanText}</span>
                            {rightEm && <span className="ml-0.5">{rightEm}</span>}
                          </span>
                        );
                        break;
                      case 'spooky':
                        classes = 'font-mono text-[#A3E635] tracking-widest font-black uppercase px-2.5 py-1 border-2 border-[#A3E635] bg-[#1A1124] inline-flex items-center gap-1.5 select-none transform rotate-[1.5deg] hover:-rotate-[2deg] duration-200 transition-all shadow-[4px_4px_0_#9333EA] rounded-md';
                        customStyleObj = {
                          fontSize: '110%',
                          textShadow: '2px 2px 0px #020617',
                          display: 'inline-flex',
                          margin: '2px 6px',
                          verticalAlign: 'middle'
                        };
                        wrapperElement = (
                          <span className={classes} style={customStyleObj}>
                            {leftEm && <span className="mr-1">{leftEm}</span>}
                            <span>{cleanText}</span>
                            {rightEm && <span className="ml-1">{rightEm}</span>}
                          </span>
                        );
                        break;
                      case 'gold':
                        classes = 'px-3 py-1 bg-[#2D1B18] border-2 border-[#E19E20] inline-flex items-center gap-1.5 shadow-[2px_2px_5px_rgba(0,0,0,0.6)] rounded-sm transform hover:scale-105 duration-200 transition-all select-none';
                        customStyleObj = {
                          fontSize: '110%',
                          display: 'inline-flex',
                          margin: '2px 6px',
                          verticalAlign: 'middle'
                        };
                        wrapperElement = (
                          <span className={classes} style={customStyleObj}>
                            {leftEm && <span className="mr-0.5">{leftEm}</span>}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-100 to-yellow-400 font-extrabold tracking-wide uppercase">
                              {cleanText}
                            </span>
                            {rightEm && <span className="ml-0.5">{rightEm}</span>}
                          </span>
                        );
                        break;
                      case 'antique':
                        classes = 'font-serif text-[#3E2723] font-black tracking-wide border-x-4 border-y border-[#7C5A34] bg-[#F5E6C4] px-2.5 py-0.5 select-none transform hover:-translate-y-0.5 duration-200 transition-all inline-flex items-center gap-1 shadow-[2px_2px_4px_rgba(0,0,0,0.15)] rounded-sm';
                        customStyleObj = {
                          fontSize: '100%',
                          display: 'inline-flex',
                          margin: '2px 6px',
                          verticalAlign: 'middle'
                        };
                        wrapperElement = (
                          <span className={classes} style={customStyleObj}>
                            {leftEm && <span className="text-xs mr-0.5">{leftEm}</span>}
                            <span>{cleanText}</span>
                            {rightEm && <span className="text-xs ml-0.5">{rightEm}</span>}
                          </span>
                        );
                        break;
                      case 'bubble':
                        classes = 'font-sans font-black rounded-full px-3 py-1 bg-gradient-to-b from-[#7DD3FC] via-[#38BDF8] to-[#0284C7] text-white border-2 border-white inline-flex items-center gap-1.5 select-none transform hover:scale-115 hover:rotate-1 duration-200 transition-all shadow-[inset_-2px_-3px_6px_rgba(0,0,0,0.35),_2px_3px_5px_rgba(2,132,199,0.45)]';
                        customStyleObj = {
                          fontSize: '100%',
                          display: 'inline-flex',
                          margin: '2px 6px',
                          verticalAlign: 'middle',
                          textShadow: '1px 1px 2px rgba(2,132,199,0.5)'
                        };
                        wrapperElement = (
                          <span className={classes} style={customStyleObj}>
                            {leftEm && <span className="mr-0.5">{leftEm}</span>}
                            <span>{cleanText}</span>
                            {rightEm && <span className="ml-0.5">{rightEm}</span>}
                          </span>
                        );
                        break;
                      case 'kablammo':
                        classes = 'font-kablammo text-pink-500 inline-flex items-center gap-1.5 select-none transform hover:scale-110 rotate-1 duration-200 transition-all';
                        customStyleObj = {
                          fontSize: '110%',
                          display: 'inline-flex',
                          margin: '2px 6px',
                          verticalAlign: 'middle',
                          textShadow: '2px 2px 0px #000'
                        };
                        wrapperElement = (
                          <span className={classes} style={customStyleObj}>
                            {leftEm && <span className="mr-0.5">{leftEm}</span>}
                            <span>{cleanText}</span>
                            {rightEm && <span className="ml-0.5">{rightEm}</span>}
                          </span>
                        );
                        break;
                      case 'nabla':
                        classes = 'font-nabla inline-flex items-center gap-1.5 select-none transform hover:scale-115 duration-200 transition-all';
                        customStyleObj = {
                          fontSize: '115%',
                          display: 'inline-flex',
                          margin: '2px 6px',
                          verticalAlign: 'middle'
                        };
                        wrapperElement = (
                          <span className={classes} style={customStyleObj}>
                            {leftEm && <span className="mr-0.5">{leftEm}</span>}
                            <span>{cleanText}</span>
                            {rightEm && <span className="ml-0.5">{rightEm}</span>}
                          </span>
                        );
                        break;
                      case 'splash':
                        classes = 'font-splash text-[#0891B2] inline-flex items-center gap-1 select-none transform hover:scale-110 rotate-[-1deg] duration-200 transition-all';
                        customStyleObj = {
                          fontSize: '115%',
                          display: 'inline-flex',
                          margin: '2px 6px',
                          verticalAlign: 'middle'
                        };
                        wrapperElement = (
                          <span className={classes} style={customStyleObj}>
                            {leftEm && <span className="mr-0.5">{leftEm}</span>}
                            <span>{cleanText}</span>
                            {rightEm && <span className="ml-0.5">{rightEm}</span>}
                          </span>
                        );
                        break;
                      default: // holo rainbow sticker
                        classes = 'font-sans font-black tracking-wide uppercase px-2.5 py-1 rounded bg-[#E63946] text-white inline-flex items-center gap-1.5 select-none transform hover:scale-110 hover:-rotate-1 duration-200 transition-all shadow-[3px_3px_0px_#1A1A1A] border-2 border-[#1A1A1A]';
                        customStyleObj = {
                          fontSize: '105%',
                          display: 'inline-flex',
                          margin: '2px 6px',
                          verticalAlign: 'middle'
                        };
                        wrapperElement = (
                          <span className={classes} style={customStyleObj}>
                            {leftEm && <span className="mr-0.5">{leftEm}</span>}
                            <span>{cleanText}</span>
                            {rightEm && <span className="ml-0.5">{rightEm}</span>}
                          </span>
                        );
                        break;
                    }

                    return (
                      <React.Fragment key={index}>
                        {wrapperElement}
                      </React.Fragment>
                    );
                  }
                  return <span key={index} className="mx-0.5">{part}</span>;
                });
              })()}
            </p>
          </div>
        )}

        {/* Page elements */}
        {[...page.items]
          .sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0))
          .map((item) => {
            const isSelected = selectedItemId === item.id;
            return (
              <div
                key={item.id}
                id={`item-element-${item.id}`}
                onMouseDown={(e) => handleItemMouseDown(e, item)}
                onTouchStart={(e) => handleItemTouchStart(e, item)}
                style={{
                  position: 'absolute',
                  left: `${item.x}%`,
                  top: `${item.y}%`,
                  transform: `translate(-50%, -50%) rotate(${item.rotation}deg) scale(${item.scale})`,
                  cursor: isPrintMode ? 'default' : 'move',
                  zIndex: 10 + (item.zIndex || 0),
                }}
                className={`transition-shadow p-1.5 rounded-lg ${
                  isSelected && !isPrintMode
                    ? 'ring-2 ring-violet-500 ring-offset-2 ring-offset-white shadow-xl'
                    : 'hover:ring-1 hover:ring-violet-300 hover:ring-opacity-60'
                }`}
              >
                {/* Visual selector helpers (only if edit mode & selected) */}
                {isSelected && !isPrintMode && (
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex items-center bg-gray-950 text-white text-xs py-1 px-2 rounded shadow-lg whitespace-nowrap gap-2 pointer-events-none">
                    <Move className="w-3.5 h-3.5 text-violet-400" />
                    <span>Trascia per muovere</span>
                  </div>
                )}

                {/* Render the actual item */}
                {item.type === 'character' ? (
                  <img
                    src={(item as CharacterItem).src}
                    alt={item.name}
                    referrerPolicy="no-referrer"
                    style={{
                      transform: (item as CharacterItem).isFlipped ? 'scaleX(-1)' : 'none',
                      maxHeight: '130px',
                      maxWidth: '130px',
                      objectFit: 'contain',
                    }}
                    className="pointer-events-none select-none drop-shadow-md"
                  />
                ) : (
                  <div
                    className={getArtisticTextClass(item as ArtisticTextItem)}
                    style={{
                      color: item.stylePreset === 'custom' ? (item as ArtisticTextItem).color : undefined,
                      fontSize: `${(item as ArtisticTextItem).fontSize}px`,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {(item as ArtisticTextItem).text}
                  </div>
                )}
              </div>
            );
          })}
      </div>

      {/* Item Quick-Control helper toolbar for selected element */}
      {selectedItemObj && !isPrintMode && (
        <div className="bg-white/80 backdrop-blur-md border border-violet-100 rounded-xl p-3 shadow-md flex flex-wrap md:flex-row items-center gap-3 justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-violet-700 bg-violet-50 px-2.5 py-1 rounded-md">
              {selectedItemObj.type === 'character' ? 'Personaggio' : 'Scrittura Artistica'}
            </span>
            <span className="text-xs text-gray-500 font-medium truncate max-w-[120px]">
              {selectedItemObj.type === 'character' ? selectedItemObj.name : `"${(selectedItemObj as ArtisticTextItem).text}"`}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Scale slider */}
            <div className="flex items-center gap-1.5 mr-2">
              <span className="text-xs font-medium text-gray-500">Scala:</span>
              <input
                type="range"
                min="0.3"
                max="2.5"
                step="0.1"
                value={selectedItemObj.scale}
                onChange={(e) => onUpdateItem(selectedItemObj.id, { scale: parseFloat(e.target.value) })}
                className="w-16 sm:w-24 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-violet-600"
              />
              <span className="text-xs font-bold text-gray-700 min-w-[28px] text-right">
                {Math.round(selectedItemObj.scale * 100)}%
              </span>
            </div>

            {/* Flip Horizontally button (character only) */}
            {selectedItemObj.type === 'character' && (
              <button
                onClick={() =>
                  onUpdateItem(selectedItemObj.id, {
                    isFlipped: !(selectedItemObj as CharacterItem).isFlipped,
                  })
                }
                title="Rifletti Orizzontalmente"
                className="p-1.5 hover:bg-violet-50 rounded-lg text-gray-600 hover:text-violet-600 transition-colors"
              >
                <FlipHorizontal className="w-4 h-4" />
              </button>
            )}

            {/* Rotate continuous button */}
            <button
              onClick={() => onUpdateItem(selectedItemObj.id, { rotation: (selectedItemObj.rotation + 15) % 360 })}
              title="Ruota 15 gradi"
              className="p-1.5 hover:bg-violet-50 rounded-lg text-gray-600 hover:text-violet-600 transition-colors"
            >
              <RotateCw className="w-4 h-4" />
            </button>

            {/* Z-Index layer arrangement */}
            <button
              onClick={() => {
                const otherItems = page.items.filter((it) => it.id !== selectedItemObj.id);
                const maxZ = otherItems.length > 0 ? Math.max(...otherItems.map((it) => it.zIndex || 0)) : 0;
                onUpdateItem(selectedItemObj.id, { zIndex: maxZ + 1 });
              }}
              title="Porta in Primo Piano"
              className="p-1.5 hover:bg-violet-50 rounded-lg text-gray-650 hover:text-violet-600 transition-colors"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                const otherItems = page.items.filter((it) => it.id !== selectedItemObj.id);
                const minZ = otherItems.length > 0 ? Math.min(...otherItems.map((it) => it.zIndex || 0)) : 0;
                onUpdateItem(selectedItemObj.id, { zIndex: minZ - 1 });
              }}
              title="Sposta in Secondo Piano"
              className="p-1.5 hover:bg-violet-50 rounded-lg text-gray-650 hover:text-violet-600 transition-colors"
            >
              <ArrowDown className="w-4 h-4" />
            </button>

            <span className="h-5 w-px bg-gray-200 mx-1"></span>

            {/* Delete button */}
            <button
              onClick={() => onDeleteItem(selectedItemObj.id)}
              title="Elimina Elemento"
              className="p-1.5 hover:bg-red-50 rounded-lg text-red-500 hover:text-red-650 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
