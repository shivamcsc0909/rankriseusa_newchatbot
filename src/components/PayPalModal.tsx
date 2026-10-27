import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { X, CreditCard, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface PayPalModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialAmount?: string;
}

type ModalStep = 'amount' | 'checkout' | 'success' | 'error';

export default function PayPalModal({ isOpen, onClose, initialAmount }: PayPalModalProps) {
  const [step, setStep] = useState<ModalStep>('amount');
  const [amount, setAmount] = useState('');
  const [amountError, setAmountError] = useState('');
  const [transactionId, setTransactionId] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (initialAmount && parseFloat(initialAmount) > 0) {
        setAmount(initialAmount);
        setStep('checkout');
      } else {
        setAmount('');
        setStep('amount');
      }
      setAmountError('');
      setTransactionId('');
    }
  }, [isOpen, initialAmount]);

  const handleClose = () => {
    setStep('amount');
    setAmount('');
    setAmountError('');
    setTransactionId('');
    onClose();
  };


  const handleAmountSubmit = () => {
    const parsed = parseFloat(amount);
    if (!amount || isNaN(parsed) || parsed <= 0) {
      setAmountError('Please enter a valid amount greater than $0.');
      return;
    }
    setAmountError('');
    setStep('checkout');
  };

  const handleAmountKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleAmountSubmit();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 24 }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-md flex flex-col my-auto"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-[#0070ba] to-[#1546a0] px-6 py-5 relative rounded-t-3xl flex-shrink-0">
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors rounded-full p-1 hover:bg-white/10"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-3 text-white">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold">Secure Payment</h2>
                    <p className="text-xs text-white/75">Powered by PayPal</p>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 overflow-y-auto">
                {/* Step: Enter Amount */}
                {step === 'amount' && (
                  <motion.div
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -16 }}
                  >
                    <p className="text-gray-600 text-sm mb-4">
                      Enter the amount you wish to pay for our services.
                    </p>
                    <div className="relative mb-1">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold text-lg select-none">
                        $
                      </span>
                      <input
                        type="number"
                        min="1"
                        step="0.01"
                        value={amount}
                        onChange={(e) => {
                          setAmount(e.target.value);
                          setAmountError('');
                        }}
                        onKeyDown={handleAmountKeyDown}
                        placeholder="0.00"
                        autoFocus
                        className="w-full pl-9 pr-4 py-3.5 border-2 border-gray-200 rounded-xl text-gray-900 text-lg font-semibold focus:outline-none focus:border-[#0070ba] transition-colors"
                      />
                    </div>
                    {amountError && (
                      <p className="text-red-500 text-xs mt-1 mb-3">{amountError}</p>
                    )}
                    <p className="text-xs text-gray-400 mb-5">Currency: USD</p>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleAmountSubmit}
                      className="w-full bg-gradient-to-r from-[#0070ba] to-[#1546a0] text-white py-3.5 rounded-xl font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-blue-500/20"
                    >
                      Continue to PayPal
                    </motion.button>
                  </motion.div>
                )}

                {/* Step: PayPal Checkout Buttons */}
                {step === 'checkout' && (
                  <motion.div
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-sm text-gray-600">Amount to pay:</p>
                      <span className="text-2xl font-black text-[#0070ba]">
                        ${parseFloat(amount).toFixed(2)}{' '}
                        <span className="text-sm font-normal text-gray-500">USD</span>
                      </span>
                    </div>

                    <div className="border-t border-gray-100 pt-4 mb-4">
                      <PayPalScriptProvider
                        options={{
                          clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID,
                          currency: 'USD',
                        }}
                      >
                        <PayPalButtons
                          style={{
                            layout: 'vertical',
                            shape: 'rect',
                            color: 'blue',
                            label: 'pay',
                          }}
                          createOrder={async () => {
                            const res = await fetch('/api/create-order.php', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ amount }),
                            });
                            const text = await res.text();
                            if (!text) throw new Error('Server response empty.');
                            const data = JSON.parse(text);
                            if (!res.ok) throw new Error(data.error || 'Order creation failed');
                            return data.id;
                          }}
                          onApprove={async (data) => {
                            const res = await fetch('/api/capture-order.php', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ orderID: data.orderID }),
                            });
                            const text = await res.text();
                            if (!text) throw new Error('Capture response empty.');
                            const order = JSON.parse(text);
                            if (!res.ok) throw new Error(order.error || 'Capture failed');
                            setTransactionId(order.id || '');
                            setStep('success');
                            toast.success('Payment completed successfully!');
                          }}
                          onCancel={() => {
                            toast.info('Payment cancelled. You can try again anytime.');
                          }}
                          onError={(err) => {
                            console.error('PayPal error:', err);
                            setStep('error');
                            toast.error('Payment failed. Please try again.');
                          }}
                        />
                      </PayPalScriptProvider>
                    </div>

                    <button
                      onClick={() => setStep('amount')}
                      className="w-full text-gray-400 text-sm hover:text-gray-600 transition-colors py-1"
                    >
                      ← Change Amount
                    </button>
                  </motion.div>
                )}

                {/* Step: Success */}
                {step === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-4"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                    >
                      <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h3>
                    <p className="text-gray-500 text-sm mb-1">
                      Thank you for your payment of{' '}
                      <span className="font-semibold text-gray-700">
                        ${parseFloat(amount).toFixed(2)} USD
                      </span>
                    </p>
                    {transactionId && (
                      <p className="text-xs text-gray-400 mb-5 break-all">
                        Transaction ID: {transactionId}
                      </p>
                    )}
                    <p className="text-gray-500 text-sm mb-6">
                      Our team will reach out to you shortly to get started.
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleClose}
                      className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-xl font-semibold transition-colors shadow-lg shadow-green-500/20"
                    >
                      Done
                    </motion.button>
                  </motion.div>
                )}

                {/* Step: Error */}
                {step === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-4"
                  >
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h3>
                    <p className="text-gray-500 text-sm mb-6">
                      Something went wrong with your payment. Please try again.
                    </p>
                    <div className="flex gap-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setStep('checkout')}
                        className="flex-1 bg-gradient-to-r from-[#0070ba] to-[#1546a0] text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity"
                      >
                        Try Again
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleClose}
                        className="flex-1 border-2 border-gray-200 text-gray-600 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Footer */}
              {(step === 'amount' || step === 'checkout') && (
                <div className="px-6 pb-5 flex items-center justify-center gap-2 text-xs text-gray-400 flex-shrink-0">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  Payments are secured and encrypted by PayPal
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
