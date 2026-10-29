import React, { useState } from "react";
import NavBar from "./components/NavBar";
import RobotGame from "./components/RobotGame";
import Intro from "./components/Intro";
import About from "./components/About";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import Skills from "./components/Skills";
import Education from "./components/Education";
import Contact from "./components/Contact";
import Credits from "./components/Credits";
import "./styles/Global.css";
import "./styles/RobotGame.css";

export default function App() {
  const [gameActive, setGameActive] = useState(false);
  const [showGameInfo, setShowGameInfo] = useState(false);

  return (
    <div className="App">
      <NavBar />
      <div className="game-toggle-fixed">
        <div className="game-toggle-row">
          <button
            className={`game-toggle-btn${gameActive ? " game-toggle-btn--on" : ""}`}
            onClick={() => setGameActive((a) => !a)}
            title={gameActive ? "Disable game mode" : "Enable game mode"}
          >
            <span className="game-toggle-dot" />
            game mode
          </button>
          {gameActive && (
            <button
              className="game-info-btn"
              onMouseEnter={() => setShowGameInfo(true)}
              onMouseLeave={() => setShowGameInfo(false)}
            >
              i
            </button>
          )}
        </div>
        {showGameInfo && gameActive && (
          <div className="robot-game-info">
            <div className="robot-game-info-title">how to play</div>
            <div className="robot-game-info-row">
              <span className="robot-game-key">← →</span>
              <span>move</span>
            </div>
            <div className="robot-game-info-row">
              <span className="robot-game-key">space</span>
              <span>jump</span>
            </div>
            <div className="robot-game-info-row">
              <span className="robot-game-key">scroll</span>
              <span>explore</span>
            </div>
            <div className="robot-game-info-goal">collect your scattered brain cells</div>
          </div>
        )}
      </div>
      <RobotGame active={gameActive} />
      <div id="content">
        <Intro />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Education />
        <Contact />
        <Credits />
      </div>
    </div>
  );
}
