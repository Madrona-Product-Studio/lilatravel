import { useEffect } from "react";
import { C, FONTS } from "@data/brand";

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

  const btnBase = {
    fontFamily: FONTS.body,
    fontSize: 14,
    fontWeight: 600,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    border: "none",
    borderRadius: 2,
    cursor: "pointer",
    padding: "12px 28px",
    transition: "opacity 0.2s",
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.4)",
        padding: 20,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: C.warmWhite,
          borderRadius: 2,
          padding: "36px 32px",
          maxWidth: 400,
          width: "100%",
          boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
          animation: "lilaModalIn 0.2s ease-out",
        }}
      >
        <style>{`
          @keyframes lilaModalIn {
            from { opacity: 0; transform: scale(0.96) translateY(6px); }
            to   { opacity: 1; transform: scale(1) translateY(0); }
          }
        `}</style>

        <p style={{
          fontFamily: FONTS.body,
          fontSize: 15,
          lineHeight: 1.7,
          color: C.darkInk,
          margin: "0 0 28px",
        }}>
          {message}
        </p>

        <div style={{
          display: "flex",
          gap: 12,
          justifyContent: "flex-end",
        }}>
          {isConfirm ? (
            <>
              <button
                onClick={onClose}
                style={{ ...btnBase, background: C.stone, color: C.darkInk }}
              >
                {cancelLabel}
              </button>
              <button
                onClick={onConfirm}
                style={{ ...btnBase, background: C.slate, color: C.warmWhite }}
              >
                {confirmLabel}
              </button>
            </>
          ) : (
            <button
              onClick={onClose}
              style={{ ...btnBase, background: C.slate, color: C.warmWhite }}
            >
              {dismissLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
