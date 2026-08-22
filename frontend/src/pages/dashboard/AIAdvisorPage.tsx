import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, ArrowRight, Paperclip, ChevronRight, TrendingUp, Target, Wallet } from 'lucide-react';
import '../../styles/ai-advisor.css';

// --- MOCK DATA ---
const SUGGESTIONS = [
  "Where can I save more?",
  "Am I spending too much?",
  "How should I invest ₹10,000?",
  "Can I reach my goal faster?",
  "Review my monthly spending",
  "Build my savings plan"
];

const MOCK_RESPONSES: Record<string, any> = {
  save: {
    text: "Your current spending suggests you could redirect around ₹2,400/month toward savings.",
    insight: { title: "SAVINGS OPPORTUNITY", value: "₹2,400 / month", sub: "Dining is 18% above target" }
  },
  invest: {
    text: "Based on your current surplus, ₹10,000/month could be considered for your investment plan.",
    insight: null
  },
  expense: {
    text: "Dining and subscriptions are currently your largest optimization opportunities.",
    insight: null
  },
  goal: {
    text: "Your current contribution keeps your goal on track.",
    insight: null
  },
  default: {
    text: "I can help you understand spending, savings, investments and financial goals.",
    insight: null
  }
};

type Message = {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  insight?: { title: string; value: string; sub: string } | null;
};

