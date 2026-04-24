import React from "react";
import Modal from "./Modal";
import { ExternalLink, FileCode2, CopyCheck, Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function ScriptModal({ open, onClose, video }) {
    const [copied, setCopied] = useState(false);

    if (!video) return null;

    const hasScript = !!video.script_url;

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(video.script_url);
            setCopied(true);
            toast.success("Script link copied");
            setTimeout(() => setCopied(false), 2000);
        } catch {
            toast.error("Failed to copy");
        }
    };

    return (
        <Modal open={open} onClose={onClose} title="Script Details" maxWidth="max-w-lg" testId="script-modal">
            <div className="flex gap-4 mb-5">
                <img
                    src={video.thumbnail}
                    alt=""
                    className="w-28 h-20 md:w-36 md:h-24 object-cover rounded-xl shrink-0"
                />
                <div className="min-w-0">
                    <h4 className="font-semibold text-sm leading-snug line-clamp-3">{video.title}</h4>
                    <a
                        href={`https://www.youtube.com/watch?v=${video.video_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs mt-2"
                        style={{ color: "var(--accent)" }}
                        data-testid="script-modal-watch-link"
                    >
                        <ExternalLink size={12} /> Watch on YouTube
                    </a>
                </div>
            </div>

            {hasScript ? (
                <div className="space-y-3">
                    <div className="pill">
                        <FileCode2 size={12} /> Script Available
                    </div>
                    <div
                        className="rounded-xl p-3 text-xs break-all font-mono"
                        style={{
                            background: "hsl(var(--accent-h) 30% 10% / 0.5)",
                            border: "1px solid var(--border)",
                            color: "var(--text-dim)",
                        }}
                        data-testid="script-url-display"
                    >
                        {video.script_url}
                    </div>
                    <div className="flex gap-2">
                        <a
                            href={video.script_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-neon flex-1 !text-sm"
                            data-testid="open-script-btn"
                        >
                            <ExternalLink size={14} /> Open Script
                        </a>
                        <button
                            onClick={copy}
                            className="btn-ghost !px-4"
                            data-testid="copy-script-btn"
                        >
                            {copied ? <CopyCheck size={14} /> : <Copy size={14} />}
                            {copied ? "Copied" : "Copy"}
                        </button>
                    </div>
                </div>
            ) : (
                <div
                    className="text-center py-6 rounded-xl"
                    style={{
                        background: "var(--surface)",
                        border: "1px dashed var(--border-strong)",
                    }}
                    data-testid="no-script-state"
                >
                    <FileCode2 size={28} className="mx-auto mb-2" style={{ color: "var(--text-soft)" }} />
                    <p className="text-sm t-dim">Script coming soon for this video.</p>
                    <p className="text-xs t-soft mt-1">Check back later or subscribe for updates.</p>
                </div>
            )}
        </Modal>
    );
}
