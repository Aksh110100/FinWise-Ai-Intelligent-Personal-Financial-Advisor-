import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { scrollToSection } from "../../utils/navigation";
import "./ScrollFinancialAnimation.css";

const TOTAL_FRAMES = 300;
const FRAME_FOLDER = "/financial-frames";
const FRAME_VERSION = "v2-20260814";

const getFramePath = (index: number) => {
    return `${FRAME_FOLDER}/frame_${String(index).padStart(6, "0")}.jpg?${FRAME_VERSION}`;
};

const STAGES = [
    {
        posClass: "pos-center-left",
        logo: "FINWISE AI",
        eyebrow: "AI-POWERED FINANCIAL INTELLIGENCE",
        heading: "YOUR MONEY.\nUNDERSTOOD.",
        description: "Your personal AI financial advisor that understands your spending, helps you save smarter, and plans what comes next.",
        extra: (
            <div className="stage-hero-extra">
                <Link to="/login" className="primary-cta">
                    START YOUR FINANCIAL PLAN
                    <ArrowRight size={16} style={{ marginLeft: '8px' }} />
                </Link>
                <div className="scroll-indicator">EXPLORE HOW IT WORKS ↓</div>
            </div>
        )
    },
    {
        posClass: "pos-left",
        eyebrow: "01 / UNDERSTAND",
        heading: "SEE WHERE\nYOUR MONEY GOES.",
        description: "AI automatically analyzes your income and expenses to reveal patterns you might miss.",
        extra: (
            <div className="insight-box">
                <div className="insight-value">₹54,200</div>
                <div className="insight-label">MONTHLY SPENDING</div>
            </div>
        )
    },
    {
        posClass: "pos-center",
        eyebrow: "02 / OPTIMIZE",
        heading: "STOP MONEY\nFROM LEAKING.",
        description: "FinWise identifies unnecessary spending and shows where you can save more.",
        extra: (
            <div className="insight-box">
                <div className="insight-value positive">+₹6,000</div>
                <div className="insight-label">POTENTIAL MONTHLY SAVINGS</div>
            </div>
        )
    },
    {
        posClass: "pos-center-right",
        eyebrow: "03 / SAVE",
        heading: "BUILD A STRONGER\nFINANCIAL BASE.",
        description: "",
        extra: (
            <div className="features-list">
                <div className="feature-item">Emergency savings.</div>
                <div className="feature-item">Monthly cash flow.</div>
                <div className="feature-item">Financial buffer.</div>
            </div>
        )
    },
    {
        posClass: "pos-center-left",
        eyebrow: "04 / INVEST",
        heading: "TURN SAVINGS\nINTO GROWTH.",
        description: "",
        extra: (
            <div className="insight-box">
                <div className="insight-label">RECOMMENDED</div>
                <div className="insight-value">₹10,000 <span className="small">/ MONTH</span></div>
                <div className="insight-label">INVESTMENT</div>
            </div>
        )
    },
    {
        posClass: "pos-center",
        eyebrow: "05 / PLAN",
        heading: "SEE WHERE\nYOU'RE GOING.",
        description: "",
        extra: (
            <div className="insight-box">
                <div className="insight-label">5 YEAR TARGET</div>
                <div className="insight-value">₹12,00,000</div>
                <div className="insight-sub positive">ON TRACK ↑</div>
            </div>
        )
    }
];

export const ScrollFinancialAnimation: React.FC = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const [currentFrame, setCurrentFrame] = useState(1);
    const [progress, setProgress] = useState(0);

    // Preload cache
    useEffect(() => {
        const imageCache = [];
        for (let i = 1; i <= TOTAL_FRAMES; i += 10) { // Preload every 10th to save memory, browser handles rest gracefully
            const img = new Image();
            img.src = getFramePath(i);
            imageCache.push(img);
        }
    }, []);

    // Strict Scroll Logic without any autoplay or time-based loops
    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;
        
        let animationFrameId: number | null = null;

        const handleScroll = () => {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
            
            animationFrameId = requestAnimationFrame(() => {
                const rect = section.getBoundingClientRect();
                
                // scrollableDistance based purely on the outer section's height
                const scrollableDistance = section.offsetHeight - window.innerHeight;
                if (scrollableDistance <= 0) return;

                // Calculate exact progress based on section top position
                const currentProgress = Math.min(1, Math.max(0, -rect.top / scrollableDistance));
                setProgress(currentProgress);

                // Map progress exactly to frames 1 to 300
                const frame = Math.round(currentProgress * (TOTAL_FRAMES - 1)) + 1;
                setCurrentFrame(Math.max(1, Math.min(TOTAL_FRAMES, frame)));
            });
        };

        window.addEventListener("scroll", handleScroll, { passive: true, capture: true });
        handleScroll(); // Initial check

        return () => {
            window.removeEventListener("scroll", handleScroll, { capture: true });
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
        };
    }, []);

    // Calculate active stage based on progress
    let activeStage = 0;
    if (progress >= 0.16 && progress < 0.33) activeStage = 1;
    else if (progress >= 0.33 && progress < 0.5) activeStage = 2;
    else if (progress >= 0.5 && progress < 0.66) activeStage = 3;
    else if (progress >= 0.66 && progress < 0.83) activeStage = 4;
    else if (progress >= 0.83) activeStage = 5;

    return (
        <section ref={sectionRef} className="financial-world-section" id="scroll-transformation">
            <div className="financial-world-sticky">
                
                {/* BACKGROUND LAYER: Live Financial Environment */}
                <div className="background-layer">
                    <img
                        src={getFramePath(currentFrame)}
                        alt="Financial Environment"
                        className="full-screen-frame"
                    />
                    <div className="dark-overlay"></div>
                </div>

                {/* FOREGROUND LAYER: The Story */}
                <div className="foreground-layer">
                    <div className="foreground-wrapper">
                        {STAGES.map((stage, index) => {
                            let stateClass = 'upcoming';
                            if (index === activeStage) {
                                stateClass = 'active';
                            } else if (index < activeStage) {
                                stateClass = 'past';
                            }

                            return (
                                <div key={index} className={`story-overlay ${stage.posClass} ${stateClass}`}>
                                    {stage.logo && <div className="stage-logo">{stage.logo}</div>}
                                    <div className="stage-eyebrow">{stage.eyebrow}</div>
                                    <h2 className="stage-heading">
                                        {stage.heading.split('\n').map((line, i) => (
                                            <React.Fragment key={i}>
                                                {line}<br />
                                            </React.Fragment>
                                        ))}
                                    </h2>
                                    {stage.description && <p className="stage-desc">{stage.description}</p>}
                                    <div className="stage-extra">
                                        {stage.extra}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Left Edge Progress Indicator */}
                <div className="edge-progress-indicator">
                    <div className="edge-line">
                        <div className="edge-line-fill" style={{ height: `${progress * 100}%` }}></div>
                    </div>
                    <div className="edge-pips">
                        {[1, 2, 3, 4, 5].map((num) => (
                            <div key={num} className={`edge-pip ${activeStage === num ? 'active' : ''} ${activeStage > num ? 'past' : ''}`}>
                                0{num}
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
};