export const AIAdvisorPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-1',
      sender: 'ai',
      text: 'Your finances have a few patterns worth looking at.',
      insight: null
    },
    {
      id: 'init-2',
      sender: 'ai',
      text: 'I can help you understand spending, improve savings, plan investments and work toward your goals.',
      insight: {
        title: 'MONTHLY CASH FLOW',
        value: '₹85,000 income',
        sub: '₹54,200 expenses • ₹30,800 available'
      }
    }
  ]);
  
  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  const handleSend = (text: string) => {
    if (!text.trim() || isThinking) return;

    // Add user message
    const newMsg: Message = { id: Date.now().toString(), sender: 'user', text };
    setMessages(prev => [...prev, newMsg]);
    setInputValue('');
    setIsThinking(true);

    // Mock response logic
    setTimeout(() => {
      setIsThinking(false);
      const lower = text.toLowerCase();
      let response = MOCK_RESPONSES.default;
      
      if (lower.includes('save') || lower.includes('savings')) response = MOCK_RESPONSES.save;
      else if (lower.includes('invest') || lower.includes('investment')) response = MOCK_RESPONSES.invest;
      else if (lower.includes('spend') || lower.includes('expense')) response = MOCK_RESPONSES.expense;
      else if (lower.includes('goal')) response = MOCK_RESPONSES.goal;

      setMessages(prev => [
        ...prev,
        { id: Date.now().toString(), sender: 'ai', text: response.text, insight: response.insight }
      ]);
    }, 1500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Mock file upload handling by sending a message
      const text = `Uploaded file: ${file.name}`;
      handleSend(text);
    }
  };

  return (
    <div className="ai-advisor-page">
      
      {/* 1. Ambient Background Layer */}
      <div className="ai-ambient-layer">
        <div className="ai-ambient-glow" />
        {/* Subtle Financial Background Lines (SVG) */}
        <svg style={{ position: 'absolute', top: '10%', left: 0, width: '150%', height: '400px' }}>
          <path className="financial-graph-line" d="M0,200 Q200,150 400,250 T800,200 T1200,300" style={{ animationDelay: '0s' }} />
          <path className="financial-graph-line" d="M0,250 Q300,350 500,150 T1000,250 T1400,150" style={{ animationDelay: '-5s', opacity: 0.04 }} />
        </svg>
        
        {/* Floating Fragments */}
        <div className="floating-fragment" style={{ top: '25%', left: '15%', animationDelay: '0s' }}>+₹6,000 savings</div>
        <div className="floating-fragment" style={{ top: '45%', right: '20%', animationDelay: '-3s' }}>↑ 12.4% growth</div>
        <div className="floating-fragment" style={{ top: '65%', left: '10%', animationDelay: '-6s' }}>₹54,200 expenses</div>
        <div className="floating-fragment" style={{ top: '35%', right: '35%', animationDelay: '-9s', fontSize: '0.65rem' }}>ON TRACK</div>
      </div>

      {/* 2. Floating AI Core */}
      <div className="ai-core-container">
        <div className="orbit-circle orbit-1" />
        <div className="orbit-circle orbit-2" />
        <div className="orbit-circle orbit-3" />
        <div className="core-pulse" />
        {/* Small floating data points around core */}
        <div style={{ position: 'absolute', top: 0, left: '50%', width: '4px', height: '4px', background: '#fff', borderRadius: '50%', transform: 'translate(-50%, -50%)', opacity: 0.5 }} />
        <div style={{ position: 'absolute', bottom: '15%', right: '5%', width: '3px', height: '3px', background: 'rgba(220,190,140,0.8)', borderRadius: '50%', opacity: 0.8 }} />
      </div>

      {/* 3. Main Content Sections */}
      
      {/* SECTION 1: FULL PAGE CHAT */}
      <section className="ai-section" style={{ maxWidth: '100%', padding: '8px 24px', height: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column' }}>
        
        {/* Full Screen Chat Panel */}
        <div className="ai-chat-panel" style={{ width: '100%', flex: 1, margin: 0, borderRadius: '24px', border: '1px solid rgba(220, 190, 140, 0.15)', position: 'relative' }}>
          
          {/* Chat Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(5, 5, 5, 0.8)', zIndex: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }}>
                <Sparkles size={16} color="rgba(220,190,140,1)" />
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#fff' }}>FINWISE AI</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Financial Intelligence</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#4ade80', boxShadow: '0 0 8px rgba(74, 222, 128, 0.4)' }} />
              ONLINE
            </div>
          </div>

          {/* Chat Messages Area */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '24px', paddingBottom: '120px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {messages.map((msg) => (
              <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start' }} className={msg.sender === 'user' ? 'user-message-container' : 'ai-message-container'}>
                
                {msg.sender === 'ai' ? (
                  <div className="ai-message" style={{ display: 'flex', gap: '16px', maxWidth: '85%' }}>
                    <div style={{ marginTop: '4px' }}>
                      <Sparkles size={16} color="rgba(220, 190, 140, 0.8)" />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.95rem', lineHeight: 1.6, color: 'var(--text-primary)' }}>
                        {msg.text}
                      </div>
                      
                      {/* Financial Insight Card Fragment */}
                      {msg.insight && (
                        <div className="chat-insight-card" style={{ marginTop: '16px', padding: '16px', width: '100%', maxWidth: '320px' }}>
                          <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.05em', color: 'rgba(220, 190, 140, 0.9)', marginBottom: '8px' }}>
                            {msg.insight.title}
                          </div>
                          <div style={{ fontSize: '1.25rem', fontFamily: 'var(--font-primary)', fontWeight: 600, color: '#fff', marginBottom: '4px' }}>
                            {msg.insight.value}
                          </div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                            {msg.insight.sub}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="user-message" style={{ padding: '12px 20px', borderRadius: '100px', fontSize: '0.95rem', color: '#fff', maxWidth: '80%' }}>
                    {msg.text}
                  </div>
                )}
              </div>
            ))}

            {isThinking && (
              <div className="ai-message" style={{ display: 'flex', gap: '16px', maxWidth: '85%' }}>
                <div style={{ marginTop: '4px' }}>
                  <Sparkles size={16} color="rgba(220, 190, 140, 0.8)" />
                </div>
                <div className="thinking-dots" style={{ height: '24px' }}>
                  <div className="thinking-dot" />
                  <div className="thinking-dot" />
                  <div className="thinking-dot" />
                </div>
              </div>
            )}
            
            <div ref={chatEndRef} />
          </div>

          {/* Floating Chat Input Area */}
          <div style={{ 
            position: 'absolute', 
            bottom: '24px', 
            left: '50%', 
            transform: 'translateX(-50%)', 
            width: 'calc(100% - 48px)', 
            maxWidth: '800px',
            zIndex: 20 
          }}>
            <div className="chat-input-wrapper" style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '16px', 
              background: 'rgba(10, 10, 10, 0.65)', 
              backdropFilter: 'blur(30px)',
              WebkitBackdropFilter: 'blur(30px)',
              border: '1px solid rgba(255, 255, 255, 0.15)', 
              boxShadow: '0 10px 40px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
              padding: '8px 8px 8px 16px', 
              borderRadius: '100px' 
            }}>
              <div 
                style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', padding: '8px', borderRadius: '50%', transition: 'background 0.2s' }}
                onClick={() => fileInputRef.current?.click()}
              >
                <Paperclip size={18} color="rgba(255,255,255,0.4)" />
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                style={{ display: 'none' }} 
                onChange={handleFileUpload}
              />
              <input 
                type="text" 
                placeholder="Ask FinWise anything about your money..." 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend(inputValue)}
                style={{ flex: 1 }}
              />
              <button 
                className="chat-send-btn" 
                onClick={() => handleSend(inputValue)}
                disabled={!inputValue.trim() || isThinking}
              >
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
