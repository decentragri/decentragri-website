import { useState, useEffect } from 'preact/hooks';
import { useAuthStore } from '../../context/AuthContext';
import { stakeEth, getStakingStats } from '../../client/onchain/clientStaking';
import './Staking.css';

const Staking = () => {
  const userInfo = useAuthStore((state) => state.userInfo);
  const ethBalance = userInfo?.walletData?.ethBalance || '0';
  
  const [stakeAmount, setStakeAmount] = useState<string>('');
  const [expectedReward, setExpectedReward] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statsError, setStatsError] = useState<string | null>(null);
  
  // Staking constants from backend
  const [stakingStats, setStakingStats] = useState({
    APR: 1.80,
    EXCHANGE_RATE: 1.04
  });
  const TX_FEE = 'Free';

  const calculateStakeFromReward = (rswEthAmount: string): string => {
    const reward = parseFloat(rswEthAmount) || 0;
    return (reward / stakingStats.EXCHANGE_RATE).toFixed(3);
  };

  const calculateRewardFromStake = (ethAmount: string): string => {
    const stake = parseFloat(ethAmount) || 0;
    return (stake * stakingStats.EXCHANGE_RATE).toFixed(3);
  };

  // Fetch staking stats
  useEffect(() => {
    const fetchStakingInfo = async () => {
      // Get staking statistics
      try {
        const stats = await getStakingStats();
        if (stats instanceof Error) {
          throw stats;
        }
        
        setStakingStats({
          APR: stats.apr,
          EXCHANGE_RATE: stats.exchangeRate
        });
        setStatsError(null);
      } catch (error: any) {
        console.error('Failed to fetch staking stats:', error);
        setStatsError(error.message || 'Failed to fetch staking information');
      }
    };

    fetchStakingInfo();
  }, []);

  const handleStakeChange = (e: Event) => {
    const input = (e.target as HTMLInputElement).value;
    setStakeAmount(input);
    if (input === '' || input === '0') {
      setExpectedReward('');
    } else {
      setExpectedReward(calculateRewardFromStake(input));
    }
  };

  const handleRewardChange = (e: Event) => {
    const input = (e.target as HTMLInputElement).value;
    setExpectedReward(input);
    if (input === '' || input === '0') {
      setStakeAmount('');
    } else {
      setStakeAmount(calculateStakeFromReward(input));
    }
  };

  const handleMaxClick = () => {
    setStakeAmount(ethBalance);
    setExpectedReward(calculateRewardFromStake(ethBalance));
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatsError(null); // Clear any previous errors
    try {
      const result = await stakeEth(stakeAmount);
      if (result instanceof Error) {
        throw result;
      }
      
      // Clear inputs on success
      setStakeAmount('');
      setExpectedReward('');
    } catch (error: any) {
      console.error('Staking failed:', error);
      setStatsError(error.message || 'Failed to stake ETH');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="staking-background">
        <div className="staking-background-effect"></div>
      </div>
      <div className="staking-modern-outer">
        <div className="staking-modern-card">
          <div className="staking-modern-header">
            <h2 className="staking-modern-title">Stake</h2>
          </div>
          <form onSubmit={handleSubmit} className="staking-modern-form">
            <div className="staking-modern-row staking-modern-row-top">
              <div className="staking-modern-labels">
                <span className="staking-modern-label">Stake</span>
                <span className="staking-modern-available">{ethBalance} ETH Available</span>
              </div>
              <div className="staking-modern-input-group">
                <input
                  type="number"
                  className="staking-modern-input"
                  value={stakeAmount}
                  onChange={handleStakeChange}
   
                  min="0"
                  step="0.01"
                  required
                />
                <div className="staking-modern-token">
                  <img src="/assets/img/eth-logo.svg" alt="ETH" className="staking-modern-token-icon" />
                  <span className="staking-modern-token-symbol">ETH</span>
                </div>
                <button
                  type="button"
                  className="staking-modern-max"
                  onClick={handleMaxClick}
                >
                  MAX
                </button>
              </div>
            </div>

            <div className="staking-modern-row staking-modern-row-receive">
              <span className="staking-modern-label">Receive</span>
              <div className="staking-modern-input-group staking-modern-receive-group">
                <input
                  type="number"
                  className="staking-modern-input staking-modern-receive-amount"
                  value={expectedReward}
                  onChange={handleRewardChange}
                  onFocus={(e) => (e.target as HTMLInputElement).select()}
                  min="0"
                  step="0.01"
                  style={{ cursor: 'text', pointerEvents: 'auto' }}
                />
                <div className="staking-modern-token">
                  <img src="/assets/img/rsweth-logo.svg" alt="rswETH" className="staking-modern-token-icon" />
                  <span className="staking-modern-token-symbol">rswETH</span>
                </div>
              </div>
            </div>

            {statsError && (
              <div className="staking-modern-error">
                <i className="fi-sr-exclamation-circle"></i>
                <span>{statsError}</span>
              </div>
            )}

            <div className="staking-modern-info">
              <div className="staking-modern-info-row">
                <span className="staking-modern-info-label">rswETH APR</span>
                <span className="staking-modern-info-value">{stakingStats.APR}%</span>
              </div>
              <div className="staking-modern-info-row">
                <span className="staking-modern-info-label">Exchange rate</span>
                <span className="staking-modern-info-value">1 rswETH = {stakingStats.EXCHANGE_RATE} ETH</span>
              </div>
              <div className="staking-modern-info-row">
                <span className="staking-modern-info-label">Transaction fee</span>
                <span className="staking-modern-info-value">{TX_FEE}</span>
              </div>
            </div>

            <button
              type="submit"
              className="staking-modern-submit"
              disabled={isSubmitting || !stakeAmount}
            >
              {isSubmitting ? 'Staking...' : 'Stake ETH'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Staking;
