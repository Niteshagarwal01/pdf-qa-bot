import React, { useState, useEffect } from 'react';
import { getSessionsApi } from '../../../services/api';
// We no longer need custom CSS, we use the global Dashboard.css classes

const KnowledgeView = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [pdfs, setPdfs] = useState([]);

  useEffect(() => {
    // Entrance animation
    const elements = document.querySelectorAll('.dash-body .animate-on-load');
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
              name: doc?.filename || "Unknown Protocol",
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
    <main className="dash-body" style={{ position: 'relative', overflow: 'hidden', minHeight: '100vh' }}>
      
      {/* ── MASSIVE CRAZY BACKGROUND (MATCHING UPLINK) ── */}
      <div className="extreme-bg-text glitch-hover" style={{ fontSize: '18vw', top: '20%', left: '50%', opacity: 0.1, zIndex: 0 }}>KNOWLEDGE</div>
      <div className="abstract-glow-orb" style={{ top: '10%', left: '50%', width: '800px', height: '800px', filter: 'blur(150px)', opacity: 0.1, background: 'var(--accent)', zIndex: 0, transform: 'translateX(-50%)' }}></div>
      <div className="abstract-glow-orb" style={{ bottom: '-10%', left: '-10%', width: '600px', height: '600px', filter: 'blur(200px)', opacity: 0.05, background: '#00ffcc', zIndex: 0 }}></div>

      <div style={{ position: 'relative', zIndex: 10 }}>
        
        {/* ── SEARCH HEADER ── */}
        <section className="doc-scanner-section animate-on-load" style={{ paddingBottom: '0', minHeight: 'auto', marginTop: '60px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                <h2 className="scanner-title glitch-hover" style={{ fontSize: '2rem' }}>NEURAL DATABASES</h2>
                <div style={{ width: '100%', maxWidth: '600px', position: 'relative' }}>
                    <input 
                        type="text" 
                        placeholder="QUERY KNOWLEDGE MATRIX..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            width: '100%',
                            background: 'rgba(0, 0, 0, 0.5)',
                            border: '1px solid var(--accent)',
                            color: 'var(--accent)',
                            padding: '15px 20px',
                            fontFamily: 'var(--font-mono)',
                            letterSpacing: '2px',
                            outline: 'none',
                            textTransform: 'uppercase'
                        }}
                    />
                </div>
            </div>
        </section>

        {/* ── MASONRY DECK (MATCHING SECURED DATA DECK) ── */}
        <section className="doc-masonry-section animate-on-load" style={{ animationDelay: '0.2s' }}>
          <div className="masonry-header">
            <div className="hud-barcode"></div>
            <span className="masonry-title">SYNCHRONIZED INDICES</span>
            <span className="hud-divider">|</span>
            <span className="neon-text">{filteredPdfs.length} NODES</span>
          </div>

          <div className="doc-masonry-deck">
            {filteredPdfs.map(pdf => (
                <div key={pdf.id} className="masonry-slate">
                  <div className="slate-top">
                    <span className="slate-id">IDX-{pdf.session_id.substring(0, 8).toUpperCase()}</span>
                    <span className="slate-status ready">ONLINE</span>
                  </div>
                  
                  <div className="slate-body">
                    <h3 className="slate-name" title={pdf.name}>{pdf.name}</h3>
                    <p className="slate-meta">FAISS CLUSTER {'//'} {pdf.created_at.split('T')[0]}</p>
                    <p className="slate-stage" style={{ color: 'var(--accent)' }}>{pdf.chat.length} SYNAPSES FIRED</p>
                  </div>

                  <div className="slate-actions">
                    <button className="action-btn view">ANALYZE</button>
                    <button 
                      className="action-btn process"
                      style={{ color: '#ff5f56', borderColor: '#ff5f56' }}
                    >
                      PURGE
                    </button>
                  </div>
                </div>
            ))}
            
            {filteredPdfs.length === 0 && (
                <div style={{ padding: '40px', textAlign: 'center', color: '#ff5f56', fontFamily: 'var(--font-mono)', letterSpacing: '2px' }}>
                    [ NO DATA NODES DETECTED IN MATRIX ]
                </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
};

export default KnowledgeView;
