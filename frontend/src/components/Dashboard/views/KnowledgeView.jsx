import React, { useState, useEffect } from 'react';
import { getSessionsApi } from '../../../services/api';
import './KnowledgeView.css';

const KnowledgeView = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [pdfs, setPdfs] = useState([]);

  useEffect(() => {
    // Entrance animation
    const elements = document.querySelectorAll('.animate-on-load');
    elements.forEach((el, index) => {
      setTimeout(() => {
        el.style.opacity = 1;
        el.style.transform = 'translateY(0)';
      }, index * 100);
    });

    const fetchHistory = async () => {
      try {
        const raw = localStorage.getItem('pdf_qa_sessions_v1'); 
        if (!raw) return;
        let parsed = null;
        try { parsed = JSON.parse(atob(raw)); } catch (_) { return; }
        if (!Array.isArray(parsed)) return;
        
        const knownSessions = parsed.filter(s => s && s.session_id && s.session_secret);
        const sessions = await getSessionsApi(knownSessions);
        if (sessions && sessions.length > 0) {
          const formattedPdfs = sessions.map(s => {
            const doc = s.documents?.[0];
            return {
              id: doc?.document_id || s.session_id,
              name: doc?.filename || "Unknown Document",
              chat: s.chat || [],
              session_id: s.session_id,
              created_at: s.created_at || new Date().toISOString()
            };
          });
          setPdfs(formattedPdfs);
        }
      } catch (e) {
        console.error("Failed to load knowledge history:", e);
      }
    };
    fetchHistory();
  }, []);

  const filteredPdfs = pdfs.filter(pdf => 
    pdf.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pdf.session_id?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="knowledge-landing-wrap">
      {/* Huge Background Typography to fill empty space */}
      <div className="bg-typography">RAG ENGINE</div>
      
      {/* Background & Ambiance */}
      <div className="knowledge-grid-bg"></div>
      <div className="knowledge-glow-core"></div>
      <div className="knowledge-glow-accent"></div>
      
      {/* Floating Decor */}
      <div className="decor-group" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1 }}>
        <div className="decor-cross c1" style={{ top: '15%', left: '8%', animation: 'float 8s infinite alternate' }}></div>
        <div className="decor-cross c2" style={{ top: '60%', left: '48%', animation: 'float 12s infinite alternate-reverse' }}></div>
        <div className="decor-cross c3" style={{ top: '25%', right: '40%', animation: 'float 10s infinite alternate' }}></div>
        <div className="decor-dot d1" style={{ bottom: '25%', left: '12%', animation: 'pulse 4s infinite' }}></div>
        <div className="decor-dot d2" style={{ top: '45%', right: '42%', animation: 'pulse 5s infinite 1s' }}></div>
        <div className="decor-dot d3" style={{ bottom: '40%', right: '8%', animation: 'pulse 6s infinite 2s' }}></div>
      </div>

      <div className="knowledge-container">
        
        {/* Search Header */}
        <div className="knowledge-search-section animate-on-load" style={{ opacity: 0, transform: 'translateY(20px)', transition: 'all 0.8s ease' }}>
          <div className="knowledge-tag">
            <span className="tag-pulse" style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#c8ff00', boxShadow: '0 0 10px #c8ff00', animation: 'rapidPulse 1.5s infinite' }}></span>
            <span className="tag-text" style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '10px', letterSpacing: '0.2em', color: '#555' }}>
              GLOBAL NEURAL NET v2.0
            </span>
          </div>

          <h1 style={{ fontFamily: '"Syne", sans-serif', fontSize: 'clamp(3.5rem, 6vw, 6rem)', fontWeight: 800, margin: '0 0 16px 0', letterSpacing: '-0.02em' }}>
            <span className="lime-glow glow-hover" style={{ display: 'inline-block' }}>QUERY</span>
            <span className="white-text glow-hover" style={{ display: 'inline-block', marginLeft: '16px' }}>THE MATRIX</span>
          </h1>
          <p className="text-hover-effect" style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: '18px', color: '#999', margin: '0 0 32px 0', maxWidth: '650px', lineHeight: '1.6' }}>
            Access all uploaded documents embedded in the FAISS vector database. Use natural language to search across the entire neural network instantly.
          </p>

          <div className="knowledge-search-input-wrap">
            <input 
              type="text" 
              className="knowledge-search-input"
              placeholder="SEARCH SECURED DOCUMENTS..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* 3D Glass Panels Grid */}
        <div className="knowledge-glass-grid animate-on-load" style={{ opacity: 0, transform: 'translateY(20px)', transition: 'all 0.8s ease 0.2s' }}>
          {filteredPdfs.map(pdf => (
            <div key={pdf.id} className="panel-glass hover-lift">
              
              <div className="panel-header">
                <div className="mac-dots">
                  <i></i><i></i><i></i>
                </div>
                <div className="panel-title">IDX-{pdf.session_id.substring(0, 8)}</div>
              </div>

              <div className="panel-body">
                <h3 className="doc-title text-hover-effect">{pdf.name}</h3>
                <p className="doc-text">
                  Data payload synchronized on <span className="highlight-lime text-hover-effect">{pdf.created_at.split('T')[0]}</span>. 
                  This intelligence node has processed exactly <span className="highlight-lime text-hover-effect">{pdf.chat.length} vector embeddings</span> in the current active subspace.
                </p>
                
                <div className="doc-skeleton">
                  <div className="skel-line w-100"></div>
                  <div className="skel-line w-80"></div>
                  <div className="skel-line w-90"></div>
                </div>
              </div>

              <div className="panel-actions">
                <button className="btn-primary-small">
                  <span className="btn-text">ANALYZE</span>
                  <span className="btn-glare"></span>
                </button>
                <button className="btn-secondary-small">
                  PURGE NODE
                </button>
              </div>
              
            </div>
          ))}

          {filteredPdfs.length === 0 && (
             <div className="knowledge-empty-state hover-lift">
               <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--accent, #c8ff00)" strokeWidth="1" style={{ opacity: 0.8, filter: 'drop-shadow(0 0 10px rgba(200, 255, 0, 0.4))' }}>
                 <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                 <line x1="9" y1="9" x2="15" y2="15"></line>
                 <line x1="15" y1="9" x2="9" y2="15"></line>
               </svg>
               <h3 className="doc-title" style={{ marginTop: '32px' }}>NO NODES DETECTED</h3>
               <p className="text-hover-effect" style={{ color: '#888', marginTop: '10px', fontFamily: '"Space Grotesk", sans-serif', letterSpacing: '0.05em' }}>
                 INITIALIZE UPLINK SEQUENCE TO START.
               </p>
             </div>
          )}
        </div>
      </div>

      {/* Bottom Data Bar */}
      <div className="knowledge-data-bar animate-on-load" style={{ animationDelay: '0.6s', opacity: 0, transform: 'translateY(20px)', transition: 'all 0.8s ease' }}>
        <div className="data-col">
          <div className="data-value">{pdfs.length}<span style={{ color: '#c8ff00', textShadow: '0 0 20px rgba(200, 255, 0, 0.5)' }}>+</span></div>
          <div className="data-label">NODES SYNCED</div>
        </div>
        <div className="data-col">
          <div className="data-value">{pdfs.reduce((acc, p) => acc + (p.chat?.length || 0), 0)}<span style={{ color: '#c8ff00', textShadow: '0 0 20px rgba(200, 255, 0, 0.5)' }}>K</span></div>
          <div className="data-label">VECTORS STORED</div>
        </div>
        <div className="data-col active-col hover-lift" style={{ transform: 'none' }}>
          <div className="data-value">&lt; 15ms</div>
          <div className="data-label">FAISS LATENCY</div>
          <div className="active-glow"></div>
        </div>
        <div className="data-col">
          <div className="data-value">∞</div>
          <div className="data-label">INTELLIGENCE NET</div>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeView;
