import React from "react";
import { FaGithub } from "react-icons/fa";
import { HiOutlineExternalLink } from "react-icons/hi";

const ExternalLinks = ({ githubLink, openLink }) => {
  return (
    <span className="external-links">
      {githubLink && (
        <a className="github-icon" href={githubLink} target="_blank" rel="noopener noreferrer">
          <FaGithub size={20} />
        </a>
      )}
      {openLink && (
        <a className="open-icon" href={openLink} target="_blank" rel="noopener noreferrer">
          <HiOutlineExternalLink size={22} />
        </a>
      )}
    </span>
  );
};

export default ExternalLinks;
