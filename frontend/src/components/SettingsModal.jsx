import React, { useState } from "react";
import Modal from "./Modal";
import { useTheme, ACCENT_PRESETS } from "../context/ThemeContext";
import { Sun, Moon, Palette, Check, Sparkles } from "lucide-react";
import { toast } from "sonner";

export default function SettingsModal({ open, onClose }) {
    const { theme, setTheme, accent, setAccent } = useTheme();
    const [pendingTheme, setPendingTheme] = useState(theme);
    const [pendingAccent, setPendingAccent] = useState(accent);

    React.useEffect(() => {
        if (open) {
            setPendingTheme(theme);
            setPendingAccent(accent);
        }
    }, [open, theme, accent]);

    const apply = () => {
        setTheme(pendingTheme);
        setAccent(pendingAccent);
        toast.success("Settings applied");
        onClose();
    };

    return (
        <Modal open={open} onClose={onClose} title="Settings" maxWidth="max-w-lg" testId="settings-modal">
            {/* Theme toggle */}
            <section>
                <div className="flex items-center gap-2 mb-3">
                    <Sparkles size={15} style={{ color: "var(--accent)" }} />
                    <h4 className="text-xs uppercase tracking-wider font-semibold t-soft">
                        Appearance
                    </h4>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    {[
                        { key: "dark", label: "Dark", icon: Moon },
                        { key: "light", label: "Light", icon: Sun },
                    ].map(({ key, label, icon: Icon }) => {
                        const active = pendingTheme === key;
                        return (
                            <button
                                key={key}
                                onClick={() => setPendingTheme(key)}
                                data-testid={`theme-${key}-option`}
                                className="p-4 rounded-2xl flex flex-col items-center gap-2 transition-all"
                                style={{
                                    background: active ? "var(--accent-soft)" : "var(--surface)",
                                    border: active
                                        ? "1px solid var(--accent)"
                                        : "1px solid var(--border)",
                                    boxShadow: active ? "0 0 0 3px var(--accent-soft)" : "none",
                                }}
                            >
                                <Icon size={20} style={{ color: active ? "var(--accent)" : "var(--text-dim)" }} />
                                <span className="text-sm font-semibold">{label}</span>
                            </button>
                        );
                    })}
                </div>
            </section>

            {/* Accent color */}
            <section className="mt-7">
                <div className="flex items-center gap-2 mb-3">
                    <Palette size={15} style={{ color: "var(--accent)" }} />
                    <h4 className="text-xs uppercase tracking-wider font-semibold t-soft">
                        Accent Color
                    </h4>
                </div>

                <div className="grid grid-cols-4 gap-3">
                    {ACCENT_PRESETS.map((p) => {
                        const active =
                            pendingAccent.h === p.h &&
                            pendingAccent.s === p.s &&
                            pendingAccent.l === p.l;
                        return (
                            <button
                                key={p.name}
                                onClick={() => setPendingAccent({ h: p.h, s: p.s, l: p.l })}
                                title={p.name}
                                data-testid={`accent-${p.name.toLowerCase().replace(/\s+/g, "-")}`}
                                className="relative aspect-square rounded-xl transition-transform hover:scale-105"
                                style={{
                                    background: `hsl(${p.h} ${p.s}% ${p.l}%)`,
                                    boxShadow: active
                                        ? `0 0 0 3px hsl(${p.h} ${p.s}% ${p.l}% / 0.45), 0 8px 24px -6px hsl(${p.h} ${p.s}% ${p.l}% / 0.6)`
                                        : "0 4px 12px -4px rgba(0,0,0,0.3)",
                                }}
                            >
                                {active && (
                                    <Check
                                        size={18}
                                        color="#fff"
                                        className="absolute inset-0 m-auto"
                                    />
                                )}
                            </button>
                        );
                    })}
                </div>

                <div className="mt-4">
                    <label className="text-xs uppercase tracking-wider t-soft font-semibold">
                        Custom Hue
                    </label>
                    <input
                        type="range"
                        min="0"
                        max="360"
                        value={pendingAccent.h}
                        onChange={(e) =>
                            setPendingAccent({ ...pendingAccent, h: parseInt(e.target.value, 10) })
                        }
                        className="w-full mt-2"
                        style={{ accentColor: `hsl(${pendingAccent.h} ${pendingAccent.s}% ${pendingAccent.l}%)` }}
                        data-testid="hue-slider"
                    />
                </div>
            </section>

            <button
                onClick={apply}
                className="btn-neon w-full mt-7"
                data-testid="apply-settings-btn"
            >
                <Check size={15} /> Apply Changes
            </button>
        </Modal>
    );
}
