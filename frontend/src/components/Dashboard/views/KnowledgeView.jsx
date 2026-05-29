import React, { useState } from 'react';
import './KnowledgeView.css';

const KnowledgeView = ({ pdfs = [] }) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter pdfs based on the search query
  const filteredPdfs = pdfs.filter(pdf => 
    pdf.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pdf.id?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="knowledge-container-crazy">
      <div className="knowledge-grid-bg"></div>
      
      {/* Header & Stats section */}
      <div className="knowledge-header-panel">
        <div className="knowledge-title-wrapper">
          <h1 className="knowledge-title glitch" data-text="GLOBAL KNOWLEDGE NET">
            GLOBAL KNOWLEDGE NET
          </h1>
          <div className="knowledge-subtitle">
            <span className="blink-dot"></span> SYNCHRONIZED NEURAL DATABASES
          </div>
        </div>

        <div className="knowledge-stats-panel">
          <div className="stat-box">
            <div className="stat-value">{pdfs.length}</div>
            <div className="stat-label">ACTIVE NODES</div>
          </div>
          <div className="stat-box">
            <div className="stat-value">{pdfs.reduce((acc, pdf) => acc + (pdf.chat?.length || 0), 0)}</div>
            <div className="stat-label">SYNAPSES FIRED</div>
          </div>
          <div className="stat-box">
            <div className="stat-value text-glow-green">ONLINE</div>
            <div className="stat-label">FAISS CLUSTER</div>
          </div>
        </div>
      </div>

      {/* Global Search */}
      <div className="knowledge-search-container">
        <div className="search-input-wrapper">
          <span className="search-icon">⌕</span>
          <input 
            type="text" 
            className="knowledge-search-input" 
            placeholder="QUERY KNOWLEDGE MATRIX..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <span className="search-cursor">_</span>
        </div>
      </div>

      {/* Data Nodes Grid */}
      <div className="knowledge-nodes-grid">
        {filteredPdfs.length > 0 ? (
          filteredPdfs.map((pdf, idx) => (
            <div key={pdf.id || idx} className="data-node-card">
              <div className="node-card-glitch-layer"></div>
              <div className="node-card-content">
                <div className="node-header">
                  <div className="node-id">NODE_{pdf.id?.substring(0, 8) || 'UNKNOWN'}</div>
                  <div className="node-status">SECURE</div>
                </div>
                <h3 className="node-title">{pdf.name || 'Unnamed Protocol'}</h3>
                
                <div className="node-metadata">
                  <div className="meta-row">
                    <span className="meta-key">CHATS:</span>
                    <span className="meta-val">{pdf.chat?.length || 0}</span>
                  </div>
                  <div className="meta-row">
                    <span className="meta-key">S-ID:</span>
                    <span className="meta-val">{pdf.session_id?.substring(0, 12)}...</span>
                  </div>
                </div>
                
                <div className="node-actions">
                  <button className="node-btn view-btn">ACCESS DB</button>
                  <button className="node-btn purge-btn">PURGE</button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state-container">
            <div className="empty-state-icon">!</div>
            <div className="empty-state-text">NO DATA NODES DETECTED</div>
            <div className="empty-state-subtext">INITIATE UPLOAD SEQUENCE TO POPULATE THE MATRIX</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default KnowledgeView;
