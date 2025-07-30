import React from 'react';
import './TreeNFTs.css';
import { FaTree, FaMapMarkerAlt, FaSeedling, FaCoins, FaChartLine } from 'react-icons/fa';

const TreeNFTs = () => {
  const crops = [
    {
      name: "Pili Nuts",
      market: "$180M in 2023",
      projection: "$320M by 2033",
      cagr: "7% CAGR",
      description: "High-value export commodity with growing global demand",
      image: "/assets/img/placeholder-tree-1.svg"
    },
    {
      name: "Cacao",
      market: "$13.5B in 2023",
      projection: "$23.5B by 2030",
      cagr: "8% CAGR",
      description: "Premium crop with strong export potential",
      image: "/assets/img/placeholder-tree-2.svg"
    },
    {
      name: "Coffee",
      market: "$245B in 2024",
      projection: "$381B by 2034",
      cagr: "4.5% CAGR",
      description: "Global commodity with stable demand growth",
      image: "/assets/img/placeholder-tree-3.svg"
    }
  ];

  const nftFeatures = [
    {
      icon: <FaMapMarkerAlt />,
      title: "GPS Coordinates",
      description: "Precise location tracking for each tree"
    },
    {
      icon: <FaSeedling />,
      title: "Farmer ID",
      description: "Verified farmer ownership and management"
    },
    {
      icon: <FaTree />,
      title: "Soil Data",
      description: "Sensor hash and environmental conditions"
    },
    {
      icon: <FaChartLine />,
      title: "Growth Tracking",
      description: "Planting and last-audit date records"
    }
  ];

  return (
    <div className="tree-nfts-page">
      {/* Hero Section */}
      <section className="tree-nfts-hero">
        <div className="tree-nfts-hero-background">
          <div className="tree-nfts-floating-element element-1"></div>
          <div className="tree-nfts-floating-element element-2"></div>
          <div className="tree-nfts-floating-element element-3"></div>
        </div>
        <div className="tree-nfts-container">
          <div className="tree-nfts-hero-content">
            <div className="tree-nfts-badge">
              <FaTree />
              TREE NFTs (ERC-1155)
            </div>
            <h1 className="tree-nfts-title">
              Unique Digital Assets for <span className="tree-nfts-gradient">Agricultural Trees</span>
            </h1>
            <p className="tree-nfts-subtitle">
              Each verified tree is minted as a unique NFT with immutable ownership records, 
              transparent history, and comprehensive metadata tracking.
            </p>
          </div>
        </div>
      </section>

      {/* Why These Crops Section */}
      <section className="tree-nfts-crops-section">
        <div className="tree-nfts-container">
          <div className="tree-nfts-section-header">
            <h2 className="tree-nfts-section-title">Why These Crops?</h2>
            <p className="tree-nfts-section-subtitle">
              We're starting with pili nuts, cacao, and coffee for three strategic reasons:
            </p>
          </div>
          
          <div className="tree-nfts-reasons">
            <div className="tree-nfts-reason-card">
              <div className="tree-nfts-reason-number">01</div>
              <h3>Premium Global Markets</h3>
              <p>We've chosen crops that the world loves and pays premium prices for. These aren't just local products, they're sought after commodities with thriving international markets.</p>
            </div>
            <div className="tree-nfts-reason-card">
              <div className="tree-nfts-reason-number">02</div>
              <h3>Building Climate Resilience</h3>
              <p>These crops grow in regions facing climate challenges. By creating decentralized, tech-enabled farming networks, we're helping communities build stronger, more sustainable agriculture.</p>
            </div>
            <div className="tree-nfts-reason-card">
              <div className="tree-nfts-reason-number">03</div>
              <h3>Perfect for Digital Innovation</h3>
              <p>The natural growing and harvesting rhythms of these crops align beautifully with blockchain technology, making seasonal tokenization practical.</p>
            </div>
          </div>

          <div className="tree-nfts-crops-grid">
            {crops.map((crop, index) => (
              <div className="tree-nfts-crop-card" key={index}>
                <div className="tree-nfts-crop-image">
                  <img src={crop.image} alt={crop.name} />
                  <div className="tree-nfts-crop-overlay"></div>
                </div>
                <div className="tree-nfts-crop-content">
                  <h3 className="tree-nfts-crop-name">{crop.name}</h3>
                  <p className="tree-nfts-crop-description">{crop.description}</p>
                  <div className="tree-nfts-crop-stats">
                    <div className="tree-nfts-crop-stat">
                      <span className="tree-nfts-stat-label">Current Market</span>
                      <span className="tree-nfts-stat-value">{crop.market}</span>
                    </div>
                    <div className="tree-nfts-crop-stat">
                      <span className="tree-nfts-stat-label">Projection</span>
                      <span className="tree-nfts-stat-value">{crop.projection}</span>
                    </div>
                    <div className="tree-nfts-crop-stat">
                      <span className="tree-nfts-stat-label">Growth Rate</span>
                      <span className="tree-nfts-stat-value gradient-text">{crop.cagr}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How Tokenization Works */}
      <section className="tree-nfts-tokenization-section">
        <div className="tree-nfts-container">
          <div className="tree-nfts-section-header">
            <h2 className="tree-nfts-section-title">How Tokenization Works</h2>
            <p className="tree-nfts-section-subtitle">
              We use two types of on-chain tokens to represent agricultural assets
            </p>
          </div>

          <div className="tree-nfts-tokenization-grid">
            <div className="tree-nfts-token-card tree-nft-card">
              <div className="tree-nfts-token-header">
                <div className="tree-nfts-token-icon">
                  <FaTree />
                </div>
                <div className="tree-nfts-token-badge">ERC-1155</div>
              </div>
              <h3 className="tree-nfts-token-title">Tree NFTs</h3>
              <p className="tree-nfts-token-description">
                Each verified tree (pili, cacao, coffee) is minted as a unique NFT with comprehensive metadata
              </p>
              <div className="tree-nfts-metadata-grid">
                {nftFeatures.map((feature, index) => (
                  <div className="tree-nfts-metadata-item" key={index}>
                    <div className="tree-nfts-metadata-icon">{feature.icon}</div>
                    <div className="tree-nfts-metadata-content">
                      <h4>{feature.title}</h4>
                      <p>{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="tree-nfts-token-card yield-token-card">
              <div className="tree-nfts-token-header">
                <div className="tree-nfts-token-icon">
                  <FaCoins />
                </div>
                <div className="tree-nfts-token-badge">ERC-20</div>
              </div>
              <h3 className="tree-nfts-token-title">Yield Tokens</h3>
              <p className="tree-nfts-token-description">
                After each harvest, farmers receive yield tokens representing the quantity produced
              </p>
              <div className="tree-nfts-yield-examples">
                {/* <div className="tree-nfts-yield-example">
                  <div className="tree-nfts-yield-ratio">1:1</div>
                  <div className="tree-nfts-yield-text">
                    <strong>1 Yield Token</strong> = <strong>1 kg</strong> of dried pili nut or cacao beans
                  </div>
                </div> */}
                <div className="tree-nfts-yield-actions">
                  <div className="tree-nfts-yield-action">
                    <span className="tree-nfts-action-icon">🔄</span>
                    <span>Redeem harvest yield</span>
                  </div>
                  <div className="tree-nfts-yield-action">
                    <span className="tree-nfts-action-icon">💱</span>
                    <span>Sell on DEX platforms</span>
                  </div>
                  <div className="tree-nfts-yield-action">
                    <span className="tree-nfts-action-icon">📅</span>
                    <span>Roll over to next cycle</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Market Statistics */}
      <section className="tree-nfts-market-section">
        <div className="tree-nfts-container">
          <div className="tree-nfts-market-content">
            <h2 className="tree-nfts-market-title">Real World Asset Tokenization Market</h2>
            <div className="tree-nfts-market-stats">
              <div className="tree-nfts-market-stat">
                <div className="tree-nfts-market-number">$0.66B</div>
                <div className="tree-nfts-market-label">Market Size 2024</div>
              </div>
              <div className="tree-nfts-market-arrow">→</div>
              <div className="tree-nfts-market-stat">
                <div className="tree-nfts-market-number gradient-text">$1.67B</div>
                <div className="tree-nfts-market-label">Projected 2032</div>
              </div>
              <div className="tree-nfts-market-growth">
                <div className="tree-nfts-growth-badge">12.9% CAGR</div>
              </div>
            </div>
            <p className="tree-nfts-market-source">Source: Dataintelo Research</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TreeNFTs;
