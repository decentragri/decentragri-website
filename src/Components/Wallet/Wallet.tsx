import { useState, useEffect } from 'preact/hooks';
import { useAuthStore } from '@context/AuthContext';
import TokenTransferModal from './TokenTransferModal';
import '../../assets/css/wallet-page.css';

interface UserInfo {
  username?: string;
  walletAddress?: string;
  // Add other user properties as needed
}

interface TokenCardProps {
  symbol: string;
  name: string;
  balance: string;
  image: string;
}

// Simple SVG icons for copy and check
const CopyIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
  </svg>
);

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);



const formatBalance = (balance: string) => {
  // If balance is 0, 0.0, or 0.00, return '0'
  const num = parseFloat(balance);
  return num === 0 ? '0' : balance;
};

const TokenCard = ({ symbol, name, balance, image }: TokenCardProps) => (
  <div className="wallet-token-card">
    <div className="token-image-container">
      <img src={image} alt={name} className="token-image" />
    </div>
    <div className="token-info">
      <div className="token-symbol">{symbol}</div>
      <div className="token-name">{name}</div>
    </div>
    <div className="token-balance" data-symbol={symbol}>
      {formatBalance(balance)}
    </div>
  </div>
);

interface Token {
  symbol: string;
  name: string;
  balance: string;
  image: string;
}

const Wallet = () => {
  const userInfo = useAuthStore((state) => state.userInfo) as UserInfo | null;
  const [copied, setCopied] = useState<'username' | 'address' | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set loading to false once we have user info or after a timeout
    if (userInfo) {
      setIsLoading(false);
    } else {
      const timer = setTimeout(() => setIsLoading(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [userInfo]);

  // If not loading but no user info, show a message
  if (!isLoading && !userInfo) {
    return (
      <div className="wallet-container">
        <h1 className="wallet-title">My Wallet</h1>
        <div className="wallet-error">
          Please sign in to view your wallet information.
        </div>
      </div>
    );
  }

  // Mock token data - replace with actual data from your API
  const [tokens, setTokens] = useState<Token[]>([
    {
      symbol: 'ETH',
      name: 'Ethereum',
      balance: '0.0',
      image: '/assets/img/icons/ethereum_icon.png'
    },
    {
      symbol: 'rswETH',
      name: 'rsWETH',
      balance: '0.0',
      image: '/assets/img/icons/rsweth_icon.png'
    },
    {
      symbol: 'SWELL',
      name: 'Swell Network',
      balance: '0.0',
      image: '/assets/img/icons/swell_icon.png'
    },
    {
      symbol: 'DAGRI',
      name: 'Decentragri',
      balance: '0.0',
      image: '/assets/img/logo/decentra_logo2.png'
    }
  ]);

  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [showTransferModal, setShowTransferModal] = useState(false);

  const handleTokenClick = (token: Token) => {
    setSelectedToken(token);
    setShowTransferModal(true);
  };

  const handleTransfer = (amount: string, toAddress: string) => {
    // TODO: Implement actual token transfer logic
    console.log(`Transferring ${amount} ${selectedToken?.symbol} to ${toAddress}`);
    // Update token balance after successful transfer
    if (selectedToken) {
      const updatedTokens = tokens.map(t => 
        t.symbol === selectedToken.symbol 
          ? { ...t, balance: (parseFloat(t.balance) - parseFloat(amount)).toFixed(4) }
          : t
      );
      setTokens(updatedTokens);
    }
    setShowTransferModal(false);
  };

  const handleReceive = () => {
    // TODO: Handle receive action if needed
    console.log('Receive action for', selectedToken?.symbol);
  };

  const copyToClipboard = (text: string | undefined, type: 'username' | 'address') => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  if (isLoading) {
    return (
      <div className="wallet-container">
        <h1 className="wallet-title">My Wallet</h1>
        <div className="wallet-loading">Loading wallet information...</div>
      </div>
    );
  }

  return (
    <div className="wallet-container">
      <h1 className="wallet-title">My Wallet</h1>
      
      <div className="wallet-info">
        <div className="wallet-field">
          <label>Username</label>
          <div className="wallet-address-container">
            <span className="wallet-text">{userInfo?.username || 'N/A'}</span>
            <button 
              className={`wallet-copy-btn ${copied === 'username' ? 'copied' : ''}`}
              onClick={() => copyToClipboard(userInfo?.username, 'username')}
              aria-label="Copy username"
              disabled={!userInfo?.username}
            >
              {copied === 'username' ? <CheckIcon /> : <CopyIcon />}
            </button>
          </div>
        </div>

        <div className="wallet-field">
          <label>Wallet Address</label>
          <div className="wallet-address-container">
            <span className="wallet-text wallet-address">
              {userInfo?.walletAddress || '0x00...0000'}
            </span>
            <button 
              className={`wallet-copy-btn ${copied === 'address' ? 'copied' : ''}`}
              onClick={() => copyToClipboard(userInfo?.walletAddress, 'address')}
              aria-label="Copy wallet address"
              disabled={!userInfo?.walletAddress}
            >
              {copied === 'address' ? <CheckIcon /> : <CopyIcon />}
            </button>
          </div>
        </div>
      </div>

      <div className="wallet-tokens">
        <h2 className="tokens-title">Your Tokens</h2>
        <div className="tokens-grid">
          {tokens.map((token) => (
            <div key={token.symbol} onClick={() => handleTokenClick(token)} style={{ cursor: 'pointer' }}>
              <TokenCard {...token} />
            </div>
          ))}
          
          {showTransferModal && selectedToken && (
            <TokenTransferModal
              token={selectedToken}
              onClose={() => setShowTransferModal(false)}
              onTransfer={handleTransfer}
              onReceive={handleReceive}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Wallet;
