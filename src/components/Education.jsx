import React from "react";
import "../styles/Education.css";
import FadeInSection from "./FadeInSection";

const education = [
  {
    school: "Avanthi Institute of Engineering and Technology",
    degree: "B.Tech in Computer Science & Engineering (AI & ML) — Lateral Entry",
    period: "Oct 2022 – Jun 2025",
    note: "Focused on algorithms, data structures, and applied AI/ML coursework.",
  },
  {
    school: "Teegala Krishna Reddy Engineering College",
    degree: "Diploma in Electronics & Communication Engineering",
    period: "Jun 2019 – Jun 2022",
    note: "Completed diploma coursework with practical labs in embedded systems and signals.",
  },
  {
    school: "SR Digi School",
    degree: "Secondary School Certificate",
    period: "Jun 2013 – Jun 2019",
    note: "Completed secondary education with emphasis on math and science.",
  },
];

const certifications = [
  { title: "Skyscanner Software Engineering Job Simulation", issuer: "Forage · 2026" },
  { title: "Java Programming", issuer: "Great Learning" },
  { title: "SQL (Intermediate)", issuer: "HackerRank" },
];

const Education = () => {
  return (
    <div id="education">
      <FadeInSection>
        <div className="section-header">
          <span className="section-title">/ education</span>
        </div>
        <ul className="education-timeline">
          {education.map((e, i) => (
            <FadeInSection key={e.school} delay={(i + 1) * 100 + "ms"}>
              <li className="education-item">
                <div className="education-school">{e.school}</div>
                <div className="education-degree">{e.degree}</div>
                <div className="education-period">{e.period}</div>
                <div className="education-note">{e.note}</div>
              </li>
            </FadeInSection>
          ))}
        </ul>

        <div className="certs-title">/ certifications</div>
        <div className="certs-grid">
          {certifications.map((c) => (
            <div className="cert-card" key={c.title}>
              <h4>{c.title}</h4>
              <p>{c.issuer}</p>
            </div>
          ))}
        </div>
      </FadeInSection>
    </div>
  );
};

export default Education;
