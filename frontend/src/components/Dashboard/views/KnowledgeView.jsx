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
      {/* Background & Ambiance (from Hero.jsx) */}
      <div className="knowledge-grid-bg"></div>
      <div className="knowledge-glow-core"></div>
      
      {/* Floating Decor (from Hero.jsx) */}
      <div className="decor-group" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1 }}>
        <div className="decor-dot" style={{ top: '15%', left: '8%', width: '4px', height: '4px', background: '#555', borderRadius: '50%', position: 'absolute', animation: 'pulse 4s infinite' }}></div>
        <div className="decor-dot" style={{ bottom: '25%', right: '12%', width: '4px', height: '4px', background: '#555', borderRadius: '50%', position: 'absolute', animation: 'pulse 5s infinite 1s' }}></div>
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

          <h1 style={{ fontFamily: '"Syne", sans-serif', fontSize: 'clamp(3rem, 5vw, 5rem)', fontWeight: 800, margin: '0 0 10px 0', letterSpacing: '-0.02em', color: '#fff' }}>
            <span style={{ color: '#c8ff00', textShadow: '0 0 40px rgba(200, 255, 0, 0.3)' }}>QUERY</span> YOUR DATA
          </h1>

          <div className="knowledge-search-input-wrap">
            <input 
              type="text" 
              className="knowledge-search-input"
              placeholder="SEARCH KNOWLEDGE BASE..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* 3D Glass Panels Grid */}
        <div className="knowledge-glass-grid animate-on-load" style={{ opacity: 0, transform: 'translateY(20px)', transition: 'all 0.8s ease 0.2s' }}>
          {filteredPdfs.map(pdf => (
            <div key={pdf.id} className="panel-glass">
              
              <div className="panel-header">
                <div className="mac-dots">
                  <i></i><i></i><i></i>
                </div>
                <div className="panel-title">IDX-{pdf.session_id.substring(0, 8)}</div>
              </div>

              <div className="panel-body">
                <h3 className="doc-title">{pdf.name}</h3>
                <p className="doc-text">
                  Synchronized on <span className="highlight-lime">{pdf.created_at.split('T')[0]}</span>. 
                  This node has processed <span className="highlight-lime">{pdf.chat.length}</span> interactions and is currently active in the RAG vector space.
                </p>
                
                <div className="doc-skeleton">
                  <div className="skel-line w-100"></div>
                  <div className="skel-line w-80"></div>
                  <div className="skel-line w-90"></div>
                </div>
              </div>

              <div className="panel-actions">
                <button className="btn-primary-small">ANALYZE</button>
                <button className="btn-secondary-small" style={{ borderColor: 'rgba(255, 95, 86, 0.4)', color: '#ff5f56' }}>PURGE</button>
              </div>
              
            </div>
          ))}

          {filteredPdfs.length === 0 && (
             <div className="knowledge-empty-state">
               <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1">
                 <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                 <line x1="9" y1="9" x2="15" y2="15"></line>
                 <line x1="15" y1="9" x2="9" y2="15"></line>
               </svg>
               <h3 className="doc-title">NO NODES DETECTED</h3>
             </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default KnowledgeView;
