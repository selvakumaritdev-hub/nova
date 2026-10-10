import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, Sparkles, X, ShoppingBag, ArrowRight, User, Minimize2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { apiService } from '../../services/api';
import { useCart } from '../../context/CartContext';
import { useLanguage } from '../../context/LanguageContext';

export const AIAssistantWidget = ({ isFloating = true, initialOpen = false }) => {
  const { addToCart } = useCart();
  const { t } = useLanguage();

  const [isOpen, setIsOpen] = useState(initialOpen);
  const [messages, setMessages] = useState([
    {
      id: 'm-1',
      sender: 'ai',
      text: "Hello! I am NOVA AI, your luxury shopping concierge. Tell me what you're looking for (e.g. 'Show me budget headphones', 'Gaming smartphone under ₹30,000', or 'Anniversary gift ideas').",
      products: []
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const suggestedPrompts = [
    "I need a phone under ₹70,000 for gaming",
    "Show me budget headphones with ANC",
    "Luxury watches for gift",
    "Best skincare elixir for glowing skin",
    "Modern furniture for living room"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (queryText) => {
    const text = (queryText || inputValue).trim();
    if (!text) return;

    // Add user message
    const userMsg = {
      id: 'user-' + Date.now(),
      sender: 'user',
      text: text
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Analyze intent using frontend intelligent matching
    setTimeout(async () => {
      let matchedProducts = [];
      let responseText = "";
      const lower = text.toLowerCase();

      // Fetch catalog
      const catalog = await apiService.getProducts({ limit: 30 });

      // Match categories and prices
      if (lower.includes('phone') || lower.includes('gaming') || lower.includes('mobile')) {
        matchedProducts = catalog.filter(p => p.category === 'electronics' && (p.title.toLowerCase().includes('phone') || p.title.toLowerCase().includes('cyber') || p.price > 20000));
        responseText = "I've handpicked our highest-performing flagship smartphones with high-refresh rate displays and dedicated cooling for gaming:";
      } else if (lower.includes('headphone') || lower.includes('audio') || lower.includes('sound') || lower.includes('anc') || lower.includes('budget')) {
        matchedProducts = catalog.filter(p => p.category === 'electronics' && (p.title.toLowerCase().includes('headphone') || p.title.toLowerCase().includes('horizon')));
        responseText = "Here are top-rated spatial audio headphones engineered with active noise cancellation and pristine fidelity:";
      } else if (lower.includes('watch') || lower.includes('gift') || lower.includes('anniversary') || lower.includes('luxury')) {
        matchedProducts = catalog.filter(p => p.category === 'accessories' || p.price > 25000);
        responseText = "For timeless gifting and luxury craftsmanship, these certified horology masterpieces make an exceptional statement:";
      } else if (lower.includes('skin') || lower.includes('beauty') || lower.includes('glow') || lower.includes('fragrance')) {
        matchedProducts = catalog.filter(p => p.category === 'beauty');
        responseText = "Here is our curated selection of 24K gold-infused botanical elixirs and niche French fragrances:";
      } else if (lower.includes('furniture') || lower.includes('chair') || lower.includes('room') || lower.includes('home')) {
        matchedProducts = catalog.filter(p => p.category === 'furniture' || p.category === 'home-living');
        responseText = "I recommend these Scandinavian and Italian handcrafted pieces designed for comfort and modern architecture:";
      } else {
        // General matching by keywords
        matchedProducts = catalog.slice(0, 3);
        responseText = `Based on your request "${text}", here are the top curated recommendations from our vault:`;
      }

      // If matchedProducts is empty, provide top rated
      if (matchedProducts.length === 0) {
        matchedProducts = catalog.slice(0, 2);
      }

      const aiMsg = {
        id: 'ai-' + Date.now(),
        sender: 'ai',
        text: responseText,
        products: matchedProducts.slice(0, 2)
      };

      setIsTyping(false);
      setMessages(prev => [...prev, aiMsg]);
    }, 900);
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
        boxShadow: 'var(--shadow-lg)',
        overflow: 'hidden'
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '16px 20px',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(15, 19, 28, 0.95) 100%)',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--grad-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF'
            }}
          >
            <Sparkles size={18} />
          </div>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>NOVA AI Concierge</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-emerald)' }} />
              Active Catalog Intelligence
            </span>
          </div>
        </div>

        {isFloating && (
          <button
            onClick={() => setIsOpen(false)}
            className="btn-icon"
            style={{ width: '32px', height: '32px' }}
          >
            <X size={16} />
          </button>
        )}
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
                background: msg.sender === 'user' ? 'var(--grad-primary)' : 'var(--bg-tertiary)',
                color: msg.sender === 'user' ? '#FFFFFF' : 'var(--text-primary)',
                fontSize: '0.9rem',
                lineHeight: 1.5,
                border: msg.sender === 'user' ? 'none' : '1px solid var(--border-subtle)'
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
                  maxWidth: '340px',
                  marginTop: '4px'
                }}
              >
                {msg.products.map(product => (
                  <div
                    key={product.id}
                    style={{
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border-medium)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}
                  >
                    <img
                      src={product.thumbnail}
                      alt={product.title}
                      style={{
                        width: '54px',
                        height: '54px',
                        borderRadius: 'var(--radius-xs)',
                        objectFit: 'cover'
                      }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h4
                        style={{
                          fontSize: '0.85rem',
                          fontWeight: 700,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {product.title}
                      </h4>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
                        <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                          ₹{product.price.toLocaleString('en-IN')}
                        </span>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button
                            onClick={() => addToCart(product)}
                            className="btn btn-primary btn-sm"
                            style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                          >
                            <ShoppingBag size={12} />
                            <span>Add</span>
                          </button>
                          <Link
                            to={`/product/${product.id}`}
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                          >
                            <ArrowRight size={12} />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            <Sparkles size={14} className="animate-spin" />
            <span>{t('ai_thinking')}</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompt Chips */}
      <div
        style={{
          padding: '8px 16px',
          display: 'flex',
          gap: '6px',
          overflowX: 'auto',
          borderTop: '1px solid var(--border-subtle)',
          background: 'rgba(9, 11, 16, 0.4)'
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
              fontSize: '0.75rem',
              fontWeight: 600,
              color: 'var(--text-secondary)',
              whiteSpace: 'nowrap',
              flexShrink: 0
            }}
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        style={{
          padding: '12px 16px',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          gap: '8px',
          background: 'var(--bg-card)'
        }}
      >
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={t('ai_placeholder')}
          className="input-field"
          style={{ padding: '8px 14px', fontSize: '0.875rem' }}
        />
        <button type="submit" className="btn btn-primary" style={{ padding: '8px 14px' }}>
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
          style={{
            position: 'fixed',
            bottom: '28px',
            right: '28px',
            zIndex: 8999,
            width: '60px',
            height: '60px',
            borderRadius: 'var(--radius-full)',
            background: 'var(--grad-primary)',
            boxShadow: '0 8px 30px var(--accent-primary-glow)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          aria-label="Open NOVA AI Assistant"
        >
          <Bot size={28} />
          <span
            style={{
              position: 'absolute',
              top: '0',
              right: '0',
              width: '14px',
              height: '14px',
              borderRadius: '50%',
              background: 'var(--accent-emerald)',
              border: '2px solid var(--bg-primary)'
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
            style={{
              position: 'fixed',
              bottom: '28px',
              right: '28px',
              zIndex: 9000,
              width: '420px',
              maxWidth: 'calc(100vw - 32px)',
              height: '600px',
              maxHeight: 'calc(100vh - 100px)'
            }}
          >
            {widgetContent}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
