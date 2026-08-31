import React, { useState, useEffect } from 'react';
import TenantNavigation from '../../common/TenantNavigation';
import { getSupportTickets, createSupportTicket, addTicketMessage } from '../../../services/supportService';

const Support = () => {
  const [activeTab, setActiveTab] = useState('tickets');
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [formData, setFormData] = useState({ subject: '', category: 'Parking', description: '' });
  const [error, setError] = useState(null);

  const faqs = [
    { q: 'How do I pay my rent?', a: 'You can pay online via the Billing section using UPI, Cards, or Net Banking.' },
    { q: 'What is the guest policy?', a: 'Guests are allowed up to 10 PM. Overnight stays require prior approval.' },
    { q: 'How to book amenities?', a: 'Navigate to the Bookings section to reserve slots for pool, gym, or clubhouse.' }
  ];

  const fetchTickets = async () => {
    try {
      const res = await getSupportTickets();
      if (res.success) {
        setTickets(res.data);
      }
    } catch (err) {
      setError('Failed to fetch support tickets');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    try {
      const res = await createSupportTicket(formData);
      if (res.success) {
        setFormData({ subject: '', category: 'Parking', description: '' });
        await fetchTickets();
        setActiveTab('tickets');
      } else {
        setError(res.message || 'Failed to create ticket');
      }
    } catch (err) {
      setError('Error creating ticket');
      console.error(err);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const res = await addTicketMessage(selectedTicket._id, { text: newMessage });
      if (res.success) {
        setSelectedTicket(res.data);
        setNewMessage('');
        await fetchTickets();
      } else {
        setError(res.message || 'Failed to send message');
      }
    } catch (err) {
      setError('Error sending message');
      console.error(err);
    }
  };

  return (
    <>
      <TenantNavigation />
      <div style={{ padding: '20px', maxWidth: '850px', margin: '0 auto' }}>
      {error && <div style={{ color: 'red', marginBottom: '15px' }}>{error}</div>}
      <h2>💬 Support Center</h2>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button onClick={() => { setActiveTab('tickets'); setSelectedTicket(null); }}>View Tickets</button>
        <button onClick={() => setActiveTab('create')}>Create Ticket</button>
        <button onClick={() => setActiveTab('faq')}>FAQ</button>
        <button onClick={() => setActiveTab('contact')}>Contact Office</button>
      </div>

      {/* 1. View Tickets & Chat */}
      {activeTab === 'tickets' && !selectedTicket && (
        <div>
          <h3>Your Support Tickets</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {tickets.map((t) => (
              <li
                key={t._id}
                onClick={() => setSelectedTicket(t)}
                style={{
                  padding: '12px',
                  border: '1px solid #ccc',
                  borderRadius: '6px',
                  marginBottom: '10px',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <strong>[{t.ticketId}] {t.subject}</strong> ({t.category})
                  <p style={{ margin: '5px 0 0', color: '#666' }}>{t.description}</p>
                </div>
                <span style={{ textTransform: 'uppercase', fontWeight: 'bold' }}>{t.status}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Ticket Chat View */}
      {selectedTicket && (
        <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '6px' }}>
          <button onClick={() => setSelectedTicket(null)}>← Back to Tickets</button>
          <h3>[{selectedTicket.ticketId}] {selectedTicket.subject}</h3>
          <p><strong>Status:</strong> {selectedTicket.status}</p>

          <div style={{ height: '250px', overflowY: 'auto', border: '1px solid #eee', padding: '10px', margin: '15px 0' }}>
            {selectedTicket.messages.map((m, idx) => (
              <div key={idx} style={{ textAlign: m.senderRole === 'tenant' ? 'right' : 'left', marginBottom: '10px' }}>
                <div style={{
                  display: 'inline-block',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  backgroundColor: m.senderRole === 'tenant' ? '#dcf8c6' : '#f1f0f0'
                }}>
                  <small style={{ fontWeight: 'bold' }}>{m.senderRole.toUpperCase()}</small>
                  <p style={{ margin: '2px 0 0' }}>{m.text}</p>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              style={{ flex: 1, padding: '8px' }}
              required
            />
            <button type="submit">Send</button>
          </form>
        </div>
      )}

      {/* 2. Create Ticket */}
      {activeTab === 'create' && (
        <form onSubmit={handleCreateTicket} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <h3>Create Support Ticket</h3>
          <input
            type="text"
            placeholder="Subject"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            required
          />
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          >
            <option value="Parking">Parking</option>
            <option value="Billing">Billing</option>
            <option value="Maintenance">Maintenance</option>
            <option value="General">General</option>
            <option value="Security">Security</option>
          </select>
          <textarea
            placeholder="Describe your issue..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows="4"
            required
          />
          <button type="submit">Submit Ticket</button>
        </form>
      )}

      {/* 3. FAQ */}
      {activeTab === 'faq' && (
        <div>
          <h3>Frequently Asked Questions</h3>
          {faqs.map((faq, idx) => (
            <div key={idx} style={{ marginBottom: '15px' }}>
              <h4>Q: {faq.q}</h4>
              <p>A: {faq.a}</p>
            </div>
          ))}
        </div>
      )}

      {/* 4. Contact Office */}
      {activeTab === 'contact' && (
        <div>
          <h3>Contact Property Office</h3>
          <p><strong>Phone:</strong> +91 98765 43210</p>
          <p><strong>Email:</strong> support@propertymanager.com</p>
          <p><strong>Office Hours:</strong> Mon - Sat: 9:00 AM - 6:00 PM</p>
        </div>
      )}
      </div>
      
    </>
  );
};

export default Support;