import React, { useEffect, useState } from 'react';
import {
  BoxSeam,
  Palette,
  DatabaseCheck,
  ShieldLockFill,
  CpuFill,
  PcDisplay,
} from 'react-bootstrap-icons';
import AOS from 'aos';
import 'aos/dist/aos.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'animate.css';

function Services() {
  useEffect(() => {
    AOS.init({ once: true });
  }, []);

  const ServiceCard = ({ icon, title, description, delay }) => {
    const [isHovered, setIsHovered] = useState(false);

    const cardStyle = {
      backgroundColor: isHovered ? '#e2e6ea' : '#ffffff',
      transition: 'all 0.3s ease',
      boxShadow: isHovered
        ? '0 10px 20px rgba(0,0,0,0.1)'
        : '0 .5rem 1rem rgba(0,0,0,.05)',
      cursor: 'pointer',
    };

    return (
      <div
        className="col-md-4"
        data-aos="fade-up"
        data-aos-delay={delay}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className="card border-0 rounded-4 h-100 text-center p-4"
          style={cardStyle}
        >
          <div className="mb-3 animate__animated animate__pulse animate__infinite">
            {icon}
          </div>
          <h5 className="fw-bold mb-2">{title}</h5>
          <p className="text-muted mb-0">{description}</p>
        </div>
      </div>
    );
  };

  return (
    <section
      id="services"
      className="py-5"
      style={{ backgroundColor: '#f0f2f5' }}
    >
      <div className="container">
        {/* Section Heading */}
        <div className="text-center mb-5" data-aos="fade-down">
          <h2 className="fw-bold display-6 d-inline-flex align-items-center gap-2 text-dark">
            <BoxSeam className="text-primary" size={32} />
            Expertise Service! Let’s check it out
          </h2>
          <p className="text-muted fs-6">
            I offer professional development services across the full MERN stack.
          </p>
        </div>

        {/* Service Cards */}
        <div className="row g-4">
          <ServiceCard
            icon={<PcDisplay size={64} className="text-primary" />}
            title="Frontend Development"
            description="Interactive and responsive UI with React.js, Bootstrap and modern web standards."
            delay={100}
          />
          <ServiceCard
            icon={<CpuFill size={64} className="text-primary" />}
            title="Backend Development"
            description="Robust and scalable APIs with Node.js, Express, and MongoDB."
            delay={200}
          />
          <ServiceCard
            icon={<ShieldLockFill size={64} className="text-primary" />}
            title="Security Implementation"
            description="Secure auth systems using JWT, OTP, access control and data protection."
            delay={300}
          />
        </div>
      </div>
    </section>
  );
}

export default Services;
