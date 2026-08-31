import React, { useState, useMemo } from 'react';
import TenantNavigation from '../../common/TenantNavigation';

// --- DATA SOURCE ---
const AMENITY_PORTAL_DATA = {
  amenityPortal: {
    categories: [
      "All",
      "Fitness",
      "Sports",
      "Entertainment",
      "Community",
      "Parking"
    ],
    amenities: [
      {
        id: "AM001",
        name: "Swimming Pool",
        category: "Sports",
        capacity: 20,
        currentOccupancy: 8,
        timing: "06:00 AM - 09:00 PM",
        bookingRequired: true,
        rating: 4.5,
        photo: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=600&q=80",
        rules: [
          "Proper swimwear mandatory",
          "Shower before entering the pool",
          "Children under 12 must be supervised"
        ]
      },
      {
        id: "AM002",
        name: "Gym",
        category: "Fitness",
        capacity: 15,
        currentOccupancy: 12,
        timing: "05:00 AM - 10:00 PM",
        bookingRequired: false,
        rating: 4.7,
        photo: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80",
        rules: [
          "Wipe down equipment after use",
          "Re-rack weights after workout",
          "Sports shoes compulsory"
        ]
      },
      {
        id: "AM003",
        name: "Clubhouse Theater",
        category: "Entertainment",
        capacity: 30,
        currentOccupancy: 0,
        timing: "10:00 AM - 11:00 PM",
        bookingRequired: true,
        rating: 4.8,
        photo: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80",
        rules: [
          "No outside heavy food inside",
          "Clean up after session finishes"
        ]
      },
      {
        id: "AM004",
        name: "Community Hall",
        category: "Community",
        capacity: 100,
        currentOccupancy: 45,
        timing: "08:00 AM - 10:00 PM",
        bookingRequired: true,
        rating: 4.3,
        photo: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=600&q=80",
        rules: [
          "Prior booking confirmation required",
          "Loud music allowed until 10:00 PM only"
        ]
      },
      {
        id: "AM005",
        name: "Visitor Parking B2",
        category: "Parking",
        capacity: 40,
        currentOccupancy: 38,
        timing: "24 Hours",
        bookingRequired: false,
        rating: 4.1,
        photo: "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=600&q=80",
        rules: [
          "Park strictly inside marked bays",
          "Maximum 48-hour continuous stay allowed"
        ]
      }
    ],
    features: [
      "Amenity Search",
      "Amenity Filters",
      "Availability",
      "Rules",
      "Photos",
      "Ratings"
    ]
  }
};

