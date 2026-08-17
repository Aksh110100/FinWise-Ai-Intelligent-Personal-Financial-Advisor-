import React, { useEffect, useRef, useState } from "react";
import "./HowItWorks.css";

const STAGES = [
    {
        num: "01",
        title: "UNDERSTAND",
        heading: "SEE WHERE\nYOUR MONEY GOES.",
        description: "AI automatically analyzes your income and expenses to reveal patterns you might miss.",
        insightValue: "₹54,200",
        insightLabel: "MONTHLY SPENDING"
    },
    {
        num: "02",
        title: "OPTIMIZE",
        heading: "STOP MONEY\nFROM LEAKING.",
        description: "FinWise identifies unnecessary spending and shows where you can save more.",
        insightValue: "+₹6,000",
        insightLabel: "POTENTIAL MONTHLY SAVINGS",
        positive: true
    },
    {
        num: "03",
        title: "SAVE",
        heading: "BUILD A STRONGER\nFINANCIAL BASE.",
        description: "Emergency savings. Monthly cash flow. Financial buffer. Use subtle visual indicators.",
        insightValue: null,
        insightLabel: null
    },
    {
        num: "04",
        title: "INVEST",
        heading: "TURN SAVINGS\nINTO GROWTH.",
        description: "",
        insightValue: "₹10,000 / MO",
        insightLabel: "RECOMMENDED INVESTMENT"
    },
    {
        num: "05",
        title: "PLAN",
        heading: "SEE WHERE\nYOU'RE GOING.",
        description: "",
        insightValue: "₹12,00,000",
        insightLabel: "5 YEAR TARGET",
        subLabel: "ON TRACK ↑",
        positive: true
    }
];

const StageContent: React.FC<{ stage: any }> = ({ stage }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                } else {
                    setIsVisible(false);
                }
            },
            { threshold: 0.3 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    return (
        <div ref={ref} className={`story-content ${isVisible ? 'visible' : ''}`}>
            <div className="how-stage-eyebrow">{stage.num} / {stage.title}</div>
            <h2 className="how-stage-heading">
                {stage.heading.split('\n').map((line: string, j: number) => (
                    <React.Fragment key={j}>{line}<br/></React.Fragment>
                ))}
            </h2>
            {stage.description && <p className="how-stage-desc">{stage.description}</p>}
            
            {stage.insightValue && (
                <div className="how-insight-box">
                    <div className={`how-insight-value ${stage.positive ? 'positive' : ''}`}>
                        {stage.insightValue}
                    </div>
                    <div className="how-insight-label">{stage.insightLabel}</div>
                    {stage.subLabel && <div className={`how-insight-sub ${stage.positive ? 'positive' : ''}`}>{stage.subLabel}</div>}
                </div>
            )}
        </div>
    );
};

export const HowItWorks: React.FC = () => {
    return (
        <section id="how-it-works" className="how-it-works-section">
            <div className="how-it-works-container">
                {STAGES.map((stage, i) => (
                    <div key={i} className="story-stage">
                        <StageContent stage={stage} />
                    </div>
                ))}
            </div>
        </section>
    );
};
