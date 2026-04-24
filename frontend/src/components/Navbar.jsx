import React, { useState } from "react";
import {
    Search,
    Settings as SettingsIcon,
    Heart,
    LogIn,
    LogOut,
    Sun,
    Moon,
    ShieldCheck,
    Menu,
    X,
} from "lucide-react";
import { VYNTRIX_LOGO } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export default function Navbar({
    onOpenLogin,
    onOpenSettings,
    onOpenDonate,
    search,
    setSearch,
}) {
    const { user, logout, isAdmin } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <header className="nav-sticky" data-testid="main-navbar">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-4 h-16 md:h-20">
                    {/* Logo + brand */}
                    <a href="#top" className="flex items-center gap-3 shrink-0 group" data-testid="brand-link">
                        <div
                            className="w-10 h-10 md:w-11 md:h-11 rounded-xl overflow-hidden ring-2 ring-offset-2 transition-all"
                            style={{
                                boxShadow: "0 0 22px var(--accent-glow)",
                                borderColor: "var(--accent)",
                                ringColor: "var(--accent)",
                                ringOffsetColor: "transparent",
                            }}
                        >
                            <img src={VYNTRIX_LOGO} alt="Vyntrix" className="w-full h-full object-cover" />
                        </div>
                        <div className="hidden sm:block leading-tight">
                            <div className="text-sm font-bold tracking-wide gradient-text">
                                VYNTRIX
                            </div>
                            <div className="text-[10px] font-medium t-soft uppercase tracking-[0.18em]">
                                Script Hub
                            </div>
                        </div>
                    </a>

                    {/* Search (desktop) */}
                    <div className="hidden md:flex flex-1 max-w-xl relative">
                        <Search
                            className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                            size={16}
                            style={{ color: "var(--text-soft)" }}
                        />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search scripts, games, videos..."
                            className="vx-input pl-11"
                            data-testid="nav-search-input"
                        />
                    </div>

                    {/* Right controls */}
                    <div className="flex items-center gap-2 ml-auto">
                        <button
                            onClick={toggleTheme}
                            className="btn-ghost !p-2 !w-10 !h-10 !rounded-full justify-center"
                            aria-label="Toggle theme"
                            data-testid="theme-toggle-btn"
                        >
                            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
                        </button>

                        <button
                            onClick={onOpenDonate}
                            className="btn-neon !px-4 !py-2 hidden sm:inline-flex"
                            data-testid="open-donate-btn"
                        >
                            <Heart size={14} fill="currentColor" /> Support
                        </button>

                        <button
                            onClick={onOpenSettings}
                            className="btn-ghost !p-2 !w-10 !h-10 !rounded-full justify-center"
                            aria-label="Settings"
                            data-testid="open-settings-btn"
                        >
                            <SettingsIcon size={16} />
                        </button>

                        {user ? (
                            <div className="flex items-center gap-2">
                                {isAdmin && (
                                    <span className="pill hidden md:inline-flex" data-testid="admin-badge">
                                        <ShieldCheck size={12} /> Admin
                                    </span>
                                )}
                                <button
                                    onClick={logout}
                                    className="btn-ghost"
                                    data-testid="logout-btn"
                                >
                                    <LogOut size={14} /> Logout
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={onOpenLogin}
                                className="btn-ghost"
                                data-testid="open-login-btn"
                            >
                                <LogIn size={14} /> Admin
                            </button>
                        )}

                        <button
                            className="btn-ghost !p-2 !w-10 !h-10 !rounded-full justify-center md:hidden"
                            onClick={() => setMobileOpen((v) => !v)}
                            aria-label="Menu"
                            data-testid="mobile-menu-btn"
                        >
                            {mobileOpen ? <X size={16} /> : <Menu size={16} />}
                        </button>
                    </div>
                </div>

                {/* Mobile search */}
                {mobileOpen && (
                    <div className="md:hidden pb-4">
                        <div className="relative">
                            <Search
                                className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                                size={16}
                                style={{ color: "var(--text-soft)" }}
                            />
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search scripts..."
                                className="vx-input pl-11"
                                data-testid="mobile-search-input"
                            />
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}