export default function Amenities() {
  const { categories, amenities, features } = AMENITY_PORTAL_DATA.amenityPortal;

  // State Management
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedAmenity, setSelectedAmenity] = useState(null);
  const [bookingSuccessMsg, setBookingSuccessMsg] = useState('');

  // Filtering Logic (Amenity Search & Filters feature implementation)
  const filteredAmenities = useMemo(() => {
    return amenities.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory, amenities]);

  // Handle Slot Booking
  const handleBooking = (amenity) => {
    setBookingSuccessMsg(`Slot successfully booked for ${amenity.name}!`);
    setTimeout(() => setBookingSuccessMsg(''), 4000);
    setSelectedAmenity(null);
  };

  return (
    <>
      <TenantNavigation />
      <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <h1 style={styles.title}>🏊 Amenities Portal</h1>
        <div style={styles.featureBadgeContainer}>
          {features.map((feat, idx) => (
            <span key={idx} style={styles.featureBadge}>✓ {feat}</span>
          ))}
        </div>
      </header>

      {/* Control Bar: Search & Category Filters */}
      <div style={styles.controls}>
        <input
          type="text"
          placeholder="🔍 Search amenity by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={styles.searchInput}
        />

        <div style={styles.categoryContainer}>
          {categories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedCategory(cat)}
              style={{
                ...styles.categoryBtn,
                ...(selectedCategory === cat ? styles.activeCategoryBtn : {})
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Booking Feedback Alert */}
      {bookingSuccessMsg && (
        <div style={styles.alertSuccess}>
          {bookingSuccessMsg}
        </div>
      )}

      {/* Amenities Grid */}
      <div style={styles.grid}>
        {filteredAmenities.length > 0 ? (
          filteredAmenities.map((item) => {
            const availableSlots = item.capacity - item.currentOccupancy;
            const isFull = availableSlots <= 0;

            return (
              <div key={item.id} style={styles.card}>
                {/* Photo Feature */}
                <div style={styles.imageWrapper}>
                  <img src={item.photo} alt={item.name} style={styles.image} />
                  <span style={styles.categoryTag}>{item.category}</span>
                </div>

                <div style={styles.cardBody}>
                  <div style={styles.cardHeader}>
                    <h3 style={styles.cardTitle}>{item.name}</h3>
                    {/* Ratings Feature */}
                    <span style={styles.ratingTag}>⭐ {item.rating}</span>
                  </div>

                  <p style={styles.infoText}>⏰ <strong>Timing:</strong> {item.timing}</p>
                  
                  {/* Availability Feature */}
                  <div style={styles.availabilityBox}>
                    <span>Available Slots: <strong>{availableSlots} / {item.capacity}</strong></span>
                    <span style={{
                      ...styles.statusDot,
                      backgroundColor: isFull ? '#ef4444' : '#22c55e'
                    }}></span>
                  </div>

                  {/* Rules Feature Preview */}
                  <div style={styles.rulesSection}>
                    <strong style={{ fontSize: '13px', color: '#4b5563' }}>📋 Key Rules:</strong>
                    <ul style={styles.rulesList}>
                      {item.rules.slice(0, 2).map((rule, index) => (
                        <li key={index} style={styles.ruleItem}>{rule}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Actions */}
                  <button
                    disabled={isFull}
                    onClick={() => setSelectedAmenity(item)}
                    style={{
                      ...styles.bookBtn,
                      backgroundColor: isFull ? '#9ca3af' : '#2563eb',
                      cursor: isFull ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {isFull ? 'Fully Occupied' : item.bookingRequired ? 'Book Slot' : 'Walk-In Only'}
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <p style={styles.noResults}>No amenities match your filter parameters.</p>
        )}
      </div>

      {/* Amenity Detail & Booking Modal */}
      {selectedAmenity && (
        <div style={styles.modalBackdrop} onClick={() => setSelectedAmenity(null)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ marginTop: 0 }}>{selectedAmenity.name}</h2>
            <p><strong>Timing:</strong> {selectedAmenity.timing}</p>
            <p><strong>Category:</strong> {selectedAmenity.category}</p>
            <p><strong>Rating:</strong> ⭐ {selectedAmenity.rating}</p>
            
            <h4 style={{ marginBottom: '8px' }}>Rules & Regulations:</h4>
            <ul>
              {selectedAmenity.rules.map((rule, idx) => (
                <li key={idx} style={{ marginBottom: '4px' }}>{rule}</li>
              ))}
            </ul>

            <div style={styles.modalActions}>
              <button onClick={() => setSelectedAmenity(null)} style={styles.cancelBtn}>
                Cancel
              </button>
              <button onClick={() => handleBooking(selectedAmenity)} style={styles.confirmBtn}>
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    
    </>
  );
}

// Inline Styles Component
const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '24px',
    fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
    color: '#1f2937'
  },
  header: {
    marginBottom: '24px'
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: '8px'
  },
  featureBadgeContainer: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap'
  },
  featureBadge: {
    fontSize: '12px',
    backgroundColor: '#e0e7ff',
    color: '#3730a3',
    padding: '4px 8px',
    borderRadius: '12px',
    fontWeight: '600'
  },
  controls: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    marginBottom: '32px'
  },
  searchInput: {
    padding: '12px 16px',
    fontSize: '16px',
    borderRadius: '8px',
    border: '1px solid #d1d5db',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box'
  },
  categoryContainer: {
    display: 'flex',
    gap: '8px',
    overflowX: 'auto',
    paddingBottom: '4px'
  },
  categoryBtn: {
    padding: '8px 16px',
    borderRadius: '20px',
    border: '1px solid #d1d5db',
    backgroundColor: '#ffffff',
    color: '#374151',
    cursor: 'pointer',
    fontSize: '14px',
    whiteSpace: 'nowrap',
    transition: 'all 0.2s'
  },
  activeCategoryBtn: {
    backgroundColor: '#2563eb',
    color: '#ffffff',
    borderColor: '#2563eb'
  },
  alertSuccess: {
    padding: '12px 16px',
    backgroundColor: '#dcfce7',
    color: '#15803d',
    borderRadius: '8px',
    marginBottom: '24px',
    border: '1px solid #86efac'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '24px'
  },
  card: {
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    overflow: 'hidden',
    backgroundColor: '#ffffff',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
    display: 'flex',
    flexDirection: 'column'
  },
  imageWrapper: {
    position: 'relative',
    height: '180px',
    width: '100%'
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  categoryTag: {
    position: 'absolute',
    top: '12px',
    left: '12px',
    backgroundColor: 'rgba(0,0,0,0.6)',
    color: '#ffffff',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px'
  },
  cardBody: {
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px'
  },
  cardTitle: {
    margin: 0,
    fontSize: '18px',
    color: '#111827'
  },
  ratingTag: {
    backgroundColor: '#fef3c7',
    color: '#92400e',
    padding: '2px 6px',
    borderRadius: '4px',
    fontSize: '13px',
    fontWeight: 'bold'
  },
  infoText: {
    margin: '4px 0 12px 0',
    fontSize: '14px',
    color: '#4b5563'
  },
  availabilityBox: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 12px',
    backgroundColor: '#f9fafb',
    borderRadius: '6px',
    fontSize: '13px',
    marginBottom: '12px'
  },
  statusDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    display: 'inline-block'
  },
  rulesSection: {
    marginBottom: '16px',
    flexGrow: 1
  },
  rulesList: {
    margin: '4px 0 0 0',
    paddingLeft: '18px'
  },
  ruleItem: {
    fontSize: '12px',
    color: '#6b7280',
    marginBottom: '2px'
  },
  bookBtn: {
    width: '100%',
    padding: '10px',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    fontWeight: '600',
    fontSize: '14px'
  },
  noResults: {
    gridColumn: '1 / -1',
    textAlign: 'center',
    color: '#6b7280',
    padding: '40px'
  },
  modalBackdrop: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  },
  modalContent: {
    backgroundColor: '#ffffff',
    padding: '24px',
    borderRadius: '12px',
    maxWidth: '450px',
    width: '90%'
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '20px'
  },
  cancelBtn: {
    padding: '8px 16px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    backgroundColor: '#fff',
    cursor: 'pointer'
  },
  confirmBtn: {
    padding: '8px 16px',
    border: 'none',
    borderRadius: '6px',
    backgroundColor: '#16a34a',
    color: '#fff',
    cursor: 'pointer',
    fontWeight: '600'
  }
};