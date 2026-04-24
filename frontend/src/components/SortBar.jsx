import React from "react";
import { Clock, Flame, History, SortAsc } from "lucide-react";

const OPTIONS = [
    { key: "latest", label: "Latest", icon: Clock },
    { key: "oldest", label: "Oldest", icon: History },
    { key: "popular", label: "Most Popular", icon: Flame },
];

export default function SortBar({ sort, setSort, count }) {
    return (
        <div className="mb-6">
            {/* Header row */}
            <div className="flex items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2 min-w-0">
                    <SortAsc size={18} style={{ color: "var(--accent)" }} className="shrink-0" />
                    <h2 className="text-lg font-bold tracking-tight">
                        All Videos
                        <span className="ml-2 text-sm t-soft font-normal">({count})</span>
                    </h2>
                </div>
            </div>

            {/* Sort pills — own row, scrollable on mobile */}
            <div className="-mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto">
                <div
                    className="inline-flex gap-1.5 p-1 glass rounded-full w-max"
                    data-testid="sort-bar"
                >
                    {OPTIONS.map((opt) => {
                        const Icon = opt.icon;
                        const active = sort === opt.key;
                        return (
                            <button
                                key={opt.key}
                                onClick={() => setSort(opt.key)}
                                data-testid={`sort-${opt.key}-btn`}
                                className="whitespace-nowrap px-3.5 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5"
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
        </div>
    );
}
