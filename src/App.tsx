import React, { useState, useEffect } from 'react';
import { BookData, PageData, BookItem } from './types';
import PageCanvas from './components/PageCanvas';
import Toolbar from './components/Toolbar';
import BookManager from './components/BookManager';
import { PREMADE_CHARACTERS } from './components/PremadeAssets';
import { BookOpen, Sparkles, Wand2, Info, BookCheck, Palette, FilePlus } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'crea_libri_progetto_autosave_v2';

const DEFAULT_BOOK: BookData = {
  title: 'Le Avventure del Drago Pippo',
  author: 'Silvia',
  pages: [
    {
      id: 'page_1',
      backgroundType: 'premade',
      backgroundValue: 'forest_twilight',
      narrativeText: 'C\'era una volta, nel fantastico Bosco Incantato, un piccolo drago di nome Pippo, che amava esplorare le radure segrete e cantare canzoni alle lucciole dorate.',
      narrativePosition: 'bottom',
      items: [
        {
          id: 'item_init_dragon',
          type: 'character',
          src: PREMADE_CHARACTERS[0].src,
          name: 'Drago Gentile',
          x: 33,
          y: 65,
          scale: 1.25,
          rotation: -5,
          zIndex: 1,
          isFlipped: false,
        },
        {
          id: 'item_init_text_1',
          type: 'artistic-text',
          text: 'RUGGITO! 🐉',
          x: 70,
          y: 35,
          scale: 1.3,
          rotation: -12,
          zIndex: 2,
          fontSize: 48,
          color: '',
          stylePreset: 'comic',
          fontFamily: 'Inter',
          fontWeight: 'bold',
        }
      ],
    },
    {
      id: 'page_2',
      backgroundType: 'premade',
      backgroundValue: 'cloud_castle',
      narrativeText: 'Un giorno Pippo volò fin sopra le nuvole e scoprì un castello fatato, dove volava una magica fata dalle ali azzurre pronta a regalargli un desiderio.',
      narrativePosition: 'bottom',
      items: [
        {
          id: 'item_init_fairy',
          type: 'character',
          src: PREMADE_CHARACTERS[1].src,
          name: 'Fata Splendente',
          x: 75,
          y: 58,
          scale: 1.1,
          rotation: 0,
          zIndex: 1,
          isFlipped: false,
        },
        {
          id: 'item_init_dragon_p2',
          type: 'character',
          src: PREMADE_CHARACTERS[0].src,
          name: 'Drago Pippo',
          x: 25,
          y: 68,
          scale: 0.95,
          rotation: 5,
          zIndex: 1,
          isFlipped: true, // Looking towards the fairy
        },
        {
          id: 'item_init_text_2',
          type: 'artistic-text',
          text: 'MAESTOSO! ✨',
          x: 48,
          y: 22,
          scale: 1.15,
          rotation: 4,
          zIndex: 2,
          fontSize: 42,
          color: '',
          stylePreset: 'fairy',
          fontFamily: 'Inter',
          fontWeight: 'bold',
        }
      ],
    }
  ],
};

