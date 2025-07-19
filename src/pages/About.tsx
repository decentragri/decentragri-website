import { useState, useEffect } from 'react';
import Header from '../Components/Header/Header';
import Footer from '../Components/Footer/Footer';
import SideBar from '../Components/IndexOne/SideBar';
import { useThemeStore } from '../context/ThemeContext';
import './About.css';
import './AboutCardOverrides.css';
import { FaTwitter, FaLinkedin, FaLeaf, FaFacebook, FaGithub } from 'react-icons/fa';
import { MdOutlineScience, MdOutlineConnectWithoutContact } from 'react-icons/md';
import { GiFarmer } from 'react-icons/gi';
import { BsGraphUp } from 'react-icons/bs';
import CallToAction from '../Components/Common/CallToAction';

// Team member data
const teamMembers = [

  {
    name: 'Yehna Lee',
    role: 'Chief Executive Officer',
    image: '/assets/img/team/dahl_full.png',
    bio: 'Visionary leader with a passion for agricultural innovation and sustainable farming solutions.',
    twitter: 'https://x.com/alviedahl',
    linkedin: 'https://www.linkedin.com/in/yehna-lee-0b539b26a/'
  },
  {
    name: 'Khyle De Jesus-Santos',
    role: 'Chief Product Officer, Biotechnology Researcher',
    image: '/assets/img/team/khyle_full.png',
    bio: 'Expert in sustainable farming practices and crop optimization techniques.',
    linkedin: 'https://www.linkedin.com/in/khyle-de-jesus-10444a197/'
  },
  {
    name: 'Anthony Arriola',
    role: 'Chief Technology Officer',
    image: '/assets/img/team/anthony_full.png',
    bio: 'Technology expert specializing in agricultural data systems and IoT solutions.',
    github: 'https://github.com/YirenNing24',
    twitter: 'https://x.com/ryujiminssi'
  },
  {
    name: 'Joshua Demate',
    role: 'Regional Director, Camarines Sur',
    image: '/assets/img/team/myng_full.png',
    bio: 'Works directly with farmers to implement and optimize our solutions in the field.',
    facebook: 'https://www.facebook.com/joshua.demate.3'
  },
  {
    name: 'Carmela De Guzman ',
    role: 'Regional Director, Bulacan',
    image: '/assets/img/team/mela.jpg',
    bio: 'Creates intuitive interfaces that make complex agricultural data accessible to everyone.',
    linkedin: 'https://x.com/ryujiminssi'
  },


];

// Core values data
const coreValues = [
  {
    icon: (
      <div style={{ marginBottom: '0.29rem' }}>
        <FaLeaf size={32} color="#6DBE45" />
      </div>
    ),
    title: 'Sustainability',
    description: 'We develop solutions that respect and preserve our environment for future generations.'
  },
  {
    icon: (
      <div style={{ marginBottom: '0.29rem' }}>
        <MdOutlineScience size={40} color="#6DBE45" />
      </div>
    ),
    title: 'Innovation',
    description: 'We constantly push the boundaries of what\'s possible in agricultural technology.'
  },
  {
    icon: (
      <div style={{ marginBottom: '0.29rem' }}>
        <GiFarmer size={39} color="#6DBE45" />
      </div>
    ),
    title: 'Farmer First',
    description: 'Our solutions are designed with real farmers\' needs at the forefront.'
  },
  {
    icon: (
      <div style={{ marginBottom: '0.29rem' }}>
        <BsGraphUp size={32} color="#6DBE45" />
      </div>
    ),
    title: 'Data-Driven',
    description: 'We make decisions based on data and measurable outcomes.'
  },
  {
    icon: (
      <div style={{ marginBottom: '0.3rem' }}>
        <MdOutlineConnectWithoutContact size={36} color="#6DBE45" />
      </div>
    ),
    title: 'Community',
    description: 'We believe in building strong connections between farmers, technologists, and consumers.'
  }
];

