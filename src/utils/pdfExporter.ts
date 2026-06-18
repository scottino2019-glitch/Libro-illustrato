import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { PageData, BookItem, CharacterItem, ArtisticTextItem } from '../types';
import { PREMADE_BACKGROUNDS } from '../components/PremadeAssets';

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

export async function exportBookToPDF(
  bookTitle: string,
  bookAuthor: string,
  pages: PageData[],
  orientation: 'landscape' | 'portrait',
  onProgress: (pageIndex: number, total: number) => void
): Promise<void> {
  const isPortrait = orientation === 'portrait';
  const pdf = new jsPDF({
    orientation: isPortrait ? 'portrait' : 'landscape',
    unit: 'mm',
    format: 'a4', // A4: Portrait is 210x297, Landscape is 297x210
  });

  const totalPages = pages.length;

  for (let i = 0; i < totalPages; i++) {
    onProgress(i, totalPages);
    const page = pages[i];

    // Create a temporary container for rendering this page off-screen
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.left = '-9999px';
    container.style.top = '0';
    
    // Set aspect ratio dimensions for the offscreen stage
    const canvasWidth = isPortrait ? 750 : 1000;
    const canvasHeight = isPortrait ? 1000 : 750;
    container.style.width = `${canvasWidth}px`;
    container.style.height = `${canvasHeight}px`;
    container.style.boxSizing = 'border-box';
    container.style.overflow = 'hidden';
    container.style.fontFamily = 'Inter, sans-serif';

    // Apply Background
    if (page.backgroundType === 'color') {
      container.style.backgroundColor = page.backgroundValue || '#F3F4F6';
    } else if (page.backgroundType === 'image') {
      container.style.backgroundImage = `url("${page.backgroundValue}")`;
      container.style.backgroundSize = 'cover';
      container.style.backgroundPosition = 'center';
    } else if (page.backgroundType === 'premade') {
      const premade = PREMADE_BACKGROUNDS.find((bg) => bg.id === page.backgroundValue);
      if (premade) {
        container.style.backgroundImage = `url("${premade.src}")`;
        container.style.backgroundSize = '100% 100%';
        container.style.backgroundPosition = 'center';
        container.style.backgroundRepeat = 'no-repeat';
      } else {
        container.style.backgroundColor = '#F3F4F6';
      }
    }

    // Add Narrative Text
    if (page.narrativeText && page.narrativePosition !== 'floating-hidden') {
      const narrativeBox = document.createElement('div');
      narrativeBox.style.position = 'absolute';
      narrativeBox.style.left = '0';
      narrativeBox.style.right = '0';
      
      const paragraph = document.createElement('p');
      paragraph.style.margin = '0';
      paragraph.style.fontFamily = 'Georgia, serif';
      paragraph.style.fontStyle = 'italic';
      paragraph.style.fontSize = '34px'; // Much larger, very readable exported font!
      paragraph.style.textAlign = 'center';
      paragraph.style.lineHeight = '1.6';
      paragraph.style.fontWeight = '500';
      paragraph.style.display = 'flex';
      paragraph.style.flexWrap = 'wrap';
      paragraph.style.alignItems = 'center';
      paragraph.style.justifyContent = 'center';

      // Parse asterisks to allow mixed normal and inline stylized artistic text elements
      const parts = page.narrativeText.split(/(\*[^*]+\*)/g);
      parts.forEach((part) => {
        if (part.startsWith('*') && part.endsWith('*')) {
          const inner = part.slice(1, -1);
          let stylePreset = 'holo'; // default if no colon prefix
          let cleanText = inner;
          
          if (inner.includes(':')) {
            const colonIndex = inner.indexOf(':');
            const prefix = inner.substring(0, colonIndex).trim().toLowerCase();
            if (['comic', 'fairy', 'spooky', 'gold', 'antique', 'bubble'].includes(prefix)) {
              stylePreset = prefix;
              cleanText = inner.substring(colonIndex + 1);
            }
          }

          const em = getInlineEmoji(cleanText, stylePreset);
          const leftEm = em.left;
          const rightEm = em.right;

          const span = document.createElement('span');
          span.innerText = `${leftEm ? leftEm + ' ' : ''}${cleanText}${rightEm ? ' ' + rightEm : ''}`;
          span.style.display = 'inline-flex';
          span.style.alignItems = 'center';
          span.style.margin = '4px 6px';
          span.style.padding = '4px 10px';
          span.style.borderRadius = '8px';
          span.style.boxSizing = 'border-box';
          
          if (stylePreset === 'comic') {
            span.style.fontFamily = '"Arial Black", "Impact", sans-serif';
            span.style.fontSize = '26px';
            span.style.fontWeight = '900';
            span.style.textTransform = 'uppercase';
            span.style.fontStyle = 'italic';
            span.style.color = '#FCD34D'; // Bright amber-yellow
            span.style.backgroundColor = '#FF5722'; // Orange-Red Comic BG
            span.style.border = '3px solid #000000';
            span.style.boxShadow = '3px 3px 0px #000000';
            span.style.textShadow = '2px 2px 0px #000';
          } else if (stylePreset === 'fairy') {
            span.style.fontFamily = '"Georgia", serif';
            span.style.fontSize = '24px';
            span.style.fontWeight = 'bold';
            span.style.fontStyle = 'italic';
            span.style.color = '#FFFFFF';
            span.style.backgroundImage = 'linear-gradient(to right, #F472B6, #D946EF, #6366F1)';
            span.style.border = '1px solid rgba(255,255,255,0.4)';
            span.style.borderRadius = '20px'; // pill shape
            span.style.boxShadow = '0px 0px 10px rgba(236,72,153,0.85)';
            span.style.textShadow = '1px 1px 2px rgba(131,24,67,0.4)';
          } else if (stylePreset === 'spooky') {
            span.style.fontFamily = '"Courier New", monospace';
            span.style.fontSize = '26px';
            span.style.fontWeight = '900';
            span.style.textTransform = 'uppercase';
            span.style.color = '#A3E635'; // Lime green
            span.style.backgroundColor = '#1A1124'; // slime deep background
            span.style.border = '2px solid #A3E635';
            span.style.boxShadow = '3px 3px 0px #9333EA';
            span.style.textShadow = '2px 2px 0px #020617';
          } else if (stylePreset === 'gold') {
            span.style.fontFamily = '"Arial Black", "Impact", sans-serif';
            span.style.fontSize = '26px';
            span.style.fontWeight = 'bold';
            span.style.color = '#FCD34D'; // gold
            span.style.backgroundColor = '#2D1B18'; // dark crimson backing
            span.style.border = '2px solid #E19E20';
            span.style.boxShadow = '2px 2px 5px rgba(0,0,0,0.6)';
            span.style.textTransform = 'uppercase';
          } else if (stylePreset === 'antique') {
            span.style.fontFamily = '"Times New Roman", "Georgia", serif';
            span.style.fontSize = '22px';
            span.style.fontWeight = 'bold';
            span.style.fontStyle = 'italic';
            span.style.color = '#3E2723'; // Antique deep brown
            span.style.backgroundColor = '#F5E6C4'; // parchment papyrus
            span.style.borderLeft = '4px solid #7C5A34';
            span.style.borderRight = '4px solid #7C5A34';
            span.style.borderTop = '1px solid #7C5A34';
            span.style.borderBottom = '1px solid #7C5A34';
            span.style.borderRadius = '4px';
            span.style.boxShadow = '2px 2px 4px rgba(0,0,0,0.15)';
          } else if (stylePreset === 'bubble') {
            span.style.fontFamily = 'system-ui, -apple-system, sans-serif';
            span.style.fontSize = '22px';
            span.style.fontWeight = '900';
            span.style.color = '#FFFFFF';
            span.style.backgroundImage = 'linear-gradient(to bottom, #7DD3FC, #38BDF8, #0284C7)';
            span.style.border = '2.5px solid #FFFFFF';
            span.style.borderRadius = '30px'; // full bubble pill
            span.style.boxShadow = 'inset -2px -3px 6px rgba(0,0,0,0.35), 2px 3px 5px rgba(2,132,199,0.45)';
            span.style.textShadow = '1px 1px 2px rgba(2,132,199,0.5)';
          } else { // holo default rainbow starburst sticker
            span.style.fontFamily = 'system-ui, -apple-system, sans-serif';
            span.style.fontSize = '24px';
            span.style.fontWeight = '950';
            span.style.textTransform = 'uppercase';
            span.style.color = '#FFFFFF';
            span.style.backgroundColor = '#E63946';
            span.style.border = '2px solid #1A1A1A';
            span.style.boxShadow = '3px 3px 0px #1A1A1A';
          }
          
          paragraph.appendChild(span);
        } else if (part.length > 0) {
          const spanText = document.createElement('span');
          spanText.innerText = part;
          spanText.style.margin = '0 3px';
          paragraph.appendChild(spanText);
        }
      });

      // Advanced narrative style rendering (sullo sfondo, no fuori - integrated overlay styles)
      if (page.narrativeStyle === 'parchment') {
        narrativeBox.style.backgroundColor = 'rgba(252, 246, 228, 0.9)'; // Vintage Warm Ivory Parchment
        narrativeBox.style.padding = '35px 45px';
        narrativeBox.style.boxSizing = 'border-box';
        narrativeBox.style.zIndex = '20';
        narrativeBox.style.borderStyle = 'double';
        narrativeBox.style.borderWidth = page.narrativePosition === 'top' ? '0 0 5px 0' : '5px 0 0 0';
        narrativeBox.style.borderColor = '#B58D3D';
        
        paragraph.style.color = page.narrativeColor || '#3E2723';
      } else if (page.narrativeStyle === 'banner') {
        // elegant slate banner style (translucent so we see the scenery backing)
        narrativeBox.style.backgroundColor = 'rgba(255, 255, 255, 0.85)';
        narrativeBox.style.padding = '35px 45px';
        narrativeBox.style.boxSizing = 'border-box';
        narrativeBox.style.zIndex = '20';
        narrativeBox.style.borderStyle = 'solid';
        narrativeBox.style.borderColor = 'rgba(209, 206, 199, 0.4)';
        narrativeBox.style.borderWidth = page.narrativePosition === 'top' ? '0 0 1px 0' : '1px 0 0 0';
        
        paragraph.style.color = page.narrativeColor || '#1A1A1A';
      } else {
        // default transparent/on-scenery style with no background cover
        narrativeBox.style.backgroundColor = 'transparent';
        narrativeBox.style.padding = '40px 50px';
        narrativeBox.style.boxSizing = 'border-box';
        narrativeBox.style.zIndex = '20';
        narrativeBox.style.borderWidth = '0';
        
        const textColor = page.narrativeColor || '#1A1A1A';
        paragraph.style.color = textColor;
        
        // Add smart text shadow contrast outline based on custom color
        const isLight = textColor.toUpperCase() === '#FFFFFF' || textColor.toLowerCase() === 'white' || 
          (textColor.startsWith('#') && textColor.length === 7 && 
            (parseInt(textColor.substring(1, 3), 16) * 0.299 + 
             parseInt(textColor.substring(3, 5), 16) * 0.587 + 
             parseInt(textColor.substring(5, 7), 16) * 0.114) > 170);
             
        if (isLight) {
          paragraph.style.textShadow = '1px 1px 0px #000, -1px -1px 0px #000, 1px -1px 0px #000, -1px 1px 0px #000, 0px 1px 0px #000, 0px -1px 0px #000, 1px 0px 0px #000, -1px 0px 0px #000, 0px 0px 8px rgba(0,0,0,1)';
        } else {
          paragraph.style.textShadow = '1px 1px 0px #fff, -1px -1px 0px #fff, 1px -1px 0px #fff, -1px 1px 0px #fff, 0px 1px 0px #fff, 0px -1px 0px #fff, 1px 0px 0px #fff, -1px 0px 0px #fff, 0px 0px 8px rgba(255, 255, 255, 1), 0px 0px 15px rgba(255, 255, 255, 0.9)';
        }
      }

      narrativeBox.appendChild(paragraph);

      if (page.narrativePosition === 'top') {
        narrativeBox.style.top = '0';
      } else {
        narrativeBox.style.bottom = '0';
      }
      container.appendChild(narrativeBox);
    }

    // Add Items (Characters and Artistic Texts)
    // Sort by z-index
    const sortedItems = [...page.items].sort((a, b) => a.zIndex - b.zIndex);

    for (const item of sortedItems) {
      const itemNode = document.createElement('div');
      itemNode.style.position = 'absolute';
      itemNode.style.left = `${item.x}%`;
      itemNode.style.top = `${item.y}%`;
      itemNode.style.transform = `translate(-50%, -50%) rotate(${item.rotation}deg) scale(${item.scale})`;
      itemNode.style.zIndex = `${10 + item.zIndex}`;

      if (item.type === 'character') {
         const charItem = item as CharacterItem;
         const img = document.createElement('img');
         img.src = charItem.src;
         img.style.maxHeight = '180px'; // slightly larger on raw high res node
         img.style.maxWidth = '180px';
         img.style.objectFit = 'contain';
         img.setAttribute('referrerpolicy', 'no-referrer');
         if (charItem.isFlipped) {
           img.style.transform = 'scaleX(-1)';
         }
         itemNode.appendChild(img);
      } else if (item.type === 'artistic-text') {
        const textItem = item as ArtisticTextItem;
        const textDiv = document.createElement('div');
        textDiv.innerText = textItem.text;
        textDiv.style.whiteSpace = 'nowrap';
        // Base sizes relative to scale
        textDiv.style.fontSize = `${textItem.fontSize * 1.2}px`; // scaled up for 1000px resolution

        // Preset style application
        if (textItem.stylePreset === 'comic') {
          textDiv.style.fontFamily = '"Impact", "Arial Black", sans-serif';
          textDiv.style.fontWeight = '900';
          textDiv.style.fontStyle = 'italic';
          textDiv.style.textTransform = 'uppercase';
          textDiv.style.color = '#FDE047'; // Yellow
          textDiv.style.webkitTextStroke = '2px #000';
          textDiv.style.textShadow = '3px 3px 0px #E11D48'; // Red accent shadow
        } else if (textItem.stylePreset === 'fairy') {
          textDiv.style.fontFamily = '"Georgia", serif';
          textDiv.style.fontStyle = 'italic';
          textDiv.style.fontWeight = '700';
          textDiv.style.color = '#EC4899'; // Pink
          textDiv.style.textShadow = '0 0 10px rgba(236,72,153,0.8)';
        } else if (textItem.stylePreset === 'spooky') {
          textDiv.style.fontFamily = '"Courier New", monospace';
          textDiv.style.fontWeight = '900';
          textDiv.style.textTransform = 'uppercase';
          textDiv.style.letterSpacing = '0.15em';
          textDiv.style.color = '#A3E635'; // Lime green
          textDiv.style.textShadow = '2px 2px 0px #020617, 0 0 12px #84CC16';
        } else if (textItem.stylePreset === 'gold') {
          textDiv.style.fontFamily = '"Georgia", serif';
          textDiv.style.fontWeight = '900';
          textDiv.style.color = '#F59E0B'; // Gold
          textDiv.style.textShadow = '2px 2px 4px rgba(0,0,0,0.6)';
        } else if (textItem.stylePreset === 'antique') {
          textDiv.style.fontFamily = '"Georgia", serif';
          textDiv.style.fontStyle = 'italic';
          textDiv.style.fontWeight = '700';
          textDiv.style.color = '#451A03'; // Deep brown
          textDiv.style.borderBottom = '3px double #78350F';
          textDiv.style.paddingBottom = '4px';
        } else if (textItem.stylePreset === 'bubble') {
          textDiv.style.fontFamily = '"Arial Black", sans-serif';
          textDiv.style.fontWeight = '900';
          textDiv.style.color = '#FFFFFF';
          textDiv.style.backgroundColor = '#38BDF8';
          textDiv.style.border = '3px solid #0284C7';
          textDiv.style.borderRadius = '16px';
          textDiv.style.padding = '5px 15px';
          textDiv.style.boxShadow = '4px 4px 0px #0284C7';
        } else {
          textDiv.style.fontFamily = 'sans-serif';
          textDiv.style.fontWeight = '700';
          textDiv.style.color = textItem.color || '#000000';
        }

        itemNode.appendChild(textDiv);
      }

      container.appendChild(itemNode);
    }

    document.body.appendChild(container);

    // Wait a brief moment for any images to render
    await new Promise((resolve) => setTimeout(resolve, 250));

    try {
      // Capture off-screen page with high resolution scale
      const canvas = await html2canvas(container, {
        scale: 2.0, // Retains extreme sharpness!
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#FFFFFF',
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);

      // Add to PDF
      if (i > 0) {
        pdf.addPage();
      }
      if (isPortrait) {
        pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297); // fits Portrait precisely
      } else {
        pdf.addImage(imgData, 'JPEG', 0, 0, 297, 210); // fits Landscape precisely
      }
    } catch (err) {
      console.error('Failed to capture page during PDF generation', err);
    } finally {
      document.body.removeChild(container);
    }
  }

  // Save/Download the compiled PDF
  const sanitizedTitle = (bookTitle || 'il-mio-libro-illustrato')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-');
  pdf.save(`${sanitizedTitle}.pdf`);
}
