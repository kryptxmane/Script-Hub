import React from "react";

export default function VideoSkeleton() {
    return (
        <div className="video-card overflow-hidden">
            <div className="skeleton" style={{ aspectRatio: "16 / 9", borderRadius: 0 }} />
            <div className="p-5 space-y-3">
                <div className="skeleton h-4 w-5/6" />
                <div className="skeleton h-4 w-2/3" />
                <div className="flex gap-3 pt-2">
                    <div className="skeleton h-3 w-14" />
                    <div className="skeleton h-3 w-16" />
                </div>
                <div className="skeleton h-10 w-full mt-3" style={{ borderRadius: 999 }} />
            </div>
        </div>
    );
}
