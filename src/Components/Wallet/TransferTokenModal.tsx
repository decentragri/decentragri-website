import { useState, useRef } from 'preact/hooks';
import { useThemeStore } from '@context/ThemeContext';
import './TransferTokenModal.css';

interface Token {
  symbol: string;
  balance: number;
  balanceInUSD: number;
  icon: string;
}

interface TransferTokenModalProps {
  isOpen: boolean;
  onClose: () => void;
  token: Token;
  onTransfer: (data: {
    to: string;
    amount: string;
    token: string;
  }) => Promise<void>;
}

export const TransferTokenModal = ({
  isOpen,
  onClose,
  token,
  onTransfer,
}: TransferTokenModalProps) => {
  const { isDarkMode } = useThemeStore();
  const [step, setStep] = useState<'form' | 'confirm'>('form');
  const [toAddress, setToAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setError('');
    
    // Basic validation
    if (!toAddress) {
      setError('Please enter a recipient address');
      return;
    }
    
    if (!toAddress.startsWith('0x') || toAddress.length !== 42) {
      setError('Please enter a valid Ethereum address');
      return;
    }
    
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    
    if (parseFloat(amount) > token.balance) {
      setError('Insufficient balance');
      return;
    }
    
    setStep('confirm');
  };

  const handleConfirm = async () => {
    try {
      setIsSubmitting(true);
      setError('');
      
      await onTransfer({
        to: toAddress,
        amount,
        token: token.symbol,
      });
      
      // Reset form on success
      setToAddress('');
      setAmount('');
      setStep('form');
      onClose();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to process transfer';
      setError(errorMessage);
      console.error('Transfer error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    
    // In a real app, you would use a QR code scanning library here
    // For now, we'll just log the file
    console.log('QR code file selected:', file);
    // Simulate scanning a QR code
    setToAddress('0x742d35Cc6634C0532925a3b844Bc454e4438f44e');
    
    // Reset the file input to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text && text.startsWith('0x') && text.length === 42) {
        setToAddress(text);
      } else {
        setError('Invalid Ethereum address in clipboard');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to read clipboard';
      console.error('Failed to read clipboard:', errorMessage);
      setError('Failed to read from clipboard. Please check permissions.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`transfer-modal-overlay ${isDarkMode ? 'dark' : ''}`}>
      <div className="transfer-modal">
        <div className="modal-header">
          <h2>Transfer {token.symbol}</h2>
          <button className="close-button" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        {step === 'form' ? (
          <form onSubmit={handleSubmit} className="transfer-form">
            <div className="form-group">
              <label htmlFor="amount">Amount ({token.symbol})</label>
              <div className="amount-input-container">
                <input
                  id="amount"
                  type="text"
                  inputMode="decimal"
                  placeholder="0.0"
                  value={amount}
                  onInput={(e) => setAmount((e.target as HTMLInputElement).value)}
                  className="amount-input"
                  autoFocus
                />
                <div className="max-button" onClick={() => setAmount(token.balance.toString())}>
                  MAX
                </div>
              </div>
              <div className="balance">
                Balance: {token.balance} {token.symbol}
                <span>≈ ${token.balanceInUSD.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="form-group">
              <div className="address-header">
                <label htmlFor="to-address">To</label>
                <div className="address-actions">
                  <button type="button" onClick={handlePasteFromClipboard} className="text-button">
                    <i className="fas fa-paste"></i> Paste
                  </button>
                  <button 
                    type="button" 
                    onClick={() => fileInputRef.current?.click()}
                    className="text-button"
                  >
                    <i className="fas fa-qrcode"></i> Scan QR
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleFileUpload}
                  />
                </div>
              </div>
              <input
                id="to-address"
                type="text"
                placeholder="0x..."
                value={toAddress}
                onInput={(e) => setToAddress((e.target as HTMLInputElement).value)}
                className="address-input"
              />
              {toAddress && (
                <div className="address-preview">
                  {`${toAddress.substring(0, 6)}...${toAddress.substring(38)}`}
                  {toAddress.length === 42 && (
                    <span className="valid-address">
                      <i className="fas fa-check-circle"></i> Valid address
                    </span>
                  )}
                </div>
              )}
            </div>
            
            {error && <div className="error-message">{error}</div>}
            
            <div className="form-actions">
              <button
                type="button"
                className="secondary-button"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="primary-button"
                disabled={isSubmitting || !toAddress || !amount}
              >
                Continue
              </button>
            </div>
          </form>
        ) : (
          <div className="confirmation-step">
            <div className="confirmation-details">
              <div className="detail-row">
                <span>From</span>
                <span className="wallet-address">
                  {`0x1234...${'1234'.substring(0, 4)}`}
                </span>
              </div>
              <div className="detail-row">
                <span>To</span>
                <span className="wallet-address">
                  {`${toAddress.substring(0, 6)}...${toAddress.substring(38)}`}
                </span>
              </div>
              <div className="detail-row">
                <span>Amount</span>
                <span className="amount-display">
                  {amount} {token.symbol}
                  <span>≈ ${(parseFloat(amount) * (token.balanceInUSD / token.balance)).toFixed(2)}</span>
                </span>
              </div>
              <div className="detail-row">
                <span>Network Fee</span>
                <span>~$0.50</span>
              </div>
              <div className="divider"></div>
              <div className="detail-row total">
                <span>Total</span>
                <span className="total-amount">
                  {amount} {token.symbol}
                  <span>≈ ${(parseFloat(amount) * (token.balanceInUSD / token.balance) + 0.5).toFixed(2)}</span>
                </span>
              </div>
            </div>
            
            {error && <div className="error-message">{error}</div>}
            
            <div className="form-actions">
              <button
                type="button"
                className="secondary-button"
                onClick={() => setStep('form')}
                disabled={isSubmitting}
              >
                Back
              </button>
              <button
                type="button"
                className="primary-button"
                onClick={handleConfirm}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i> Processing...
                  </>
                ) : (
                  'Confirm Transfer'
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransferTokenModal;
