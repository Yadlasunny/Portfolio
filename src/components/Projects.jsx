import React from "react";
import "../styles/Projects.css";
import { HiOutlineFolderOpen } from "react-icons/hi";
import FadeInSection from "./FadeInSection";
import ExternalLinks from "./ExternalLinks";

const projects = {
  "Employee Management System": {
    desc: "A CRUD-based Employee Management System using Java and MySQL, applying OOP principles and optimized SQL queries to reliably manage 100+ employee records.",
    techStack: "Java, JDBC, MySQL, HTML, CSS",
    link: "https://github.com/yadlasunny",
  },
  "To-Do List Application": {
    desc: "A responsive single-page To-Do List app built with React and TypeScript, using Hooks for state management and local storage for CRUD persistence.",
    techStack: "React, TypeScript, HTML, CSS",
    link: "https://github.com/Yadlasunny/To-do-List-App/tree/main/src",
  },
};

const Projects = () => {
  return (
    <div id="projects">
      <div className="section-header">
        <span className="section-title">/ projects</span>
        <a
          href="https://github.com/yadlasunny"
          className="explore-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          View all projects
        </a>
      </div>

      <div className="project-container">
        <ul className="projects-grid">
          {Object.keys(projects).map((key, i) => (
            <FadeInSection key={i} delay={(i + 1) * 100 + "ms"}>
              <li className="projects-card">
                <div className="card-header">
                  <div className="folder-icon">
                    <HiOutlineFolderOpen />
                  </div>
                  <ExternalLinks githubLink={projects[key]["link"]} />
                </div>
                <div className="card-title">{key}</div>
                <div className="card-desc">{projects[key]["desc"]}</div>
                <div className="card-tech">{projects[key]["techStack"]}</div>
              </li>
            </FadeInSection>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Projects;
