import React, { useState, useRef } from 'react';
import { PageData, BookData } from '../types';
import { exportBookToPDF } from '../utils/pdfExporter';
import { PREMADE_BACKGROUNDS } from './PremadeAssets';
import {
  Plus,
  Copy,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Download,
  Upload,
  FileText,
  RotateCcw,
  BookOpen,
  Loader2,
  BookMarked
} from 'lucide-react';

interface BookManagerProps {
  book: BookData;
  activePageIndex: number;
  onSelectPage: (index: number) => void;
  onAddPage: () => void;
  onDuplicatePage: () => void;
  onDeletePage: () => void;
  onMovePage: (fromIndex: number, direction: 'left' | 'right') => void;
  onResetPage: () => void;
  onResetBook: () => void;
  onLoadBook: (loadedBook: BookData) => void;
}

export default function BookManager({
  book,
  activePageIndex,
  onSelectPage,
  onAddPage,
  onDuplicatePage,
  onDeletePage,
  onMovePage,
  onResetPage,
  onResetBook,
  onLoadBook,
}: BookManagerProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState({ current: 0, total: 0 });
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showClearPageConfirm, setShowClearPageConfirm] = useState(false);
  
  // JSON loading refs
  const jsonFileInputRef = useRef<HTMLInputElement>(null);

  // Trigger PDF build
  const handleExportPDF = async () => {
    if (book.pages.length === 0) return;
    setIsExporting(true);
    setExportProgress({ current: 0, total: book.pages.length });

    try {
      await exportBookToPDF(book.title, book.author, book.pages, book.orientation || 'landscape', (current, total) => {
        setExportProgress({ current: current + 1, total });
      });
    } catch (err) {
      console.error('Si è verificato un errore durante l\'esportazione del PDF:', err);
      alert('Spiacenti, si è verificato un errore durante la creazione del PDF. Riprova più tardi.');
    } finally {
      setIsExporting(false);
    }
  };

  // Trigger JSON project export (download file)
  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(book, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    
    const fileName = `${(book.title || 'il-mio-libro').toLowerCase().replace(/[^a-z0-9]+/g, '-')}-progetto.json`;
    downloadAnchor.setAttribute('download', fileName);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    document.body.removeChild(downloadAnchor);
  };

  // Trigger JSON project loaded
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const loadedData = JSON.parse(event.target?.result as string);
          if (loadedData && Array.isArray(loadedData.pages) && typeof loadedData.title === 'string') {
            onLoadBook(loadedData);
          } else {
            alert('Formato file JSON non valido per un libro illustrato.');
          }
        } catch (err) {
          alert('Impossibile interpretare il file JSON caricato. Verifica sia integro.');
        }
      };
      reader.readAsText(file);
    }
  };

  // Thumbnails rendering background helper
  const getThumbnailBackground = (page: PageData): React.CSSProperties => {
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

  return (
    <div className="flex flex-col gap-5 bg-white p-5 md:p-6 border border-[#D1CEC7] rounded-none shadow-[4px_4px_0_rgba(0,0,0,0.05)]">
      
      {/* Header with utility backups */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#D1CEC7] pb-3">
        <div className="flex items-center gap-2">
          <BookMarked className="w-5 h-5 text-[#E63946]" />
          <h3 className="text-sm font-serif italic font-bold text-[#1A1A1A]">Organizzazione Libri & Pagine</h3>
        </div>

        {/* Save/Load JSON utility buttons to avoid user draft loss */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleExportJSON}
            title="Esporta progetto libro in JSON per modificarlo in futuro"
            className="flex items-center gap-1 px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-[#2D2D2D] hover:bg-[#1A1A1A] hover:text-white border border-[#D1CEC7] bg-white transition-all rounded-none"
          >
            <Download className="w-3.5 h-3.5" />
            Salva Progetto
          </button>

          <button
            onClick={() => jsonFileInputRef.current?.click()}
            title="Carica un progetto libro JSON precedentemente salvato"
            className="flex items-center gap-1 px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-[#2D2D2D] hover:bg-[#1A1A1A] hover:text-white border border-[#D1CEC7] bg-white transition-all rounded-none"
          >
            <Upload className="w-3.5 h-3.5" />
            Carica Progetto
          </button>
          
          <input
            type="file"
            ref={jsonFileInputRef}
            onChange={handleImportJSON}
            accept=".json,application/json,text/json,text/plain,.txt"
            className="hidden"
          />
        </div>
      </div>

      {/* Pages Carousel / Timeline bar */}
      <div className="flex flex-col gap-3">
        <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#2D2D2D]/60">
          Pagine del Libro ({book.pages.length})
        </label>

        {/* Scrollable Row */}
        <div className="flex items-stretch gap-3 overflow-x-auto pb-3 pt-1 scrollbar-thin">
          {book.pages.map((page, index) => {
            const isActive = index === activePageIndex;
            return (
              <div
                key={page.id}
                onClick={() => onSelectPage(index)}
                className={`relative group flex flex-col justify-between shrink-0 w-24 sm:w-28 border rounded-none overflow-hidden cursor-pointer transition-all ${
                  isActive
                    ? 'ring-2 ring-[#1A1A1A] border-transparent shadow-[2px_2px_0px_rgba(0,0,0,0.15)] bg-[#FAF9F6]'
                    : 'border-[#D1CEC7] bg-white hover:border-[#1A1A1A]'
                }`}
              >
                {/* Visual miniature of the page */}
                <div
                  style={getThumbnailBackground(page)}
                  className="w-full aspect-[4/3] relative flex items-center justify-center border-b border-[#D1CEC7] bg-[#F0EEE9]"
                >
                  {/* Miniature of characters count or special word overlay */}
                  <div className="absolute inset-0 flex flex-wrap gap-0.5 p-1 items-center justify-center opacity-70">
                    {page.items.slice(0, 3).map((item) => (
                      <div
                        key={item.id}
                        className={`w-2.5 h-2.5 rounded-none ${
                          item.type === 'character' ? 'bg-[#E63946]' : 'bg-[#1A1A1A]'
                        }`}
                        title={item.type === 'character' ? 'Personaggio' : 'Testo artistico'}
                      />
                    ))}
                  </div>

                  <span className="absolute bottom-1 right-1 bg-[#1A1A1A] text-white font-mono text-[9px] px-1">
                    pag.{index + 1}
                  </span>
                </div>

                {/* Thumbnail footer label */}
                <div className="p-1 px-1.5 text-center bg-[#F0EEE9]/40 text-[10px] truncate max-w-full font-medium text-[#2D2D2D] group-hover:text-[#1A1A1A]">
                  {page.narrativeText ? page.narrativeText.slice(0, 15) + '...' : 'Senza testo'}
                </div>

                {/* Quick overlay indicator */}
                {isActive && (
                  <div className="absolute top-1 left-1 w-2.5 h-2.5 bg-[#E63946]" />
                )}
              </div>
            );
          })}

          {/* Quick inline appender button */}
          <button
            onClick={onAddPage}
            className="flex flex-col items-center justify-center shrink-0 w-24 sm:w-28 aspect-[4/3] border-2 border-dashed border-[#D1CEC7] hover:border-[#1A1A1A] hover:bg-white rounded-none transition-all gap-1 cursor-pointer"
          >
            <Plus className="w-5 h-5 text-[#2D2D2D]/60" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-tight text-[#2D2D2D]/60 text-center px-1">Aggiungi</span>
          </button>
        </div>
      </div>

      {/* Primary Actions for current active page */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 border-t border-[#D1CEC7] pt-4">
        <button
          onClick={onDuplicatePage}
          className="flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-mono font-bold uppercase tracking-wider text-[#2D2D2D] bg-white hover:bg-[#F0EEE9] border border-[#D1CEC7] rounded-none transition-colors"
        >
          <Copy className="w-3.5 h-3.5" />
          Duplica Pagina
        </button>

        {showClearPageConfirm ? (
          <button
            type="button"
            onClick={() => {
              onResetPage();
              setShowClearPageConfirm(false);
            }}
            className="flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-mono font-bold uppercase tracking-wider text-white bg-[#E63946] border border-[#E63946] rounded-none animate-pulse cursor-pointer"
            title="Clicca per svuotare i personaggi e scritti su questa pagina"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Confermi Svuota? ⚠️
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              setShowClearPageConfirm(true);
              setTimeout(() => setShowClearPageConfirm(false), 4000);
            }}
            title="Svuota tutti i personaggi e testi da questa pagina"
            className="flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-mono font-bold uppercase tracking-wider text-[#2D2D2D] bg-white hover:bg-[#F0EEE9] border border-[#D1CEC7] rounded-none transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Svuota Pagina
          </button>
        )}

        {/* Rearrange Page positions left-right */}
        <button
          onClick={() => onMovePage(activePageIndex, 'left')}
          disabled={activePageIndex === 0}
          className={`flex items-center justify-center gap-1 py-2 px-2 text-xs font-mono font-bold uppercase tracking-wider rounded-none border transition-colors ${
            activePageIndex === 0
              ? 'text-gray-400 bg-[#F0EEE9]/50 border-[#D1CEC7] cursor-not-allowed'
              : 'text-[#2D2D2D] bg-white hover:bg-[#F0EEE9] border-[#D1CEC7]'
          }`}
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          Sposta Sinistra
        </button>

        <button
          onClick={() => onMovePage(activePageIndex, 'right')}
          disabled={activePageIndex === book.pages.length - 1}
          className={`flex items-center justify-center gap-1 py-2 px-2 text-xs font-mono font-bold uppercase tracking-wider rounded-none border transition-colors ${
            activePageIndex === book.pages.length - 1
              ? 'text-gray-400 bg-[#F0EEE9]/50 border-[#D1CEC7] cursor-not-allowed'
              : 'text-[#2D2D2D] bg-white hover:bg-[#F0EEE9] border-[#D1CEC7]'
          }`}
        >
          Sposta Destra
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Delete and PDF Compilation Block */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2 items-center justify-between border-t border-[#D1CEC7] mt-1">
        <button
          onClick={onDeletePage}
          disabled={book.pages.length <= 1}
          className={`w-full sm:w-auto flex items-center justify-center gap-1.5 py-2 px-4 text-xs font-mono font-bold uppercase tracking-wider rounded-none border transition-colors ${
            book.pages.length <= 1
              ? 'text-gray-400 bg-[#F0EEE9]/50 cursor-not-allowed border-transparent'
              : 'text-amber-900 border-[#D1CEC7] bg-white hover:bg-[#E63946]/10 hover:text-[#E63946] hover:border-[#E63946]'
          }`}
        >
          <Trash2 className="w-3.5 h-3.5" />
          Elimina Pagina Attuale
        </button>

        {/* EXPORT TO PDF BUTTON - THE PRIMARY END CONVERSION CHANNEL */}
        <button
          onClick={handleExportPDF}
          disabled={isExporting}
          className="w-full sm:w-auto px-6 py-3 bg-[#1A1A1A] hover:bg-[#E63946] text-[#FAF9F6] font-serif font-black uppercase text-xs tracking-widest rounded-none shadow-[4px_4px_0_rgba(0,0,0,0.15)] hover:shadow-none transition-all duration-200 border border-[#1A1A1A] flex items-center justify-center gap-2"
        >
          {isExporting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-[#FAF9F6]" />
              <span>Esportazione PDF... ({exportProgress.current}/{exportProgress.total})</span>
            </>
          ) : (
            <>
              <FileText className="w-4.5 h-4.5 text-[#FAF9F6]" />
              <span>Esporta Libro Completo in PDF 📚</span>
            </>
          )}
        </button>
      </div>

      {/* Clean global reset helper */}
      <div className="flex justify-end pt-1">
        {showResetConfirm ? (
          <div className="flex items-center gap-2 bg-amber-50 p-2 border border-amber-200 animate-fade-in">
            <span className="text-[10px] font-serif italic text-amber-900">Sei sicuro? Perdi tutte le pagine create.</span>
            <button
              type="button"
              onClick={() => {
                onResetBook();
                setShowResetConfirm(false);
              }}
              className="text-[10px] text-white bg-[#E63946] px-2 py-0.5 font-bold uppercase tracking-wider cursor-pointer"
            >
              Sì, Nuovo Libro 📖
            </button>
            <button
              type="button"
              onClick={() => setShowResetConfirm(false)}
              className="text-[10px] text-gray-500 hover:text-gray-700 underline font-mono cursor-pointer"
            >
              Annulla
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowResetConfirm(true)}
            className="text-[10px] text-gray-500 hover:text-[#E63946] hover:underline transition-colors font-serif italic font-medium cursor-pointer"
          >
            Ricomincia da Capo (Nuovo Libro) 🔄
          </button>
        )}
      </div>
    </div>
  );
}
