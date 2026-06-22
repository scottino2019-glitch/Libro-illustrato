import React, { useState, useRef } from 'react';
import { PageData, BookItem, ArtisticTextItem, CharacterItem } from '../types';
import { PREMADE_BACKGROUNDS, PREMADE_CHARACTERS } from './PremadeAssets';
import { Sparkles, Image as ImageIcon, User as UserIcon, Type, FileImage, Upload, HelpCircle } from 'lucide-react';

interface ToolbarProps {
  currentPage: PageData;
  onUpdateBackground: (type: 'color' | 'image' | 'premade', value: string) => void;
  onUpdateNarrativeText: (
    text: string,
    position: 'top' | 'bottom' | 'floating-hidden',
    style?: 'transparent' | 'banner' | 'parchment',
    color?: string
  ) => void;
  onAddItem: (item: BookItem) => void;
}

export default function Toolbar({
  currentPage,
  onUpdateBackground,
  onUpdateNarrativeText,
  onAddItem,
}: ToolbarProps) {
  const [activeTab, setActiveTab] = useState<'background' | 'character' | 'text-art' | 'narrative'>('character');

  // Background customization state
  const bgColors = ['#fdf0d5', '#fffdf5', '#f3f4f6', '#ecfdf5', '#eff6ff', '#fff1f2', '#1e293b', '#000000'];

  // File input refs
  const bgFileInputRef = useRef<HTMLInputElement>(null);
  const charFileInputRef = useRef<HTMLInputElement>(null);

  // Artistic text state
  const [artText, setArtText] = useState('');
  const [quickArtText, setQuickArtText] = useState('');
  const [inlineArtisticText, setInlineArtisticText] = useState('');
  const [textPreset, setTextPreset] = useState<'comic' | 'fairy' | 'spooky' | 'gold' | 'antique' | 'bubble' | 'custom' | 'kablammo' | 'nabla' | 'splash'>('comic');
  const [customColor, setCustomColor] = useState('#ec4899');
  const [customSize, setCustomSize] = useState(36);

  // Drag-and-drop visual states
  const [isBgDragOver, setIsBgDragOver] = useState(false);
  const [isCharDragOver, setIsCharDragOver] = useState(false);

  // Helper file uploader base64 reader
  const handleImageUpload = (file: File, destination: 'bg' | 'char') => {
    if (!file.type.startsWith('image/')) {
      alert('Carica un file di tipo immagine valido.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (destination === 'bg') {
        onUpdateBackground('image', dataUrl);
      } else {
        const newChar: CharacterItem = {
          id: `char_custom_${Date.now()}`,
          type: 'character',
          src: dataUrl,
          name: file.name.split('.')[0] || 'Caricato',
          x: 50,
          y: 50,
          scale: 1.0,
          rotation: 0,
          isFlipped: false,
          zIndex: currentPage.items.length + 1,
        };
        onAddItem(newChar);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent, setDragOver: (b: boolean) => void) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent, setDragOver: (b: boolean) => void) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent, destination: 'bg' | 'char', setDragOver: (b: boolean) => void) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleImageUpload(e.dataTransfer.files[0], destination);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, destination: 'bg' | 'char') => {
    if (e.target.files && e.target.files.length > 0) {
      handleImageUpload(e.target.files[0], destination);
    }
  };

  // Add Artistic word
  const handleAddArtisticText = () => {
    if (!artText.trim()) return;

    const newArtTextItem: ArtisticTextItem = {
      id: `text_art_${Date.now()}`,
      type: 'artistic-text',
      text: artText.trim(),
      x: 50,
      y: 40,
      scale: 1,
      rotation: 0,
      zIndex: currentPage.items.length + 1,
      fontSize: customSize,
      color: textPreset === 'custom' ? customColor : '#000000',
      stylePreset: textPreset,
      fontFamily: 'Inter',
      fontWeight: 'bold',
    };

    onAddItem(newArtTextItem);
    setArtText(''); // reset
  };

  // Add Quick Artistic word from narrative tab
  const handleAddQuickArtisticText = () => {
    if (!quickArtText.trim()) return;

    const newArtTextItem: ArtisticTextItem = {
      id: `text_art_quick_${Date.now()}`,
      type: 'artistic-text',
      text: quickArtText.trim(),
      x: 50,
      y: 45,
      scale: 1,
      rotation: 0,
      zIndex: currentPage.items.length + 1,
      fontSize: 34,
      color: '#EC4899', // nice default pink
      stylePreset: 'fairy', // cute default
      fontFamily: 'Inter',
      fontWeight: 'bold',
    };

    onAddItem(newArtTextItem);
    setQuickArtText('');
  };

  // Insert structured inline artistic styled tag in the narrative text
  const handleInsertInlineArtistic = (stylePresetName: 'comic' | 'fairy' | 'spooky' | 'gold' | 'antique' | 'bubble' | 'kablammo' | 'nabla' | 'splash') => {
    const word = inlineArtisticText.trim();
    if (!word) return;

    const formattedTag = `*${stylePresetName}:${word}*`;
    const currentNarrative = currentPage.narrativeText || '';
    const updatedNarrative = currentNarrative ? `${currentNarrative.trim()} ${formattedTag}` : formattedTag;

    onUpdateNarrativeText(
      updatedNarrative,
      currentPage.narrativePosition,
      currentPage.narrativeStyle,
      currentPage.narrativeColor
    );
    setInlineArtisticText(''); // clear custom input
  };

  return (
    <div className="bg-white p-5 md:p-6 border border-[#D1CEC7] rounded-none shadow-[4px_4px_0px_rgba(0,0,0,0.05)] flex flex-col gap-6">
      {/* Category Tabs */}
      <div className="flex border-b border-[#D1CEC7] pb-3 overflow-x-auto gap-2 scrollbar-thin">
        <button
          onClick={() => setActiveTab('character')}
          className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-mono font-bold uppercase tracking-wider rounded-none shrink-0 border transition-all ${
            activeTab === 'character'
              ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
              : 'text-[#2D2D2D] border-[#D1CEC7] bg-white hover:bg-[#FAF9F6] hover:border-[#1A1A1A]'
          }`}
        >
          <UserIcon className="w-3.5 h-3.5" />
          Personaggi & Oggetti
        </button>

        <button
          onClick={() => setActiveTab('text-art')}
          className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-mono font-bold uppercase tracking-wider rounded-none shrink-0 border transition-all ${
            activeTab === 'text-art'
              ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
              : 'text-[#2D2D2D] border-[#D1CEC7] bg-white hover:bg-[#FAF9F6] hover:border-[#1A1A1A]'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          Scritture Artistiche
        </button>

        <button
          onClick={() => setActiveTab('background')}
          className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-mono font-bold uppercase tracking-wider rounded-none shrink-0 border transition-all ${
            activeTab === 'background'
              ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
              : 'text-[#2D2D2D] border-[#D1CEC7] bg-white hover:bg-[#FAF9F6] hover:border-[#1A1A1A]'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          Sfondi & Colori
        </button>

        <button
          onClick={() => setActiveTab('narrative')}
          className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-mono font-bold uppercase tracking-wider rounded-none shrink-0 border transition-all ${
            activeTab === 'narrative'
              ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
              : 'text-[#2D2D2D] border-[#D1CEC7] bg-white hover:bg-[#FAF9F6] hover:border-[#1A1A1A]'
          }`}
        >
          <Type className="w-3.5 h-3.5" />
          Testo Narrativo
        </button>
      </div>

      {/* Content Areas */}
      <div className="flex-1 min-h-[350px]">
        {/* CHARACTER TAB */}
        {activeTab === 'character' && (
          <div className="flex flex-col gap-5">
            <div>
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#1A1A1A] mb-1">Aggiungi Personaggio Personale</h3>
              <p className="text-[11px] text-gray-500 font-serif italic">Trascina un disegno, foto o PNG trasparente per aggiungerlo direttamente alla scena.</p>
            </div>

            {/* Drag & Drop Upload Zone */}
            <div
              onDragOver={(e) => handleDragOver(e, setIsCharDragOver)}
              onDragLeave={(e) => handleDragLeave(e, setIsCharDragOver)}
              onDrop={(e) => handleDrop(e, 'char', setIsCharDragOver)}
              onClick={() => charFileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-none p-5 text-center cursor-pointer transition-all ${
                isCharDragOver
                  ? 'border-[#E63946] bg-[#FAF9F6]'
                  : 'border-[#D1CEC7] hover:border-[#1A1A1A] bg-[#FAF9F6]/40'
              }`}
            >
              <input
                type="file"
                ref={charFileInputRef}
                onChange={(e) => handleFileChange(e, 'char')}
                accept="image/*"
                className="hidden"
              />
              <Upload className="w-7 h-7 text-gray-400 mx-auto mb-2" />
              <p className="text-xs font-mono font-bold uppercase tracking-wider text-[#2D2D2D]">Seleziona o Trascina file</p>
              <p className="text-[11px] text-gray-500 font-serif italic mt-1">Carica PNG, JPG, SVG (ottimale con sfondo trasparente)</p>
            </div>

            {/* Premade Cast of characters */}
            <div>
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#1A1A1A] mb-3">O usa un Personaggio Magico:</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {PREMADE_CHARACTERS.map((char) => (
                  <button
                    key={char.id}
                    onClick={() => {
                      const newChar: CharacterItem = {
                        id: `${char.id}_${Date.now()}`,
                        type: 'character',
                        src: char.src,
                        name: char.name,
                        x: 50,
                        y: 50,
                        scale: 1.0,
                        rotation: 0,
                        isFlipped: false,
                        zIndex: currentPage.items.length + 1,
                      };
                      onAddItem(newChar);
                    }}
                    className="flex flex-col items-center p-3 border border-[#D1CEC7] rounded-none hover:border-[#1A1A1A] hover:bg-[#FAF9F6] transition-all text-center group bg-white shadow-[2px_2px_0px_rgba(0,0,0,0.02)]"
                  >
                    <div className="w-14 h-14 overflow-hidden mb-2 flex items-center justify-center p-1 rounded-none bg-[#F0EEE9] group-hover:bg-white border border-[#D1CEC7]">
                      <img src={char.src} alt={char.name} referrerPolicy="no-referrer" className="max-w-full max-h-full" />
                    </div>
                    <span className="text-xs font-serif italic text-gray-700 group-hover:text-[#191919] truncate w-full">
                      {char.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ARTISTIC TEXT TAB */}
        {activeTab === 'text-art' && (
          <div className="flex flex-col gap-5">
            <div>
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#1A1A1A] mb-1">Enfatizza un momento della storia</h3>
              <p className="text-[11px] text-gray-500 font-serif italic mb-2">
                Aggiungi testi speciali con caratteri artistici giganti, ideali per simboleggiare i momenti magici della narrazione.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-gray-500 mb-1">Scrivi la parola o frase d'impatto:</label>
                <input
                  type="text"
                  placeholder="Es. SBOOM!, RUGGITO!, Silenzio..., Un giorno lontano..."
                  value={artText}
                  onChange={(e) => setArtText(e.target.value)}
                  className="w-full px-4 py-2 border border-[#D1CEC7] rounded-none bg-[#FAF9F6]/20 text-gray-800 placeholder-gray-400 focus:ring-1 focus:ring-[#1A1A1A] focus:border-[#1A1A1A] focus:outline-none font-serif text-sm italic"
                />
              </div>

              {/* Style Presets */}
              <div>
                <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-gray-500 mb-2">Scegli uno Stile Artistico:</label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    onClick={() => setTextPreset('comic')}
                    className={`p-2.5 border rounded-none text-left font-bold italic transition-all ${
                      textPreset === 'comic'
                        ? 'border-[#1A1A1A] bg-[#1A1A1A]/5 text-[#1A1A1A] shadow-sm ring-1 ring-[#1A1A1A]'
                        : 'border-[#D1CEC7] hover:border-[#1A1A1A] text-gray-700 bg-white'
                    }`}
                  >
                    <span className="text-yellow-600 font-serif font-black uppercase inline-block mr-1">BOOM!</span>
                    <span className="text-[10px] opacity-75 font-normal block font-sans">Azione / Suono</span>
                  </button>

                  <button
                    onClick={() => setTextPreset('fairy')}
                    className={`p-2.5 border rounded-none text-left font-serif italic transition-all ${
                      textPreset === 'fairy'
                        ? 'border-[#1A1A1A] bg-[#1A1A1A]/5 text-[#1A1A1A] shadow-sm ring-1 ring-[#1A1A1A]'
                        : 'border-[#D1CEC7] hover:border-[#1A1A1A] text-gray-700 bg-white'
                    }`}
                  >
                    <span className="text-[#E63946] font-semibold text-sm block">Magica ✨</span>
                    <span className="text-[10px] opacity-75 font-normal block font-sans">Fiaba / Luccichio</span>
                  </button>

                  <button
                    onClick={() => setTextPreset('spooky')}
                    className={`p-2.5 border rounded-none text-left font-mono transition-all ${
                      textPreset === 'spooky'
                        ? 'border-[#1A1A1A] bg-[#1A1A1A]/5 text-[#1A1A1A] shadow-sm ring-1 ring-[#1A1A1A]'
                        : 'border-[#D1CEC7] hover:border-[#1A1A1A] text-gray-700 bg-white'
                    }`}
                  >
                    <span className="text-violet-700 font-extrabold block uppercase text-sm">SPETTRALE 👻</span>
                    <span className="text-[10px] opacity-75 font-normal block font-sans">Mistero / Mostro</span>
                  </button>

                  <button
                    onClick={() => setTextPreset('gold')}
                    className={`p-2.5 border rounded-none text-left font-sans transition-all ${
                      textPreset === 'gold'
                        ? 'border-[#1A1A1A] bg-[#1A1A1A]/5 text-[#1A1A1A] shadow-sm ring-1 ring-[#1A1A1A]'
                        : 'border-[#D1CEC7] hover:border-[#1A1A1A] text-gray-700 bg-white'
                    }`}
                  >
                    <span className="font-extrabold text-amber-600 block text-sm">👑 REGALE</span>
                    <span className="text-[10px] opacity-75 font-normal block font-sans">Leggendario / Oro</span>
                  </button>

                  <button
                    onClick={() => setTextPreset('antique')}
                    className={`p-2.5 border rounded-none text-left font-serif transition-all ${
                      textPreset === 'antique'
                        ? 'border-[#1A1A1A] bg-[#1A1A1A]/5 text-[#1A1A1A] shadow-sm ring-1 ring-[#1A1A1A]'
                        : 'border-[#D1CEC7] hover:border-[#1A1A1A] text-gray-700 bg-white'
                    }`}
                  >
                    <span className="font-bold text-amber-950 block text-sm underline decoration-double">Antica</span>
                    <span className="text-[10px] opacity-75 font-normal block font-sans">Pergamena / Storico</span>
                  </button>

                  <button
                    onClick={() => setTextPreset('bubble')}
                    className={`p-2.5 border rounded-none text-left transition-all ${
                      textPreset === 'bubble'
                        ? 'border-[#1A1A1A] bg-[#1A1A1A]/5 text-[#1A1A1A] shadow-sm ring-1 ring-[#1A1A1A]'
                        : 'border-[#D1CEC7] hover:border-[#1A1A1A] text-gray-700 bg-white'
                    }`}
                  >
                    <span className="font-extrabold text-[#E63946] block text-xs">FESTOSA 🎈</span>
                    <span className="text-[10px] opacity-75 font-normal block font-sans">Divertente / Colorata</span>
                  </button>

                  <button
                    onClick={() => setTextPreset('kablammo')}
                    className={`p-2.5 border rounded-none text-left transition-all ${
                      textPreset === 'kablammo'
                        ? 'border-[#1A1A1A] bg-[#1A1A1A]/5 text-[#1A1A1A] shadow-sm ring-1 ring-[#1A1A1A]'
                        : 'border-[#D1CEC7] hover:border-[#1A1A1A] text-gray-700 bg-white'
                    }`}
                  >
                    <span className="font-kablammo text-pink-500 block text-xs">KABLAMMO 🤪</span>
                    <span className="text-[10px] opacity-75 font-normal block font-sans">Buffa / Cartoon</span>
                  </button>

                  <button
                    onClick={() => setTextPreset('nabla')}
                    className={`p-2.5 border rounded-none text-left transition-all ${
                      textPreset === 'nabla'
                        ? 'border-[#1A1A1A] bg-[#1A1A1A]/5 text-[#1A1A1A] shadow-sm ring-1 ring-[#1A1A1A]'
                        : 'border-[#D1CEC7] hover:border-[#1A1A1A] text-gray-700 bg-white'
                    }`}
                  >
                    <span className="font-nabla block text-xs">Nabla 🟥🟨</span>
                    <span className="text-[10px] opacity-75 font-normal block font-sans">Colorata 3D</span>
                  </button>

                  <button
                    onClick={() => setTextPreset('splash')}
                    className={`p-2.5 border rounded-none text-left transition-all ${
                      textPreset === 'splash'
                        ? 'border-[#1A1A1A] bg-[#1A1A1A]/5 text-[#1A1A1A] shadow-sm ring-1 ring-[#1A1A1A]'
                        : 'border-[#D1CEC7] hover:border-[#1A1A1A] text-gray-700 bg-white'
                    }`}
                  >
                    <span className="font-splash text-[#0891B2] block text-xs">Splash 💦</span>
                    <span className="text-[10px] opacity-75 font-normal block font-sans">Pittura / Ink</span>
                  </button>

                  <button
                    onClick={() => setTextPreset('custom')}
                    className={`p-2.5 border rounded-none text-left transition-all col-span-2 ${
                      textPreset === 'custom'
                        ? 'border-[#1A1A1A] bg-[#1A1A1A]/5 text-[#1A1A1A] shadow-sm ring-1 ring-[#1A1A1A]'
                        : 'border-[#D1CEC7] hover:border-[#1A1A1A] text-gray-700 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-800 text-sm">🎨 Semplice Personalizzato</span>
                      <input
                        type="color"
                        value={customColor}
                        onChange={(e) => {
                          setTextPreset('custom');
                          setCustomColor(e.target.value);
                        }}
                        className="w-6 h-6 rounded-none cursor-pointer border border-[#D1CEC7]"
                      />
                    </div>
                    <span className="text-[10px] opacity-75 font-normal block font-sans">Scegli colore, trascinabile</span>
                  </button>
                </div>
              </div>

              {/* Size Slider */}
              <div>
                <div className="flex justify-between text-[10px] font-mono font-bold text-gray-550 uppercase tracking-wider mb-1.5">
                  <span>Dimensione Scritta:</span>
                  <span className="text-[#E63946] font-mono">{customSize}px</span>
                </div>
                <input
                  type="range"
                  min="16"
                  max="110"
                  value={customSize}
                  onChange={(e) => setCustomSize(parseInt(e.target.value))}
                  className="w-full h-1 bg-[#D1CEC7] appearance-none cursor-pointer accent-[#E63946]"
                />
              </div>

              <button
                onClick={handleAddArtisticText}
                disabled={!artText.trim()}
                className={`w-full py-2.5 px-4 rounded-none font-serif font-bold uppercase tracking-wider flex items-center justify-center gap-2 border transition-all text-xs ${
                  artText.trim()
                    ? 'bg-[#1A1A1A] hover:bg-[#E63946] text-white border-[#1A1A1A] shadow-[2px_2px_0px_rgba(0,0,0,0.1)] active:translate-y-0.5'
                    : 'bg-[#F0EEE9] text-gray-400 border-[#D1CEC7] cursor-not-allowed'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                Aggiungi Scritta Speciale alla Pagina
              </button>
            </div>
          </div>
        )}

        {/* BACKGROUNDS & COLORS TAB */}
        {activeTab === 'background' && (
          <div className="flex flex-col gap-5">
            <div>
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#1A1A1A] mb-1">Cambia l'Ambiente della Pagina</h3>
              <p className="text-[11px] text-gray-500 font-serif italic">Imposta uno sfondo personale, un luogo fiabesco pre-disegnato o un colore solido.</p>
            </div>

            {/* Custom Background Upload Zone */}
            <div
              onDragOver={(e) => handleDragOver(e, setIsBgDragOver)}
              onDragLeave={(e) => handleDragLeave(e, setIsBgDragOver)}
              onDrop={(e) => handleDrop(e, 'bg', setIsBgDragOver)}
              onClick={() => bgFileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-none p-5 text-center cursor-pointer transition-all ${
                isBgDragOver
                  ? 'border-[#E63946] bg-[#FAF9F6]'
                  : 'border-[#D1CEC7] hover:border-[#1A1A1A] bg-[#FAF9F6]/40'
              }`}
            >
              <input
                type="file"
                ref={bgFileInputRef}
                onChange={(e) => handleFileChange(e, 'bg')}
                accept="image/*"
                className="hidden"
              />
              <FileImage className="w-7 h-7 text-gray-400 mx-auto mb-1.5" />
              <p className="text-xs font-mono font-bold uppercase tracking-wider text-[#2D2D2D]">Carica Sfondo Personale</p>
              <p className="text-[11px] text-gray-550 font-serif italic mt-0.5">Trascina un disegno panoramico o foto</p>
            </div>

            {/* Solid Colors */}
            <div>
              <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#2D2D2D]/60 mb-2.5">O Scegli un Colore Solido:</h4>
              <div className="flex flex-wrap gap-2">
                {bgColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => onUpdateBackground('color', color)}
                    style={{ backgroundColor: color }}
                    title={color}
                    className={`w-8 h-8 rounded-none border transition-all hover:scale-105 shadow-sm ${
                      currentPage.backgroundType === 'color' && currentPage.backgroundValue === color
                        ? 'border-[#1A1A1A] ring-1 ring-[#1A1A1A] scale-105'
                        : 'border-[#D1CEC7]'
                    }`}
                  />
                ))}
                {/* Custom Color Input */}
                <input
                  type="color"
                  value={currentPage.backgroundType === 'color' ? currentPage.backgroundValue : '#ffffff'}
                  onChange={(e) => onUpdateBackground('color', e.target.value)}
                  title="Scegli Colore Personalizzato"
                  className="w-8 h-8 rounded-none cursor-pointer border border-[#D1CEC7] overflow-hidden"
                />
              </div>
            </div>

            {/* Premade Backgrounds List */}
            <div>
              <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#2D2D2D]/60 mb-2.5">Luoghi Magici di Default:</h4>
              <div className="grid grid-cols-2 gap-3">
                {PREMADE_BACKGROUNDS.map((bg) => (
                  <button
                    key={bg.id}
                    onClick={() => onUpdateBackground('premade', bg.id)}
                    className={`flex flex-col text-left p-1.5 border rounded-none overflow-hidden transition-all group ${
                      currentPage.backgroundType === 'premade' && currentPage.backgroundValue === bg.id
                        ? 'border-[#1A1A1A] bg-[#FAF9F6]'
                        : 'border-[#D1CEC7] hover:border-[#1A1A1A] bg-white'
                    }`}
                  >
                    <div className="w-full aspect-[4/3] rounded-none overflow-hidden bg-gray-50 mb-1 border border-[#D1CEC7]">
                      <img src={bg.src} alt={bg.name} referrerPolicy="no-referrer" className="w-full h-full object-cover group-hover:scale-105 transition-all duration-350" />
                    </div>
                    <span className="text-xs font-serif italic text-gray-700 px-1 truncate w-full group-hover:text-[#1A1A1A]">
                      {bg.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* NARRATIVE TEXT TAB */}
        {activeTab === 'narrative' && (
          <div className="flex flex-col gap-5">
            <div>
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#1A1A1A] mb-1">Aggiungi la Favola / Narrazione principale</h3>
              <p className="text-[11px] text-gray-500 font-serif italic">Inserisci le righe principali del racconto. Queste verranno mostrate sul libro.</p>
            </div>

            <div>
              <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-gray-700 mb-1">Testo Narrativo per questa pagina:</label>
              <textarea
                rows={4}
                placeholder="C'era una volta, nel cuore della foresta lucente, un piccolo drago curioso che sognava di volare sopra le nuvole dorate..."
                value={currentPage.narrativeText}
                onChange={(e) => onUpdateNarrativeText(e.target.value, currentPage.narrativePosition, currentPage.narrativeStyle, currentPage.narrativeColor)}
                className="w-full px-4 py-2.5 border border-[#D1CEC7] rounded-none bg-[#FAF9F6]/20 text-gray-800 placeholder-gray-400 focus:ring-1 focus:ring-[#1A1A1A] focus:border-[#1A1A1A] focus:outline-none font-serif text-sm leading-relaxed"
              />
              
              {/* Mixed normal and artistic word helper panel */}
              <div className="mt-3 p-3 bg-amber-50/70 border border-[#D1CEC7] rounded-none">
                <span className="block text-[11px] font-sans font-bold text-[#E63946] uppercase mb-1.5 flex items-center gap-1 justify-between">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-[#E63946]" />
                    Alternanza Parole Artistiche:
                  </span>
                  <span className="text-[9px] bg-[#E63946]/10 text-[#E63946] px-1.5 py-0.2 font-mono rounded font-bold">STILI REALI 🎨</span>
                </span>
                
                <p className="text-[10px] text-gray-600 font-serif leading-relaxed mb-3">
                  Adesso puoi inserire parole con gli stessi stili dei titoli! Scrivi una parola, scegli uno stile qui sotto e comparirà nel testo con un'animazione o colorazione favolosa:
                </p>

                {/* Input for the word */}
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    placeholder="Scrivi qui la parola ad effetto (es: DRAGO, FATINA, SBOOM)..."
                    value={inlineArtisticText}
                    onChange={(e) => setInlineArtisticText(e.target.value)}
                    className="flex-1 px-2.5 py-1.5 border border-[#D1CEC7] rounded-none text-xs font-sans bg-white placeholder-gray-400 focus:outline-none focus:border-[#1A1A1A]"
                  />
                </div>

                {/* Style buttons */}
                <div>
                  <span className="block text-[9px] font-sans font-bold uppercase tracking-wider text-gray-500 mb-1.5">Tocca lo stile per inserire la parola nel racconto:</span>
                  <div className="grid grid-cols-3 gap-1">
                    <button
                      type="button"
                      disabled={!inlineArtisticText.trim()}
                      onClick={() => handleInsertInlineArtistic('comic')}
                      className={`py-1.5 px-2 text-[10px] font-bold text-center border cursor-pointer border-yellow-350 bg-yellow-100 hover:bg-yellow-200 text-yellow-905 transition-colors ${!inlineArtisticText.trim() ? 'opacity-40 cursor-not-allowed' : ''}`}
                      title="Stile fumetto vivace con contorno e ombre"
                    >
                      💥 Fumetto
                    </button>
                    <button
                      type="button"
                      disabled={!inlineArtisticText.trim()}
                      onClick={() => handleInsertInlineArtistic('fairy')}
                      className={`py-1.5 px-2 text-[10px] font-bold text-center border cursor-pointer border-pink-350 bg-pink-100 hover:bg-pink-200 text-pink-905 transition-colors ${!inlineArtisticText.trim() ? 'opacity-40 cursor-not-allowed' : ''}`}
                      title="Stile magico rosa con bagliore"
                    >
                      ✨ Magico
                    </button>
                    <button
                      type="button"
                      disabled={!inlineArtisticText.trim()}
                      onClick={() => handleInsertInlineArtistic('spooky')}
                      className={`py-1.5 px-2 text-[10px] font-bold text-center border cursor-pointer border-lime-350 bg-lime-100 hover:bg-lime-200 text-lime-905 transition-colors ${!inlineArtisticText.trim() ? 'opacity-40 cursor-not-allowed' : ''}`}
                      title="Stile spaventoso verde brillante"
                    >
                      🧟 Spaventoso
                    </button>
                    <button
                      type="button"
                      disabled={!inlineArtisticText.trim()}
                      onClick={() => handleInsertInlineArtistic('gold')}
                      className={`py-1.5 px-2 text-[10px] font-bold text-center border cursor-pointer border-amber-350 bg-amber-100 hover:bg-amber-200 text-amber-905 transition-colors ${!inlineArtisticText.trim() ? 'opacity-40 cursor-not-allowed' : ''}`}
                      title="Stile dorato scintillante premium"
                    >
                      👑 Dorato
                    </button>
                    <button
                      type="button"
                      disabled={!inlineArtisticText.trim()}
                      onClick={() => handleInsertInlineArtistic('antique')}
                      className={`py-1.5 px-2 text-[10px] font-bold text-center border cursor-pointer border-amber-800 bg-amber-50 hover:bg-amber-150 text-amber-950 transition-colors ${!inlineArtisticText.trim() ? 'opacity-40 cursor-not-allowed' : ''}`}
                      title="Stile antico d'epoca regale"
                    >
                      📜 Antico
                    </button>
                    <button
                      type="button"
                      disabled={!inlineArtisticText.trim()}
                      onClick={() => handleInsertInlineArtistic('bubble')}
                      className={`py-1.5 px-2 text-[10px] font-bold text-center border cursor-pointer border-sky-350 bg-sky-100 hover:bg-sky-200 text-sky-905 transition-colors ${!inlineArtisticText.trim() ? 'opacity-40 cursor-not-allowed' : ''}`}
                      title="Stile bolla lucido e azzurro"
                    >
                      🫧 Bolla
                    </button>
                    <button
                      type="button"
                      disabled={!inlineArtisticText.trim()}
                      onClick={() => handleInsertInlineArtistic('kablammo')}
                      className={`py-1.5 px-2 text-[10px] font-bold text-center border cursor-pointer border-pink-350 bg-pink-100 hover:bg-pink-200 text-pink-950 transition-colors ${!inlineArtisticText.trim() ? 'opacity-40 cursor-not-allowed' : ''}`}
                      title="Stile buffo tipo cartone animato"
                    >
                      🤪 Kablammo
                    </button>
                    <button
                      type="button"
                      disabled={!inlineArtisticText.trim()}
                      onClick={() => handleInsertInlineArtistic('nabla')}
                      className={`py-1.5 px-2 text-[10px] font-bold text-center border cursor-pointer border-rose-350 bg-rose-50 hover:bg-rose-100 text-rose-950 transition-colors ${!inlineArtisticText.trim() ? 'opacity-40 cursor-not-allowed' : ''}`}
                      title="Stile Nabla colorato 3D"
                    >
                      🟥 Nabla
                    </button>
                    <button
                      type="button"
                      disabled={!inlineArtisticText.trim()}
                      onClick={() => handleInsertInlineArtistic('splash')}
                      className={`py-1.5 px-2 text-[10px] font-bold text-center border cursor-pointer border-cyan-350 bg-cyan-100 hover:bg-cyan-200 text-cyan-950 transition-colors ${!inlineArtisticText.trim() ? 'opacity-40 cursor-not-allowed' : ''}`}
                      title="Stile Splash pittura"
                    >
                      💦 Splash
                    </button>
                  </div>
                </div>

                {/* Quick Examples */}
                <div className="mt-3 pt-2.5 border-t border-[#D1CEC7]/40 flex flex-wrap gap-1.5 items-center">
                  <span className="text-[9px] font-mono text-gray-500 uppercase">Esempi pronti:</span>
                  <button
                    type="button"
                    onClick={() => onUpdateNarrativeText("Un spaventoso *spooky:DRAGO* sputò fuoco, ma con un tocco *fairy:MAGICO* si trasformò in un *bubble:ORSETTO*!", currentPage.narrativePosition, currentPage.narrativeStyle, currentPage.narrativeColor)}
                    className="text-[10px] bg-white hover:bg-amber-100/90 text-gray-750 px-2 py-0.5 border border-[#D1CEC7] rounded-none font-serif italic cursor-pointer transition-colors"
                  >
                    Il Drago Magico 🐉
                  </button>
                  <button
                    type="button"
                    onClick={() => onUpdateNarrativeText("Nel regno del *antique:RE* c'era un *gold:TESORO* immenso che faceva *comic:SBOOM!* ✨", currentPage.narrativePosition, currentPage.narrativeStyle, currentPage.narrativeColor)}
                    className="text-[10px] bg-white hover:bg-amber-100/90 text-gray-750 px-2 py-0.5 border border-[#D1CEC7] rounded-none font-serif italic cursor-pointer transition-colors"
                  >
                    Il Tesoro d'Oro 👑
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-gray-700 mb-2">Posizione del Testo sulla Scena:</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => onUpdateNarrativeText(currentPage.narrativeText, 'top', currentPage.narrativeStyle, currentPage.narrativeColor)}
                  className={`py-2 px-3 border rounded-none text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    currentPage.narrativePosition === 'top'
                      ? 'border-[#1A1A1A] bg-[#1A1A1A] text-white shadow-sm'
                      : 'border-[#D1CEC7] hover:border-[#1A1A1A] text-gray-600 bg-white'
                  }`}
                >
                  In Alto
                </button>

                <button
                  type="button"
                  onClick={() => onUpdateNarrativeText(currentPage.narrativeText, 'bottom', currentPage.narrativeStyle, currentPage.narrativeColor)}
                  className={`py-2 px-3 border rounded-none text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    currentPage.narrativePosition === 'bottom'
                      ? 'border-[#1A1A1A] bg-[#1A1A1A] text-white shadow-sm'
                      : 'border-[#D1CEC7] hover:border-[#1A1A1A] text-gray-600 bg-white'
                  }`}
                >
                  In Basso
                </button>

                <button
                  type="button"
                  onClick={() => onUpdateNarrativeText(currentPage.narrativeText, 'floating-hidden', currentPage.narrativeStyle, currentPage.narrativeColor)}
                  className={`py-2 px-3 border rounded-none text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    currentPage.narrativePosition === 'floating-hidden'
                      ? 'border-[#1A1A1A] bg-[#1A1A1A] text-white shadow-sm'
                      : 'border-[#D1CEC7] hover:border-[#1A1A1A] text-gray-600 bg-white'
                  }`}
                >
                  Nessuno
                </button>
              </div>
              <p className="text-[10px] text-gray-500 mt-1.5 flex gap-1 font-serif italic mb-4">
                <HelpCircle className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <span>Seleziona "Nessuno" se vuoi integrare scritte interamente tramite "Scritture Artistiche".</span>
              </p>
            </div>

            {currentPage.narrativePosition !== 'floating-hidden' && (
              <>
                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-gray-700 mb-2">Stile Grafico del Testo Narrativo:</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => onUpdateNarrativeText(currentPage.narrativeText, currentPage.narrativePosition, 'transparent', currentPage.narrativeColor)}
                      className={`py-2 px-2 border rounded-none text-[11px] font-mono font-bold uppercase tracking-tight transition-all cursor-pointer ${
                        currentPage.narrativeStyle === 'transparent'
                          ? 'border-[#1A1A1A] bg-[#1A1A1A] text-white shadow-sm'
                          : 'border-[#D1CEC7] hover:border-[#1A1A1A] text-gray-600 bg-white'
                      }`}
                    >
                      Sullo Sfondo
                    </button>

                    <button
                      type="button"
                      onClick={() => onUpdateNarrativeText(currentPage.narrativeText, currentPage.narrativePosition, 'parchment', currentPage.narrativeColor)}
                      className={`py-2 px-2 border border-double rounded-none text-[11px] font-serif font-bold uppercase tracking-tight transition-all cursor-pointer ${
                        currentPage.narrativeStyle === 'parchment'
                          ? 'border-[#B58D3D] bg-[#FCF6E4] text-[#3E2723] shadow-inner ring-1 ring-[#B58D3D]/30'
                          : 'border-[#D1CEC7] hover:border-[#1A1A1A] hover:bg-[#FAF9F6] text-gray-600 bg-white'
                      }`}
                    >
                      Pergamena ✨
                    </button>

                    <button
                      type="button"
                      onClick={() => onUpdateNarrativeText(currentPage.narrativeText, currentPage.narrativePosition, 'banner', currentPage.narrativeColor)}
                      className={`py-2 px-2 border rounded-none text-[11px] font-mono font-bold uppercase tracking-tight transition-all cursor-pointer ${
                        currentPage.narrativeStyle === 'banner' || !currentPage.narrativeStyle
                          ? 'border-[#1A1A1A] bg-[#FAF9F6] text-[#1A1A1A]'
                          : 'border-[#D1CEC7] hover:border-[#1A1A1A] text-gray-600 bg-white'
                      }`}
                    >
                      Fascia Bianca
                    </button>
                  </div>
                  <p className="text-[10px] text-gray-500 mt-1.5 flex gap-1 font-serif italic mb-4">
                    <HelpCircle className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span>"Sullo Sfondo" mette il testo direttamente sopra l'immagine o l'illustrazione senza coprire la scena.</span>
                  </p>
                </div>

                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-gray-700 mb-2">Colore del Testo Narrativo:</label>
                  <p className="text-[10px] text-gray-500 mb-2 font-serif italic">Utile per farlo risaltare se usi sfondi scuri o colorati!</p>
                  <div className="flex flex-wrap gap-2 items-center bg-[#FAF9F6] p-2.5 border border-[#D1CEC7]">
                    {[
                      { name: 'Nero', value: '#1A1A1A' },
                      { name: 'Bianco', value: '#FFFFFF' },
                      { name: 'Oro Racconto', value: '#D4AF37' },
                      { name: 'Rosso Magico', value: '#E63946' },
                      { name: 'Marrone Libro', value: '#3E2723' },
                    ].map((colorObj) => (
                      <button
                        key={colorObj.value}
                        type="button"
                        onClick={() => onUpdateNarrativeText(currentPage.narrativeText, currentPage.narrativePosition, currentPage.narrativeStyle, colorObj.value)}
                        title={colorObj.name}
                        className={`w-6 h-6 rounded-full border border-gray-300 transition-all cursor-pointer ${
                          (currentPage.narrativeColor || '#1A1A1A') === colorObj.value
                            ? 'scale-110 ring-2 ring-[#1A1A1A] ring-offset-1'
                            : 'hover:scale-105'
                        }`}
                        style={{ backgroundColor: colorObj.value }}
                      >
                        {colorObj.value === '#FFFFFF' && (
                          <div className="w-full h-full rounded-full border border-gray-400 bg-white" />
                        )}
                      </button>
                    ))}

                    <div className="flex items-center gap-1.5 ml-auto border-l border-[#D1CEC7]/60 pl-3">
                      <input
                        type="color"
                        value={currentPage.narrativeColor || '#1A1A1A'}
                        onChange={(e) => onUpdateNarrativeText(currentPage.narrativeText, currentPage.narrativePosition, currentPage.narrativeStyle, e.target.value)}
                        className="w-7 h-7 border border-[#D1CEC7] p-0.5 bg-white cursor-pointer rounded-none"
                      />
                      <span className="text-[10px] font-mono font-bold text-gray-600">{currentPage.narrativeColor || '#1A1A1A'}</span>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Alternating standard text and artistic text while typing (interactive prompt feature) */}
            <div className="mt-2 border-t border-[#D1CEC7]/40 pt-4 bg-[#F2F1EC]/30 p-3 border border-[#D1CEC7] rounded-none">
              <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-[#1A1A1A] mb-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#E63946]" />
                <span>Inserisci Testo Artistico al Volo ✨</span>
              </label>
              <p className="text-[10px] text-gray-600 mb-2.5 font-serif italic leading-relaxed">
                Vuoi alternare parole magiche mobili alla narrazione? Scrivile qui sotto per creare istantaneamente una splendida scritta drag-and-drop!
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Es: SBOOM! / Splash / C'era una volta..."
                  value={quickArtText}
                  onChange={(e) => setQuickArtText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddQuickArtisticText();
                    }
                  }}
                  className="flex-1 px-3 py-2 border border-[#D1CEC7] bg-white text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#1A1A1A]"
                />
                <button
                  type="button"
                  onClick={handleAddQuickArtisticText}
                  className="bg-[#1A1A1A] hover:bg-gray-800 text-white text-[11px] font-mono font-bold uppercase tracking-wider py-2 px-3 transition-colors cursor-pointer"
                >
                  Aggiungi
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
