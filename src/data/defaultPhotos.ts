/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PhotoItem } from '../types/photo';

// Cute cat couple SVG illustrations for the 9 photos in "Hành tinh kỷ niệm"
const createCatCoupleSvg = (
  bgColor: string,
  cat1Color: string,
  cat1EarInner: string,
  cat2Color: string,
  cat2EarInner: string,
  accessory:
    | 'heart'
    | 'scarf'
    | 'flower'
    | 'book'
    | 'yarn'
    | 'hug'
    | 'crown'
    | 'balloon'
    | 'star'
) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
    <rect width="400" height="400" rx="42" fill="${bgColor}"/>
    
    <!-- Soft background sparkles -->
    <circle cx="70" cy="85" r="5" fill="#f472b6" opacity="0.45"/>
    <circle cx="330" cy="95" r="6" fill="#f472b6" opacity="0.45"/>
    <path d="M95 65 C90 55 75 55 75 67 C75 77 95 88 95 88 C95 88 115 77 115 67 C115 55 100 55 95 65 Z" fill="#f472b6" opacity="0.35" transform="scale(0.6) translate(60, 40)"/>

    <!-- Top Floating Pink Heart -->
    <g transform="translate(200, 78)">
      <path d="M0 12 C-18 -12 -42 4 -42 26 C-42 48 0 72 0 72 C0 72 42 48 42 26 C42 4 18 -12 0 12 Z" fill="#ec4899" stroke="#be185d" stroke-width="3"/>
      <circle cx="-14" cy="18" r="5" fill="#fbcfe8" opacity="0.7"/>
    </g>

    <!-- Cat 1 (Left) -->
    <g transform="translate(135, 245)">
      <!-- Body -->
      <ellipse cx="0" cy="65" rx="52" ry="55" fill="${cat1Color}" stroke="#1e293b" stroke-width="6"/>
      <!-- Ears -->
      <polygon points="-48,-28 -38,-82 -8,-45" fill="${cat1Color}" stroke="#1e293b" stroke-width="6" stroke-linejoin="round"/>
      <polygon points="-42,-34 -35,-70 -15,-45" fill="${cat1EarInner}"/>
      <polygon points="12,-45 38,-82 48,-28" fill="${cat1Color}" stroke="#1e293b" stroke-width="6" stroke-linejoin="round"/>
      <polygon points="16,-45 34,-70 41,-34" fill="${cat1EarInner}"/>
      <!-- Head -->
      <ellipse cx="0" cy="-8" rx="56" ry="48" fill="${cat1Color}" stroke="#1e293b" stroke-width="6"/>
      <!-- Blush -->
      <ellipse cx="-28" cy="2" rx="10" ry="6" fill="#f472b6" opacity="0.65"/>
      <ellipse cx="28" cy="2" rx="10" ry="6" fill="#f472b6" opacity="0.65"/>
      <!-- Eyes -->
      <circle cx="-20" cy="-10" r="6.5" fill="#1e293b"/>
      <circle cx="-22" cy="-12" r="2.2" fill="#ffffff"/>
      <circle cx="20" cy="-10" r="6.5" fill="#1e293b"/>
      <circle cx="18" cy="-12" r="2.2" fill="#ffffff"/>
      <!-- Cute Mouth -->
      <path d="M-8 -1 Q0 6 0 -1 Q0 6 8 -1" fill="none" stroke="#1e293b" stroke-width="4" stroke-linecap="round"/>
      <!-- Whiskers -->
      <line x1="-42" y1="-5" x2="-60" y2="-8" stroke="#1e293b" stroke-width="3.5" stroke-linecap="round"/>
      <line x1="-42" y1="4" x2="-60" y2="6" stroke="#1e293b" stroke-width="3.5" stroke-linecap="round"/>
    </g>

    <!-- Cat 2 (Right) -->
    <g transform="translate(260, 250)">
      <!-- Tail -->
      <path d="M45 85 Q82 70 72 35" fill="none" stroke="${cat2Color}" stroke-width="16" stroke-linecap="round"/>
      <path d="M45 85 Q82 70 72 35" fill="none" stroke="#1e293b" stroke-width="6" stroke-linecap="round"/>
      <!-- Body -->
      <ellipse cx="0" cy="62" rx="50" ry="52" fill="${cat2Color}" stroke="#1e293b" stroke-width="6"/>
      <!-- Ears -->
      <polygon points="-46,-26 -35,-78 -6,-42" fill="${cat2Color}" stroke="#1e293b" stroke-width="6" stroke-linejoin="round"/>
      <polygon points="-40,-32 -32,-66 -13,-42" fill="${cat2EarInner}"/>
      <polygon points="10,-42 36,-78 46,-26" fill="${cat2Color}" stroke="#1e293b" stroke-width="6" stroke-linejoin="round"/>
      <polygon points="15,-42 32,-66 39,-32" fill="${cat2EarInner}"/>
      <!-- Head -->
      <ellipse cx="0" cy="-6" rx="54" ry="46" fill="${cat2Color}" stroke="#1e293b" stroke-width="6"/>
      <!-- Forehead stripes -->
      <line x1="0" y1="-48" x2="0" y2="-32" stroke="#1e293b" stroke-width="4" stroke-linecap="round" opacity="0.5"/>
      <line x1="-10" y1="-46" x2="-6" y2="-34" stroke="#1e293b" stroke-width="4" stroke-linecap="round" opacity="0.5"/>
      <line x1="10" y1="-46" x2="6" y2="-34" stroke="#1e293b" stroke-width="4" stroke-linecap="round" opacity="0.5"/>
      <!-- Blush -->
      <ellipse cx="-26" cy="4" rx="10" ry="6" fill="#f472b6" opacity="0.65"/>
      <ellipse cx="26" cy="4" rx="10" ry="6" fill="#f472b6" opacity="0.65"/>
      <!-- Eyes -->
      <circle cx="-18" cy="-8" r="6.5" fill="#1e293b"/>
      <circle cx="-20" cy="-10" r="2.2" fill="#ffffff"/>
      <circle cx="18" cy="-8" r="6.5" fill="#1e293b"/>
      <circle cx="16" cy="-10" r="2.2" fill="#ffffff"/>
      <!-- Cute Mouth -->
      <path d="M-8 1 Q0 8 0 1 Q0 8 8 1" fill="none" stroke="#1e293b" stroke-width="4" stroke-linecap="round"/>
      <!-- Whiskers -->
      <line x1="40" y1="-3" x2="58" y2="-6" stroke="#1e293b" stroke-width="3.5" stroke-linecap="round"/>
      <line x1="40" y1="6" x2="58" y2="8" stroke="#1e293b" stroke-width="3.5" stroke-linecap="round"/>
    </g>

    <!-- Accessory Overlay -->
    ${
      accessory === 'scarf'
        ? `<g transform="translate(200, 285)">
            <path d="M-95 -5 Q0 25 95 -5" fill="none" stroke="#f43f5e" stroke-width="22" stroke-linecap="round"/>
            <path d="M-10 8 L-18 52 M12 8 L22 50" stroke="#f43f5e" stroke-width="18" stroke-linecap="round"/>
          </g>`
        : accessory === 'flower'
        ? `<g transform="translate(200, 300)">
            <line x1="0" y1="0" x2="0" y2="48" stroke="#10b981" stroke-width="6" stroke-linecap="round"/>
            <circle cx="-10" cy="-6" r="10" fill="#f472b6"/>
            <circle cx="10" cy="-6" r="10" fill="#f472b6"/>
            <circle cx="0" cy="-16" r="10" fill="#f472b6"/>
            <circle cx="0" cy="4" r="10" fill="#f472b6"/>
            <circle cx="0" cy="-6" r="7" fill="#facc15"/>
          </g>`
        : accessory === 'book'
        ? `<g transform="translate(200, 315)">
            <path d="M-55 10 L0 22 L55 10 L55 -12 L0 0 L-55 -12 Z" fill="#fb7185" stroke="#1e293b" stroke-width="4"/>
            <line x1="0" y1="0" x2="0" y2="22" stroke="#1e293b" stroke-width="4"/>
          </g>`
        : accessory === 'yarn'
        ? `<g transform="translate(200, 318)">
            <circle cx="0" cy="0" r="24" fill="#38bdf8" stroke="#1e293b" stroke-width="4"/>
            <path d="M-14 -10 Q0 5 14 -10 M-16 6 Q0 -8 16 6" fill="none" stroke="#bae6fd" stroke-width="3"/>
          </g>`
        : accessory === 'crown'
        ? `<g transform="translate(135, 175)">
            <polygon points="-24,10 -18,-16 0,-2 18,-16 24,10" fill="#facc15" stroke="#1e293b" stroke-width="4" stroke-linejoin="round"/>
            <circle cx="0" cy="-4" r="3.5" fill="#f43f5e"/>
          </g>`
        : accessory === 'balloon'
        ? `<g transform="translate(310, 125)">
            <line x1="0" y1="28" x2="-25" y2="95" stroke="#475569" stroke-width="3"/>
            <ellipse cx="0" cy="0" rx="24" ry="28" fill="#fb7185" stroke="#1e293b" stroke-width="4"/>
            <circle cx="-8" cy="-8" r="5" fill="#ffe4e6" opacity="0.7"/>
          </g>`
        : accessory === 'star'
        ? `<g transform="translate(200, 305)">
            <polygon points="0,-24 7,-8 25,-6 12,6 15,24 0,15 -15,24 -12,6 -25,-6 -7,-8" fill="#facc15" stroke="#1e293b" stroke-width="4" stroke-linejoin="round"/>
          </g>`
        : ''
    }
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

