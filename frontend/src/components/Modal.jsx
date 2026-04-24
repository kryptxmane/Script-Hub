import React, { useEffect } from "react";
import { X } from "lucide-react";

export default function Modal({ open, onClose, children, title, maxWidth = "max-w-md", testId }) {
    useEffect(() => {
        if (!open) return;
        const onKey = (e) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", onKey);
        document.body.style.overflow = "hidden";
        return () => {
            window.removeEventListener("keydown", onKey);
            document.body.style.overflow = "";
        };
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            data-testid={testId || "modal"}
        >
            <div
                className="absolute inset-0"
                style={{
                    background: "rgba(7, 4, 18, 0.7)",
                    backdropFilter: "blur(8px)",
                }}
                onClick={onClose}
            />
            <div
                className={`relative w-full ${maxWidth} glass-strong rounded-3xl p-6 md:p-7 fade-up`}
                style={{ animationDuration: "0.35s" }}
            >
                <div className="flex items-center justify-between mb-5">
                    <h3 className="text-lg font-bold tracking-tight">{title}</h3>
                    <button
                        onClick={onClose}
                        className="btn-ghost !p-2 !w-9 !h-9 !rounded-full justify-center"
                        aria-label="Close"
                        data-testid="modal-close-btn"
                    >
                        <X size={16} />
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
}
