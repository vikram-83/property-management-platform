import React, { createContext, useContext, useState, useEffect } from 'react';
import propertyService from '../services/propertyService';

const DEFAULT_PROPERTIES = [
  {
    id: 'PROP001',
    name: 'Green Valley Residency',
    type: 'Apartment',
    address: {
      street: '124 Civil Lines, Near Circuit House',
      city: 'Satna',
      state: 'Madhya Pradesh',
      country: 'India',
      pincode: '485001',
    },
    manager: {
      id: 'USR102',
      name: 'Amit Sharma',
      email: 'manager@propertymanagement.com',
      phone: '+91 98765 43210',
    },
    buildings: 4,
    units: 120,
    occupiedUnits: 95,
    vacantUnits: 25,
    monthlyRevenue: 1425000,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=80',
    description: 'Modern luxury residential apartment complex featuring gated security, rooftop pool, and solar-powered common areas.',
  },
  {
    id: 'PROP002',
    name: 'Sunrise Heights',
    type: 'Commercial',
    address: {
      street: '45 Vijay Nagar Square, AB Road',
      city: 'Indore',
      state: 'Madhya Pradesh',
      country: 'India',
      pincode: '452001',
    },
    manager: {
      id: 'USR105',
      name: 'Priya Patel',
      email: 'priya.patel@propertymanagement.com',
      phone: '+91 98234 56789',
    },
    buildings: 2,
    units: 40,
    occupiedUnits: 40,
    vacantUnits: 0,
    monthlyRevenue: 980000,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80',
    description: 'Grade-A commercial corporate hub with high-speed fiber internet, cafeteria, and central HVAC.',
  },
  {
    id: 'PROP003',
    name: 'Royal Palms Estate',
    type: 'Villa Complex',
    address: {
      street: '88 Hoshangabad Road',
      city: 'Bhopal',
      state: 'Madhya Pradesh',
      country: 'India',
      pincode: '462001',
    },
    manager: {
      id: 'USR108',
      name: 'Vikram Singh',
      email: 'vikram.singh@propertymanagement.com',
      phone: '+91 94567 89012',
    },
    buildings: 10,
    units: 20,
    occupiedUnits: 15,
    vacantUnits: 5,
    monthlyRevenue: 750000,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&auto=format&fit=crop&q=80',
    description: 'Exclusive gated community of luxury private villas with private gardens and personal swimming pools.',
  },
  {
    id: 'PROP004',
    name: 'Apex Business Hub',
    type: 'Commercial',
    address: {
      street: '22 Raghuraj Nagar, Commercial Zone',
      city: 'Satna',
      state: 'Madhya Pradesh',
      country: 'India',
      pincode: '485001',
    },
    manager: {
      id: 'USR102',
      name: 'Amit Sharma',
      email: 'manager@propertymanagement.com',
      phone: '+91 98765 43210',
    },
    buildings: 1,
    units: 60,
    occupiedUnits: 45,
    vacantUnits: 15,
    monthlyRevenue: 675000,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop&q=80',
    description: 'Retail and co-working office space with underground visitor parking and backup power generators.',
  },
];

const PropertyContext = createContext(null);

export const PropertyProvider = ({ children }) => {
  const [properties, setProperties] = useState(DEFAULT_PROPERTIES);
  const [selectedProperty, setSelectedProperty] = useState(() => {
    try {
      const stored = localStorage.getItem('pm_selected_property');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Failed to parse stored property:', e);
    }
    return DEFAULT_PROPERTIES[0];
  });
  const [notificationMsg, setNotificationMsg] = useState(null);

  // Attempt to load properties from backend
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const data = await propertyService.getAll();
        if (Array.isArray(data) && data.length > 0) {
          setProperties(data);
          if (!selectedProperty) {
            setSelectedProperty(data[0]);
          }
        } else if (data?.data && Array.isArray(data.data) && data.data.length > 0) {
          setProperties(data.data);
          if (!selectedProperty) {
            setSelectedProperty(data.data[0]);
          }
        }
      } catch (err) {
        // Fallback default properties already initialized
      }
    };
    fetchProperties();
  }, []);

  const selectProperty = (property) => {
    if (!property) return;
    setSelectedProperty(property);
    try {
      localStorage.setItem('pm_selected_property', JSON.stringify(property));
    } catch (e) {
      console.error('Failed to save selected property in localStorage:', e);
    }

    setNotificationMsg(`🏢 Selected "${property.name}" as active property!`);
    setTimeout(() => {
      setNotificationMsg(null);
    }, 4000);
  };

  const clearSelectedProperty = () => {
    setSelectedProperty(null);
    try {
      localStorage.removeItem('pm_selected_property');
    } catch (e) {}
  };

  const getPropertyById = (id) => {
    return properties.find((p) => p.id === id || p._id === id) || null;
  };

  return (
    <PropertyContext.Provider
      value={{
        properties,
        selectedProperty,
        selectProperty,
        clearSelectedProperty,
        getPropertyById,
        setProperties,
        notificationMsg,
      }}
    >
      {notificationMsg && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 9999,
            backgroundColor: '#1e293b',
            color: '#ffffff',
            padding: '12px 20px',
            borderRadius: '12px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '14px',
            fontWeight: '600',
            border: '1px solid #3b82f6',
          }}
        >
          <span style={{ fontSize: '18px', color: '#10b981' }}>✓</span>
          <span>{notificationMsg}</span>
        </div>
      )}
      {children}
    </PropertyContext.Provider>
  );
};

export const useProperty = () => {
  const context = useContext(PropertyContext);
  if (!context) {
    throw new Error('useProperty must be used within a PropertyProvider');
  }
  return context;
};

export default PropertyContext;
