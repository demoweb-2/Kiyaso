import { useState, useRef, useCallback } from 'react';
import { Upload, X, ImageIcon } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface ImageUploadProps {
  value: string | null;
  onChange: (url: string | null) => void;
  label?: string;
  className?: string;
  aspectClass?: string;
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;

export default function ImageUpload({
  value,
  onChange,
  label = 'Image',
  className = '',
  aspectClass = 'aspect-video',
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (PNG, JPG, WebP).');
      return;
    }
    setUploading(true);
    setError(null);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData.session?.access_token;

      const ext = file.name.split('.').pop() || 'jpg';
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const uploadUrl = `${SUPABASE_URL}/storage/v1/object/kiyaso-images/${fileName}`;

      const headers: Record<string, string> = {
        'Content-Type': file.type,
        'x-upsert': 'false',
      };
      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
      }

      const response = await fetch(uploadUrl, {
        method: 'POST',
        headers,
        body: file,
      });

      if (!response.ok) {
        const errText = await response.text().catch(() => '');
        let errMsg = `HTTP ${response.status}`;
        try {
          const errJson = JSON.parse(errText);
          errMsg = errJson.message || errJson.error || errMsg;
        } catch {
          if (errText) errMsg = errText;
        }
        throw new Error(errMsg);
      }

      const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/kiyaso-images/${fileName}`;
      onChange(publicUrl);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(`Upload failed: ${message}`);
    } finally {
      setUploading(false);
    }
  }, [onChange]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  };

  const handleRemove = () => {
    if (value) {
      const path = value.split('/kiyaso-images/')[1];
      if (path) {
        supabase.storage.from('kiyaso-images').remove([path]).then(() => {});
      }
    }
    onChange(null);
  };

  return (
    <div className={className}>
      {label && (
        <label className="text-white text-sm font-semibold mb-1 block">{label}</label>
      )}
      <div
        onClick={() => !uploading && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`relative ${aspectClass} rounded-xl border-2 border-dashed cursor-pointer overflow-hidden transition-all ${
          dragOver
            ? 'border-brand-500 bg-brand-600/10'
            : value
            ? 'border-white/10'
            : 'border-white/20 hover:border-white/30 hover:bg-white/5'
        }`}
      >
        {value ? (
          <>
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-all flex items-center justify-center gap-2 opacity-0 hover:opacity-100">
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
                className="px-3 py-1.5 rounded-lg bg-white/20 backdrop-blur-md text-white text-xs font-semibold flex items-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5" /> Replace
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); handleRemove(); }}
                className="px-3 py-1.5 rounded-lg bg-brand-600 text-white text-xs font-semibold flex items-center gap-1.5"
              >
                <X className="w-3.5 h-3.5" /> Remove
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-charcoal-500">
            {uploading ? (
              <>
                <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mb-2" />
                <p className="text-xs font-medium text-charcoal-400">Uploading...</p>
              </>
            ) : (
              <>
                <ImageIcon className="w-8 h-8 mb-2" />
                <p className="text-xs font-medium text-charcoal-400">Click or drag & drop</p>
                <p className="text-xs text-charcoal-500 mt-0.5">PNG, JPG, WebP</p>
              </>
            )}
          </div>
        )}
      </div>
      {error && (
        <p className="text-brand-500 text-xs mt-1.5">{error}</p>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}
