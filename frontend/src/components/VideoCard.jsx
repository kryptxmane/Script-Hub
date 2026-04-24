import React from "react";
import { Play, Eye, Calendar, Edit3, FileCode2, ExternalLink } from "lucide-react";

function compact(n) {
    return Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(n || 0);
}

function timeAgo(iso) {
    if (!iso) return "";
    const d = new Date(iso);
    const diff = Date.now() - d.getTime();
    const s = Math.floor(diff / 1000);
    if (s < 60) return "just now";
    const m = Math.floor(s / 60);
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    const days = Math.floor(h / 24);
    if (days < 30) return `${days}d ago`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months}mo ago`;
    return `${Math.floor(months / 12)}y ago`;
}

// ISO8601 duration → "mm:ss"
function parseDuration(iso) {
    if (!iso) return "";
    const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!m) return "";
    const h = parseInt(m[1] || 0, 10);
    const mm = parseInt(m[2] || 0, 10);
    const ss = parseInt(m[3] || 0, 10);
    if (h) return `${h}:${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
    return `${mm}:${String(ss).padStart(2, "0")}`;
}

export default function VideoCard({ video, isAdmin, onGetScript, onEdit, index }) {
    const duration = parseDuration(video.duration);

    return (
        <article
            className="video-card fade-up"
            style={{ animationDelay: `${Math.min(index * 60, 400)}ms` }}
            data-testid={`video-card-${video.video_id}`}
        >
            <a
                href={`https://www.youtube.com/watch?v=${video.video_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="thumb block relative"
                data-testid={`video-thumb-${video.video_id}`}
            >
                <img src={video.thumbnail} alt={video.title} loading="lazy" />
                <div
                    className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300"
                    style={{
                        background:
                            "linear-gradient(180deg, rgba(10,7,20,0.1) 0%, rgba(10,7,20,0.75) 100%)",
                    }}
                >
                    <div
                        className="w-14 h-14 rounded-full flex items-center justify-center"
                        style={{
                            background: "var(--accent)",
                            boxShadow: "0 0 40px var(--accent-glow)",
                        }}
                    >
                        <Play size={22} color="#fff" fill="#fff" className="ml-1" />
                    </div>
                </div>
                {duration && (
                    <span
                        className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md text-[11px] font-semibold"
                        style={{ background: "rgba(0,0,0,0.78)", color: "#fff" }}
                    >
                        {duration}
                    </span>
                )}
                {video.script_url && (
                    <span
                        className="absolute top-2 left-2 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1"
                        style={{
                            background: "var(--accent)",
                            color: "#fff",
                            boxShadow: "0 0 20px var(--accent-glow)",
                        }}
                    >
                        <FileCode2 size={11} /> Script Ready
                    </span>
                )}
            </a>

            <div className="p-4 md:p-5">
                <h3
                    className="font-semibold text-base leading-snug line-clamp-2 min-h-[2.6rem]"
                    title={video.title}
                >
                    {video.title}
                </h3>

                <div className="mt-3 flex items-center gap-4 text-xs t-dim">
                    <span className="flex items-center gap-1.5">
                        <Eye size={13} /> {compact(video.view_count)}
                    </span>
                    <span className="flex items-center gap-1.5">
                        <Calendar size={13} /> {timeAgo(video.published_at)}
                    </span>
                </div>

                <div className="mt-4 flex items-center gap-2">
                    <button
                        onClick={() => onGetScript(video)}
                        className="btn-neon !py-2 !px-4 !text-xs flex-1"
                        data-testid={`get-script-btn-${video.video_id}`}
                    >
                        <FileCode2 size={13} /> Get Script
                    </button>
                    {isAdmin && (
                        <button
                            onClick={() => onEdit(video)}
                            className="btn-ghost !p-2 !w-10 !h-10 !rounded-full justify-center"
                            aria-label="Edit script"
                            data-testid={`edit-script-btn-${video.video_id}`}
                        >
                            <Edit3 size={14} />
                        </button>
                    )}
                </div>
            </div>
        </article>
    );
}
