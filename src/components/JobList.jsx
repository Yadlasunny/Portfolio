import React, { useState } from "react";
import FadeInSection from "./FadeInSection";

const experienceItems = {
  Cloudontech: {
    jobTitle: "Software Development Engineer (SDE) @",
    duration: "JUN 2025 - PRESENT",
    desc: [
      "Built Gruhini Foods, a cross-platform Flutter application (Android, iOS, Web, Windows, Linux) for a homemade snacks/sweets/pickles business, supporting three distinct roles: customer, shop owner, and head admin.",
      "Designed and implemented the Supabase (PostgreSQL) backend, including schema migrations for products, customers, orders, shop owners, and admins, with Row-Level Security (RLS) policies scoping data access per role.",
      "Integrated Razorpay payment checkout across mobile, web, and Windows platforms, alongside a UPI-based payment flow with screenshot verification and a 6-state order status lifecycle.",
      "Led a security-hardening pass on authentication: replaced insecure default/fallback credentials with bcrypt-based password hashing and dedicated RPC functions for admin and shop-owner login.",
      "Built responsive, brand-consistent UI (Material 3, custom maroon theme) using Provider for state management across mobile and desktop targets.",
      "Wrote setup scripts and documentation, including a seed script for demo data and a migration runbook, to make the project easy for teammates to onboard onto and deploy.",
    ],
  },
  Skyscanner: {
    jobTitle: "Software Engineering Virtual Intern @",
    duration: "FEB 2026 (via Forage)",
    desc: [
      "Completed a multi-module software engineering job simulation covering backend, frontend, and mobile development workflows.",
      "Built and tested two functional applications (web and Android) following real-world engineering workflows.",
      "Developed a Java Dropwizard microservice with multiple REST endpoints for car rental and hotel services.",
      "Created an Android application to display dynamic flight itinerary data.",
      "Gained hands-on exposure to microservices architecture and collaborative development practices.",
    ],
  },
};

const JobList = () => {
  const keys = Object.keys(experienceItems);
  const [active, setActive] = useState(0);
  const key = keys[active];
  const item = experienceItems[key];

  return (
    <div className="joblist-wrap">
      <div className="joblist-tabs" role="tablist">
        {keys.map((k, i) => (
          <button
            key={k}
            role="tab"
            aria-selected={active === i}
            className={`joblist-tab${active === i ? " active" : ""}`}
            onClick={() => setActive(i)}
          >
            {k}
          </button>
        ))}
      </div>
      <div className="joblist-panel" role="tabpanel">
        <span className="joblist-job-title">{item.jobTitle + " "}</span>
        <span className="joblist-job-company">{key}</span>
        <div className="joblist-duration">{item.duration}</div>
        <ul className="job-description">
          {item.desc.map((descItem, i) => (
            <FadeInSection key={i} delay={(i + 1) * 100 + "ms"}>
              <li>{descItem}</li>
            </FadeInSection>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default JobList;
