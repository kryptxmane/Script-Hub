import React, { useEffect, useMemo, useState } from "react";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";

import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import SortBar from "../components/SortBar";
import VideoCard from "../components/VideoCard";
import VideoSkeleton from "../components/VideoSkeleton";
import UGPhoneCollab from "../components/UGPhoneCollab";
import Footer from "../components/Footer";
import LoginModal from "../components/LoginModal";
import ScriptModal from "../components/ScriptModal";
import EditScriptModal from "../components/EditScriptModal";
import DonateModal from "../components/DonateModal";
import SettingsModal from "../components/SettingsModal";
import { SearchX } from "lucide-react";

export default function HomePage() {
    const { isAdmin } = useAuth();

    const [channel, setChannel] = useState(null);
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [search, setSearch] = useState("");
    const [sort, setSort] = useState("latest");

    const [loginOpen, setLoginOpen] = useState(false);
    const [donateOpen, setDonateOpen] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [scriptModalVideo, setScriptModalVideo] = useState(null);
    const [editModalVideo, setEditModalVideo] = useState(null);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const [chRes, vidRes] = await Promise.all([
                    api.get("/channel").catch(() => ({ data: null })),
                    api.get("/videos"),
                ]);
                if (cancelled) return;
                setChannel(chRes.data);
                setVideos(vidRes.data || []);
            } catch (e) {
                if (!cancelled) setError("Failed to load videos. Please try again later.");
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, []);

    // Parse ISO 8601 duration to seconds — used to filter out Shorts (<= 60s)
    const parseDurationSeconds = (iso) => {
        if (!iso) return 0;
        const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
        if (!m) return 0;
        return (parseInt(m[1] || 0, 10) * 3600) + (parseInt(m[2] || 0, 10) * 60) + parseInt(m[3] || 0, 10);
    };

    // Exclude YouTube Shorts (<= 60s) from every view
    const longFormVideos = useMemo(
        () => videos.filter((v) => parseDurationSeconds(v.duration) > 60),
        [videos]
    );

    const filteredVideos = useMemo(() => {
        let list = [...longFormVideos];
        const q = search.trim().toLowerCase();
        if (q) {
            list = list.filter(
                (v) =>
                    v.title.toLowerCase().includes(q) ||
                    (v.description || "").toLowerCase().includes(q)
            );
        }
        if (sort === "latest") {
            list.sort((a, b) => new Date(b.published_at) - new Date(a.published_at));
        } else if (sort === "oldest") {
            list.sort((a, b) => new Date(a.published_at) - new Date(b.published_at));
        } else if (sort === "popular") {
            list.sort((a, b) => (b.view_count || 0) - (a.view_count || 0));
        }
        return list;
    }, [longFormVideos, search, sort]);

    // "Trending This Week" = last 7 days by views, fallback to last 30 days, hide if empty
    const { trending, trendingLabel } = useMemo(() => {
        const now = Date.now();
        const weekAgo = now - 7 * 24 * 60 * 60 * 1000;
        const monthAgo = now - 30 * 24 * 60 * 60 * 1000;

        const inRange = (since) =>
            longFormVideos
                .filter((v) => new Date(v.published_at).getTime() >= since)
                .sort((a, b) => (b.view_count || 0) - (a.view_count || 0))
                .slice(0, 3);

        const week = inRange(weekAgo);
        if (week.length > 0) return { trending: week, trendingLabel: "Trending This Week" };
        const month = inRange(monthAgo);
        if (month.length > 0) return { trending: month, trendingLabel: "Trending This Month" };
        return { trending: [], trendingLabel: "" };
    }, [longFormVideos]);

    const handleScriptSaved = (video_id, url) => {
        setVideos((prev) =>
            prev.map((v) => (v.video_id === video_id ? { ...v, script_url: url } : v))
        );
    };

    return (
        <div className="aurora-bg min-h-screen">
            <Navbar
                onOpenLogin={() => setLoginOpen(true)}
                onOpenSettings={() => setSettingsOpen(true)}
                onOpenDonate={() => setDonateOpen(true)}
                search={search}
                setSearch={setSearch}
            />

            <main className="relative z-10">
                <Hero channel={channel} videoCount={longFormVideos.length} />

                <UGPhoneCollab />

                {/* Trending */}
                {!loading && trending.length > 0 && (
                    <section className="py-6">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="flex items-center gap-2 mb-5">
                                <span className="pill">{trendingLabel}</span>
                            </div>
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                {trending.map((v, i) => (
                                    <VideoCard
                                        key={`trend-${v.video_id}`}
                                        video={v}
                                        isAdmin={isAdmin}
                                        onGetScript={setScriptModalVideo}
                                        onEdit={setEditModalVideo}
                                        index={i}
                                    />
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* All videos */}
                <section className="py-10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <SortBar sort={sort} setSort={setSort} count={filteredVideos.length} />

                        {error && (
                            <div
                                className="p-5 rounded-2xl text-sm"
                                style={{
                                    background: "rgba(244,63,94,0.1)",
                                    border: "1px solid rgba(244,63,94,0.3)",
                                    color: "var(--danger)",
                                }}
                                data-testid="video-load-error"
                            >
                                {error}
                            </div>
                        )}

                        {loading ? (
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                                {Array.from({ length: 8 }).map((_, i) => (
                                    <VideoSkeleton key={i} />
                                ))}
                            </div>
                        ) : filteredVideos.length === 0 ? (
                            <div
                                className="text-center py-16 glass rounded-3xl"
                                data-testid="no-results-state"
                            >
                                <SearchX
                                    size={44}
                                    className="mx-auto mb-3"
                                    style={{ color: "var(--text-soft)" }}
                                />
                                <h3 className="text-xl font-bold mb-1">No Results Found</h3>
                                <p className="text-sm t-dim">
                                    Try a different keyword or clear your search.
                                </p>
                            </div>
                        ) : (
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                                {filteredVideos.map((v, i) => (
                                    <VideoCard
                                        key={v.video_id}
                                        video={v}
                                        isAdmin={isAdmin}
                                        onGetScript={setScriptModalVideo}
                                        onEdit={setEditModalVideo}
                                        index={i}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </section>

            </main>

            <Footer />

            <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
            <DonateModal open={donateOpen} onClose={() => setDonateOpen(false)} />
            <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
            <ScriptModal
                open={!!scriptModalVideo}
                onClose={() => setScriptModalVideo(null)}
                video={scriptModalVideo}
            />
            <EditScriptModal
                open={!!editModalVideo}
                onClose={() => setEditModalVideo(null)}
                video={editModalVideo}
                onSaved={handleScriptSaved}
            />
        </div>
    );
}
