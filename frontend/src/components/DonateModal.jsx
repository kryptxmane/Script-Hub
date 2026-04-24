import React, { useState } from "react";
import Modal from "./Modal";
import { Heart, Copy, CopyCheck, ExternalLink } from "lucide-react";
import { toast } from "sonner";

const PAYPAL_EMAIL = "cyrusmiguel4@gmail.com";
const PAYPAL_HANDLE = "@gianubando";
const PAYPAL_URL = "https://paypal.me/gianubando";

export default function DonateModal({ open, onClose }) {
    const [copiedKey, setCopiedKey] = useState(null);

    const copy = async (text, key) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedKey(key);
            toast.success("Copied");
            setTimeout(() => setCopiedKey(null), 1800);
        } catch {
            toast.error("Copy failed");
        }
    };

    return (
        <Modal open={open} onClose={onClose} title="Support Vyntrix" maxWidth="max-w-md" testId="donate-modal">
            <div className="text-center mb-6">
                <div
                    className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4"
                    style={{
                        background: "linear-gradient(135deg, var(--accent), hsl(var(--accent-h) 80% 45%))",
                        boxShadow: "0 0 40px var(--accent-glow)",
                    }}
                >
                    <Heart size={26} color="#fff" fill="#fff" />
                </div>
                <p className="text-sm t-dim px-2">
                    Thank you for supporting the Vyntrix channel! Your donations keep the scripts flowing and the content free for everyone. 💜
                </p>
            </div>

            <div className="space-y-3">
                <DonationRow
                    label="PayPal Email"
                    value={PAYPAL_EMAIL}
                    keyId="email"
                    copy={copy}
                    copiedKey={copiedKey}
                />
                <DonationRow
                    label="PayPal Handle"
                    value={PAYPAL_HANDLE}
                    keyId="handle"
                    copy={copy}
                    copiedKey={copiedKey}
                />
                <a
                    href={PAYPAL_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-neon w-full !text-sm"
                    data-testid="paypal-link-btn"
                >
                    <ExternalLink size={14} /> Open PayPal.me
                </a>
            </div>
        </Modal>
    );
}

function DonationRow({ label, value, keyId, copy, copiedKey }) {
    const copied = copiedKey === keyId;
    return (
        <div
            className="flex items-center justify-between gap-3 p-3 rounded-xl"
            style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
            }}
        >
            <div className="min-w-0">
                <div className="text-[10px] uppercase tracking-wider t-soft font-semibold">
                    {label}
                </div>
                <div className="text-sm font-medium truncate" data-testid={`donate-${keyId}-value`}>
                    {value}
                </div>
            </div>
            <button
                onClick={() => copy(value, keyId)}
                className="btn-ghost !p-2 !w-9 !h-9 !rounded-full justify-center shrink-0"
                aria-label="Copy"
                data-testid={`donate-copy-${keyId}-btn`}
            >
                {copied ? <CopyCheck size={14} /> : <Copy size={14} />}
            </button>
        </div>
    );
}
