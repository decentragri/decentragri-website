import React from 'react'
import './Banner.css'

const Banner = () => {
  return (
      <>
           <div 
             className="banner-bg"
             style={{ 
               backgroundImage: 'url(/assets/img/banner/dashboard_banner.jpg)',
               backgroundSize: 'cover',
               backgroundPosition: 'center',
               backgroundRepeat: 'no-repeat',
               position: 'relative',
               zIndex: 1,
               minHeight: '500px'
             }}
           >
          
            <div 
              className="banner-area"
              style={{
                position: 'relative',
                zIndex: 2
              }}
            >
              <div className="container">
                <div className="row">
                  <div className="col-lg-6 col-md-8">
                    <div 
                      className="banner-content"
                      style={{
                        position: 'relative',
                        zIndex: 2
                      }}
                    >
                      <h2 
                        className="title"
                        style={{
                          color: '#ffffff',
                          textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)'
                        }}
                      >
                        Decentragri is transforming<br /> <span style={{ color: '#6DBE45' }}>agri-finance</span>
                      </h2>
                      <p
                        style={{
                          color: '#ffffff',
                          textShadow: '0 1px 3px rgba(0, 0, 0, 0.3)'
                        }}
                      >
                        Empowering agriculture, verifying sustainable practices, and unlocking global market access through AI + Machine Learning + Decentralized Technology.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* top-seller-area */}

            {/* top-seller-area-end */}
          </div>
      </>
  )
}

export default Banner