export default function About() {
  const { isDarkMode } = useThemeStore();

  return (
    <div className={`about-page ${isDarkMode ? 'dark-mode' : ''}`}>
      <SideBar />
      <div className="main-content">
        <Header />
        
        {/* Hero Section */}
        <section className="about-hero">
          <div className="container">
            <div className="hero-content">
              <h1 
                className="title"
                style={{
                color: '#ffffff',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)'
                }}
              >
                Transforming Agriculture<br /> <span style={{ color: '#6DBE45' }}>through technology</span>
              </h1>
              
              <p className="hero-subtitle">
                Empowering farmers with innovative solutions for sustainable and efficient farming
              </p>

            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="mission-section">
          <div className="container">
            <div className="section-header">
            <h2 className="section-title">
            <span>Our</span>
            <span className="text-accent">Mission</span>
          </h2>
              <p>To make the daily lives of farmers easier and more efficient through the power of technology</p>
            </div>
            <div className="mission-content">
              <div className="mission-text">
                <p>
                  At DecentrAgri, we believe that innovation and nature are not opposing forces, but partners. 
                  Our commitment is to develop technologies that not only simplify and enhance everyday agricultural 
                  work but also actively contribute to preserving our environment.
                </p>
                <p>
                  We envision a future where humanity's ingenuity and the Earth's resilience coexist in harmony, 
                  enriching lives today and securing a better tomorrow for generations to come.
                </p>
              </div>
              <div className="mission-image">
                <img 
                  src="/assets/img/banner/carousel_pics.jpg" 
                  alt="Sustainable farming" 
                />
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="values-section">
          <div className="container">
            <div className="section-header">
            <h2 className="section-title">
            <span>Our</span>
            <span className="text-accent">Core Values</span>
          </h2>
              <p>Guiding principles that drive our work and culture</p>
            </div>
            <div className="values-grid">
              {coreValues.map((value, index) => (
                <div key={index} className="value-card">
                  <div className="value-icon-container">
                    {value.icon}
                  </div>
                  <h3>{value.title}</h3>
                  <p>{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="team-section">
          <div className="container">
            <div className="section-header">
            <h2 className="section-title">
            <span>Meet</span>
            <span className="text-accent">Our Founders</span>
          </h2>
              <p>The passionate individuals driving our mission forward</p>
            </div>
            <div className="team-grid">
              {teamMembers.map((member, index) => (
                <div key={index} className="team-card">
                  <div className="team-card-inner">
                    <div className="team-image">
                      <img 
                        src={member.image} 
                        alt={member.name} 
                        data-member={member.name.replace(/\s+/g, '-').toLowerCase()}
                      />
                    </div>
                    <div className="team-info">
                      <h3>{member.name}</h3>
                      <p className="team-role">{member.role}</p>
                      <div className="team-social">
                        {member.twitter && (
                          <a href={member.twitter} target="_blank" rel="noopener noreferrer" aria-label={`${member.name}'s Twitter`}>
                            <div style={{ display: 'inline-flex', margin: '0 5px' }}>
                              <FaTwitter size={20} color={isDarkMode ? '#fff' : '#333'} />
                            </div>
                          </a>
                        )}
                        {member.linkedin && (
                          <a href={member.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`${member.name}'s LinkedIn`}>
                            <div style={{ display: 'inline-flex', margin: '0 5px' }}>
                              <FaLinkedin size={20} color={isDarkMode ? '#fff' : '#333'} />
                            </div>
                          </a>
                        )}
                        {member.facebook && (
                          <a href={member.facebook} target="_blank" rel="noopener noreferrer" aria-label={`${member.name}'s Facebook`}>
                            <div style={{ display: 'inline-flex', margin: '0 5px' }}>
                              <FaFacebook size={20} color={isDarkMode ? '#fff' : '#333'} />
                            </div>
                          </a>
                        )}
                        {member.github && (
                          <a href={member.github} target="_blank" rel="noopener noreferrer" aria-label={`${member.name}'s GitHub`}>
                            <div style={{ display: 'inline-flex', margin: '0 5px' }}>
                              <FaGithub size={20} color={isDarkMode ? '#fff' : '#333'} />
                            </div>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Founder's Message */}
        <section className="founder-section">
          <div className="container">
            <div className="founder-card">
              <div className="founder-image">
                <img 
                  src="/assets/img/logo/decentra_logo2.png" 
                  alt="DecentrAgri" 
                />
              </div>
              <div className="founder-message">
                <h2>A Message from Our Team</h2>
                <blockquote>
                  "At DecentrAgri, we're not just building technology—we're building a movement. 
                  A movement towards sustainable agriculture, empowered farmers, and a healthier planet. 
                  Every line of code we write, every feature we develop, and every farmer we help is a step 
                  closer to the future we envision."
                </blockquote>
                <div className="founder-signature">
                  <p className="founder-name">Founding team</p>
                  <p className="founder-title">DecentrAgri</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <CallToAction 
          title="Ready to Transform Your Farming Experience?"
          subtitle="Join hundreds of farmers already benefiting from our innovative solutions"
          primaryButtonText="Get in Touch"
          primaryButtonLink="/contact"
        />

        <Footer />
      </div>
    </div>
  );
}
