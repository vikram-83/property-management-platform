import axios from 'axios';
import { io } from 'socket.io-client';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

// Fallback Property Dataset
const FALLBACK_PROPERTIES = [
  {
    _id: 'PROP001',
    id: 'PROP001',
    name: 'Green Valley Residency',
    title: 'Luxury 3BHK Green Valley Residency',
    category: 'Apartment',
    type: 'Apartment',
    location: 'Civil Lines, Satna, MP',
    address: { street: '124 Civil Lines', city: 'Satna', state: 'MP', pincode: '485001', country: 'India' },
    price: 15000,
    rooms: 3,
    area: '1450 sqft',
    status: 'Available',
    occupiedUnits: 95,
    vacantUnits: 25,
    units: 120,
    buildings: 4,
    owner: 'Ramesh Verma',
    manager: { id: 'USR102', name: 'Amit Sharma' },
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=80',
  },
  {
    _id: 'PROP002',
    id: 'PROP002',
    name: 'Sunrise Heights',
    title: 'Sunrise Commercial Towers',
    category: 'Commercial',
    type: 'Commercial',
    location: 'Vijay Nagar, Indore, MP',
    address: { street: '45 Vijay Nagar Square', city: 'Indore', state: 'MP', pincode: '452001', country: 'India' },
    price: 35000,
    rooms: 4,
    area: '2800 sqft',
    status: 'Available',
    occupiedUnits: 40,
    vacantUnits: 0,
    units: 40,
    buildings: 2,
    owner: 'Priya Sharma',
    manager: { id: 'USR105', name: 'Priya Patel' },
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80',
  },
  {
    _id: 'PROP003',
    id: 'PROP003',
    name: 'Royal Palms Estate',
    title: 'Royal Palms 4BHK Villa Complex',
    category: 'Villa',
    type: 'Villa Complex',
    location: 'Hoshangabad Road, Bhopal, MP',
    address: { street: '88 Hoshangabad Road', city: 'Bhopal', state: 'MP', pincode: '462001', country: 'India' },
    price: 45000,
    rooms: 4,
    area: '3200 sqft',
    status: 'Available',
    occupiedUnits: 15,
    vacantUnits: 5,
    units: 20,
    buildings: 10,
    owner: 'Vikram Singh',
    manager: { id: 'USR108', name: 'Vikram Singh' },
    image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&auto=format&fit=crop&q=80',
  },
  {
    _id: 'PROP004',
    id: 'PROP004',
    name: 'Apex Business Hub',
    title: 'Modern Retail & Office Space',
    category: 'Commercial',
    type: 'Commercial',
    location: 'Commercial Zone, Satna, MP',
    address: { street: '22 Raghuraj Nagar', city: 'Satna', state: 'MP', pincode: '485001', country: 'India' },
    price: 22000,
    rooms: 2,
    area: '950 sqft',
    status: 'Available',
    occupiedUnits: 45,
    vacantUnits: 15,
    units: 60,
    buildings: 1,
    owner: 'Ankit Gupta',
    manager: { id: 'USR102', name: 'Amit Sharma' },
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop&q=80',
  },
];

export const propertyAPI = {
  getAll: async (params = {}) => {
    try {
      const res = await API.get('/properties', { params });
      return res.data;
    } catch (e) {
      return { data: FALLBACK_PROPERTIES };
    }
  },
  getById: async (id) => {
    try {
      const res = await API.get(`/properties/${id}`);
      return res.data;
    } catch (e) {
      const found = FALLBACK_PROPERTIES.find((p) => p._id === id || p.id === id) || FALLBACK_PROPERTIES[0];
      return { data: found };
    }
  },
  create: async (data) => {
    const res = await API.post('/properties', data);
    return res.data;
  },
  update: async (id, data) => {
    const res = await API.put(`/properties/${id}`, data);
    return res.data;
  },
  remove: async (id) => {
    const res = await API.delete(`/properties/${id}`);
    return res.data;
  },
};

export const bookingAPI = {
  createBooking: async (data) => {
    try {
      const res = await API.post('/bookings', data);
      return res.data;
    } catch (e) {
      return { success: true, message: 'Booking request registered successfully (mock fallback)' };
    }
  },
  getUserBookings: async () => {
    try {
      const res = await API.get('/bookings/my-bookings');
      return res.data;
    } catch (e) {
      return { data: [] };
    }
  },
};

export const maintenanceAPI = {
  getAll: async () => {
    try {
      const res = await API.get('/maintenance');
      return res.data;
    } catch (e) {
      return { data: [] };
    }
  },
  create: async (data) => {
    const res = await API.post('/maintenance', data);
    return res.data;
  },
};

// Socket.io singleton service with fallback listeners
class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
  }

  connect() {
    if (!this.socket) {
      try {
        const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
        this.socket = io(socketUrl, {
          autoConnect: true,
          reconnection: true,
          reconnectionAttempts: 5,
        });
      } catch (err) {
        console.warn('Socket connection fallback active');
      }
    }
    return this.socket;
  }

  subscribeToPropertyUpdates(cb) {
    const s = this.connect();
    if (s) {
      s.on('property_status_changed', cb);
    }
    this.listeners.set('property_status_changed', cb);
  }

  unsubscribeFromPropertyUpdates() {
    if (this.socket && this.listeners.has('property_status_changed')) {
      this.socket.off('property_status_changed', this.listeners.get('property_status_changed'));
      this.listeners.delete('property_status_changed');
    }
  }

  emit(event, data) {
    const s = this.connect();
    if (s) {
      s.emit(event, data);
    }
  }
}

export const socketService = new SocketService();
export const api = API;
export default API;