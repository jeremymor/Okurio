"use client";

import { useRef } from "react";
import { Plus, X } from "lucide-react";

interface LogoUploadProps {
  value?: string;
  onChange: (logo: string | undefined) => void;
}

function resizeImage(file: File, maxSize: number = 200): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let { width, height } = img;
        if (width > height) {
          if (width > maxSize) {
            height = (height * maxSize) / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = (width * maxSize) / height;
            height = maxSize;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/png", 0.8));
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function LogoUpload({ value, onChange }: LogoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const dataUrl = await resizeImage(file);
    onChange(dataUrl);
    if (inputRef.current) inputRef.current.value = "";
  };

  if (value) {
    return (
      <div className="relative h-[45px] w-[45px]">
        <img
          src={value}
          alt="Logo"
          className="h-full w-full rounded-full object-cover"
        />
        <button
          type="button"
          onClick={() => onChange(undefined)}
          className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
        >
          <X className="h-2.5 w-2.5" />
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => inputRef.current?.click()}
      className="flex h-7 w-7 items-center justify-center rounded-full border border-black/[0.08] bg-logo-bg shadow-sm hover:shadow-md transition-shadow"
    >
      <Plus className="h-3.5 w-3.5 text-logo-icon" />
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />
    </button>
  );
}
