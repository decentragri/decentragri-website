import { FunctionComponent } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import './TokenTransferModal.css';

// Mock transaction history data 
interface Transaction {
  id: string;
  type: 'send' | 'receive';
  amount: string;
  date: Date;
  status: 'completed' | 'pending' | 'failed';
  hash: string;
  to?: string;
  from?: string;
}

const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'receive',
    amount: '10.5',
    date: new Date(Date.now() - 3600000 * 2), // 2 hours ago
    status: 'completed',
    hash: '0x123...456',
    from: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e'
  },
  {
    id: '2',
    type: 'send',
    amount: '5.2',
    date: new Date(Date.now() - 86400000), // 1 day ago
    status: 'completed',
    hash: '0x789...012',
    to: '0x1234567890abcdef1234567890abcdef12345678'
  },
  // Add more mock transactions as needed
];

const formatBalance = (balance: string) => {
  // If balance is 0, 0.0, or 0.00, return '0'
  const num = parseFloat(balance);
  return num === 0 ? '0' : balance;
};

interface TokenTransferModalProps {
  token: {
    symbol: string;
    name: string;
    balance: string;
    image: string;
  };
  onClose: () => void;
  onTransfer: (amount: string, toAddress: string) => void;
  onReceive: () => void;
}

const TokenTransferModal: FunctionComponent<TokenTransferModalProps> = ({
  token,
  onClose,
  onTransfer,
  onReceive,
}) => {
  const [activeTab, setActiveTab] = useState<'send' | 'receive' | 'history'>('send');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [amount, setAmount] = useState('');
  const [toAddress, setToAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [isDark, setIsDark] = useState(document.body.classList.contains('dark-mode'));
  
  // Generate QR code when component mounts or active tab changes
  useEffect(() => {
    const generateQR = async () => {
      try {
        // Using a placeholder wallet address - replace with actual wallet address from props or context
        const walletAddress = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e';
        
        // Dynamically import QRCode to fix Vite HMR issues
        const QRCode = (await import('qrcode')).default;
        
        // QR code colors
        const primaryColor = '#000000'; // Black QR code for better contrast
        const backgroundColor = '#FFFFFF'; // White background for QR code
        // Text color for better contrast
        const textColor = isDark ? '#E1E1FF' : '#2D3748';
        
        // First, generate the QR code to a data URL
        const qrDataUrl = await QRCode.toDataURL(walletAddress, {
          width: 300,
          margin: 1,
          color: {
            dark: primaryColor,
            light: backgroundColor,
          },
          errorCorrectionLevel: 'H'
        });

        // Create a canvas to draw the QR code and logo
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size
        canvas.width = 300;
        canvas.height = 300;

        // Draw the QR code
        const qrImg = new Image();
        qrImg.src = qrDataUrl;
        
        await new Promise<void>((resolve) => {
          qrImg.onload = () => {
            ctx.drawImage(qrImg, 0, 0, canvas.width, canvas.height);
            
            // Now add the logo
            const logoImg = new Image();
            logoImg.crossOrigin = 'anonymous';
            logoImg.src = '/assets/img/logo/decentra_logo2.png';
            
            logoImg.onload = () => {
              const logoSize = canvas.width * 0.2; // 20% of QR code size
              const logoX = (canvas.width - logoSize) / 2;
              const logoY = (canvas.height - logoSize) / 2;
              
              // Draw white (or theme-appropriate) background for logo
              const padding = logoSize * 0.2;
              ctx.fillStyle = backgroundColor;
              ctx.fillRect(
                logoX - padding,
                logoY - padding,
                logoSize + padding * 2,
                logoSize + padding * 2
              );
              
              // Draw the logo
              ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize);
              resolve();
            };
          };
        });
        
        setQrCodeUrl(canvas.toDataURL());
      } catch (err) {
        console.error('Error generating QR code:', err);
      }
    };
    
    if (activeTab === 'receive') {
      generateQR();
    }
  }, [activeTab]);

  const handleTransfer = (e: Event) => {
    e.preventDefault();
    if (!amount || !toAddress) return;
    setIsLoading(true);
    onTransfer(amount, toAddress);
    // Reset form
    setAmount('');
    setToAddress('');
    setIsLoading(false);
  };

  const handleMaxClick = () => {
    setAmount(formatBalance(token.balance));
  };

  // Update dark mode state when theme changes and load transactions
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.body.classList.contains('dark-mode'));
    });
    
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    // Load transactions (in a real app, this would be an API call)
    setTransactions(mockTransactions);
    
    return () => observer.disconnect();
  }, []);
  
  return (
    <div className={`token-transfer-overlay ${isDark ? 'dark-mode' : ''}`} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="token-transfer-modal">
        <button className="token-transfer-close" onClick={onClose} aria-label="Close">
          &times;
        </button>
        
        <div className="token-transfer-header">
          <img 
            src={token.image} 
            alt={token.name} 
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '12px',
              marginBottom: '1rem',
              objectFit: 'cover'
            }} 
          />
          <h2 className="token-transfer-title">{token.name}</h2>
          <p className="token-transfer-subtitle">
            Balance: {formatBalance(token.balance)} {token.symbol}
          </p>
        </div>

        <div className="token-transfer-tabs">
          <button 
            className={`token-transfer-tab ${activeTab === 'send' ? 'active' : ''}`}
            onClick={() => setActiveTab('send')}
          >
            Send
          </button>
          <button 
            className={`token-transfer-tab ${activeTab === 'receive' ? 'active' : ''}`}
            onClick={() => setActiveTab('receive')}
          >
            Receive
          </button>
          <button 
            className={`token-transfer-tab ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            History
          </button>
        </div>

        {activeTab === 'history' ? (
          <div className="transaction-history">
            {transactions.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--secondary-text-color)' }}>
                No transactions found
              </div>
            ) : (
              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {transactions.map((tx) => (
                  <div 
                    key={tx.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '1rem',
                      borderBottom: '1px solid var(--border-color)',
                      transition: 'background-color 0.2s'
                    }}
                    className="transaction-item"
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: tx.type === 'receive' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {tx.type === 'receive' ? '↓' : '↑'}
                      </div>
                      <div>
                        <div style={{ 
                          fontWeight: 500,
                          color: 'var(--primary-text-color)'
                        }}>
                          {tx.type === 'receive' ? 'Received' : 'Sent'} {token.symbol}
                        </div>
                        <div style={{ 
                          fontSize: '0.8rem',
                          color: 'var(--secondary-text-color)',
                          marginTop: '0.25rem'
                        }}>
                          {tx.date.toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{
                        fontWeight: 600,
                        color: tx.type === 'receive' ? '#4CAF50' : '#F44336'
                      }}>
                        {tx.type === 'receive' ? '+' : '-'} {tx.amount}
                      </div>
                      <div style={{
                        fontSize: '0.75rem',
                        color: 'var(--secondary-text-color)',
                        marginTop: '0.25rem',
                        fontFamily: 'monospace'
                      }}>
                        {tx.hash.substring(0, 6)}...{tx.hash.substring(tx.hash.length - 4)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : activeTab === 'send' ? (
          <form onSubmit={handleTransfer}>
            <div style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                color: 'var(--secondary-text-color)',
                fontSize: '0.9rem'
              }}>
                Amount
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.currentTarget.value)}
                  placeholder="0.0"
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--input-background)',
                    color: 'var(--primary-text-color)',
                    fontSize: '1.1rem',
                    boxSizing: 'border-box'
                  }}
                  step="any"
                  min="0"
                  max={token.balance}
                  required
                />
                <button
                  type="button"
                  onClick={handleMaxClick}
                  style={{
                    position: 'absolute',
                    right: '8px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'var(--primary-light)',
                    color: 'var(--primary-text-color)',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '2px 8px',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    fontWeight: 600
                  }}
                >
                  MAX
                </button>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '0.25rem',
                fontSize: '0.85rem',
                color: 'var(--secondary-text-color)'
              }}>
                <span>Available: {formatBalance(token.balance)} {token.symbol}</span>
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                color: 'var(--secondary-text-color)',
                fontSize: '0.9rem'
              }}>
                To Address
              </label>
              <input
                type="text"
                value={toAddress}
                onChange={(e) => setToAddress(e.currentTarget.value)}
                placeholder="0x..."
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  background: 'var(--input-background)',
                  color: 'var(--primary-text-color)',
                  fontSize: '0.95rem',
                  boxSizing: 'border-box',
                  fontFamily: 'monospace'
                }}
                required
              />
            </div>

            <button
              type="submit"
              className="token-transfer-btn primary"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                background: 'var(--primary-color)',
                color: 'white',
                border: 'none',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
                opacity: isLoading ? 0.7 : 1
              }}
            >
              {isLoading ? 'Processing...' : 'Send'}
            </button>
          </form>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <div style={{
              background: 'var(--card-background)',
              borderRadius: '12px',
              padding: '1.5rem',
              marginBottom: '1.5rem',
              border: '1px solid var(--border-color)'
            }}>
              <div style={{
                width: '240px',
                height: '240px',
                margin: '0 auto 1.5rem',
                padding: '20px',
                background: isDark ? '#25293C' : '#FFFFFF',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: isDark 
                  ? '0 4px 20px rgba(0, 0, 0, 0.3)' 
                  : '0 4px 20px rgba(0, 0, 0, 0.08)',
                border: '1px solid',
                borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s ease'
              }}>
                {qrCodeUrl ? (
                  <div style={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <img 
                      src={qrCodeUrl} 
                      alt="Wallet Address QR Code" 
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        borderRadius: '8px'
                      }} 
                    />
                  </div>
                ) : (
                  <div style={{
                    width: '100px',
                    height: '100px',
                    background: '#f5f5f5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#999',
                    fontSize: '0.8rem',
                    textAlign: 'center',
                    padding: '0.5rem',
                    wordBreak: 'break-all'
                  }}>
                    Loading QR...
                  </div>
                )}
              </div>
              <p style={{
                color: isDark ? '#FFFFFF' : '#2D3748',
                fontSize: '1rem',
                margin: '1.5rem 0 1rem',
                fontWeight: 500,
                opacity: 0.95
              }}>
                Scan to receive {token.symbol}
              </p>
              <div style={{
                background: 'var(--input-background)',
                padding: '0.75rem',
                borderRadius: '8px',
                marginBottom: '1rem',
                wordBreak: 'break-all',
                fontSize: '0.85rem',
                fontFamily: 'monospace',
                color: 'var(--primary-text-color)'
              }}>
                0x742d35Cc6634C0532925a3b844Bc454e4438f44e
              </div>
              <button
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText('0x742d35Cc6634C0532925a3b844Bc454e4438f44e');
                    // Show copied message
                    const copyBtn = document.querySelector('.copy-address-btn');
                    if (copyBtn) {
                      const originalText = copyBtn.textContent;
                      copyBtn.textContent = 'Copied!';
                      setTimeout(() => {
                        if (copyBtn) copyBtn.textContent = originalText;
                      }, 2000);
                    }
                  } catch (err) {
                    console.error('Failed to copy address:', err);
                  }
                }}
                className="token-transfer-btn secondary"
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  borderRadius: '6px',
                  background: 'var(--card-background)',
                  color: 'var(--primary-text-color)',
                  border: '1px solid var(--border-color)',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.2s'
                }}
              >
                <span className="copy-address-btn">Copy Address</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 4V16C8 17.1 8.9 18 10 18H20C21.1 18 22 17.1 22 16V7C22 5.9 21.1 5 20 5H17M4 8H3C2.45 8 2 8.45 2 9V21C2 21.55 2.45 22 3 22H15C15.55 22 16 21.55 16 21V20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TokenTransferModal;
