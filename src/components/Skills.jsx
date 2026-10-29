import React from "react";
import "../styles/Skills.css";
import FadeInSection from "./FadeInSection";

const skillGroups = [
  { group: "Languages", items: ["Java", "Dart", "TypeScript", "JavaScript"] },
  { group: "Mobile & Web", items: ["Flutter (Material 3)", "Provider", "React", "HTML", "CSS"] },
  { group: "Backend & APIs", items: ["JDBC", "REST APIs", "Supabase", "Razorpay"] },
  { group: "Databases", items: ["MySQL", "PostgreSQL (via Supabase)", "Row-Level Security (RLS)"] },
  { group: "Tools & Platforms", items: ["Git", "VS Code", "Supabase Dashboard", "SQL Migrations"] },
  { group: "Core Concepts", items: ["OOP", "DBMS", "SDLC", "Debugging", "Exception Handling", "Auth & Security (bcrypt)"] },
];

const Skills = () => {
  return (
    <div id="skills">
      <FadeInSection>
        <div className="section-header">
          <span className="section-title">/ skills</span>
        </div>
        <div className="skills-grid">
          {skillGroups.map((g, i) => (
            <FadeInSection key={g.group} delay={(i + 1) * 80 + "ms"}>
              <div className="skills-card">
                <h3>{g.group}</h3>
                <ul>
                  {g.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </FadeInSection>
          ))}
        </div>
      </FadeInSection>
    </div>
  );
};

export default Skills;