export default function App() {
  const [book, setBook] = useState<BookData>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed.pages) && parsed.pages.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Impossibile caricare il libro salvato:', e);
    }
    return DEFAULT_BOOK;
  });

  const [activePageIndex, setActivePageIndex] = useState<number>(0);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  // Autosave when book edits occur
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(book));
  }, [book]);

  const currentPage = book.pages[activePageIndex] || book.pages[0];

  // Title / Author / Orientation mutations
  const handleUpdateMeta = (fields: { title?: string; author?: string; orientation?: 'landscape' | 'portrait' }) => {
    setBook((prev) => ({
      ...prev,
      ...fields,
    }));
  };

  // Background mutations
  const handleUpdateBackground = (type: 'color' | 'image' | 'premade', value: string) => {
    setBook((prev) => {
      const updatedPages = [...prev.pages];
      updatedPages[activePageIndex] = {
        ...updatedPages[activePageIndex],
        backgroundType: type,
        backgroundValue: value,
      };
      return { ...prev, pages: updatedPages };
    });
  };

  // Narrative block text mutation
  const handleUpdateNarrativeText = (
    text: string,
    position: 'top' | 'bottom' | 'floating-hidden',
    style?: 'transparent' | 'banner' | 'parchment',
    color?: string
  ) => {
    setBook((prev) => {
      const updatedPages = [...prev.pages];
      updatedPages[activePageIndex] = {
        ...updatedPages[activePageIndex],
        narrativeText: text,
        narrativePosition: position,
        narrativeStyle: style,
        narrativeColor: color,
      };
      return { ...prev, pages: updatedPages };
    });
  };

  // Add Item (draggable character/text)
  const handleAddItem = (item: BookItem) => {
    setBook((prev) => {
      const updatedPages = [...prev.pages];
      updatedPages[activePageIndex] = {
        ...updatedPages[activePageIndex],
        items: [...updatedPages[activePageIndex].items, item],
      };
      return { ...prev, pages: updatedPages };
    });
    setSelectedItemId(item.id); // Select it immediately
  };

  // Update properties of a single draggable item (position, scale, flip, etc.)
  const handleUpdateItem = (itemId: string, updatedFields: Partial<BookItem>) => {
    setBook((prev) => {
      const updatedPages = [...prev.pages];
      const pageItems = updatedPages[activePageIndex].items.map((item) => {
        if (item.id === itemId) {
          return { ...item, ...updatedFields } as BookItem;
        }
        return item;
      });

      updatedPages[activePageIndex] = {
        ...updatedPages[activePageIndex],
        items: pageItems,
      };
      return { ...prev, pages: updatedPages };
    });
  };

  // Delete a single item
  const handleDeleteItem = (itemId: string) => {
    setBook((prev) => {
      const updatedPages = [...prev.pages];
      updatedPages[activePageIndex] = {
        ...updatedPages[activePageIndex],
        items: updatedPages[activePageIndex].items.filter((item) => item.id !== itemId),
      };
      return { ...prev, pages: updatedPages };
    });
    if (selectedItemId === itemId) {
      setSelectedItemId(null);
    }
  };

  // Select item control
  const handleSelectItem = (id: string | null) => {
    setSelectedItemId(id);
  };

  // PAGE ACTIONS (Book Manager)
  const handleAddPage = () => {
    const newPage: PageData = {
      id: `page_${Date.now()}`,
      backgroundType: 'color',
      backgroundValue: '#fffdf5', // cream paper color default
      narrativeText: '',
      narrativePosition: 'bottom',
      items: [],
    };

    setBook((prev) => ({
      ...prev,
      pages: [...prev.pages, newPage],
    }));
    setActivePageIndex(book.pages.length); // Switch to new page
    setSelectedItemId(null);
  };

  const handleDuplicatePage = () => {
    const freshPageId = `page_dupe_${Date.now()}`;
    const clonedPage: PageData = {
      ...currentPage,
      id: freshPageId,
      // Create new unique item IDs for current copy
      items: currentPage.items.map((it) => ({
        ...it,
        id: `${it.id}_dupe_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      })),
    };

    setBook((prev) => {
      const updatedPages = [...prev.pages];
      // Insert duplicate page immediately after active index
      updatedPages.splice(activePageIndex + 1, 0, clonedPage);
      return { ...prev, pages: updatedPages };
    });

    setActivePageIndex(activePageIndex + 1);
    setSelectedItemId(null);
  };

  const handleDeletePage = () => {
    if (book.pages.length <= 1) return;

    setBook((prev) => {
      const updatedPages = prev.pages.filter((_, idx) => idx !== activePageIndex);
      return { ...prev, pages: updatedPages };
    });

    // Clamp active index
    setActivePageIndex((prevIndex) => Math.max(0, prevIndex - 1));
    setSelectedItemId(null);
  };

  const handleMovePage = (fromIndex: number, direction: 'left' | 'right') => {
    const toIndex = direction === 'left' ? fromIndex - 1 : fromIndex + 1;
    if (toIndex < 0 || toIndex >= book.pages.length) return;

    setBook((prev) => {
      const updatedPages = [...prev.pages];
      const pageToMove = updatedPages[fromIndex];
      // Swap positions
      updatedPages[fromIndex] = updatedPages[toIndex];
      updatedPages[toIndex] = pageToMove;
      return { ...prev, pages: updatedPages };
    });

    setActivePageIndex(toIndex);
    setSelectedItemId(null);
  };

  // Clear elements off current page
  const handleResetPage = () => {
    setBook((prev) => {
      const updatedPages = [...prev.pages];
      updatedPages[activePageIndex] = {
        ...updatedPages[activePageIndex],
        items: [],
      };
      return { ...prev, pages: updatedPages };
    });
    setSelectedItemId(null);
  };

  // Reset entire book draft
  const handleResetBook = () => {
    const cleanBook: BookData = {
      title: 'Nuovo Libro Illustrato',
      author: 'Autore',
      pages: [
        {
          id: `page_${Date.now()}`,
          backgroundType: 'color',
          backgroundValue: '#fffdf5',
          narrativeText: 'Inizia a scrivere la tua favola qui...',
          narrativePosition: 'bottom',
          items: [],
        },
      ],
    };
    setBook(cleanBook);
    setActivePageIndex(0);
    setSelectedItemId(null);
  };

  // Direct load project JSON
  const handleLoadBook = (loadedBook: BookData) => {
    setBook(loadedBook);
    setActivePageIndex(0);
    setSelectedItemId(null);
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-[#F9F7F2]">
      <div className="max-w-7xl mx-auto flex flex-col gap-6 font-sans">

        {/* Dynamic Studio Header - Artistic Flair style */}
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-6 border-b-2 border-r-2 border-[#D1CEC7] shadow-[4px_4px_0px_rgba(0,0,0,0.05)] rounded-none">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#E63946] flex items-center justify-center rounded-sm rotate-3 shadow-sm shrink-0">
              <span className="text-white font-serif font-bold text-2xl">L</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#E63946] bg-[#E63946]/10 px-2 py-0.5">
                  Storycraft Studio
                </span>
                <span className="flex items-center gap-1 text-[10px] text-amber-800 bg-[#F0EEE9] px-2 py-0.5 font-semibold border border-[#D1CEC7]">
                  <Wand2 className="w-3 h-3 text-[#E63946]" />
                  PDF Export Live
                </span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl italic tracking-tight font-black text-[#1A1A1A] mt-1">
                Storycraft / <span className="text-lg font-sans not-italic font-normal uppercase tracking-widest text-[#2D2D2D]/60">LibroVibo Editor</span>
              </h1>
            </div>
          </div>

          {/* Guidelines disclaimer */}
          <div className="flex items-center gap-3 max-w-sm text-xs bg-[#F0EEE9]/80 p-3 border border-[#D1CEC7] text-[#2D2D2D]">
            <Info className="w-5 h-5 text-[#E63946] shrink-0" />
            <span className="font-serif italic text-gray-700 leading-snug">
              <strong>Crea e Disegna:</strong> trascina ed organizza testi artistici e sfondi personali, poi esporta in un libro PDF stampabile della tua storia!
            </span>
          </div>
        </header>

        {/* Global Metadata Inputs (Configures the PDF/JSON Title & Book layout orientation) */}
        <div className="bg-white p-5 border border-[#D1CEC7] shadow-sm grid grid-cols-1 md:grid-cols-3 gap-5 rounded-none">
          <div>
            <label className="block text-xs font-bold text-[#2D2D2D] uppercase tracking-wider mb-2 flex items-center gap-1.5 font-sans">
              <BookCheck className="w-4 h-4 text-[#E63946]" />
              Titolo del Libro Illustrato:
            </label>
            <input
              type="text"
              value={book.title}
              onChange={(e) => handleUpdateMeta({ title: e.target.value })}
              placeholder="Es. Il Viaggio del Piccolo Astronauta"
              className="w-full px-4 py-2.5 border border-[#D1CEC7] bg-[#F9F7F2]/50 text-sm font-semibold text-[#1A1A1A] focus:bg-white focus:ring-1 focus:ring-[#1A1A1A] focus:outline-none placeholder-gray-400 font-serif italic"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#2D2D2D] uppercase tracking-wider mb-2 flex items-center gap-1.5 font-sans">
              <Palette className="w-4 h-4 text-[#E63946]" />
              Autore / Scrittore:
            </label>
            <input
              type="text"
              value={book.author}
              onChange={(e) => handleUpdateMeta({ author: e.target.value })}
              placeholder="Inserisci il tuo nome"
              className="w-full px-4 py-2.5 border border-[#D1CEC7] bg-[#F9F7F2]/50 text-sm font-semibold text-[#1A1A1A] focus:bg-white focus:ring-1 focus:ring-[#1A1A1A] focus:outline-none placeholder-gray-400 font-sans"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#2D2D2D] uppercase tracking-wider mb-2 flex items-center gap-1.5 font-sans">
              <BookOpen className="w-4 h-4 text-[#E63946]" />
              Orientamento della Pagina:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleUpdateMeta({ orientation: 'landscape' })}
                title="Scegli orientamento orizzontale classico"
                className={`py-2.5 px-3 border rounded-none text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  (book.orientation || 'landscape') === 'landscape'
                    ? 'border-[#1A1A1A] bg-[#1A1A1A] text-white shadow-sm'
                    : 'border-[#D1CEC7] hover:border-[#1A1A1A] text-gray-700 bg-white'
                }`}
              >
                Orizzontale 🌅
              </button>
              <button
                onClick={() => handleUpdateMeta({ orientation: 'portrait' })}
                title="Scegli orientamento verticale a ritratto"
                className={`py-2.5 px-3 border rounded-none text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  book.orientation === 'portrait'
                    ? 'border-[#1A1A1A] bg-[#1A1A1A] text-white shadow-sm'
                    : 'border-[#D1CEC7] hover:border-[#1A1A1A] text-gray-700 bg-white'
                }`}
              >
                Verticale 🗼
              </button>
            </div>
          </div>
        </div>

        {/* MAIN VISUAL WORKSPACE GRID */}
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT SECTION (Interactive Canvas Stage & Instructions) - 7 cols */}
          <section className="lg:col-span-7 flex flex-col gap-4">
            
            {/* Header info bar of the active page */}
            <div className="flex justify-between items-center bg-[#1A1A1A] text-white py-3 px-5 border-b-2 border-r-2 border-[#D1CEC7]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-[#E63946]" />
                <span className="text-xs font-bold tracking-wider uppercase font-mono text-gray-300">
                  Foglio di Lavoro Attivo
                </span>
              </div>
              <span className="text-xs font-serif italic font-bold text-[#FAF9F6] bg-[#E63946] px-3 py-1">
                Pagina {activePageIndex + 1} di {book.pages.length}
              </span>
            </div>

            {/* Main Page Stage Canvas (supports orizzontale/verticale layouts) */}
            <PageCanvas
              page={currentPage}
              selectedItemId={selectedItemId}
              onSelectItem={handleSelectItem}
              onUpdateItem={handleUpdateItem}
              onDeleteItem={handleDeleteItem}
              orientation={book.orientation || 'landscape'}
            />

            {/* Quick Helper Tip for layout integration */}
            <div className="bg-[#FAF9F6] border-l-4 border-[#E63946] border-y border-r border-[#D1CEC7] p-4 flex items-start gap-3 text-xs text-[#2D2D2D] shadow-sm">
              <Sparkles className="w-5 h-5 text-[#E63946] shrink-0 mt-0.5" />
              <div>
                <span className="font-serif italic font-bold block text-sm text-[#1A1A1A] mb-1">Integrazione artistica testo e disegno:</span> Seleziona una 
                <strong> "Scrittura Speciale"</strong> per aggiungere esclamazioni o incipit poetici sul foglio. 
                Puoi <strong>trascinarle liberamente</strong>, ruotarle e ridimensionarle affiancandole ai tuoi personaggi preferiti della faba.
              </div>
            </div>
          </section>

          {/* RIGHT SECTION (Design Control Toolbar & Assets) - 5 cols */}
          <section className="lg:col-span-5">
            <Toolbar
              currentPage={currentPage}
              onUpdateBackground={handleUpdateBackground}
              onUpdateNarrativeText={handleUpdateNarrativeText}
              onAddItem={handleAddItem}
            />
          </section>
        </main>

        {/* FOOTER SECTION (Book Manager Timeline & Sequences) - 12 cols */}
        <section className="w-full">
          <BookManager
            book={book}
            activePageIndex={activePageIndex}
            onSelectPage={setActivePageIndex}
            onAddPage={handleAddPage}
            onDuplicatePage={handleDuplicatePage}
            onDeletePage={handleDeletePage}
            onMovePage={handleMovePage}
            onResetPage={handleResetPage}
            onResetBook={handleResetBook}
            onLoadBook={handleLoadBook}
          />
        </section>

        {/* Global branding label */}
        <footer className="text-center py-6 text-gray-500 text-xs font-sans border-t border-[#D1CEC7]/65 mt-4">
          Storycraft / LibroVibo Libri Illustrati © {new Date().getFullYear()} — Creato appositamente per bambini, insegnanti e artisti sognatori.
        </footer>

      </div>
    </div>
  );
}
