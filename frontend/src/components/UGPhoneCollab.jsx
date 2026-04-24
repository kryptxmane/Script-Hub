import React from "react";
import { UGPHONE_LOGO, UGPHONE_URL } from "../lib/api";
import { Gamepad2, Zap, Globe2, ArrowRight } from "lucide-react";

export default function UGPhoneCollab() {
    return (
        <section className="py-14 md:py-20 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div
                    className="glass-strong noise relative overflow-hidden rounded-3xl p-8 md:p-12"
                    data-testid="ugphone-section"
                >
                    {/* Accent blobs */}
                    <div
                        className="absolute -top-20 -right-20 w-80 h-80 rounded-full pointer-events-none"
                        style={{
                            background:
                                "radial-gradient(circle, var(--accent-glow), transparent 60%)",
                            filter: "blur(60px)",
                        }}
                    />
                    <div
                        className="absolute -bottom-20 -left-10 w-72 h-72 rounded-full pointer-events-none"
                        style={{
                            background:
                                "radial-gradient(circle, hsl(var(--accent-h) 80% 55% / 0.35), transparent 60%)",
                            filter: "blur(60px)",
                        }}
                    />

                    <div className="grid md:grid-cols-[1fr_auto] gap-8 md:gap-10 items-center relative">
                        <div>
                            <span className="pill mb-5 inline-flex">
                                <Zap size={12} /> Official Partner
                            </span>
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
                                Play Roblox anywhere with{" "}
                                <span className="gradient-text">UGPhone</span>
                            </h2>
                            <p
                                className="mt-4 max-w-xl text-sm md:text-base"
                                style={{ color: "var(--text-dim)" }}
                            >
                                UGPhone is a cloud Android phone that runs 24/7 in the cloud — perfect
                                for running Roblox, executors & scripts without lag or device limits.
                                Use my invitation code to unlock bonuses.
                            </p>

                            <div className="mt-6 flex flex-wrap gap-3">
                                <div className="glass px-4 py-2 text-xs flex items-center gap-2">
                                    <Gamepad2 size={14} style={{ color: "var(--accent)" }} />
                                    Cloud Gaming
                                </div>
                                <div className="glass px-4 py-2 text-xs flex items-center gap-2">
                                    <Globe2 size={14} style={{ color: "var(--accent)" }} />
                                    24/7 Uptime
                                </div>
                                <div className="glass px-4 py-2 text-xs flex items-center gap-2">
                                    <Zap size={14} style={{ color: "var(--accent)" }} />
                                    Code: <strong>vyntrx</strong>
                                </div>
                            </div>

                            <a
                                href={UGPHONE_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-neon mt-7 !text-sm"
                                data-testid="ugphone-affiliate-btn"
                            >
                                Claim Your Bonus <ArrowRight size={14} />
                            </a>
                        </div>

                        <div className="flex items-center justify-center">
                            <div
                                className="relative w-44 h-44 md:w-60 md:h-60 rounded-[32px] flex items-center justify-center p-6"
                                style={{
                                    background:
                                        "linear-gradient(135deg, hsl(var(--accent-h) 35% 14%), hsl(var(--accent-h) 45% 20%))",
                                    border: "1px solid var(--border-strong)",
                                    boxShadow: "0 30px 70px -20px var(--accent-glow)",
                                }}
                            >
                                <img
                                    src={UGPHONE_LOGO}
                                    alt="UGPhone"
                                    className="w-full h-full object-contain drop-shadow-[0_0_30px_rgba(255,255,255,0.25)]"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
