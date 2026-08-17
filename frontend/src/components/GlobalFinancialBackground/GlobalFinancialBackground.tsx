import React, { useEffect, useState, useRef } from "react";
import "./GlobalFinancialBackground.css";

const TOTAL_FRAMES = 300;
const FRAME_FOLDER = "/financial-frames";
const FRAME_VERSION = "v2-20260814";

const getFramePath = (index: number) => {
    return `${FRAME_FOLDER}/frame_${String(index).padStart(6, "0")}.jpg?${FRAME_VERSION}`;
};

export const GlobalFinancialBackground: React.FC = () => {
    const [currentFrame, setCurrentFrame] = useState(1);
    const [progress, setProgress] = useState(0);
    const imageCacheRef = useRef<HTMLImageElement[]>([]);

    // Preload ALL frames sequentially to ensure perfectly smooth scrolling
    useEffect(() => {
        for (let i = 1; i <= TOTAL_FRAMES; i++) {
            const img = new Image();
            img.src = getFramePath(i);
            imageCacheRef.current.push(img);
        }
    }, []);

    // Global Scroll Listener with exact throttle pattern
    useEffect(() => {
        let ticking = false;

        const updateFrameFromScroll = () => {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight;
            const viewportHeight = window.innerHeight;
            const maxScroll = scrollHeight - viewportHeight;
            
            const currentProgress = maxScroll > 0 ? scrollTop / maxScroll : 0;
            const clampedProgress = Math.max(0, Math.min(1, currentProgress));
            
            // 0 -> 1 mapped to 0 -> 299, then +1 for 1-based index
            const frameIndex = Math.round(clampedProgress * (TOTAL_FRAMES - 1));
            const exactFrame = Math.max(1, Math.min(TOTAL_FRAMES, frameIndex + 1));
            
            setProgress(clampedProgress);
            setCurrentFrame(exactFrame);
        };

        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    updateFrameFromScroll();
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        // Initial setup
        updateFrameFromScroll();

        window.addEventListener("resize", handleScroll, { passive: true });

        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", handleScroll);
        };
    }, []);

    return (
        <div className="global-financial-bg">
            <img
                src={getFramePath(currentFrame)}
                alt="Global Financial Environment"
                className="global-frame-img"
            />
        </div>
    );
};