export const DEFAULT_PHOTOS: PhotoItem[] = [
  {
    id: 'slot-1',
    url: createCatCoupleSvg('#fce7f3', '#ffffff', '#fbcfe8', '#fdba74', '#fed7aa', 'heart'),
    caption: 'Khoảnh khắc ngọt ngào #1',
    subCaption: 'Chạm vào để xem phóng to hoặc thay bằng ảnh của Cậu 🌸',
    date: '20/10',
    isCustom: false,
    isEmpty: false,
  },
  {
    id: 'slot-2',
    url: createCatCoupleSvg('#e0f2fe', '#94a3b8', '#fbcfe8', '#334155', '#f472b6', 'scarf'),
    caption: 'Ấm áp bên nhau #2',
    subCaption: 'Mãi bên nhau ấm áp như chiếc khăn mùa thu ✨',
    date: '20/10',
    isCustom: false,
    isEmpty: false,
  },
  {
    id: 'slot-3',
    url: createCatCoupleSvg('#fef3c7', '#ffffff', '#fbcfe8', '#b45309', '#fde68a', 'flower'),
    caption: 'Bông hoa tặng Cậu #3',
    subCaption: 'Nụ cười của Cậu luôn rạng rỡ như đóa hoa tươi thắm 🌷',
    date: '20/10',
    isCustom: false,
    isEmpty: false,
  },
  {
    id: 'slot-4',
    url: createCatCoupleSvg('#f3e8ff', '#ffffff', '#fbcfe8', '#1e293b', '#f472b6', 'book'),
    caption: 'Câu chuyện đôi mình #4',
    subCaption: 'Mỗi ngày bên Cậu đều là một trang kỷ niệm đáng yêu 💖',
    date: '20/10',
    isCustom: false,
    isEmpty: false,
  },
  {
    id: 'slot-5',
    url: createCatCoupleSvg('#dcfce7', '#fdba74', '#fed7aa', '#cbd5e1', '#fbcfe8', 'yarn'),
    caption: 'Niềm vui nhỏ xíu #5',
    subCaption: 'Chúc Cậu ngày 20/10 luôn tràn ngập tiếng cười 🌼',
    date: '20/10',
    isCustom: false,
    isEmpty: false,
  },
  {
    id: 'slot-6',
    url: createCatCoupleSvg('#ffe4e6', '#cbd5e1', '#fbcfe8', '#ffffff', '#fbcfe8', 'hug'),
    caption: 'Mãi luôn hạnh phúc #6',
    subCaption: 'Chúc Cậu gặp thật nhiều may mắn và luôn xinh đẹp ✨',
    date: '20/10',
    isCustom: false,
    isEmpty: false,
  },
  {
    id: 'slot-7',
    url: createCatCoupleSvg('#fef9c3', '#ffffff', '#fbcfe8', '#f59e0b', '#fde68a', 'crown'),
    caption: 'Công chúa ngày 20/10 #7',
    subCaption: 'Hôm nay Cậu là người xinh đẹp và rạng rỡ nhất 👑',
    date: '20/10',
    isCustom: false,
    isEmpty: false,
  },
  {
    id: 'slot-8',
    url: createCatCoupleSvg('#e0e7ff', '#cbd5e1', '#fbcfe8', '#64748b', '#f472b6', 'balloon'),
    caption: 'Bay cao ước mơ #8',
    subCaption: 'Mọi điều ước của Cậu đều sẽ thành hiện thực 🎈',
    date: '20/10',
    isCustom: false,
    isEmpty: false,
  },
  {
    id: 'slot-9',
    url: createCatCoupleSvg('#fae8ff', '#ffffff', '#f5d0fe', '#f472b6', '#fbcfe8', 'star'),
    caption: 'Ngôi sao may mắn #9',
    subCaption: 'Chúc Cậu một ngày 20/10 trọn vẹn yêu thương 🌟',
    date: '20/10',
    isCustom: false,
    isEmpty: false,
  },
];
