import { useRef, useState } from 'react';
import { HiOutlineCloudUpload, HiOutlineTrash, HiOutlineCheckCircle } from 'react-icons/hi';

function UploadDropzone({ step, label, hint, file, previewUrl, onSelect, onClear }) {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = (fileList) => {
    const picked = fileList?.[0];
    if (picked && picked.type.startsWith('image/')) {
      onSelect(picked);
    }
  };

  return (
    <div
      onDragOver={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(event) => {
        event.preventDefault();
        setIsDragging(false);
        handleFiles(event.dataTransfer.files);
      }}
      className={`group relative overflow-hidden rounded-[20px] border transition-all duration-300 ease-out ${
        isDragging
          ? 'border-brand/70 bg-brand/[0.06]'
          : 'border-dashed border-black/15 bg-black/[0.02] hover:border-brand/40 hover:bg-brand/[0.03] dark:border-white/15 dark:bg-white/[0.03] dark:hover:border-brand/40'
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => handleFiles(event.target.files)}
      />

      {previewUrl ? (
        <div className="relative">
          <img src={previewUrl} alt={label} className="h-40 w-full object-cover" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 p-4">
            <div className="flex items-center gap-2">
              <HiOutlineCheckCircle className="text-emerald-400" size={18} />
              <div>
                <p className="text-xs font-medium text-white/70">{label}</p>
                <p className="max-w-[160px] truncate text-sm font-semibold text-white">{file?.name}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onClear();
              }}
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black/40 text-white/90 backdrop-blur transition-colors hover:bg-danger/80"
              aria-label={`Remove ${label}`}
            >
              <HiOutlineTrash size={15} />
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex w-full flex-col items-center gap-3 px-5 py-8 text-center"
        >
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-black/[0.04] text-lavender shadow-sm dark:bg-white/10">
            <HiOutlineCloudUpload size={22} />
          </span>
          <span className="flex items-center gap-2 text-sm font-semibold text-soft">
            <span className="rounded-full bg-brand/15 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-brand">
              Step {step}
            </span>
            {label}
          </span>
          <span className="text-xs leading-5 text-muted">{hint}</span>
        </button>
      )}
    </div>
  );
}

export default UploadDropzone;