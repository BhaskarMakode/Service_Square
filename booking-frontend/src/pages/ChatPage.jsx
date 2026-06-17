import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../services/apiClient';
import { useAuth } from '../context/AuthContext';

export default function ChatPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [error, setError] = useState(null);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchBookings();
  }, [user, navigate]);

  useEffect(() => {
    if (selectedBooking) {
      fetchMessages(selectedBooking._id);
    }
  }, [selectedBooking]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      // Fetch bookings, using them as the source of "conversations"
      const res = await apiClient.get('/bookings/my-bookings?limit=50');
      if (res.data.success) {
        setBookings(res.data.data.bookings || []);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch conversations');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (bookingId) => {
    try {
      setLoadingMessages(true);
      const res = await apiClient.get(`/chat/${bookingId}?limit=100`);
      if (res.data.success) {
        // Reverse because they come newest first usually
        setMessages((res.data.data.messages || []).reverse());
      }
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedBooking) return;

    const text = newMessage;
    setNewMessage(''); // optimistic clear
    
    // Optimistic UI update
    const tempId = Date.now().toString();
    const optimisticMessage = {
      _id: tempId,
      message: text,
      senderId: { _id: user._id, name: user.name, avatar: user.avatar },
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, optimisticMessage]);

    try {
      const res = await apiClient.post('/chat/send', {
        bookingId: selectedBooking._id,
        message: text
      });
      if (res.data.success) {
        // Replace temp with real
        setMessages(prev => prev.map(m => m._id === tempId ? res.data.data.message : m));
      }
    } catch (err) {
      console.error('Failed to send message:', err);
      // Remove optimistic message if failed
      setMessages(prev => prev.filter(m => m._id !== tempId));
      alert('Failed to send message. Please try again.');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getOtherParticipant = (booking) => {
    if (!booking) return { name: 'Unknown', role: 'Unknown', avatar: `https://ui-avatars.com/api/?name=Unknown&background=4F46E5&color=fff` };
    
    if (user.role === 'customer') {
      return {
        name: booking.providerId?.userId?.name || 'Provider',
        role: booking.providerId?.category || 'Service Provider',
        avatar: booking.providerId?.userId?.avatar || `https://ui-avatars.com/api/?name=${booking.providerId?.userId?.name || 'Provider'}&background=4F46E5&color=fff`
      };
    } else {
      return {
        name: booking.customerId?.name || 'Customer',
        role: 'Customer',
        avatar: booking.customerId?.avatar || `https://ui-avatars.com/api/?name=${booking.customerId?.name || 'Customer'}&background=4F46E5&color=fff`
      };
    }
  };

  return (
    <>
      <header className="sticky top-0 w-full z-50 bg-white/80 backdrop-blur-xl shadow-sm font-['Inter'] antialiased tracking-tight">
        <div className="flex justify-between items-center max-w-7xl mx-auto px-6 h-20">
          <Link to="/" className="text-2xl font-black tracking-tighter text-indigo-700">Service Square</Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link className="text-slate-600 font-medium hover:text-indigo-500 transition-colors" to="/">Home</Link>
            <Link className="text-slate-600 font-medium hover:text-indigo-500 transition-colors" to="/services">Services</Link>
            {user?.role === 'customer' && <Link className="text-slate-600 font-medium hover:text-indigo-500 transition-colors" to="/provider-onboarding-1">Become a Provider</Link>}
            {user && <Link className="text-slate-600 font-medium hover:text-indigo-500 transition-colors" to={user.role === 'customer' ? '/user-dashboard' : '/provider-panel'}>Dashboard</Link>}
          </nav>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full border border-slate-200 overflow-hidden bg-slate-100">
              <img src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=4F46E5&color=fff`} alt="User" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 h-[calc(100vh-10rem)] min-h-[600px] font-body text-on-surface">
        <div className="flex h-full gap-6">
          {/* Left Side: Conversation List */}
          <aside className="w-full md:w-1/3 flex flex-col bg-surface-container-low rounded-xl overflow-hidden shadow-sm">
            <div className="p-6">
              <h2 className="text-xl font-extrabold tracking-tight text-on-surface mb-2">Conversations</h2>
              <p className="text-xs text-on-surface-variant mb-4">Chat related to your bookings</p>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">search</span>
                <input className="w-full pl-10 pr-4 py-3 bg-surface-container-high border-none rounded-xl text-sm focus:ring-2 focus:ring-primary-fixed focus:bg-surface-container-lowest transition-all outline-none" placeholder="Search..." type="text"/>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-1 px-3 pb-3">
              {loading ? (
                <div className="p-4 text-center text-sm font-bold text-slate-400 animate-pulse">Loading conversations...</div>
              ) : error ? (
                <div className="p-4 text-center text-sm font-bold text-red-500">{error}</div>
              ) : bookings.length === 0 ? (
                <div className="p-4 text-center text-sm font-medium text-slate-500">No active conversations found.</div>
              ) : (
                bookings.map((booking) => {
                  const other = getOtherParticipant(booking);
                  const isSelected = selectedBooking?._id === booking._id;
                  
                  return (
                    <div 
                      key={booking._id} 
                      onClick={() => setSelectedBooking(booking)}
                      className={`group cursor-pointer p-4 rounded-xl flex items-center gap-4 transition-all duration-200 ${isSelected ? 'bg-surface-container-lowest shadow-sm' : 'hover:bg-surface-container-lowest'}`}
                    >
                      <div className="relative">
                        <img className="w-12 h-12 rounded-xl object-cover" alt={other.name} src={other.avatar}/>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline">
                          <span className="text-sm font-bold text-on-surface truncate capitalize">{other.name}</span>
                          <span className="text-[10px] text-on-surface-variant font-medium">{new Date(booking.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="text-xs text-on-surface-variant truncate capitalize">Booking: {booking.serviceType}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </aside>

          {/* Right Side: Chat Window */}
          <section className="flex-1 flex flex-col bg-surface-container-lowest rounded-xl overflow-hidden shadow-lg border border-outline-variant/10">
            {selectedBooking ? (
              <>
                {/* Chat Header */}
                <header className="p-4 flex items-center justify-between bg-surface-container-low/40 backdrop-blur-md border-b border-outline-variant/10">
                  <div className="flex items-center gap-4">
                    <img className="w-10 h-10 rounded-lg object-cover" alt="Profile" src={getOtherParticipant(selectedBooking).avatar}/>
                    <div>
                      <h3 className="text-sm font-bold text-on-surface leading-tight capitalize">{getOtherParticipant(selectedBooking).name}</h3>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className={`w-2 h-2 rounded-full ${selectedBooking.status === 'completed' ? 'bg-emerald-500' : 'bg-primary'}`}></span>
                        <p className="text-[11px] font-medium text-on-surface-variant uppercase tracking-wide">Booking: {selectedBooking.status}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link to={user.role === 'customer' ? `/booking-confirmation?id=${selectedBooking._id}` : `/provider-panel`} className="p-2 hover:bg-surface-container-high rounded-lg text-on-surface-variant transition-colors" title="View Booking Details">
                      <span className="material-symbols-outlined text-xl">info</span>
                    </Link>
                  </div>
                </header>

                {/* Message History */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-surface-container-lowest">
                  <div className="flex justify-center">
                    <span className="px-3 py-1 bg-surface-container-low text-[10px] font-bold text-on-surface-variant rounded-full uppercase tracking-widest">
                      {new Date(selectedBooking.bookingDate).toLocaleDateString()}
                    </span>
                  </div>
                  
                  {loadingMessages ? (
                    <div className="flex justify-center items-center h-full">
                      <div className="text-slate-400 font-bold animate-pulse text-sm">Loading messages...</div>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="flex justify-center items-center h-full flex-col opacity-50">
                      <span className="material-symbols-outlined text-4xl mb-2 text-slate-400">forum</span>
                      <p className="text-sm font-medium text-slate-500">No messages yet. Say hi!</p>
                    </div>
                  ) : (
                    messages.map((msg, index) => {
                      const isMine = msg.senderId?._id === user._id;
                      
                      return (
                        <div key={msg._id || index} className={`flex items-end gap-3 max-w-[80%] ${isMine ? 'ml-auto flex-row-reverse' : ''}`}>
                          <img className="w-6 h-6 rounded-md object-cover mb-1" alt="Avatar" src={msg.senderId?.avatar || `https://ui-avatars.com/api/?name=${msg.senderId?.name || 'User'}&background=4F46E5&color=fff`}/>
                          <div className={`space-y-1 ${isMine ? 'text-right' : ''}`}>
                            <div className={`${isMine ? 'bg-gradient-to-br from-primary to-primary-container text-white rounded-br-none' : 'bg-surface-container-low text-on-surface rounded-bl-none'} p-4 rounded-2xl shadow-sm`}>
                              <p className="text-sm leading-relaxed">{msg.message}</p>
                            </div>
                            <span className={`text-[10px] text-on-surface-variant flex items-center gap-1 ${isMine ? 'justify-end mr-1' : 'ml-1'}`}>
                              {new Date(msg.timestamp || new Date()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              {isMine && <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>done_all</span>}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <footer className="p-4 bg-surface-container-lowest border-t border-outline-variant/10">
                  <form onSubmit={handleSendMessage} className="flex items-center gap-3 bg-surface-container-high/50 p-2 pl-4 rounded-2xl border border-outline-variant/20 focus-within:border-primary-fixed focus-within:ring-2 focus-within:ring-primary-fixed transition-all">
                    <input 
                      className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2 outline-none text-on-surface" 
                      placeholder="Type your message..." 
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <div className="flex items-center gap-1">
                      <button type="submit" disabled={!newMessage.trim()} className="bg-primary text-white p-2.5 rounded-xl shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center">
                        <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>send</span>
                      </button>
                    </div>
                  </form>
                </footer>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center bg-surface-container-lowest opacity-60">
                <div className="w-20 h-20 rounded-3xl bg-surface-container-high flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-4xl text-on-surface-variant">forum</span>
                </div>
                <h3 className="text-lg font-bold text-on-surface">Select a Conversation</h3>
                <p className="text-sm text-on-surface-variant mt-1">Choose a booking from the left to start chatting</p>
              </div>
            )}
          </section>
        </div>
      </main>
    </>
  );
}
