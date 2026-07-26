import React, { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaGraduationCap, FaUniversity, FaCalendarAlt, FaAward } from 'react-icons/fa';
import AOS from 'aos';
import 'aos/dist/aos.css';

function Education() {
  useEffect(() => {
    AOS.init({ once: true, duration: 800 });
  }, []);

  const educationData = [
    {
      course: 'B.E CSE',
      year: '2025',
      institution: 'Thiagarajar College of Engineering, Madurai',
      board: 'Anna University, Chennai',
      score: '7.19 CGPA',
    },
    {
      course: 'Diploma',
      year: '2022',
      institution: 'Muthayammal Polytechnic Institution, Namakkal (Dt)',
      board: 'DOTE',
      score: '95%',
    },
    {
      course: 'X',
      year: '2017',
      institution: 'Rasi International School, Rasipuram, Namakkal (Dt)',
      board: 'CBSE',
      score: '8.0 CGPA',
    },
  ];

  return (
    <section id="education" className="py-5 bg-light text-dark">
      <div className="container">
        {/* Heading */}
        <div className="text-center mb-5" data-aos="fade-down">
          <h2 className="fw-bold text-black display-5 d-inline-flex align-items-center gap-2">
            <FaGraduationCap className="text-danger" />
            Education
          </h2>
          <p className="text-muted fs-6">A timeline of my academic journey.</p>
        </div>

        {/* Education Cards */}
        <div className="row g-4">
          {educationData.map((edu, index) => (
            <div
              key={index}
              className="col-12"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="w-100 w-md-75 mx-auto d-flex bg-white border border-1 border-danger-subtle p-4 rounded-4 shadow-sm">
                {/* Left Side */}
                <div className="me-4 text-center">
                  <div className="fw-semibold mb-1 fs-5">{edu.course}</div>
                  <div className="text-danger fs-6">
                    <FaCalendarAlt className="me-2" />
                    {edu.year}
                  </div>
                </div>

                {/* Divider */}
                <div className="vr bg-danger mx-4"></div>

                {/* Right Side */}
                <div className="fs-6">
                  <p className="mb-1">
                    <FaUniversity className="me-2 text-danger" />
                    {edu.institution}
                  </p>
                  <p className="mb-1 text-muted">Board: {edu.board}</p>
                  <p className="mb-0 text-danger fw-semibold">
                    <FaAward className="me-2" />
                    {edu.score}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Education;
