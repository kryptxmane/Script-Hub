import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import { api } from "../lib/api";
import { Link2, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function EditScriptModal({ open, onClose, video, onSaved }) {
    const [url, setUrl] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open && video) {
            setUrl(video.script_url || "");
        }
    }, [open, video]);

    if (!video) return null;

    const save = async () => {
        if (!url.trim()) {
            toast.error("Please enter a script URL");
            return;
        }
        setLoading(true);
        try {
            await api.put(`/scripts/${video.video_id}`, { script_url: url.trim() });
            toast.success("Script link saved");
            onSaved?.(video.video_id, url.trim());
            onClose();
        } catch (e) {
            toast.error(e?.response?.data?.detail || "Failed to save");
        } finally {
            setLoading(false);
        }
    };

    const remove = async () => {
        if (!video.script_url) {
            onClose();
            return;
        }
        setLoading(true);
        try {
            await api.delete(`/scripts/${video.video_id}`);
            toast.success("Script link removed");
            onSaved?.(video.video_id, null);
            onClose();
        } catch (e) {
            toast.error(e?.response?.data?.detail || "Failed to remove");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal open={open} onClose={onClose} title="Edit Script Link" maxWidth="max-w-lg" testId="edit-script-modal">
            <div className="flex gap-3 mb-5">
                <img
                    src={video.thumbnail}
                    alt=""
                    className="w-24 h-16 object-cover rounded-lg"
                />
                <h4 className="font-semibold text-sm leading-snug line-clamp-3">{video.title}</h4>
            </div>

            <label className="text-xs uppercase tracking-wider t-soft font-semibold">
                Script URL
            </label>
            <div className="relative mt-2">
                <Link2
                    size={15}
                    className="absolute left-4 top-1/2 -translate-y-1/2"
                    style={{ color: "var(--text-soft)" }}
                />
                <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://pastebin.com/..."
                    className="vx-input pl-11"
                    data-testid="edit-script-url-input"
                />
            </div>

            <div className="flex gap-2 mt-6">
                <button
                    onClick={save}
                    disabled={loading}
                    className="btn-neon flex-1"
                    data-testid="save-script-btn"
                >
                    <Save size={14} /> {loading ? "Saving..." : "Save Script"}
                </button>
                {video.script_url && (
                    <button
                        onClick={remove}
                        disabled={loading}
                        className="btn-ghost !px-4"
                        style={{ color: "var(--danger)" }}
                        data-testid="remove-script-btn"
                    >
                        <Trash2 size={14} />
                    </button>
                )}
            </div>
        </Modal>
    );
}
