import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function Home() {
  return (
    <section
      id="home"
      className="py-5 bg-light text-center d-flex align-items-center"
      style={{ minHeight: '100vh' }}
    >
      <div className="container">
        <h1 className="display-4 fw-bold mb-3">
          Hi, I’m{' '}
          <span
            style={{
              background: 'linear-gradient(to right, #dc3545, #ff6b6b)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              color: 'transparent',
              display: 'inline-block',
              fontSize:'9px'
            }}
          >
            SREENIWASAN G J
          </span>
        </h1>

        <p className="fs-5 text-muted mb-4">
          MERN Stack Developer | Passionate about Secure and Scalable Web Solutions
        </p>

        <a
          href="/SREENIWASAN.pdf"
          className="btn btn-outline-danger px-4 py-2 fw-semibold rounded-3"
          target="_blank"
          rel="noopener noreferrer"
        >
          📄 View Resume
        </a>
      </div>
    </section>
  );
}

export default Home;
