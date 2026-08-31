import React, { useState, useEffect } from 'react';
import TenantNavigation from '../../common/TenantNavigation';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const Community = () => {
  const [activeTab, setActiveTab] = useState('announcements');
  const [communityData, setCommunityData] = useState({ announcements: [], polls: [], lostAndFound: [] });
  const [lostFoundForm, setLostFoundForm] = useState({ title: '', description: '', type: 'LOST', contactInfo: '' });

  const fetchCommunityData = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/community`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setCommunityData(data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCommunityData();
  }, []);

  const handleVote = async (pollId, optionId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/community/poll/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ pollId, optionId })
      });
      const data = await res.json();
      if (data.success) fetchCommunityData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleLostFoundSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/community/lost-found`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(lostFoundForm)
      });
      const data = await res.json();
      if (data.success) {
        setLostFoundForm({ title: '', description: '', type: 'LOST', contactInfo: '' });
        fetchCommunityData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <TenantNavigation />
      <div style={{ padding: '20px', maxWidth: '850px', margin: '0 auto' }}>
      <h2>⭐ Tenant Community Hub</h2>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button onClick={() => setActiveTab('announcements')}>Announcements & Events</button>
        <button onClick={() => setActiveTab('polls')}>Community Polls</button>
        <button onClick={() => setActiveTab('lostfound')}>Lost & Found</button>
      </div>

      {/* 1. Announcements */}
      {activeTab === 'announcements' && (
        <div>
          <h3>📢 Announcements & Events</h3>
          {communityData.announcements.map((a) => (
            <div key={a._id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '6px', marginBottom: '12px' }}>
              <span style={{ fontSize: '12px', background: '#eee', padding: '2px 6px', borderRadius: '4px' }}>{a.type}</span>
              <h4 style={{ margin: '8px 0 4px' }}>{a.title}</h4>
              <p style={{ margin: '0 0 8px' }}>{a.description}</p>
              <small style={{ color: '#666' }}>📍 Location: {a.location} | 📅 Date: {a.date} | By: {a.createdBy}</small>
            </div>
          ))}
        </div>
      )}

      {/* 2. Polls */}
      {activeTab === 'polls' && (
        <div>
          <h3>📊 Resident Polls</h3>
          {communityData.polls.map((p) => {
            const totalVotes = p.options.reduce((acc, curr) => acc + curr.votes.length, 0);
            return (
              <div key={p._id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '6px', marginBottom: '15px' }}>
                <h4>{p.question}</h4>
                {p.options.map((opt) => {
                  const percentage = totalVotes > 0 ? Math.round((opt.votes.length / totalVotes) * 100) : 0;
                  return (
                    <div key={opt._id} style={{ marginBottom: '10px' }}>
                      <button onClick={() => handleVote(p._id, opt._id)} style={{ marginRight: '10px' }}>
                        Vote: {opt.optionText}
                      </button>
                      <span>{percentage}% ({opt.votes.length} votes)</span>
                      <div style={{ height: '8px', width: `${percentage}%`, backgroundColor: '#4caf50', borderRadius: '4px', marginTop: '4px' }}></div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      )}

      {/* 3. Lost & Found */}
      {activeTab === 'lostfound' && (
        <div>
          <h3>🔍 Lost & Found</h3>
          <form onSubmit={handleLostFoundSubmit} style={{ border: '1px solid #ccc', padding: '12px', borderRadius: '6px', marginBottom: '20px' }}>
            <h4>Post Item</h4>
            <input
              type="text"
              placeholder="Title (e.g., Keys found near gym)"
              value={lostFoundForm.title}
              onChange={(e) => setLostFoundForm({ ...lostFoundForm, title: e.target.value })}
              required
              style={{ display: 'block', marginBottom: '8px', width: '95%' }}
            />
            <select
              value={lostFoundForm.type}
              onChange={(e) => setLostFoundForm({ ...lostFoundForm, type: e.target.value })}
              style={{ marginBottom: '8px' }}
            >
              <option value="LOST">Lost</option>
              <option value="FOUND">Found</option>
            </select>
            <textarea
              placeholder="Description..."
              value={lostFoundForm.description}
              onChange={(e) => setLostFoundForm({ ...lostFoundForm, description: e.target.value })}
              required
              style={{ display: 'block', marginBottom: '8px', width: '95%' }}
            />
            <input
              type="text"
              placeholder="Contact Info"
              value={lostFoundForm.contactInfo}
              onChange={(e) => setLostFoundForm({ ...lostFoundForm, contactInfo: e.target.value })}
              required
              style={{ display: 'block', marginBottom: '8px', width: '95%' }}
            />
            <button type="submit">Post Notice</button>
          </form>

          {communityData.lostAndFound.map((item) => (
            <div key={item._id} style={{ border: '1px dashed #666', padding: '12px', marginBottom: '10px', borderRadius: '6px' }}>
              <span style={{ fontWeight: 'bold', color: item.type === 'LOST' ? 'red' : 'green' }}>[{item.type}]</span>
              <h4 style={{ display: 'inline', marginLeft: '8px' }}>{item.title}</h4>
              <p style={{ margin: '5px 0' }}>{item.description}</p>
              <small><strong>Contact:</strong> {item.contactInfo}</small>
            </div>
          ))}
        </div>
      )}
      </div>
      
    </>
  );
};

export default Community;