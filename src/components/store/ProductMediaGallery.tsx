'use client';

import React, { useState } from 'react';
import { PlayCircle, Image as ImageIcon } from 'lucide-react';

function getYouTubeEmbedUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes('youtu.be')) {
      const id = parsed.pathname.replace('/', '');
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    if (parsed.hostname.includes('youtube.com')) {
      const id = parsed.searchParams.get('v');
      if (id) return `https://www.youtube.com/embed/${id}`;
      if (parsed.pathname.startsWith('/shorts/')) {
        const shortId = parsed.pathname.replace('/shorts/', '');
        return shortId ? `https://www.youtube.com/embed/${shortId}` : null;
      }
      if (parsed.pathname.startsWith('/embed/')) return url;
    }
  } catch {
    // not an absolute URL
  }
  return null;
}

export function ProductMediaGallery({
  images,
  videoUrl,
  title,
  sku,
  stockStatus,
}: {
  images: string[];
  videoUrl?: string | null;
  title: string;
  sku: string;
  stockStatus: string;
}) {
  const [activeMode, setActiveMode] = useState<'IMAGE' | 'VIDEO'>('IMAGE');
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  const cleanVideo = (videoUrl || '').trim();
  const ytEmbed = cleanVideo ? getYouTubeEmbedUrl(cleanVideo) : null;

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-3xl border-2 border-zinc-200 p-4 sm:p-6 aspect-[16/11] flex items-center justify-center relative overflow-hidden">
        {activeMode === 'VIDEO' && cleanVideo ? (
          ytEmbed ? (
            <iframe
              src={ytEmbed}
              title={`${title} Videosu`}
              className="w-full h-full rounded-2xl"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <video
              src={cleanVideo}
              controls
              playsInline
              className="w-full h-full rounded-2xl object-contain bg-black"
            />
          )
        ) : (
          <img
            src={images[activeImageIdx] || images[0]}
            alt={title}
            className="w-full h-full object-contain"
          />
        )}

        <div className="absolute top-4 left-4 flex gap-2 pointer-events-none">
          <span className="px-3 py-1 rounded-lg bg-zinc-900 text-white text-xs font-extrabold">
            Stok Kodu: {sku}
          </span>
          <span className="px-3 py-1 rounded-lg bg-red-600 text-white text-xs font-extrabold">
            {stockStatus === 'IN_STOCK' ? 'Stokta Hazır' : 'Rezerve'}
          </span>
        </div>

        {cleanVideo && (
          <div className="absolute bottom-4 right-4 flex gap-1.5 bg-white/95 backdrop-blur-xs p-1 rounded-full border border-zinc-200 shadow-sm">
            <button
              type="button"
              onClick={() => setActiveMode('IMAGE')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition ${
                activeMode === 'IMAGE'
                  ? 'bg-zinc-900 text-white'
                  : 'text-zinc-700 hover:bg-zinc-100'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              Fotoğraf
            </button>
            <button
              type="button"
              onClick={() => setActiveMode('VIDEO')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition ${
                activeMode === 'VIDEO'
                  ? 'bg-red-600 text-white'
                  : 'text-zinc-700 hover:bg-zinc-100'
              }`}
            >
              <PlayCircle className="w-3.5 h-3.5" />
              Cihaz Videosu
            </button>
          </div>
        )}
      </div>

      {/* Thumbnails Row (Images + Video Thumbnail) */}
      {(images.length > 1 || cleanVideo) && (
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
          {images.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setActiveMode('IMAGE');
                setActiveImageIdx(i);
              }}
              className={`bg-white rounded-xl border-2 p-2 aspect-video flex items-center justify-center transition ${
                activeMode === 'IMAGE' && activeImageIdx === i
                  ? 'border-red-600'
                  : 'border-zinc-200 hover:border-zinc-300'
              }`}
            >
              <img
                src={img}
                alt={`${title} - ${i + 1}`}
                className="w-full h-full object-contain"
              />
            </button>
          ))}

          {cleanVideo && (
            <button
              type="button"
              onClick={() => setActiveMode('VIDEO')}
              className={`rounded-xl border-2 p-2 aspect-video flex flex-col items-center justify-center gap-1 text-[11px] font-bold transition ${
                activeMode === 'VIDEO'
                  ? 'border-red-600 bg-red-50 text-red-700'
                  : 'border-zinc-200 bg-zinc-50 text-zinc-700 hover:border-red-400'
              }`}
            >
              <PlayCircle className="w-5 h-5 text-red-600" />
              <span>Video İzle</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
