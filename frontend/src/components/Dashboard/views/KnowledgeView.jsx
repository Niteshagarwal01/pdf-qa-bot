import React, { useState, useEffect } from 'react';
import './KnowledgeView.css';
import { getSessionsApi } from '../../../services/api';

const KnowledgeView = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [pdfs, setPdfs] = useState([]);

  useEffect(() => {
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
              name: doc?.filename || "Unknown PDF",
              chat: s.chat || [],
              session_id: s.session_id,
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
    pdf.id?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="knowledge-view">
      <div className="knowledge-header">
        <h1 className="knowledge-title">Knowledge Base</h1>
        <p className="knowledge-subtitle">Manage your synchronized neural documents and FAISS indices.</p>
      </div>

      <div className="knowledge-toolbar">
        <div className="knowledge-search">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input 
            type="text" 
            placeholder="Search knowledge bases..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="knowledge-stats">
          <div className="stat">
            <span className="stat-num">{pdfs.length}</span>
            <span className="stat-label">Documents</span>
          </div>
        </div>
      </div>

      <div className="knowledge-grid">
        {filteredPdfs.length > 0 ? (
          filteredPdfs.map((pdf, idx) => (
            <div key={pdf.id || idx} className="knowledge-card">
              <div className="card-top">
                <div className="card-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                  </svg>
                </div>
                <div className="card-status active">Indexed</div>
              </div>
              <h3 className="card-title" title={pdf.name}>{pdf.name}</h3>
              <div className="card-meta">
                <div className="meta-item">
                  <span className="meta-lbl">Session:</span>
                  <span className="meta-val">{pdf.session_id.substring(0, 8)}...</span>
                </div>
                <div className="meta-item">
                  <span className="meta-lbl">Chats:</span>
                  <span className="meta-val">{pdf.chat.length} interactions</span>
                </div>
              </div>
              <div className="card-actions">
                <button className="brutal-btn primary">Analyze</button>
                <button className="brutal-btn secondary">Delete</button>
              </div>
            </div>
          ))
        ) : (
          <div className="knowledge-empty">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <circle cx="8.5" cy="8.5" r="1.5"></circle>
              <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
            <h3>No Knowledge Bases Found</h3>
            <p>Upload a document from the Documents view to populate your knowledge base.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default KnowledgeView;
