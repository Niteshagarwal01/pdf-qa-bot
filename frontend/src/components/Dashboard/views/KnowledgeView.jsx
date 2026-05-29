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
        el.classList.add('fade-in-up');
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
      <div className="decor-group">
        <div className="decor-cross c1"></div>
        <div className="decor-cross c2"></div>
        <div className="decor-cross c3"></div>
        <div className="decor-dot d1"></div>
        <div className="decor-dot d2"></div>
        <div className="decor-dot d3"></div>
      </div>

      <div className="knowledge-container">
        
        {/* ─── Hero Section ─── */}
        <div className="knowledge-hero-row">
          {/* Left Column (Text & Search) */}
          <div className="knowledge-hero-content animate-on-load">
            <div className="knowledge-tag">
              <span className="tag-pulse"></span>
              <span className="tag-text">GLOBAL NEURAL NET v2.0</span>
            </div>

            <h1 className="knowledge-hero-title">
              <span className="title-line lime-glow glow-hover">QUERY</span>
              <span className="title-line white-text glow-hover">THE MATRIX</span>
            </h1>
            
            <div className="knowledge-hero-subtitle">
              <p className="subtitle-text text-hover-effect">
                Access all uploaded documents embedded in the FAISS vector database.
              </p>
              <p className="subtitle-text text-hover-effect">
                Use natural language to search across the entire neural network instantly.
              </p>
            </div>

            <div className="knowledge-search-input-wrap">
              <input 
                type="text" 
                className="knowledge-search-input text-hover-effect"
                placeholder="SEARCH SECURED DOCUMENTS..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Right Column (3D Visual) */}
          <div className="knowledge-hero-visual animate-on-load" style={{ animationDelay: '0.2s' }}>
            <div className="scene-3d">
              {/* Box 1: The PDF Document */}
              <div className="panel-glass panel-pdf">
                <div className="panel-header">
                  <div className="mac-dots">
                    <i></i><i></i><i></i>
                  </div>
                  <div className="panel-title">SYSTEM_ARCHITECTURE.pdf</div>
                </div>
                <div className="panel-body">
                  <h3 className="doc-title text-hover-effect">Neural Core</h3>
                  <p className="doc-text">
                    DocuMind uses a distributed <span className="highlight-lime text-hover-effect">FAISS cluster</span> to map unstructured data into high-dimensional space.
                  </p>
                  <div className="doc-skeleton">
                    <div className="skel-line w-100"></div>
                    <div className="skel-line w-80"></div>
                    <div className="skel-line w-90"></div>
                  </div>
                </div>
              </div>

              {/* Box 2: The AI Chat Interface */}
              <div className="panel-glass panel-chat">
                <div className="panel-header">
                  <div className="panel-title" style={{ color: '#c8ff00' }}>DocuMind AI</div>
                  <div className="status-indicator"></div>
                </div>
                <div className="panel-body chat-container">
                  <div className="chat-bubble user-bubble hover-lift">
                    How does the FAISS cluster work?
                  </div>
                  <div className="chat-bubble ai-bubble hover-lift">
                    <span className="ai-icon">✦</span>
                    <p>It performs <strong>similarity search</strong> on dense vectors, allowing you to instantly query millions of documents.</p>
                  </div>
                  <div className="chat-input-mock">
                    <span>Ask a follow up...</span>
                    <div className="send-btn"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Masonry Grid (Document Nodes) ─── */}
        <div className="knowledge-glass-grid animate-on-load" style={{ animationDelay: '0.4s' }}>
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
               <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--accent, #c8ff00)" strokeWidth="1" className="empty-state-icon">
                 <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                 <line x1="9" y1="9" x2="15" y2="15"></line>
                 <line x1="15" y1="9" x2="9" y2="15"></line>
               </svg>
               <h3 className="doc-title" style={{ marginTop: '32px' }}>NO NODES DETECTED</h3>
               <p className="text-hover-effect subtitle-text">
                 INITIALIZE UPLINK SEQUENCE TO START.
               </p>
             </div>
          )}
        </div>
      </div>

      {/* Bottom Data Bar */}
      <div className="knowledge-data-bar animate-on-load" style={{ animationDelay: '0.6s' }}>
        <div className="data-col hover-lift">
          <div className="data-value">{pdfs.length}<span className="lime-glow">+</span></div>
          <div className="data-label">NODES SYNCED</div>
        </div>
        <div className="data-col hover-lift">
          <div className="data-value">{pdfs.reduce((acc, p) => acc + (p.chat?.length || 0), 0)}<span className="lime-glow">K</span></div>
          <div className="data-label">VECTORS STORED</div>
        </div>
        <div className="data-col active-col hover-lift" style={{ transform: 'none' }}>
          <div className="data-value">&lt; 15ms</div>
          <div className="data-label">FAISS LATENCY</div>
          <div className="active-glow"></div>
        </div>
        <div className="data-col hover-lift">
          <div className="data-value">∞</div>
          <div className="data-label">INTELLIGENCE NET</div>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeView;
