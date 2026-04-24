import React, { useState } from "react";
import { Wand2, Loader2 } from "lucide-react";
import { api } from "../lib/api";
import { toast } from "sonner";

export default function AutoExtractButton({ onDone }) {
    const [loading, setLoading] = useState(false);

    const run = async () => {
        if (loading) return;
        setLoading(true);
        try {
            const { data } = await api.post("/scripts/auto-extract");
            toast.success(
                `Auto-extracted ${data.extracted} script${data.extracted === 1 ? "" : "s"}` +
                    (data.no_link_found ? ` · ${data.no_link_found} had no link` : "")
            );
            onDone?.();
        } catch (e) {
            toast.error(e?.response?.data?.detail || "Auto-extract failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={run}
            disabled={loading}
            className="btn-ghost !text-xs"
            data-testid="auto-extract-btn"
            title="Scan video descriptions for velink / link-unlock URLs"
        >
            {loading ? <Loader2 size={13} className="animate-spin" /> : <Wand2 size={13} />}
            {loading ? "Extracting..." : "Auto-Extract Scripts"}
        </button>
    );
}
