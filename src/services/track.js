// Sends a customer activity event (login, register, cancel...) to the shop owner's server.
// Fire-and-forget: if the server is offline nothing breaks for the customer.
const API_URL = import.meta.env.VITE_API_URL || '';

export const track = (type, user, data = {}) => {
  try {
    fetch(`${API_URL}/api/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type,
        user: user ? { name: user.name, email: user.email, phone: user.phone } : null,
        data
      })
    }).catch(() => {});
  } catch {
    /* ignore */
  }
};
