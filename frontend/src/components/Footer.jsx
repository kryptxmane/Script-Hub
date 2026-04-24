import React from "react";
import { VYNTRIX_LOGO } from "../lib/api";
import { Youtube, Mail, Heart } from "lucide-react";

export default function Footer() {
    return (
        <footer
            className="relative mt-16 pt-10 pb-8 border-t"
            style={{ borderColor: "var(--border)" }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-3 gap-8 items-start">
                    <div className="flex items-center gap-3">
                        <div
                            className="w-12 h-12 rounded-xl overflow-hidden"
                            style={{ boxShadow: "0 0 22px var(--accent-glow)" }}
                        >
                            <img src={VYNTRIX_LOGO} alt="Vyntrix" className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <div className="font-bold text-base gradient-text">VYNTRIX</div>
                            <div className="text-xs t-soft uppercase tracking-wider">Script Hub</div>
                        </div>
                    </div>

                    <div>
                        <h5 className="text-xs uppercase tracking-wider t-soft font-semibold mb-3">
                            Connect
                        </h5>
                        <a
                            href="https://youtube.com/@vyntrixscripts"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm mb-2 t-dim hover:text-[var(--accent)] transition-colors"
                            data-testid="footer-yt-link"
                        >
                            <Youtube size={14} /> youtube.com/@vyntrixscripts
                        </a>
                        <a
                            href="mailto:kryptomane974@gmail.com"
                            className="flex items-center gap-2 text-sm t-dim hover:text-[var(--accent)] transition-colors"
                            data-testid="footer-email"
                        >
                            <Mail size={14} /> kryptomane974@gmail.com
                        </a>
                    </div>

                    <div>
                        <h5 className="text-xs uppercase tracking-wider t-soft font-semibold mb-3">
                            About
                        </h5>
                        <p className="text-sm t-dim max-w-sm">
                            Highest-quality Roblox scripts, executors, and tutorials. Straight to the
                            point — no BS.
                        </p>
                    </div>
                </div>

                <div
                    className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-8 pt-6 border-t text-xs t-soft"
                    style={{ borderColor: "var(--border)" }}
                >
                    <div>© {new Date().getFullYear()} Vyntrix Script Hub. All rights reserved.</div>
                    <div className="flex items-center gap-1.5">
                        Made with <Heart size={12} fill="currentColor" style={{ color: "var(--accent)" }} /> for the community
                    </div>
                </div>
            </div>
        </footer>
    );
}
