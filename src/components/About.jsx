import React from "react";
import "../styles/About.css";
import FadeInSection from "./FadeInSection";
import profileImage from "../assets/profile.png";

const About = () => {
  const one = (
    <p>
      I am currently a <b>Software Development Engineer</b> at{" "}
      <a href="#experience"> Cloudontech</a>, where I build Gruhini Foods, a
      production food-ordering app with role-based access, Supabase backend, and
      Razorpay payment integration. I also completed a Software Engineering
      virtual internship at{" "}
      <a href="https://www.skyscanner.net/" target="_blank" rel="noreferrer">
        {" "}
        Skyscanner
      </a>
      .
    </p>
  );
  const two = (
    <p>
      My background is in Computer Science with a specialization in AI & ML,
      giving me strong fundamentals in OOP, DBMS, debugging, and software
      design &mdash; well suited to evaluating and improving code beyond just
      writing it.
    </p>
  );

  const techStack = [
    "Java",
    "Flutter / Dart",
    "TypeScript",
    "React.js",
    "Supabase / PostgreSQL",
    "Razorpay",
  ];

  return (
    <div id="about">
      <FadeInSection>
        <div className="section-header">
          <span className="section-title">/ about me</span>
        </div>
        <div className="about-content">
          <div className="about-description">
            {one}
            {"Here are some technologies I have been working with:"}
            <ul className="tech-stack">
              {techStack.map((techItem, i) => (
                <FadeInSection key={i} delay={(i + 1) * 100 + "ms"}>
                  <li>{techItem}</li>
                </FadeInSection>
              ))}
            </ul>
            {two}
          </div>
          <div className="about-image">
            <img className="about-photo" src={profileImage} alt="Yadla Sunny" />
          </div>
        </div>
      </FadeInSection>
    </div>
  );
};

export default About;
