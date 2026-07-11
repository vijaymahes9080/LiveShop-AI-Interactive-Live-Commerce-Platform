import React, { useState } from 'react';
import { ShoppingCart, Trash2, X, CreditCard, Shield, Download, CheckCircle, Sparkles } from 'lucide-react';

export default function CartCheckout({ cart, onClose, onUpdateQty, onRemoveItem, onClearCart }) {
  const [step, setStep] = useState("cart"); // cart, payment, invoice
  const [couponCode, setCouponCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [upiAddress, setUpiAddress] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [invoiceDetails, setInvoiceDetails] = useState(null);
  const [isPaying, setIsPaying] = useState(false);

  const getSubtotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getDiscountAmount = () => {
    return Math.round(getSubtotal() * (appliedDiscount / 100));
  };

  const getDeliveryFee = () => {
    const subtotal = getSubtotal();
    return subtotal > 1500 || subtotal === 0 ? 0 : 99; // Free above 1500
  };

  const getTotal = () => {
    return getSubtotal() - getDiscountAmount() + getDeliveryFee();
  };

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponCode.toUpperCase() === "LIVEDEAL") {
      setAppliedDiscount(15);
      alert("Promo code applied successfully! 15% Off your entire purchase.");
    } else {
      alert("Invalid coupon code. Try using 'LIVEDEAL' for the live discount!");
    }
  };

  const handlePayment = (e) => {
    e.preventDefault();
    if (paymentMethod === "upi" && !upiAddress.includes("@")) {
      alert("Please enter a valid UPI address (e.g. name@upi)");
      return;
    }
    if (paymentMethod === "card" && cardNumber.replace(/\s/g, '').length < 16) {
      alert("Please enter a valid 16-digit card number");
      return;
    }

    setIsPaying(true);

    // Simulate Payment Gateway Ingestion
    setTimeout(() => {
      setIsPaying(false);
      const transactionId = "TXN-" + Math.floor(10000000 + Math.random() * 90000000);
      const invoice = {
        txId: transactionId,
        date: new Date().toLocaleString(),
        items: [...cart],
        subtotal: getSubtotal(),
        discount: getDiscountAmount(),
        delivery: getDeliveryFee(),
        total: getTotal(),
        paymentMethod: paymentMethod.toUpperCase(),
        status: "SUCCESSFUL"
      };

      setInvoiceDetails(invoice);
      setStep("invoice");
      onClearCart();
    }, 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={styles.backdrop}>
      <div style={styles.drawer} className="glass-heavy">
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerTitleRow}>
            <ShoppingCart size={18} color="var(--color-pink)" />
            <h3 style={styles.headerTitle}>
              {step === "cart" ? "Your Cart" : step === "payment" ? "Checkout & Pay" : "Invoice Generated"}
            </h3>
          </div>
          <button onClick={onClose} style={styles.closeBtn}>
            <X size={20} />
          </button>
        </div>

        {/* STEP 1: CART LIST */}
        {step === "cart" && (
          <div style={styles.body}>
            {cart.length === 0 ? (
              <div style={styles.emptyCart}>
                <ShoppingCart size={48} color="var(--text-muted)" style={{ marginBottom: '16px' }} />
                <p style={styles.emptyText}>Your cart is empty.</p>
                <p style={styles.emptySubText}>Scan the catalog or watch a live drop to add products!</p>
              </div>
            ) : (
              <>
                <div style={styles.cartList}>
                  {cart.map((item) => (
                    <div key={item.id} style={styles.cartItem} className="glass">
                      <img src={item.image} alt={item.name} style={styles.itemImg} />
                      <div style={styles.itemMeta}>
                        <h4 style={styles.itemName}>{item.name}</h4>
                        <span style={styles.itemPrice}>₹{item.price.toLocaleString()}</span>
                        <div style={styles.qtyRow}>
                          <button onClick={() => onUpdateQty(item.id, item.quantity - 1)} style={styles.qtyBtn}>-</button>
                          <span style={styles.qtyVal}>{item.quantity}</span>
                          <button onClick={() => onUpdateQty(item.id, item.quantity + 1)} style={styles.qtyBtn}>+</button>
                        </div>
                      </div>
                      <button onClick={() => onRemoveItem(item.id)} style={styles.deleteBtn}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Coupon Code */}
                <form onSubmit={handleApplyCoupon} style={styles.couponForm}>
                  <input
                    type="text"
                    placeholder="Enter Coupon (e.g. LIVEDEAL)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    style={styles.couponInput}
                  />
                  <button type="submit" style={styles.couponBtn}>Apply</button>
                </form>

                {/* Bill details */}
                <div style={styles.summaryCard} className="glass">
                  <div style={styles.summaryRow}>
                    <span>Subtotal:</span>
                    <span>₹{getSubtotal().toLocaleString()}</span>
                  </div>
                  {appliedDiscount > 0 && (
                    <div style={{ ...styles.summaryRow, color: 'var(--color-emerald)' }}>
                      <span>Discount ({appliedDiscount}%):</span>
                      <span>-₹{getDiscountAmount().toLocaleString()}</span>
                    </div>
                  )}
                  <div style={styles.summaryRow}>
                    <span>Delivery Charges:</span>
                    <span>{getDeliveryFee() === 0 ? "FREE" : `₹${getDeliveryFee()}`}</span>
                  </div>
                  <div style={{ ...styles.summaryRow, borderTop: '1px solid var(--border-color)', paddingTop: '10px', marginTop: '10px' }}>
                    <span style={{ fontWeight: '800', fontSize: '15px' }}>Total Amount:</span>
                    <span style={{ fontWeight: '800', fontSize: '15px', color: 'var(--color-pink)' }}>
                      ₹{getTotal().toLocaleString()}
                    </span>
                  </div>
                </div>

                <button 
                  onClick={() => setStep("payment")} 
                  className="custom-button" 
                  style={styles.actionBtn}
                >
                  Proceed to Payment
                </button>
              </>
            )}
          </div>
        )}

        {/* STEP 2: PAYMENT METHOD */}
        {step === "payment" && (
          <div style={styles.body}>
            <div style={styles.amountIndicator}>
              <span>Amount Due:</span>
              <h2 style={styles.dueVal}>₹{getTotal().toLocaleString()}</h2>
            </div>

            <form onSubmit={handlePayment} style={styles.payForm}>
              <span style={styles.label}>Select Payment Method</span>
              <div style={styles.methodToggleGrid}>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("upi")}
                  style={{
                    ...styles.methodBtn,
                    borderColor: paymentMethod === 'upi' ? 'var(--color-cyan)' : 'var(--border-color)',
                    backgroundColor: paymentMethod === 'upi' ? 'rgba(6, 182, 212, 0.15)' : 'transparent'
                  }}
                >
                  🌐 UPI / GPay
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("card")}
                  style={{
                    ...styles.methodBtn,
                    borderColor: paymentMethod === 'card' ? 'var(--color-cyan)' : 'var(--border-color)',
                    backgroundColor: paymentMethod === 'card' ? 'rgba(6, 182, 212, 0.15)' : 'transparent'
                  }}
                >
                  💳 Debit / Credit Card
                </button>
              </div>

              {/* UPI Form */}
              {paymentMethod === "upi" && (
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Enter UPI Address ID</label>
                  <input
                    type="text"
                    value={upiAddress}
                    onChange={(e) => setUpiAddress(e.target.value)}
                    placeholder="e.g. username@okaxis"
                    required
                    style={styles.formInput}
                  />
                  <div style={styles.qrSandbox}>
                    <div style={styles.qrBox}>
                      <span style={{ fontSize: '9px', fontWeight: '800', color: 'var(--text-secondary)' }}>QR SANDBOX ACTIVE</span>
                    </div>
                    <span style={styles.qrText}>Or scan dynamic merchant UPI code inside mobile apps</span>
                  </div>
                </div>
              )}

              {/* Card Form */}
              {paymentMethod === "card" && (
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim())}
                    maxLength="19"
                    placeholder="xxxx xxxx xxxx xxxx"
                    required
                    style={styles.formInput}
                  />
                  <div style={styles.cardInfoRow}>
                    <div style={{ flex: 1 }}>
                      <label style={styles.formLabel}>Expiry Date</label>
                      <input
                        type="text"
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value)}
                        placeholder="MM/YY"
                        maxLength="5"
                        required
                        style={styles.formInput}
                      />
                    </div>
                    <div style={{ flex: 0.8 }}>
                      <label style={styles.formLabel}>CVV Code</label>
                      <input
                        type="password"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        placeholder="xxx"
                        maxLength="3"
                        required
                        style={styles.formInput}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div style={styles.securitySeal}>
                <Shield size={14} color="var(--color-emerald)" />
                <span>PCI-DSS Compliant 256-bit Secure Gateway</span>
              </div>

              <div style={styles.btnRow}>
                <button type="button" onClick={() => setStep("cart")} style={styles.backBtn}>Back</button>
                <button type="submit" disabled={isPaying} className="custom-button" style={styles.payBtnSubmit}>
                  {isPaying ? "Processing Secure Gateway..." : `Pay ₹${getTotal().toLocaleString()}`}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* STEP 3: TRANSACTION SUCCESS & INVOICE */}
        {step === "invoice" && invoiceDetails && (
          <div style={styles.body}>
            <div style={styles.successBlock}>
              <CheckCircle size={36} color="var(--color-emerald)" />
              <h3 style={styles.successTitle}>Payment Successful!</h3>
              <p style={styles.successDesc}>Transaction Completed via PCI secure node.</p>
            </div>

            {/* Structured Invoice Display */}
            <div style={styles.invoiceCard} className="glass">
              <div style={styles.invoiceHeader}>
                <span style={styles.invoiceLogo}>LiveShop AI Platform</span>
                <span style={styles.invoiceBadge}>PAID</span>
              </div>
              <div style={styles.invoiceMetadata}>
                <div><strong>Tx ID:</strong> {invoiceDetails.txId}</div>
                <div><strong>Date:</strong> {invoiceDetails.date}</div>
                <div><strong>Payment Channel:</strong> {invoiceDetails.paymentMethod}</div>
              </div>

              <div style={styles.invoiceItems}>
                <div style={styles.invoiceItemHeader}>
                  <span>Item Name</span>
                  <span>Qty</span>
                  <span>Price</span>
                </div>
                {invoiceDetails.items.map((item) => (
                  <div key={item.id} style={styles.invoiceItemRow}>
                    <span style={styles.invoiceItemName}>{item.name}</span>
                    <span>{item.quantity}</span>
                    <span>₹{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div style={styles.invoiceTotalBlock}>
                <div style={styles.invTotalRow}>
                  <span>Subtotal:</span>
                  <span>₹{invoiceDetails.subtotal.toLocaleString()}</span>
                </div>
                {invoiceDetails.discount > 0 && (
                  <div style={styles.invTotalRow}>
                    <span>Coupon Discount:</span>
                    <span>-₹{invoiceDetails.discount.toLocaleString()}</span>
                  </div>
                )}
                <div style={styles.invTotalRow}>
                  <span>Delivery Charges:</span>
                  <span>{invoiceDetails.delivery === 0 ? "FREE" : `₹${invoiceDetails.delivery}`}</span>
                </div>
                <div style={{ ...styles.invTotalRow, fontWeight: '800', borderTop: '1px solid var(--border-color)', paddingTop: '6px', marginTop: '6px' }}>
                  <span>Grand Total:</span>
                  <span style={{ color: 'var(--color-pink)' }}>₹{invoiceDetails.total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div style={styles.btnRow}>
              <button onClick={handlePrint} style={styles.printBtn} className="custom-button-secondary">
                <Download size={14} /> Download PDF
              </button>
              <button 
                onClick={() => {
                  setStep("cart");
                  onClose();
                }} 
                className="custom-button"
                style={{ flex: 1 }}
              >
                Back to Stream
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  backdrop: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    zIndex: 200,
    display: 'flex',
    justifyContent: 'flex-end',
    backdropFilter: 'blur(4px)'
  },
  drawer: {
    width: '440px',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '-10px 0 30px rgba(0,0,0,0.5)',
    borderLeft: '1px solid var(--border-color)',
    animation: 'slide-in 0.3s ease-out'
  },
  header: {
    padding: '20px 24px',
    borderBottom: '1px solid var(--border-color)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: 'rgba(0,0,0,0.1)'
  },
  headerTitleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  headerTitle: {
    fontFamily: 'var(--font-title)',
    fontWeight: '700',
    fontSize: '16px',
    color: 'white'
  },
  closeBtn: {
    background: 'transparent',
    border: 'none',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center'
  },
  body: {
    flex: 1,
    overflowY: 'auto',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  emptyCart: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 0',
    textAlign: 'center',
    flex: 1
  },
  emptyText: {
    fontSize: '15px',
    fontWeight: '700',
    color: 'white'
  },
  emptySubText: {
    fontSize: '12px',
    color: 'var(--text-secondary)',
    marginTop: '6px'
  },
  cartList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    maxHeight: '340px',
    overflowY: 'auto',
    paddingRight: '4px'
  },
  cartItem: {
    padding: '10px 14px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  itemImg: {
    width: '48px',
    height: '48px',
    borderRadius: '6px',
    objectFit: 'cover',
    border: '1px solid var(--border-color)'
  },
  itemMeta: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column'
  },
  itemName: {
    fontSize: '12px',
    fontWeight: '700',
    color: 'white',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '220px'
  },
  itemPrice: {
    fontSize: '12px',
    color: 'var(--color-pink)',
    fontWeight: '700',
    marginTop: '2px'
  },
  qtyRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginTop: '6px'
  },
  qtyBtn: {
    width: '20px',
    height: '20px',
    borderRadius: '4px',
    backgroundColor: 'rgba(255,255,255,0.05)',
    border: '1px solid var(--border-color)',
    color: 'white',
    fontSize: '12px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  qtyVal: {
    fontSize: '12px',
    fontWeight: '600'
  },
  deleteBtn: {
    background: 'transparent',
    border: 'none',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    transition: 'color 0.2s ease'
  },
  couponForm: {
    display: 'flex',
    gap: '8px',
    width: '100%'
  },
  couponInput: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.03)',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    color: 'white',
    padding: '8px 12px',
    fontSize: '12px',
    outline: 'none'
  },
  couponBtn: {
    backgroundColor: 'var(--bg-tertiary)',
    border: '1px solid var(--border-color)',
    color: 'white',
    borderRadius: '8px',
    padding: '8px 14px',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  summaryCard: {
    padding: '16px',
    borderRadius: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '12px',
    color: 'var(--text-secondary)'
  },
  actionBtn: {
    width: '100%',
    padding: '12px 0',
    fontSize: '13px'
  },
  amountIndicator: {
    backgroundColor: 'rgba(0,0,0,0.15)',
    padding: '16px',
    borderRadius: '12px',
    border: '1px solid var(--border-color)',
    textAlign: 'center'
  },
  dueVal: {
    fontFamily: 'var(--font-title)',
    fontWeight: '800',
    fontSize: '24px',
    color: 'var(--color-pink)',
    marginTop: '4px'
  },
  payForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px'
  },
  label: {
    fontSize: '11px',
    fontWeight: '700',
    color: 'var(--text-secondary)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  methodToggleGrid: {
    display: 'flex',
    gap: '8px'
  },
  methodBtn: {
    flex: 1,
    padding: '10px 0',
    border: '1px solid transparent',
    borderRadius: '8px',
    fontSize: '11px',
    fontWeight: '700',
    color: 'white',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  formLabel: {
    fontSize: '11px',
    fontWeight: '600',
    color: 'var(--text-secondary)'
  },
  formInput: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    color: 'white',
    padding: '10px 14px',
    fontSize: '13px',
    outline: 'none',
    width: '100%'
  },
  qrSandbox: {
    marginTop: '10px',
    backgroundColor: 'rgba(0,0,0,0.2)',
    padding: '16px',
    borderRadius: '8px',
    border: '1px dashed var(--border-color)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px'
  },
  qrBox: {
    width: '80px',
    height: '80px',
    backgroundColor: 'white',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4px'
  },
  qrText: {
    fontSize: '10px',
    color: 'var(--text-secondary)',
    textAlign: 'center'
  },
  cardInfoRow: {
    display: 'flex',
    gap: '12px'
  },
  securitySeal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    fontSize: '10px',
    color: 'var(--text-secondary)',
    marginTop: '4px'
  },
  btnRow: {
    display: 'flex',
    gap: '10px',
    marginTop: '16px'
  },
  backBtn: {
    flex: 0.5,
    backgroundColor: 'transparent',
    border: '1px solid var(--border-color)',
    color: 'white',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '600'
  },
  payBtnSubmit: {
    flex: 1.5,
    padding: '10px 0',
    fontSize: '12px'
  },
  successBlock: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: '8px',
    padding: '12px 0'
  },
  successTitle: {
    fontFamily: 'var(--font-title)',
    fontWeight: '800',
    fontSize: '18px',
    color: 'white'
  },
  successDesc: {
    fontSize: '12px',
    color: 'var(--text-secondary)'
  },
  invoiceCard: {
    padding: '20px',
    borderRadius: '12px',
    border: '1px dashed rgba(255,255,255,0.15)',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px'
  },
  invoiceHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid var(--border-color)',
    paddingBottom: '10px'
  },
  invoiceLogo: {
    fontFamily: 'var(--font-title)',
    fontWeight: '800',
    fontSize: '14px',
    color: 'white'
  },
  invoiceBadge: {
    fontSize: '9px',
    fontWeight: '800',
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    color: 'var(--color-emerald)',
    border: '1px solid var(--color-emerald)',
    padding: '2px 6px',
    borderRadius: '4px'
  },
  invoiceMetadata: {
    fontSize: '10px',
    color: 'var(--text-secondary)',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  invoiceItems: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  invoiceItemHeader: {
    display: 'grid',
    gridTemplateColumns: '1fr 40px 60px',
    fontSize: '10px',
    fontWeight: '700',
    color: 'var(--text-muted)',
    borderBottom: '1px solid var(--border-color)',
    paddingBottom: '4px'
  },
  invoiceItemRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 40px 60px',
    fontSize: '11px',
    color: 'white'
  },
  invoiceItemName: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    paddingRight: '6px'
  },
  invoiceTotalBlock: {
    borderTop: '1px solid var(--border-color)',
    paddingTop: '10px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  invTotalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '11px',
    color: 'var(--text-secondary)'
  },
  printBtn: {
    flex: 1,
    padding: '10px 0',
    fontSize: '12px'
  }
};
