/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Upload,
  Plus,
  ChevronLeft,
  ChevronRight,
  Gift,
  RotateCcw,
} from 'lucide-react';
import { PhotoItem } from '../types/photo';
import { GreetingCardModal } from './GreetingCardModal';

interface PhotoAlbumModalProps {
  photos: PhotoItem[];
  onUpdatePhotos: (photos: PhotoItem[]) => void;
  onResetPhotos: () => void;
  onClose?: () => void;
  onReplayStory?: () => void;
  effectsEnabled?: boolean;
}

export const PhotoAlbumModal: React.FC<PhotoAlbumModalProps> = ({
  photos,
  onUpdatePhotos,
  onResetPhotos,
  onClose,
  onReplayStory,
  effectsEnabled = true,
}) => {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const [cardModalPhoto, setCardModalPhoto] = useState<PhotoItem | null>(null);
  const [targetSlotId, setTargetSlotId] = useState<string | null>(null);
  const [orbitAngle, setOrbitAngle] = useState<number>(0);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const singleSlotInputRef = useRef<HTMLInputElement | null>(null);
  const planetSectionRef = useRef<HTMLDivElement | null>(null);

  // Smooth 60fps 3D orbit around the Memory Planet
  useEffect(() => {
    if (!effectsEnabled) return;
    let rafId: number;
    let lastTime = performance.now();

    const tick = (now: number) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;
      setOrbitAngle((prev) => (prev + dt * 0.52) % (Math.PI * 2));
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [effectsEnabled]);

  // Multi-file upload ("Chọn ảnh từ máy")
  const handleFilesSelected = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const readPromises: Promise<string>[] = [];
    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) return;
      readPromises.push(
        new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve((e.target?.result as string) || '');
          reader.readAsDataURL(file);
        })
      );
    });

    Promise.all(readPromises).then((urls) => {
      const validUrls = urls.filter(Boolean);
      if (validUrls.length === 0) return;

      const nextPhotos = [...photos];
      let urlIdx = 0;

      // First: if user hasn't uploaded custom photos yet, replace default cards or empty slots
      const hasAnyCustom = nextPhotos.some((p) => p.isCustom);
      if (!hasAnyCustom) {
        for (let i = 0; i < nextPhotos.length && urlIdx < validUrls.length; i++) {
          nextPhotos[i] = {
            id: `photo-${Date.now()}-${i}`,
            url: validUrls[urlIdx++],
            caption: `Kỷ niệm đẹp #${i + 1}`,
            subCaption: 'Khoảnh khắc đáng yêu ngày 20/10 🌸',
            date: '20/10',
            isCustom: true,
            isEmpty: false,
          };
        }
      } else {
        // Fill empty or non-custom slots first
        for (let i = 0; i < nextPhotos.length && urlIdx < validUrls.length; i++) {
          if (nextPhotos[i].isEmpty || !nextPhotos[i].isCustom) {
            nextPhotos[i] = {
              id: `photo-${Date.now()}-${i}`,
              url: validUrls[urlIdx++],
              caption: `Kỷ niệm đẹp #${i + 1}`,
              subCaption: 'Khoảnh khắc đáng yêu ngày 20/10 🌸',
              date: '20/10',
              isCustom: true,
              isEmpty: false,
            };
          }
        }
      }

      // Append remaining uploaded photos as new slots
      while (urlIdx < validUrls.length) {
        nextPhotos.push({
          id: `photo-${Date.now()}-extra-${urlIdx}`,
          url: validUrls[urlIdx++],
          caption: `Kỷ niệm đẹp #${nextPhotos.length + 1}`,
          subCaption: 'Khoảnh khắc đáng yêu ngày 20/10 🌸',
          date: '20/10',
          isCustom: true,
          isEmpty: false,
        });
      }

      onUpdatePhotos(nextPhotos);
    });
  };

  // Single slot upload (when clicking an empty slot or replacing a specific photo)
  const handleSingleSlotFile = (files: FileList | null) => {
    if (!files || files.length === 0 || !targetSlotId) return;
    const file = files[0];
    if (!file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target?.result as string;
      if (!url) return;
      const next = photos.map((p, idx) =>
        p.id === targetSlotId
          ? {
              ...p,
              url,
              caption: `Kỷ niệm đẹp #${idx + 1}`,
              subCaption: 'Khoảnh khắc đáng yêu ngày 20/10 🌸',
              isCustom: true,
              isEmpty: false,
            }
          : p
      );
      onUpdatePhotos(next);
    };
    reader.readAsDataURL(file);
    setTargetSlotId(null);
  };

  // Add an empty slot ("Thêm ô trống")
  const handleAddEmptySlot = () => {
    const newSlot: PhotoItem = {
      id: `empty-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      url: '',
      caption: 'Ô trống kỷ niệm',
      isCustom: false,
      isEmpty: true,
      emptyIcon: photos.length % 2 === 0 ? 'star' : 'heart',
    };
    onUpdatePhotos([...photos, newSlot]);
  };

  // Clear a single photo slot back to empty ("×" button on card)
  const handleClearSlot = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const next = photos.map((p, idx) =>
      p.id === id
        ? {
            id: p.id,
            url: '',
            caption: 'Ô trống kỷ niệm',
            isCustom: false,
            isEmpty: true,
            emptyIcon: (idx % 2 === 0 ? 'star' : 'heart') as 'star' | 'heart',
          }
        : p
    );
    onUpdatePhotos(next);
  };

  // Clear all user photos ("Xóa ảnh của mình") or restore 9 default photos
  const handleClearAllUserPhotos = () => {
    const hasCustom = photos.some((p) => p.isCustom);
    const hasEmpty = photos.some((p) => p.isEmpty);
    if (hasCustom) {
      const cleared: PhotoItem[] = photos.slice(0, 9).map((p, idx) => ({
        id: p.id,
        url: '',
        caption: 'Ô trống kỷ niệm',
        isCustom: false,
        isEmpty: true,
        emptyIcon: idx % 2 === 0 ? 'star' : 'heart',
      }));
      onUpdatePhotos(cleared);
    } else if (hasEmpty) {
      onResetPhotos();
    } else {
      const cleared: PhotoItem[] = photos.slice(0, 9).map((p, idx) => ({
        id: p.id,
        url: '',
        caption: 'Ô trống kỷ niệm',
        isCustom: false,
        isEmpty: true,
        emptyIcon: idx % 2 === 0 ? 'star' : 'heart',
      }));
      onUpdatePhotos(cleared);
    }
  };

  const selectedPhoto =
    selectedPhotoIndex !== null && photos[selectedPhotoIndex] && !photos[selectedPhotoIndex].isEmpty
      ? photos[selectedPhotoIndex]
      : null;

  return (
    <div className="fixed inset-0 z-[100000] bg-[#060914] text-white overflow-y-auto overflow-x-hidden pointer-events-auto select-none">
      {/* Subtle Cosmic Background Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[520px] h-[520px] rounded-full bg-blue-600/10 blur-[110px]" />
        <div className="absolute bottom-1/4 left-1/3 w-[420px] h-[420px] rounded-full bg-pink-600/10 blur-[120px]" />
      </div>

      {/* Hidden File Inputs */}
      <input
        type="file"
        ref={fileInputRef}
        multiple
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          handleFilesSelected(e.target.files);
          e.target.value = '';
        }}
      />
      <input
        type="file"
        ref={singleSlotInputRef}
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          handleSingleSlotFile(e.target.files);
          e.target.value = '';
        }}
      />

      {/* Top Sticky Quick Bar */}
      <div className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#060914]/80 border-b border-cyan-500/15 px-4 py-3 flex items-center justify-between max-w-2xl mx-auto">
        <button
          onClick={() =>
            planetSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/70 border border-cyan-400/40 text-cyan-200 text-xs font-mono-vn hover:bg-cyan-900/70 transition-all cursor-pointer"
        >
          <span>🪐 Hành tinh kỷ niệm (9 ảnh)</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-teal-500/80 to-cyan-500/80 border border-cyan-300/50 text-slate-950 font-bold text-xs font-mono-vn shadow-[0_0_15px_rgba(45,212,191,0.35)] hover:brightness-110 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Thêm ảnh</span>
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
              title="Quay lại câu chuyện"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Content Container (Centered column with 3D Planet + 9 Photos Grid) */}
      <div className="relative z-10 w-full max-w-xl mx-auto px-4 pt-6 pb-20 flex flex-col items-center">
        <section
          ref={planetSectionRef}
          className="w-full flex flex-col items-center text-center"
        >
          {/* Cute glowing Pi eyes at top */}
          <div className="flex items-center gap-3.5 mb-5">
            <div className="w-8 h-8 rounded-[10px] bg-gradient-to-b from-[#67e8f9] to-[#06b6d4] shadow-[0_0_24px_rgba(34,211,238,0.8)]" />
            <div className="w-8 h-8 rounded-[10px] bg-gradient-to-b from-[#67e8f9] to-[#06b6d4] shadow-[0_0_24px_rgba(34,211,238,0.8)]" />
          </div>

          <h1
            className="text-2xl sm:text-3xl font-bold font-mono-vn tracking-wide text-[#f0fdfa] mb-3"
            style={{ textShadow: '0 0 22px rgba(103, 232, 249, 0.45)' }}
          >
            Hành tinh kỷ niệm
          </h1>

          <p className="text-sm sm:text-base text-slate-300/90 leading-relaxed max-w-md font-sans-vn mb-6">
            Thêm ảnh của cậu vào 9 khung kỷ niệm bên dưới, ảnh sẽ bay vòng quanh hành tinh. Chạm vào
            ảnh đang bay để xem to, hoặc chạm vào khung trống để chọn ảnh.
          </p>

          {/* 3D Planet & 9-Photo Orbit Stage */}
          <div className="relative w-full h-[320px] sm:h-[350px] flex items-center justify-center my-2 select-none">
            {/* Dashed Elliptical Orbit Ring */}
            <svg
              className="absolute w-[330px] sm:w-[390px] h-[150px] sm:h-[175px] pointer-events-none opacity-45"
              viewBox="0 0 400 180"
            >
              <ellipse
                cx="200"
                cy="90"
                rx="185"
                ry="68"
                fill="none"
                stroke="#94a3b8"
                strokeWidth="1.6"
                strokeDasharray="5,6"
                transform="rotate(-8 200 90)"
              />
            </svg>

            {/* The Center 3D Blue-Indigo Planet Sphere (zIndex 15) */}
            <div
              className="relative z-[15] w-[140px] h-[140px] sm:w-[156px] sm:h-[156px] rounded-full pointer-events-none transition-transform duration-500"
              style={{
                background:
                  'radial-gradient(circle at 34% 28%, #dbeafe 0%, #93c5fd 18%, #3b82f6 48%, #1d4ed8 74%, #0f172a 98%)',
                boxShadow:
                  '0 0 65px rgba(59, 130, 246, 0.45), inset -18px -20px 35px rgba(15, 23, 42, 0.85), inset 8px 8px 22px rgba(255, 255, 255, 0.35)',
              }}
            />

            {/* Orbiting Photo Slots */}
            {photos.map((photo, idx) => {
              const total = Math.max(photos.length, 1);
              const angle = orbitAngle + (idx * Math.PI * 2) / total;
              const rx = typeof window !== 'undefined' && window.innerWidth < 500 ? 136 : 168;
              const ry = typeof window !== 'undefined' && window.innerWidth < 500 ? 54 : 64;

              // Elliptical coordinates with slight tilt (-8 deg)
              const rawX = Math.cos(angle) * rx;
              const rawY = Math.sin(angle) * ry;
              const tilt = -0.14;
              const x = rawX * Math.cos(tilt) - rawY * Math.sin(tilt);
              const y = rawX * Math.sin(tilt) + rawY * Math.cos(tilt);

              // Depth: sin(angle) > 0 is in front of the planet, < 0 is behind the planet
              const depth = Math.sin(angle);
              const scale = 0.72 + ((depth + 1) / 2) * 0.38; // 0.72 at back -> 1.10 at front
              const zIndex = depth >= 0 ? 20 + Math.round(depth * 10) : 5 + Math.round((depth + 1) * 8);
              const opacity = depth >= 0 ? 1 : 0.52 + ((depth + 1) / 2) * 0.38;

              return (
                <div
                  key={photo.id}
                  onClick={() => {
                    if (photo.isEmpty) {
                      setTargetSlotId(photo.id);
                      singleSlotInputRef.current?.click();
                    } else {
                      setSelectedPhotoIndex(idx);
                    }
                  }}
                  style={{
                    transform: `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) scale(${scale.toFixed(3)})`,
                    zIndex,
                    opacity,
                  }}
                  className="absolute w-[68px] h-[78px] sm:w-[76px] sm:h-[86px] rounded-[18px] cursor-pointer transition-shadow duration-200 hover:brightness-110"
                >
                  {photo.isEmpty ? (
                    <div className="w-full h-full rounded-[18px] border-2 border-dashed border-slate-300/70 bg-slate-900/45 backdrop-blur-[2px] flex items-center justify-center shadow-[0_0_15px_rgba(148,163,184,0.15)] hover:border-cyan-300">
                      {photo.emptyIcon === 'star' ? (
                        <span className="text-xl sm:text-2xl drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]">
                          ⭐
                        </span>
                      ) : (
                        <span className="text-xl sm:text-2xl drop-shadow-[0_0_8px_rgba(244,114,182,0.8)]">
                          💗
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="w-full h-full rounded-[18px] border-[2.5px] border-white/95 bg-slate-900 overflow-hidden shadow-[0_10px_25px_rgba(0,0,0,0.55)]">
                      <img
                        src={photo.url}
                        alt={photo.caption}
                        className="w-full h-full object-cover"
                        draggable={false}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* 3 Full-Width Action Buttons */}
          <div className="w-full flex flex-col gap-3.5 mt-3 mb-7">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-3.5 px-6 rounded-full border-2 border-[#2dd4bf] bg-[#09222c]/85 hover:bg-[#0d313f] text-[#a7f3d0] font-mono-vn font-bold text-base sm:text-lg tracking-wide shadow-[0_0_22px_rgba(45,212,191,0.22)] hover:shadow-[0_0_28px_rgba(45,212,191,0.4)] active:scale-[0.99] transition-all cursor-pointer"
            >
              Chọn ảnh từ máy
            </button>

            <button
              onClick={handleAddEmptySlot}
              className="w-full py-3.5 px-6 rounded-full border-2 border-[#2dd4bf] bg-[#09222c]/85 hover:bg-[#0d313f] text-[#a7f3d0] font-mono-vn font-bold text-base sm:text-lg tracking-wide shadow-[0_0_22px_rgba(45,212,191,0.22)] hover:shadow-[0_0_28px_rgba(45,212,191,0.4)] active:scale-[0.99] transition-all cursor-pointer"
            >
              Thêm ô trống
            </button>

            <button
              onClick={handleClearAllUserPhotos}
              className="w-full py-3.5 px-6 rounded-full border-2 border-[#ec4899] bg-[#280d23]/85 hover:bg-[#3b1233] text-[#fbcfe8] font-mono-vn font-bold text-base sm:text-lg tracking-wide shadow-[0_0_22px_rgba(236,72,153,0.22)] hover:shadow-[0_0_28px_rgba(236,72,153,0.4)] active:scale-[0.99] transition-all cursor-pointer"
            >
              {photos.every((p) => p.isEmpty) ? 'Khôi phục 9 ảnh mẫu' : 'Xóa ảnh của mình'}
            </button>
          </div>

          {/* 3x3 (9 Photos) Showcase Grid */}
          <div className="w-full grid grid-cols-3 gap-3 sm:gap-4">
            {photos.map((photo, idx) =>
              photo.isEmpty ? (
                <div
                  key={photo.id}
                  onClick={() => {
                    setTargetSlotId(photo.id);
                    singleSlotInputRef.current?.click();
                  }}
                  className="aspect-square rounded-[22px] border-2 border-dashed border-slate-600/80 bg-[#0b1324]/75 hover:border-[#2dd4bf] hover:bg-[#0e1b30] flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all group"
                >
                  <span className="text-2xl text-cyan-300 group-hover:scale-110 transition-transform">
                    +
                  </span>
                  <span className="text-xs sm:text-sm font-mono-vn font-semibold text-cyan-100/90">
                    Thêm ảnh
                  </span>
                </div>
              ) : (
                <div
                  key={photo.id}
                  onClick={() => setSelectedPhotoIndex(idx)}
                  className="relative aspect-square rounded-[22px] border-2 border-[#5eead4]/80 bg-slate-900 overflow-hidden shadow-[0_0_18px_rgba(45,212,191,0.18)] cursor-pointer group hover:scale-[1.02] transition-all"
                >
                  <img
                    src={photo.url}
                    alt={photo.caption}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {/* Top-right X button */}
                  <button
                    onClick={(e) => handleClearSlot(photo.id, e)}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-slate-900/75 hover:bg-rose-600 text-white flex items-center justify-center text-sm font-bold shadow-md transition-colors cursor-pointer"
                    title="Xóa ảnh này"
                  >
                    ×
                  </button>
                </div>
              )
            )}
          </div>

          {/* Replay Action at the bottom of the 9-photo showcase */}
          {onReplayStory && (
            <div className="w-full mt-10 flex justify-center">
              <button
                onClick={onReplayStory}
                className="py-3 px-6 rounded-full border border-cyan-400/40 bg-cyan-950/40 hover:bg-cyan-900/60 text-cyan-200 font-mono-vn font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Xem lại hành trình từ đầu</span>
              </button>
            </div>
          )}
        </section>
      </div>

      {/* ============================================================
          LIGHTBOX MODAL (View Orbiting Photo Fullscreen + Greeting Card)
         ============================================================ */}
      {selectedPhoto !== null && selectedPhotoIndex !== null && (
        <div
          onClick={() => setSelectedPhotoIndex(null)}
          className="fixed inset-0 z-[100005] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 animate-fade-in"
        >
          <button
            onClick={() => setSelectedPhotoIndex(null)}
            className="absolute top-4 right-4 p-2.5 rounded-full bg-slate-800/80 hover:bg-slate-700 text-white transition-all cursor-pointer z-10"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Prev / Next Navigation */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              const filledIndices = photos
                .map((p, i) => (!p.isEmpty ? i : -1))
                .filter((i) => i !== -1);
              if (filledIndices.length <= 1) return;
              const currentPos = filledIndices.indexOf(selectedPhotoIndex);
              const prevPos = (currentPos - 1 + filledIndices.length) % filledIndices.length;
              setSelectedPhotoIndex(filledIndices[prevPos]);
            }}
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white transition-all cursor-pointer z-10"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              const filledIndices = photos
                .map((p, i) => (!p.isEmpty ? i : -1))
                .filter((i) => i !== -1);
              if (filledIndices.length <= 1) return;
              const currentPos = filledIndices.indexOf(selectedPhotoIndex);
              const nextPos = (currentPos + 1) % filledIndices.length;
              setSelectedPhotoIndex(filledIndices[nextPos]);
            }}
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white transition-all cursor-pointer z-10"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-lg w-full bg-[#0b1324] border-2 border-[#2dd4bf]/60 rounded-3xl p-4 shadow-[0_0_50px_rgba(45,212,191,0.3)] flex flex-col items-center"
          >
            <img
              src={selectedPhoto.url}
              alt={selectedPhoto.caption}
              className="max-h-[65vh] w-auto rounded-2xl object-contain shadow-2xl"
            />
            <h3 className="mt-3 text-lg font-bold font-sans-vn text-white">
              {selectedPhoto.caption}
            </h3>
            {selectedPhoto.subCaption && (
              <p className="text-xs sm:text-sm text-cyan-200/85 mt-1 text-center font-sans-vn">
                {selectedPhoto.subCaption}
              </p>
            )}

            <div className="flex flex-wrap items-center justify-center gap-2.5 mt-4">
              <button
                onClick={() => {
                  setTargetSlotId(selectedPhoto.id);
                  setSelectedPhotoIndex(null);
                  singleSlotInputRef.current?.click();
                }}
                className="px-4 py-2 rounded-full border border-[#2dd4bf] bg-[#09222c] hover:bg-[#0d313f] text-[#a7f3d0] text-xs font-mono-vn font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Thay ảnh khác</span>
              </button>

              <button
                onClick={() => {
                  setCardModalPhoto(selectedPhoto);
                  setSelectedPhotoIndex(null);
                }}
                className="px-4 py-2 rounded-full bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white text-xs font-mono-vn font-bold flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <Gift className="w-3.5 h-3.5" />
                <span>Tạo thiệp 20/10</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Greeting Card Generator Modal */}
      {cardModalPhoto && (
        <GreetingCardModal photo={cardModalPhoto} onClose={() => setCardModalPhoto(null)} />
      )}
    </div>
  );
};
