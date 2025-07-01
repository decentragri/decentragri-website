import { useState, useEffect } from 'preact/hooks';
import { Link } from 'wouter';
import './FieldCarousel.css';

const FieldCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    {
      id: 1,
      image: '/assets/img/banner/carousel_pics.jpg',
      title: 'Sustainable Rice Farming',
      description: 'Hardworking farmers carefully plant rice seedlings in lush, water-filled paddies, showcasing the traditional methods that sustain communities and feed nations. Their dedication reflects the heart of agriculture—where patience and perseverance yield abundant harvests.'
    },
    {
      id: 2,
      image: '/assets/img/banner/carousel_pics2.jpg',
      title: 'Rice Seedbed Preparation',
      description: 'Nurturing the next generation of rice plants in carefully prepared seedbeds. These young seedlings will soon be transplanted to the fields, continuing the cycle of sustainable rice cultivation.'
    }
  ];

  // Auto-advance slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className="field-carousel-section">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-12">
            <div className="section-header">
              <h2 className="section-title">
                <span>Our</span>
                <span className="text-accent">Fields</span>
              </h2>
              <p className="section-subtitle">
                Explore our sustainable farming practices and beautiful landscapes
              </p>
            </div>
          </div>
        </div>
        
        <div className="field-carousel-container">
          <div className="field-carousel">
            {slides.map((slide, index) => (
              <div 
                key={slide.id}
                className={`field-slide ${index === currentSlide ? 'active' : ''}`}
                style={{ backgroundImage: `url(${slide.image})` }}
              >
                <div className="slide-overlay">
                  <div className="slide-content">
                    <h3>{slide.title}</h3>
                    <p>{slide.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <button className="carousel-control prev" onClick={prevSlide} aria-label="Previous slide">
            <i className="fas fa-chevron-left"></i>
          </button>
          <button className="carousel-control next" onClick={nextSlide} aria-label="Next slide">
            <i className="fas fa-chevron-right"></i>
          </button>
          
          <div className="carousel-indicators">
            {slides.map((_, index) => (
              <button
                key={index}
                className={`indicator ${index === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
        
        <div className="text-center mt-5">
          {/* <Link href="/about" className="btn btn-primary">Learn More About Our Farms</Link> */}
        </div>
      </div>
    </section>
  );
};

export default FieldCarousel;
