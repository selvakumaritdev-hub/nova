import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot,
  Send,
  Sparkles,
  X,
  ShoppingBag,
  ArrowRight,
  User,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  RotateCcw,
  Check,
  Layers,
  HelpCircle,
  Package,
  Truck,
  ShieldCheck,
  Star
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { apiService } from '../../services/api';
import { useCart } from '../../context/CartContext';
import { useCompare } from '../../context/CompareContext';
import { useOrders } from '../../context/OrdersContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from '../../context/ToastContext';

export const AIAssistantWidget = ({ isFloating = true, initialOpen = false }) => {
  const { addToCart } = useCart();
  const { addToCompare } = useCompare();
  const { orders } = useOrders();
  const { user, isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const { addToast } = useToast();

  const [isOpen, setIsOpen] = useState(initialOpen);
  const [messages, setMessages] = useState([
    {
      id: 'm-1',
      sender: 'ai',
      text: "Namaste! I am NOVA AI, your luxury shopping concierge. You can type or speak in English, தமிழ் (Tamil), or Thanglish.\n\nTry asking: 'Gaming phones under ₹50,000', 'Enaku budget ANC headphones venum', or 'Track my order'.",
      products: []
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [isVoiceOutputEnabled, setIsVoiceOutputEnabled] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [addedItemMap, setAddedItemMap] = useState({});

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  const suggestedPrompts = [
    "Phones under ₹60,000",
    "Enaku budget ANC headphones venum",
    "வைரம் & தங்க நகைகள் காட்டுங்கள்",
    "Cashmere blazers & suits for men",
    "Track my latest order status",
    "What is Nova Mall return policy?"
  ];

  // Initialize Web Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSpeechSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-IN'; // Optimized for Indian English & Thanglish phonetic accents

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(r => r[0].transcript)
          .join('');
        setInputValue(transcript);
      };

      recognition.onerror = (event) => {
        setIsListening(false);
        if (event.error === 'not-allowed') {
          addToast('Microphone access was denied. Please allow microphone permissions in your browser.', 'warning');
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  // Text-To-Speech Synthesis
  const speakText = (text) => {
    if (!isVoiceOutputEnabled || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      // Clean markdown formatting before speaking
      const plainText = text.replace(/[*_#`[\]()]/g, '').slice(0, 240);
      const utterance = new SpeechSynthesisUtterance(plainText);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } catch {
      setIsSpeaking(false);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const toggleListening = () => {
    if (!speechSupported) {
      addToast('Speech recognition is not supported in this browser.', 'warning');
      return;
    }
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      try {
        recognitionRef.current?.start();
      } catch (err) {
        console.error("Speech start error:", err);
      }
    }
  };

  const handleResetChat = () => {
    stopSpeaking();
    setMessages([
      {
        id: 'm-init',
        sender: 'ai',
        text: "Conversation refreshed. How may I assist your luxury shopping journey today?",
        products: []
      }
    ]);
  };

  const handleQuickAdd = (product) => {
    addToCart(product, 1);
    setAddedItemMap(prev => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedItemMap(prev => ({ ...prev, [product.id]: false }));
    }, 1800);
  };

  const handleQuickCompare = (product) => {
    addToCompare(product);
  };

  const handleSend = async (queryText) => {
    const text = (queryText || inputValue).trim();
    if (!text) return;

    if (isListening) {
      recognitionRef.current?.stop();
    }

    // Add user message
    const userMsg = {
      id: 'user-' + Date.now(),
      sender: 'user',
      text: text
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(async () => {
      const lower = text.toLowerCase();
      let matchedProducts = [];
      let responseText = "";

      // 1. Order Tracking Query (English / Tamil / Thanglish)
      if (
        lower.includes('order') || lower.includes('track') || lower.includes('status') ||
        lower.includes('எங்கே') || lower.includes('ஆர்டர்') || lower.includes('ennoda order')
      ) {
        if (isAuthenticated && orders && orders.length > 0) {
          const latestOrder = orders[0];
          responseText = `I found your latest order #${latestOrder.id} (${latestOrder.status || 'Confirmed'}). Total: ₹${latestOrder.total?.toLocaleString('en-IN')}. Delivery is tracked for ${latestOrder.date || 'Tomorrow'}.`;
        } else {
          responseText = "You currently have no active orders in session. You can sign in to view your complete order history, or place a new order across our 500+ curated products.";
        }
      }
      // 2. Returns & Refunds Policy
      else if (
        lower.includes('return') || lower.includes('refund') || lower.includes('exchange') ||
        lower.includes('cancel') || lower.includes('ரிட்டர்ன்') || lower.includes('ரீஃபண்ட்')
      ) {
        responseText = "Nova Mall offers a 7-Day Hassle-Free Doorstep Replacement Policy on all certified items. If you wish to return an item, go to your Orders dashboard, tap 'Request Return', and our VIP courier will pick it up at zero additional cost.";
      }
      // 3. Shipping & Delivery Guidance
      else if (
        lower.includes('delivery') || lower.includes('shipping') || lower.includes('charges') ||
        lower.includes('free delivery') || lower.includes('டெலிவரி') || lower.includes('evalo naal')
      ) {
        responseText = "All orders above ₹5,000 and Nova+ VIP members enjoy 100% Free Next-Day Priority Delivery. Standard delivery across Indian metro hubs takes 24 to 48 hours with insured doorstep tracking.";
      }
      // 4. Product Search & Catalog Recommendations
      else {
        // Extract budget constraint if present (e.g. under 50000, 30k)
        let maxBudget = undefined;
        const budgetMatch = lower.match(/(?:under|below|less than|<)\s*₹?\s*(\d+)(?:k|000)?/);
        if (budgetMatch) {
          const num = parseInt(budgetMatch[1], 10);
          maxBudget = lower.includes('k') && num < 1000 ? num * 1000 : num;
        }

        // Detect category from multi-lingual keywords
        let targetCategory = undefined;
        if (lower.includes('phone') || lower.includes('mobile') || lower.includes('smartphone') || lower.includes('மொபைல்')) {
          targetCategory = 'mobiles';
        } else if (lower.includes('headphone') || lower.includes('earbuds') || lower.includes('audio') || lower.includes('speaker') || lower.includes('ஹெட்போன்')) {
          targetCategory = 'electronics';
        } else if (lower.includes('laptop') || lower.includes('computer') || lower.includes('macbook') || lower.includes('pc') || lower.includes('லேப்டாப்')) {
          targetCategory = 'computing';
        } else if (lower.includes('watch') || lower.includes('rolex') || lower.includes('omega') || lower.includes('chronograph') || lower.includes('வாட்ச்')) {
          targetCategory = 'watches';
        } else if (lower.includes('jewel') || lower.includes('gold') || lower.includes('diamond') || lower.includes('ring') || lower.includes('நகை') || lower.includes('தங்கம்')) {
          targetCategory = 'jewellery';
        } else if (lower.includes('shoe') || lower.includes('sneaker') || lower.includes('boot') || lower.includes('loafer') || lower.includes('காலணி')) {
          targetCategory = 'footwear';
        } else if (lower.includes('suit') || lower.includes('blazer') || lower.includes('men') || lower.includes('coat') || lower.includes('ஆண்கள்')) {
          targetCategory = 'fashion-men';
        } else if (lower.includes('dress') || lower.includes('gown') || lower.includes('women') || lower.includes('saree') || lower.includes('பெண்கள்')) {
          targetCategory = 'fashion-women';
        } else if (lower.includes('skin') || lower.includes('beauty') || lower.includes('cream') || lower.includes('perfume') || lower.includes('அழகு')) {
          targetCategory = 'beauty';
        } else if (lower.includes('bag') || lower.includes('luggage') || lower.includes('suitcase') || lower.includes('backpack') || lower.includes('பை')) {
          targetCategory = 'luggage';
        } else if (lower.includes('furniture') || lower.includes('sofa') || lower.includes('table') || lower.includes('chair') || lower.includes('வீட்டு')) {
          targetCategory = 'furniture';
        } else if (lower.includes('kitchen') || lower.includes('coffee') || lower.includes('espresso') || lower.includes('cookware') || lower.includes('சமையல்')) {
          targetCategory = 'kitchen';
        }

        // Query real catalog
        const searchFilters = { limit: 12 };
        if (targetCategory) searchFilters.category = targetCategory;
        if (maxBudget) searchFilters.maxPrice = maxBudget;

        const results = await apiService.getProducts(searchFilters);
        const list = Array.isArray(results) ? results : (results.products || []);

        if (list.length > 0) {
          matchedProducts = list.slice(0, 3);
          const langGreet = lower.includes('venum') || lower.includes('kaatunga')
            ? "நிச்சயமாக! இதோ உங்களுக்கான சிறந்த தேர்வுகள்:"
            : "Here are top-rated verified recommendations from our vault:";

          responseText = `${langGreet} (Showing ${matchedProducts.length} verified products${maxBudget ? ` under ₹${maxBudget.toLocaleString('en-IN')}` : ''}):`;
        } else {
          // Fallback to top rated
          const recs = await apiService.getRecommendedProducts();
          matchedProducts = (Array.isArray(recs) ? recs : []).slice(0, 2);
          responseText = `I searched our 500+ items catalogue for "${text}". Here are our top featured luxury flagships:`;
        }
      }

      const aiMsg = {
        id: 'ai-' + Date.now(),
        sender: 'ai',
        text: responseText,
        products: matchedProducts
      };

      setIsTyping(false);
      setMessages(prev => [...prev, aiMsg]);
      speakText(responseText);
    }, 850);
  };

  const widgetContent = (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: 'var(--bg-glass-strong)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid var(--border-medium)',
        borderRadius: isFloating ? 'var(--radius-lg)' : 'var(--radius-xl)',
        boxShadow: '0 24px 60px rgba(0, 0, 0, 0.65)',
        overflow: 'hidden'
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '14px 18px',
          background: 'var(--amazon-navy)',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: '#FFFFFF'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--amazon-amber)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#131921'
            }}
          >
            <Sparkles size={18} strokeWidth={2.5} />
          </div>
          <div>
            <h3 style={{ fontSize: '0.98rem', fontWeight: 800, margin: 0 }}>NOVA AI Assistant</h3>
            <span style={{ fontSize: '0.74rem', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-emerald)' }} />
              Active Voice & Text Concierge (EN / தமிழ் / Thanglish)
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {/* TTS Speaker Toggle */}
          <button
            onClick={() => {
              if (isSpeaking) stopSpeaking();
              setIsVoiceOutputEnabled(!isVoiceOutputEnabled);
              addToast(isVoiceOutputEnabled ? 'Voice reply disabled' : 'Voice reply enabled', 'info');
            }}
            className="btn-icon"
            style={{
              width: '32px',
              height: '32px',
              background: isVoiceOutputEnabled ? 'rgba(254, 189, 105, 0.2)' : 'transparent',
              color: isVoiceOutputEnabled ? 'var(--amazon-amber)' : 'var(--text-muted)',
              border: 'none'
            }}
            title={isVoiceOutputEnabled ? "Mute Voice Replies" : "Enable Voice Replies"}
          >
            {isVoiceOutputEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>

          {/* Reset Chat Button */}
          <button
            onClick={handleResetChat}
            className="btn-icon"
            style={{ width: '32px', height: '32px', background: 'transparent', color: 'var(--text-muted)', border: 'none' }}
            title="Reset Conversation"
          >
            <RotateCcw size={15} />
          </button>

          {isFloating && (
            <button
              onClick={() => {
                stopSpeaking();
                setIsOpen(false);
              }}
              className="btn-icon"
              style={{ width: '32px', height: '32px', background: 'transparent', color: '#FFFFFF', border: 'none' }}
              title="Close"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Messages List */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px'
        }}
      >
        {messages.map(msg => (
          <div
            key={msg.id}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              gap: '6px'
            }}
          >
            <div
              style={{
                maxWidth: '85%',
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                background: msg.sender === 'user' ? 'var(--amazon-navy-light)' : 'var(--bg-tertiary)',
                color: msg.sender === 'user' ? '#FFFFFF' : 'var(--text-primary)',
                fontSize: '0.88rem',
                lineHeight: 1.5,
                border: msg.sender === 'user' ? '1px solid rgba(254, 189, 105, 0.4)' : '1px solid var(--border-subtle)',
                whiteSpace: 'pre-wrap'
              }}
            >
              {msg.text}
            </div>

            {/* Embedded Product Cards */}
            {msg.products && msg.products.length > 0 && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  width: '100%',
                  maxWidth: '360px',
                  marginTop: '4px'
                }}
              >
                {msg.products.map(product => (
                  <div
                    key={product.id}
                    style={{
                      padding: '10px 12px',
                      borderRadius: '8px',
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-medium)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}
                  >
                    <img
                      src={product.thumbnail}
                      alt={product.title}
                      onError={(e) => {
                        e.currentTarget.src = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80";
                      }}
                      style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '6px',
                        objectFit: 'cover',
                        flexShrink: 0
                      }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h4
                        style={{
                          fontSize: '0.84rem',
                          fontWeight: 800,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          margin: 0
                        }}
                      >
                        {product.title}
                      </h4>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', marginTop: '2px' }}>
                        <span style={{ fontSize: '0.88rem', fontWeight: 900, color: 'var(--amazon-amber)' }}>
                          ₹{product.price.toLocaleString('en-IN')}
                        </span>
                        {product.isPrimeDelivery && (
                          <span style={{ color: '#007185', fontSize: '0.7rem', fontWeight: 800 }}>prime</span>
                        )}
                      </div>

                      {/* Direct Shopping Actions */}
                      <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                        <button
                          onClick={() => handleQuickAdd(product)}
                          className="btn-amazon-quick"
                          style={{
                            padding: '3px 8px',
                            fontSize: '0.72rem',
                            width: 'auto'
                          }}
                        >
                          {addedItemMap[product.id] ? (
                            <>
                              <Check size={11} />
                              <span>Added</span>
                            </>
                          ) : (
                            <>
                              <ShoppingBag size={11} />
                              <span>Add to Bag</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => handleQuickCompare(product)}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '3px 8px', fontSize: '0.72rem' }}
                          title="Compare"
                        >
                          <Layers size={11} />
                        </button>

                        <Link
                          to={`/product/${product.id}`}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '3px 8px', fontSize: '0.72rem' }}
                          title="View Details"
                        >
                          <ArrowRight size={11} />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--amazon-amber)', fontSize: '0.84rem' }}>
            <Sparkles size={14} className="animate-spin" />
            <span>NOVA AI is consulting the 500+ items catalogue...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompt Chips */}
      <div
        style={{
          padding: '8px 14px',
          display: 'flex',
          gap: '6px',
          overflowX: 'auto',
          borderTop: '1px solid var(--border-subtle)',
          background: 'rgba(9, 11, 16, 0.5)',
          scrollbarWidth: 'none'
        }}
      >
        {suggestedPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            style={{
              padding: '4px 10px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.74rem',
              fontWeight: 600,
              color: 'var(--text-secondary)',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              cursor: 'pointer'
            }}
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Voice Listening Active Waveform Banner */}
      {isListening && (
        <div
          style={{
            padding: '8px 16px',
            background: 'rgba(239, 68, 68, 0.15)',
            borderTop: '1px solid rgba(239, 68, 68, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.8rem',
            color: '#ef4444',
            fontWeight: 700
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444', animation: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite' }} />
            <span>Listening... Speak your request in English, தமிழ் or Thanglish</span>
          </div>
          <button
            type="button"
            onClick={toggleListening}
            style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontWeight: 800, fontSize: '0.75rem' }}
          >
            Stop
          </button>
        </div>
      )}

      {/* Input Box with Microphone Voice Button */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        style={{
          padding: '12px 14px',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'var(--bg-card)'
        }}
      >
        {/* Microphone Button */}
        <button
          type="button"
          onClick={toggleListening}
          className="btn-icon"
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            background: isListening ? '#ef4444' : 'var(--bg-tertiary)',
            color: isListening ? '#FFFFFF' : 'var(--amazon-amber)',
            border: isListening ? 'none' : '1px solid var(--border-medium)',
            cursor: 'pointer',
            flexShrink: 0
          }}
          title={isListening ? "Stop listening" : "Speak to Nova AI"}
        >
          {isListening ? <MicOff size={17} /> : <Mic size={17} />}
        </button>

        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={isListening ? "Listening to your voice..." : "Type in English or தமிழ்..."}
          className="input-field"
          style={{
            flex: 1,
            padding: '9px 12px',
            fontSize: '0.86rem',
            borderRadius: 'var(--radius-full)',
            background: 'var(--bg-input)'
          }}
        />

        <button
          type="submit"
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            background: 'var(--amazon-amber)',
            color: '#131921',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0
          }}
          title="Send"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );

  if (!isFloating) {
    return widgetContent;
  }

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="nova-ai-trigger"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 8999,
            width: '58px',
            height: '58px',
            borderRadius: 'var(--radius-full)',
            background: 'var(--amazon-amber)',
            boxShadow: '0 8px 30px rgba(254, 189, 105, 0.45)',
            color: '#131921',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid rgba(255, 255, 255, 0.4)',
            cursor: 'pointer'
          }}
          aria-label="Open NOVA AI Assistant"
        >
          <Bot size={28} strokeWidth={2.2} />
          <span
            style={{
              position: 'absolute',
              top: '2px',
              right: '2px',
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: 'var(--accent-emerald)',
              border: '2px solid #131921'
            }}
          />
        </motion.button>
      )}

      {/* Floating Modal Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            className="nova-ai-modal"
            style={{
              position: 'fixed',
              bottom: '24px',
              right: '24px',
              zIndex: 9000,
              width: '420px',
              maxWidth: 'calc(100vw - 32px)',
              height: '620px',
              maxHeight: 'calc(100vh - 80px)'
            }}
          >
            {widgetContent}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .nova-ai-trigger {
            bottom: calc(var(--mobile-nav-height, 64px) + 16px) !important;
            right: 16px !important;
            width: 52px !important;
            height: 52px !important;
          }
          .nova-ai-modal {
            bottom: 0 !important;
            right: 0 !important;
            left: 0 !important;
            top: 0 !important;
            width: 100vw !important;
            max-width: 100vw !important;
            height: 100vh !important;
            max-height: 100vh !important;
            border-radius: 0 !important;
          }
        }
      `}</style>
    </>
  );
};
