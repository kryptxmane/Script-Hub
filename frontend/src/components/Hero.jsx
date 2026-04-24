import React from "react";
import { Sparkles, Zap, Shield } from "lucide-react";

export default function Hero({ channel, videoCount }) {
    return (
        <section id="top" className="relative py-16 md:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="fade-up">
                    <span className="pill">
                        <Sparkles size={12} /> Premium Roblox Scripts
                    </span>
                </div>

                <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.05] fade-up" style={{ animationDelay: "80ms" }}>
                    <span className="gradient-text">Vyntrix</span>{" "}
                    <span style={{ color: "var(--text)" }}>Script Hub</span>
                </h1>

                <p
                    className="mt-5 text-base md:text-lg max-w-2xl fade-up"
                    style={{ color: "var(--text-dim)", animationDelay: "160ms" }}
                >
                    The highest-quality Roblox scripts, curated straight from the Vyntrix channel.
                    Clean showcases, updated executors, and working scripts — no BS.
                </p>

                <div className="mt-8 flex flex-wrap gap-3 fade-up" style={{ animationDelay: "240ms" }}>
                    <div className="glass px-5 py-3 flex items-center gap-3">
                        <Zap size={16} style={{ color: "var(--accent)" }} />
                        <div>
                            <div className="text-lg font-bold leading-none">{videoCount || "—"}</div>
                            <div className="text-xs t-soft uppercase tracking-wider">Videos</div>
                        </div>
                    </div>
                    <div className="glass px-5 py-3 flex items-center gap-3">
                        <Shield size={16} style={{ color: "var(--accent)" }} />
                        <div>
                            <div className="text-lg font-bold leading-none">
                                {channel?.subscriber_count
                                    ? Intl.NumberFormat("en", { notation: "compact" }).format(
                                          channel.subscriber_count
                                      )
                                    : "—"}
                            </div>
                            <div className="text-xs t-soft uppercase tracking-wider">Subscribers</div>
                        </div>
                    </div>
                    <a
                        href="https://youtube.com/@vyntrixscripts"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-neon"
                        data-testid="hero-channel-link"
                    >
                        Visit YouTube Channel
                    </a>
                </div>
            </div>
        </section>
    );
}
