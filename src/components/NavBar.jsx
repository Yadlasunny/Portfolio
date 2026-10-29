import React, { useState } from "react";
import { HiOutlineMail } from "react-icons/hi";
import { FaGithub, FaLinkedin, FaRegEdit } from "react-icons/fa";
import "../styles/NavBar.css";

const NAV_LINKS = [
  ["Home", "#intro"],
  ["About", "#about"],
  ["Experience", "#experience"],
  ["Projects", "#projects"],
  ["Skills", "#skills"],
  ["Contact", "#contact"],
];

const RESUME_URL = "https://drive.google.com/uc?export=download&id=1LRSC8bB0Z6LEYchNRuCFw6Fb6lZnWLut";

const NavBar = () => {
  const [expanded, setExpanded] = useState(false);

  function go(hash) {
    setExpanded(false);
    const el = document.querySelector(hash);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <button className="navbar-brand" onClick={() => go("#intro")}>
          Yadla Sunny
        </button>
        <button
          className="navbar-toggler"
          onClick={() => setExpanded((e) => !e)}
          aria-label="Toggle menu"
        >
          ☰
        </button>
        <div className={`navbar-collapse${expanded ? " open" : ""}`}>
          <div className="navbar-links">
            {NAV_LINKS.map(([label, hash]) => (
              <button key={hash} onClick={() => go(hash)}>
                {label}
              </button>
            ))}
          </div>
          <div className="navbar-icons">
            <a href="mailto:yadlasunny143@gmail.com" aria-label="Email">
              <HiOutlineMail size={19} />
            </a>
            <a href="https://github.com/yadlasunny" target="_blank" rel="noreferrer" aria-label="GitHub">
              <FaGithub size={17} />
            </a>
            <a href="https://linkedin.com/in/yadlasunny" target="_blank" rel="noreferrer" aria-label="LinkedIn">
              <FaLinkedin size={17} />
            </a>
            <a href={RESUME_URL} download aria-label="Resume">
              <FaRegEdit size={17} />
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
