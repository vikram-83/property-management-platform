import React, { useState, useEffect } from 'react';
import { propertyAPI, socketService } from '../services/api';
import { MapPin, IndianRupee, Filter, Search, ShieldCheck, Heart, Sparkles, AlertCircle } from 'lucide-react';

export const PropertyList = () => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [priceRange, setPriceRange] = useState(50000);
  const [liveEvents, setLiveEvents] = useState([]);

  useEffect(() => {
    const loadProperties = async () => {
      try {
        setLoading(true);
        const res = await propertyAPI.getAll();
        setProperties(res.data);
        setFilteredProperties(res.data);
      } catch (err) {
        // Production Fallback Mock Data
        const fallbackData = [
          { _id: '1', title: 'Luxury 3BHK Apartment', category: 'Apartment', location: 'Satna, MP', price: 15000, rooms: 3, area: '1450 sqft', status: 'Available', owner: 'Ramesh Verma' },
          { _id: '2', title: 'Modern Villa with Garden', category: 'Villa', location: 'Indore, MP', price: 35000, rooms: 4, area: '2800 sqft', status: 'Booked', owner: 'Priya Sharma' },
          { _id: '3', title: 'Cozy Commercial Office Space', category: 'Commercial', location: 'Bhopal, MP', price: 22000, rooms: 2, area: '950 sqft', status: 'Available', owner: 'Ankit Gupta' },
          { _id: '4', title: 'Studio Apartment for Students', category: 'Studio', location: 'Satna, MP', price: 8000, rooms: 1, area: '500 sqft', status: 'Available', owner: 'Vikram Chaudhari' },
        ];
        setProperties(fallbackData);
        setFilteredProperties(fallbackData);
      } finally {
        setLoading(false);
      }
    };

    loadProperties();

    const handlePropertyChange = (data) => {
      setLiveEvents((prev) => [data, ...prev.slice(0, 4)]);
      setProperties((prev) =>
        prev.map((item) => (item._id === data.propertyId ? { ...item, status: data.newStatus } : item))
      );
    };

    socketService.subscribeToPropertyUpdates(handlePropertyChange);
    return () => socketService.unsubscribeFromPropertyUpdates();
  }, []);

  useEffect(() => {
    let result = properties;

    if (searchQuery) {
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (categoryFilter !== 'All') {
      result = result.filter((p) => p.category === categoryFilter);
    }

    result = result.filter((p) => p.price <= priceRange);
    setFilteredProperties(result);
  }, [searchQuery, categoryFilter, priceRange, properties]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-600 font-medium">Fetching active rental listings...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Live Activity Monitor */}
      {liveEvents.length > 0 && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center space-x-2 text-amber-800 font-semibold mb-2">
            <Sparkles className="h-5 w-5 text-amber-600" />
            <span>Real-time Marketplace Feed</span>
          </div>
          <div className="space-y-1">
            {liveEvents.map((ev, index) => (
              <p key={index} className="text-sm text-amber-900 flex items-center space-x-2">
                <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse"></span>
                <span>{ev.message || `Property #${ev.propertyId} is now ${ev.newStatus}`}</span>
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Control & Filter Dashboard */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by city, location, title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-slate-400" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="All">All Categories</option>
              <option value="Apartment">Apartment</option>
              <option value="Villa">Villa</option>
              <option value="Commercial">Commercial</option>
              <option value="Studio">Studio</option>
            </select>
          </div>

          <div className="flex flex-col justify-center space-y-1">
            <div className="flex justify-between text-xs font-semibold text-slate-600">
              <span>Max Price</span>
              <span>₹{priceRange.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="5000"
              max="50000"
              step="1000"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.length > 0 ? (
          filteredProperties.map((prop) => (
            <div
              key={prop._id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 bg-slate-100 flex items-center justify-center text-slate-400">
                  <span className="font-medium text-sm">Interactive Image Stream</span>
                  <button className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-md rounded-full text-slate-600 hover:text-red-500 transition">
                    <Heart className="h-5 w-5" />
                  </button>
                  <span
                    className={`absolute bottom-3 left-3 px-3 py-1 text-xs font-bold rounded-full ${
                      prop.status === 'Available' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
                    }`}
                  >
                    {prop.status}
                  </span>
                </div>

                <div className="p-5 space-y-3">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-bold text-slate-900 line-clamp-1">{prop.title}</h3>
                  </div>

                  <p className="flex items-center text-sm text-slate-500">
                    <MapPin className="h-4 w-4 mr-1 text-blue-500 shrink-0" />
                    <span>{prop.location}</span>
                  </p>

                  <div className="flex items-center space-x-4 text-xs font-semibold text-slate-500 bg-slate-50 p-2.5 rounded-lg">
                    <span>{prop.rooms} Rooms</span>
                    <span>•</span>
                    <span>{prop.area}</span>
                    <span>•</span>
                    <span>{prop.category}</span>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-slate-100 flex items-center justify-between mt-4">
                <div>
                  <span className="text-xs text-slate-400 block">Monthly Rent</span>
                  <span className="flex items-center text-xl font-extrabold text-slate-900">
                    <IndianRupee className="h-5 w-5 text-slate-800" />
                    {prop.price.toLocaleString()}
                  </span>
                </div>

                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition shadow-sm">
                  Book Inspection
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full bg-white p-12 text-center rounded-2xl border border-slate-200 space-y-3">
            <AlertCircle className="h-10 w-10 text-slate-400 mx-auto" />
            <p className="text-lg font-bold text-slate-800">No properties matched your search parameters.</p>
            <p className="text-sm text-slate-500">Try resetting filters or searching for alternative locations.</p>
          </div>
        )}
      </div>
    </div>
  );
};