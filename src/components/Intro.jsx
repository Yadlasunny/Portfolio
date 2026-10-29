import React, { useState, useEffect } from "react";
import "../styles/Intro.css";
import { HiOutlineMail } from "react-icons/hi";
import FadeInSection from "./FadeInSection";
import AsciiPortrait from "./AsciiPortrait";

const NAME = "sunny";

const Intro = () => {
  const [typed, setTyped] = useState("");

  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setTyped(NAME.slice(0, i));
      if (i >= NAME.length) clearInterval(id);
    }, 110);
    return () => clearInterval(id);
  }, []);

  return (
    <div id="intro">
      <div className="intro-simulation">
        <AsciiPortrait />
      </div>
      <div className="intro-block">
        <div className="intro-title">
          {"hi, "}
          <span className="intro-name">{typed}</span>
          {" here."}
          <span className="intro-cursor">|</span>
        </div>
        <FadeInSection>
          <div className="intro-desc">
            Software Engineer in Hyderabad. I build full-stack and mobile apps at
            Cloudontech by day, and ship personal projects spanning Java, Flutter,
            React, and applied ML on the side.
          </div>
          <a href="mailto:yadlasunny143@gmail.com" className="intro-contact">
            <HiOutlineMail />
            {" Say hi!"}
          </a>
        </FadeInSection>
      </div>
    </div>
  );
};

export default Intro;
