export type ItemType = 'character' | 'artistic-text';

export interface BaseItem {
  id: string;
  type: ItemType;
  x: number; // percentage from left, 0 to 100
  y: number; // percentage from top, 0 to 100
  scale: number; // scaling factor, default 1
  rotation: number; // in degrees, default 0
  zIndex: number;
}

export interface CharacterItem extends BaseItem {
  type: 'character';
  src: string; // upload data URL or premade asset identifier
  name: string;
  isFlipped: boolean;
}

export interface ArtisticTextItem extends BaseItem {
  type: 'artistic-text';
  text: string;
  color: string;
  fontSize: number; // in pixels or relative scale
  stylePreset: 'comic' | 'fairy' | 'spooky' | 'gold' | 'antique' | 'bubble' | 'custom';
  fontFamily: string;
  fontWeight: string;
  shadowColor?: string;
  hasOutline?: boolean;
  outlineColor?: string;
}

export type BookItem = CharacterItem | ArtisticTextItem;

export interface PageData {
  id: string;
  backgroundType: 'color' | 'image' | 'premade';
  backgroundValue: string; // color hex, image URL, or premade ID
  narrativeText: string; // main narrative story text block
  narrativePosition: 'top' | 'bottom' | 'floating-hidden';
  narrativeStyle?: 'transparent' | 'banner' | 'parchment'; // customizable overlay styles
  narrativeColor?: string; // custom narrative text color choice
  items: BookItem[];
}

export interface BookData {
  title: string;
  author: string;
  orientation?: 'landscape' | 'portrait'; // landscape = horizontal, portrait = vertical
  pages: PageData[];
}
