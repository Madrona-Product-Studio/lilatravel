import { useEffect } from "react";

export default function LilaModal({
  open,
  onClose,
  message,
  variant = "alert",
  onConfirm,
  confirmLabel = "Leave",
  cancelLabel = "Cancel",
  dismissLabel = "OK",
}) {
  // Lock body scroll while open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  // Escape key dismisses
  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  const isConfirm = variant === "confirm";

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 p-5"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-warm-white rounded-sm px-8 py-9 max-w-[400px] w-full shadow-[0_20px_60px_rgba(0,0,0,0.15)] animate-lila-modal-in"
      >
        <p className="font-body text-[15px] leading-[1.7] text-dark-ink m-0 mb-7">
          {message}
        </p>

        <div className="flex gap-3 justify-end">
          {isConfirm ? (
            <>
              <button
                onClick={onClose}
                className="font-body text-sm font-semibold tracking-[0.08em] uppercase border-none rounded-sm cursor-pointer px-7 py-3 transition-opacity duration-200 bg-stone text-dark-ink"
              >
                {cancelLabel}
              </button>
              <button
                onClick={onConfirm}
                className="font-body text-sm font-semibold tracking-[0.08em] uppercase border-none rounded-sm cursor-pointer px-7 py-3 transition-opacity duration-200 bg-slate text-warm-white"
              >
                {confirmLabel}
              </button>
            </>
          ) : (
            <button
              onClick={onClose}
              className="font-body text-sm font-semibold tracking-[0.08em] uppercase border-none rounded-sm cursor-pointer px-7 py-3 transition-opacity duration-200 bg-slate text-warm-white"
            >
              {dismissLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
