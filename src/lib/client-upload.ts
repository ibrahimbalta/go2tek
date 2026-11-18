async function compressImageInBrowser(file: File): Promise<File> {
  if (!file.type.startsWith('image/') || file.size <= 600 * 1024) {
    return file;
  }

  return new Promise((resolve) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      const maxDim = 1400;
      let { width, height } = img;

      if (width > maxDim || height > maxDim) {
        if (width >= height) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(file);
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve(file);
            return;
          }
          const baseName = file.name.replace(/\.[^.]+$/, '');
          resolve(
            new File([blob], `${baseName}.jpg`, {
              type: 'image/jpeg',
            })
          );
        },
        'image/jpeg',
        0.82
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(file);
    };

    img.src = objectUrl;
  });
}

export async function uploadMediaFile(
  rawFile: File,
  type: 'image' | 'video'
): Promise<{ ok: boolean; url?: string; error?: string }> {
  try {
    let fileToSend = rawFile;

    if (type === 'image') {
      fileToSend = await compressImageInBrowser(rawFile);
      if (fileToSend.size > 4 * 1024 * 1024) {
        return {
          ok: false,
          error: 'Görsel boyutu 4 MB sınırını aşıyor. Lütfen daha küçük bir görsel seçin.',
        };
      }
    } else if (fileToSend.size > 4.2 * 1024 * 1024) {
      return {
        ok: false,
        error:
          'Doğrudan video yükleme sınırı 4 MB’dır. Daha büyük videoları YouTube’a (Liste Dışı) yükleyip linkini yapıştırabilirsiniz.',
      };
    }

    const fd = new FormData();
    fd.append('file', fileToSend);
    fd.append('type', type);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: fd,
    });

    const text = await res.text();
    let json: { url?: string; error?: string } = {};
    try {
      json = JSON.parse(text);
    } catch {
      if (res.status === 413) {
        return {
          ok: false,
          error:
            'Dosya boyutu sunucu sınırını (4 MB) aşıyor. Daha küçük bir dosya seçin veya video için link yapıştırın.',
        };
      }
      return {
        ok: false,
        error: `Sunucu hatası (${res.status}). Lütfen tekrar deneyin.`,
      };
    }

    if (!res.ok || !json.url) {
      return {
        ok: false,
        error: json.error || 'Dosya yüklenemedi.',
      };
    }

    return { ok: true, url: json.url };
  } catch {
    return {
      ok: false,
      error: 'Yükleme sırasında bağlantı hatası oluştu.',
    };
  }
}
