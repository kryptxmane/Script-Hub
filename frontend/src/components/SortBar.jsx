import React from "react";
import { ChevronDown, Clock, Flame, History, SortAsc } from "lucide-react";

const OPTIONS = [
    { key: "latest", label: "Latest", icon: Clock },
    { key: "oldest", label: "Oldest", icon: History },
    { key: "popular", label: "Most Popular", icon: Flame },
];

export default function SortBar({ sort, setSort, count }) {
    return (
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
                <SortAsc size={18} style={{ color: "var(--accent)" }} />
                <h2 className="text-lg md:text-lg font-bold tracking-tight">
                    Videos
                    <span className="ml-2 text-sm t-soft font-normal">
                        ({count})
                    </span>
                </h2>
            </div>
            <div className="flex gap-2 p-1 glass rounded-full">
                {OPTIONS.map((opt) => {
                    const Icon = opt.icon;
                    const active = sort === opt.key;
                    return (
                        <button
                            key={opt.key}
                            onClick={() => setSort(opt.key)}
                            data-testid={`sort-${opt.key}-btn`}
                            className="px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all flex items-center gap-2"
                            style={{
                                background: active
                                    ? "linear-gradient(135deg, var(--accent), hsl(var(--accent-h) 80% 45%))"
                                    : "transparent",
                                color: active ? "#fff" : "var(--text-dim)",
                                boxShadow: active
                                    ? "0 6px 22px -8px var(--accent-glow)"
                                    : "none",
                            }}
                        >
                            <Icon size={13} />
                            {opt.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
