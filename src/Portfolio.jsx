import React from "react";
import { useState, useEffect, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import { FaGithub, FaLinkedin, FaTwitter, FaHeart, FaRegHeart } from "react-icons/fa";
import emailjs from "@emailjs/browser";
import facialExpression from "./assets/facial-expression.jpg";
import agroInformatics from "./assets/agro-informatics.jpg";
import aiTextSummarizer from "./assets/AI-Text-Summarizer.jpg";
// use placeholder placed in public/assets/placeholder.jpg
const placeholder = "/assets/placeholder.jpg";

// --- Typing effect hook ---
function useTypingEffect(words, speed = 80, pause = 1200) {
  const [display, setDisplay] = useState("");
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (index >= words.length) setIndex(0);
    if (!deleting && subIndex === words[index].length) {
      const timeout = setTimeout(() => setDeleting(true), pause);
      return () => clearTimeout(timeout);
    }
    if (deleting && subIndex === 0) {
      setDeleting(false);
      setIndex(i => (i + 1) % words.length);
      return;
    }
    const timeout = setTimeout(() => {
      setSubIndex(subIndex + (deleting ? -1 : 1));
      setDisplay(words[index].substring(0, subIndex + (deleting ? -1 : 1)));
    }, deleting ? speed / 2 : speed);
    return () => clearTimeout(timeout);
  }, [subIndex, index, deleting, words, speed, pause]);
  return display;
}

export default function Portfolio() {
  const [dark, setDark] = useState(() => localStorage.getItem("theme") === "dark");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [projectFilter, setProjectFilter] = useState("All");
  const [selectedProject, setSelectedProject] = useState(null);
  const [sending, setSending] = useState(false);
  const [formStatus, setFormStatus] = useState(null); // { type: 'success'|'error', text: '...' }
  const [searchTerm, setSearchTerm] = useState("");
  const [toast, setToast] = useState(null); // short ephemeral messages
  const [favorites, setFavorites] = useState(() => {
    try {
      const raw = localStorage.getItem("favorites");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  // --- Project Sorting ---
  const [sortBy, setSortBy] = useState("date"); // "date" | "tech" | "favorites"

  const sections = {
    home: useRef(null),
    about: useRef(null),
    skills: useRef(null),
    education: useRef(null),
    projects: useRef(null),
    contact: useRef(null),
    blog: useRef(null),
  };

  // Replace the projects array with your two projects:
  const projects = [
    {
      id: 1,
      title: "Agro Informatics for Yield Prediction",
      description: (
        <>
          <div className="mb-2 text-xs text-gray-500">Jan 2025</div>
          <ul className="list-disc list-inside text-sm mb-2">
            <li>Built a yield prediction system using Python, Spark, and Hadoop for large-scale agricultural datasets.</li>
            <li>Enabled data-driven decision-making for farmers and stakeholders.</li>
          </ul>
          <div className="text-xs text-gray-400">Tools: Python, Spark, Hadoop, NumPy, Pandas, Scikit-learn</div>
        </>
      ),
      tech: ["Python", "Spark", "Hadoop", "NumPy", "Pandas", "Scikit-learn"],
      live: "#",
      repo: "https://github.com/Yadlasunny/Yield-Prediction-using-ML",
      image: agroInformatics,
      date: "2025-01-01",
    },
    {
      id: 2,
      title: "Robust Facial Expression Analysis via CNN and Deep Learning",
      description: (
        <>
          <div className="mb-2 text-xs text-gray-500">Jul 2025</div>
          <ul className="list-disc list-inside text-sm mb-2">
            <li>Developed a real-time facial expression detection system with CNN and YOLO, achieving 91.3% accuracy.</li>
            <li>Focused on key expressions (happiness, sadness, anger) for reliable real-world applications.</li>
          </ul>
          <div className="text-xs text-gray-400">Tools: CNN, YOLO, TensorFlow, OpenCV, Squiznet</div>
        </>
      ),
      tech: ["CNN", "YOLO", "TensorFlow", "OpenCV", "Squiznet"],
      live: "#",
      repo: "#",
      image: facialExpression,
      date: "2025-07-01",
    },
    {
      id: 3,
      title: "AI Text Summarizer ",
      description: (
        <>
          <div className="mb-2 text-xs text-gray-500">May 2025</div>
          <ul className="list-disc list-inside text-sm mb-2">
            <li>Designed and implemented a Python/Flask full-stack web application providing high-quality abstractive summarization for user text inputs.</li>
            <li>Integrated the Hugging Face Transformers library, utilizing the distilbart-cnn-12-6 model (an LLM-based architecture) for state-of-the-art results.</li>
            <li>Demonstrated API workflow management by handling text input, processing with PyTorch/GPU backend, and returning the structured output.</li>
          </ul>
          <div className="text-xs text-gray-400">Tools: Python, Flask, Hugging Face Transformers, PyTorch, HTML/CSS/JS</div>
        </>
      ),
      tech: ["Python", "Flask", "Hugging Face Transformers", "PyTorch", "HTML", "CSS", "JavaScript"],
      live: "#",
      repo: "https://github.com/Yadlasunny/ai-text-summarizer/tree/main/src",
      image: aiTextSummarizer,
      date: "2025-05-01",
    },
    {
      id: 4,
      title: "To-Do List Application ",
      description: (
        <>
          <div className="mb-2 text-xs text-gray-500">Jul 2025</div>
          <ul className="list-disc list-inside text-sm mb-2">
            <li>Responsive single-page application built with React and TypeScript to showcase proficiency in modern frontend development and state management.</li>
            <li>Implemented core CRUD functionality to manage tasks, demonstrating component-based architecture and user-friendly interaction design.</li>
          </ul>
          <div className="text-xs text-gray-400">Tools: React, TypeScript, HTML, CSS</div>
        </>
      ),
      tech: ["React", "TypeScript", "HTML", "CSS"],
      live: "#",
      repo: "https://github.com/Yadlasunny/To-do-List-App/tree/main/src",
      image: placeholder,
      date: "2025-07-15",
    },
    {
      id: 5,
      title: "Student Management System",
      description: (
        <>
          <div className="mb-2 text-xs text-gray-500">Dec 2025</div>
          <ul className="list-disc list-inside text-sm mb-2">
            <li>Built a console-based Student Management System using Java and MySQL for managing academic records.</li>
            <li>Implemented full CRUD operations (Create, Read, Update, Delete) with JDBC for database connectivity.</li>
          </ul>
          <div className="text-xs text-gray-400">Tools: Java, MySQL, JDBC, Maven</div>
        </>
      ),
      tech: ["Java", "MySQL", "JDBC", "Maven"],
      live: "#",
      repo: "https://github.com/Yadlasunny/student-management-system",
      image: placeholder,
      date: "2025-12-01",
    },
    {
      id: 6,
      title: "CopyBin",
      description: (
        <>
          <div className="mb-2 text-xs text-gray-500">Dec 2025</div>
          <ul className="list-disc list-inside text-sm mb-2">
            <li>Built a secure text-sharing application with shareable links, time-based expiration, and view limits.</li>
            <li>Developed using Next.js with Prisma ORM for database management and deployed on Vercel.</li>
          </ul>
          <div className="text-xs text-gray-400">Tools: Next.js, JavaScript, Prisma, CSS</div>
        </>
      ),
      tech: ["Next.js", "JavaScript", "Prisma", "CSS"],
      live: "#",
      repo: "https://github.com/Yadlasunny/CopyBin",
      image: placeholder,
      date: "2025-12-15",
    },
  ];

  const skills = [
    {
      group: "Frontend",
      items: [
        "React", "TypeScript", "Redux Toolkit", "Tailwind CSS", "HTML", "CSS", "JavaScript"
      ]
    },
    {
      group: "Backend",
      items: [
        "Node.js", "Flask", "API Integration (REST/JSON)"
      ]
    },
    {
      group: "AI/ML & Data",
      items: [
        "Hugging Face Transformers", "PyTorch", "Scikit-learn", "OpenCV", "Spark", "Hadoop", "Pandas", "NumPy"
      ]
    },
    {
      group: "Databases",
      items: [
        "MySQL", "MongoDB"
      ]
    },
    {
      group: "Languages",
      items: [
        "Python", "Java", "C/C++"
      ]
    },
    {
      group: "Tools & Platforms",
      items: [
        "Git", "Docker", "Google Colab", "VS Code", "Jupyter"
      ]
    }
  ];

  const allTechs = useMemo(
    () => ["All", ...Array.from(new Set(projects.flatMap(p => p.tech)))],
    [projects]
  );

  // --- Typing effect for hero headline ---
  const typingWords = [
    "Building clean, performant React interfaces.",
    "Delivering accessible, modern web apps.",
    "Crafting scalable component libraries.",
  ];
  const typedHeadline = useTypingEffect(typingWords);

  // --- Project Sorting Logic ---
  const sortedProjects = useMemo(() => {
    let arr = [...projects];
    if (sortBy === "date") {
      arr.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortBy === "favorites") {
      arr.sort((a, b) => {
        const aFav = favorites.includes(a.id) ? 1 : 0;
        const bFav = favorites.includes(b.id) ? 1 : 0;
        return bFav - aFav;
      });
    } else if (sortBy === "tech") {
      arr.sort((a, b) => (a.tech[0] || "").localeCompare(b.tech[0] || ""));
    }
    return arr;
  }, [projects, sortBy, favorites]);

  const filteredProjects = useMemo(
    () =>
      sortedProjects
        .filter(p => projectFilter === "All" || p.tech.includes(projectFilter))
        .filter(p => !searchTerm || p.title.toLowerCase().includes(searchTerm.toLowerCase())),
    [sortedProjects, projectFilter, searchTerm]
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) {
          const id = visible[0].target.getAttribute("data-section");
            setActiveSection(id);
        }
      },
      { threshold: [0.25, 0.5, 0.75] }
    );
    Object.values(sections).forEach(ref => {
      if (ref.current) observer.observe(ref.current);
    });
    return () => observer.disconnect();
  }, []);

  function scrollTo(id) {
    setMobileMenu(false);
    sections[id]?.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function sendEmail(e) {
    e.preventDefault();
    setSending(true);
    setFormStatus(null);
    const serviceID = import.meta.env.VITE_EMAILJS_SERVICE_ID || "service_ok4zv3a";
    const templateID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "template_p2t0si7";
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "15kc-iZa0Y2AqSoU0";

    try {
      await emailjs.sendForm(serviceID, templateID, e.target, publicKey);
      setFormStatus({ type: "success", text: "Message sent successfully." });
      e.target.reset();
    } catch (err) {
      setFormStatus({ type: "error", text: "Error sending message. Please try again later." });
    } finally {
      setSending(false);
    }
  }

  function closeModal() {
    setSelectedProject(null);
  }

  // close modal with ESC
  useEffect(() => {
    if (!selectedProject) return;
    const onKey = (e) => { if (e.key === "Escape") closeModal(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedProject]);

  function copyToClipboard(text, label) {
    navigator.clipboard?.writeText(text).then(() => {
      setToast(`${label} copied`);
      setTimeout(() => setToast(null), 2000);
    }).catch(() => {
      setToast("Copy failed");
      setTimeout(() => setToast(null), 2000);
    });
  }

  function toggleFavorite(id) {
    setFavorites(prev => {
      const s = new Set(prev);
      if (s.has(id)) s.delete(id); else s.add(id);
      const arr = Array.from(s);
      try { localStorage.setItem("favorites", JSON.stringify(arr)); } catch {}
      return arr;
    });
  }

  return (
    <div className={`font-sans antialiased overflow-x-hidden ${dark ? "bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-gray-100" : "bg-gradient-to-b from-slate-50 via-white to-slate-50 text-gray-900"} min-h-screen transition-colors duration-300`}>
      {/* Accessibility: Skip to content */}
      <a
        href="#main-content"
        className="absolute left-2 top-2 z-50 px-4 py-2 bg-indigo-600 text-white rounded-lg focus:top-2 focus:left-2 focus:z-50 focus:outline-none focus:ring-2 focus:ring-indigo-400 sr-only focus:not-sr-only transition-all"
        tabIndex={0}
      >
        Skip to main content
      </a>
      {/* Navbar */}
      <header
        className={`fixed top-0 inset-x-0 z-50 backdrop-blur-xl border-b transition-all duration-300 ${dark ? "border-gray-800/50 bg-gray-950/80" : "border-gray-200/50 bg-white/80"}`}
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex items-center justify-between h-14 sm:h-16 md:h-18">
          <div className="font-bold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">Yadla Sunny</div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setDark(d => !d)}
              className={`p-2.5 rounded-xl text-sm font-medium transition-all duration-200
              hover:scale-105 active:scale-95 ${dark ? "bg-gray-800 hover:bg-gray-700 text-yellow-400" : "bg-gray-100 hover:bg-gray-200 text-gray-700"}`}
              aria-label="Toggle theme"
            >
              {dark ? "☀️" : "🌙"}
            </button>
            <div className="relative">
              <button
                onClick={() => setMobileMenu(m => !m)}
                className={`p-2.5 rounded-xl transition-all duration-200 ${dark ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-100 hover:bg-gray-200"}`}
                aria-label="Toggle menu"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="5" r="2" />
                  <circle cx="12" cy="12" r="2" />
                  <circle cx="12" cy="19" r="2" />
                </svg>
              </button>
              {mobileMenu && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  className={`absolute right-0 top-full mt-2 w-44 sm:w-48 rounded-xl shadow-xl border overflow-hidden ${dark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"}`}
                >
                  {["home", "about", "skills", "education", "projects", "contact"].map(item => (
                    <button
                      key={item}
                      onClick={() => scrollTo(item)}
                      className={`block w-full text-left px-4 py-3 text-sm font-medium transition-all duration-200 ${
                        activeSection === item
                          ? dark
                            ? "bg-indigo-600/20 text-indigo-400"
                            : "bg-indigo-50 text-indigo-600"
                          : dark
                            ? "text-gray-300 hover:bg-gray-800"
                            : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {item.charAt(0).toUpperCase() + item.slice(1)}
                    </button>
                  ))}
                  <div className={`border-t ${dark ? "border-gray-800" : "border-gray-200"}`}>
                    <a
                      href="https://drive.google.com/file/d/1lf5cQTLcXM-minKaTXSyPcYLL8yVQXg9/view?usp=sharing"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-2 w-full px-4 py-3 text-sm font-semibold transition-all duration-200 ${dark ? "text-indigo-400 hover:bg-gray-800" : "text-indigo-600 hover:bg-gray-50"}`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                      Resume
                    </a>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="pt-14 sm:pt-16 md:pt-20" id="main-content" tabIndex={-1} aria-label="Main content">
        {/* Hero / Home */}
        <section
          ref={sections.home}
          data-section="home"
          className="relative min-h-[calc(100vh-3.5rem)] sm:min-h-[calc(100vh-4rem)] md:min-h-[calc(100vh-5rem)] flex items-center overflow-hidden"
          aria-label="Home section"
        >
          {/* Subtle background decoration */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className={`absolute top-1/4 -right-16 sm:-right-32 w-48 h-48 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-full blur-3xl opacity-10 sm:opacity-15 ${dark ? "bg-indigo-600" : "bg-indigo-400"}`} />
            <div className={`absolute bottom-1/4 -left-16 sm:-left-32 w-48 h-48 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-full blur-3xl opacity-10 sm:opacity-15 ${dark ? "bg-purple-600" : "bg-purple-400"}`} />
          </div>
          
          <div className="max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-16 md:py-20 relative z-10 w-full">
            <div className="text-center space-y-6 sm:space-y-8">
              {/* Name - Primary heading */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
                  <span className={dark ? "text-white" : "text-gray-900"}>Yadla Sunny</span>
                </h1>
              </motion.div>

              {/* Role - Secondary heading */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
              >
                <h2 className={`text-lg sm:text-2xl md:text-3xl font-semibold ${dark ? "text-indigo-400" : "text-indigo-600"}`}>
                  Full-Stack Developer  
                </h2>
              </motion.div>

              {/* Professional summary */}
              <motion.p 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className={`text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed ${dark ? "text-gray-400" : "text-gray-600"}`}
              >
                Full-Stack Developer experienced in Java backend development, React frontend applications, and database-driven systems using MySQL. 
              </motion.p>

              {/* CTA Buttons */}
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.25 }}
                className="flex flex-col sm:flex-row gap-4 sm:gap-5 justify-center pt-6 sm:pt-8 px-4 sm:px-0"
              >
                <button
                  onClick={() => scrollTo("projects")}
                  className={`group w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 min-h-[48px] sm:min-h-[56px] rounded-xl font-semibold text-sm sm:text-base transition-all duration-200
                    bg-indigo-600 text-white
                    hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-600/25 hover:-translate-y-0.5
                    focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${dark ? "focus:ring-offset-gray-950" : "focus:ring-offset-white"}
                    active:scale-[0.98]`}
                >
                  View Projects
                  <span className="inline-block ml-2 transition-transform duration-200 group-hover:translate-x-1">→</span>
                </button>

                <a
                  href="https://drive.google.com/file/d/1lf5cQTLcXM-minKaTXSyPcYLL8yVQXg9/view?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 min-h-[48px] sm:min-h-[56px] rounded-xl font-semibold text-sm sm:text-base transition-all duration-200 flex items-center justify-center gap-2.5
                    ${dark 
                      ? "bg-gradient-to-r from-gray-800 to-gray-800 text-white border-2 border-indigo-500/50 hover:border-indigo-400 hover:shadow-xl hover:shadow-indigo-500/15" 
                      : "bg-white text-gray-900 border-2 border-indigo-500/40 hover:border-indigo-500 hover:shadow-xl hover:shadow-indigo-500/15"}
                    hover:-translate-y-0.5
                    focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${dark ? "focus:ring-offset-gray-950" : "focus:ring-offset-white"}
                    active:scale-[0.98]`}
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download Resume
                </a>
              </motion.div>

              {/* Quick contact links */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.35 }}
                className="flex items-center justify-center gap-2 sm:gap-3 pt-8 sm:pt-10 pb-4"
              >
                <a 
                  href="https://github.com/Yadlasunny" 
                  target="_blank" 
                  rel="noreferrer"
                  className={`flex items-center gap-2 p-3 sm:px-4 sm:py-2.5 rounded-full transition-all duration-200 min-w-[48px] min-h-[48px] justify-center ${dark ? "text-gray-400 hover:text-white hover:bg-gray-800/80" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"}`}
                  aria-label="GitHub"
                >
                  <FaGithub size={24} />
                  <span className="hidden md:inline text-sm font-medium">GitHub</span>
                </a>
                <a 
                  href="https://linkedin.com/in/yadla-sunny" 
                  target="_blank" 
                  rel="noreferrer"
                  className={`flex items-center gap-2 p-3 sm:px-4 sm:py-2.5 rounded-full transition-all duration-200 min-w-[48px] min-h-[48px] justify-center ${dark ? "text-gray-400 hover:text-blue-400 hover:bg-blue-500/10" : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"}`}
                  aria-label="LinkedIn"
                >
                  <FaLinkedin size={24} />
                  <span className="hidden md:inline text-sm font-medium">LinkedIn</span>
                </a>
                <a 
                  href="mailto:yadlasunny143@gmail.com"
                  className={`flex items-center gap-2 p-3 sm:px-4 sm:py-2.5 rounded-full transition-all duration-200 min-w-[48px] min-h-[48px] justify-center ${dark ? "text-gray-400 hover:text-red-400 hover:bg-red-500/10" : "text-gray-600 hover:text-red-600 hover:bg-red-50"}`}
                  aria-label="Email"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="hidden md:inline text-sm font-medium">Email</span>
                </a>
              </motion.div>
            </div>
          </div>

          {/* Scroll indicator */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2"
          >
            <button 
              onClick={() => scrollTo("about")}
              className={`p-3 rounded-full transition-all duration-200 ${dark ? "text-gray-500 hover:text-gray-300 hover:bg-gray-800/50" : "text-gray-400 hover:text-gray-600 hover:bg-gray-100/50"}`}
              aria-label="Scroll to about section"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </button>
          </motion.div>
        </section>

        {/* About */}
        <section
          ref={sections.about}
          data-section="about"
          className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-24 space-y-8 sm:space-y-10 md:space-y-14"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center md:text-left"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold inline-flex items-center gap-3">
              <span className="hidden sm:block h-10 w-1 rounded-full bg-gradient-to-b from-indigo-500 to-purple-600" />
              About Me
            </h2>
            <p className={`mt-3 text-sm sm:text-base max-w-2xl ${dark ? "text-gray-400" : "text-gray-600"}`}>
              Get to know my focus areas and the values I bring to every project.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className={`group p-5 sm:p-6 md:p-8 rounded-2xl border transition-all duration-300 hover:shadow-xl ${dark ? "border-gray-800/50 bg-gray-900/50 hover:border-indigo-500/30" : "border-gray-200/50 bg-white hover:border-indigo-500/30"}`}
            >
              <div className={`inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl mb-4 sm:mb-5 ${dark ? "bg-indigo-500/10" : "bg-indigo-50"}`}>
                <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
              </div>
              <h3 className="font-semibold text-lg sm:text-xl mb-4">Focus Areas</h3>
              <ul className="space-y-3 text-sm sm:text-base leading-relaxed">
                <li className="flex items-start gap-3"><span className="text-indigo-500 mt-1">▹</span>Component design systems & reusable patterns.</li>
                <li className="flex items-start gap-3"><span className="text-indigo-500 mt-1">▹</span>Accessibility (ARIA roles, keyboard navigation).</li>
                <li className="flex items-start gap-3"><span className="text-indigo-500 mt-1">▹</span>Performance (lazy loading, memoization, code-splitting).</li>
                <li className="flex items-start gap-3"><span className="text-indigo-500 mt-1">▹</span>State management strategy and data fetching.</li>
              </ul>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className={`group p-6 sm:p-8 rounded-2xl border transition-all duration-300 hover:shadow-xl ${dark ? "border-gray-800/50 bg-gray-900/50 hover:border-indigo-500/30" : "border-gray-200/50 bg-white hover:border-indigo-500/30"}`}
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-5 ${dark ? "bg-purple-500/10" : "bg-purple-50"}`}>
                <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
              </div>
              <h3 className="font-semibold text-lg sm:text-xl mb-4">Values</h3>
              <p className={`text-sm sm:text-base leading-relaxed mb-4 ${dark ? "text-gray-300" : "text-gray-600"}`}>
                Maintain readability, predictable architecture, and leverage tooling (TypeScript, ESLint, Prettier) to keep code quality high.
              </p>
              <p className={`text-sm sm:text-base leading-relaxed ${dark ? "text-gray-300" : "text-gray-600"}`}>
                Deliver interfaces that feel fast and intuitive while staying maintainable for teams.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Skills */}
        <section
          ref={sections.skills}
          data-section="skills"
          className={`py-12 sm:py-16 md:py-24 ${dark ? "bg-gray-900/30" : "bg-gray-50/50"}`}
        >
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-10 md:mb-14"
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
                Skills & Technologies
              </h2>
              <p className={`mt-3 text-sm sm:text-base max-w-2xl mx-auto ${dark ? "text-gray-400" : "text-gray-600"}`}>
                Technologies and tools I work with to build modern web applications.
              </p>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
              {/* Frontend */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0 }}
                className={`rounded-xl border p-4 sm:p-6 ${dark ? "border-gray-800 bg-gray-900/60" : "border-gray-200 bg-white"}`}
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-emerald-500 flex items-center justify-center mb-4 sm:mb-5">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <h3 className="font-bold text-lg mb-4">Frontend</h3>
                <ul className="space-y-2.5">
                  {skills.find(s => s.group === "Frontend")?.items.map(skill => (
                    <li key={skill} className={`flex items-center gap-3 text-sm ${dark ? "text-gray-400" : "text-gray-600"}`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                      {skill}
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Languages */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className={`rounded-xl border p-4 sm:p-6 ${dark ? "border-gray-800 bg-gray-900/60" : "border-gray-200 bg-white"}`}
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-green-500 flex items-center justify-center mb-4 sm:mb-5">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <h3 className="font-bold text-lg mb-4">Languages</h3>
                <ul className="space-y-2.5">
                  {skills.find(s => s.group === "Languages")?.items.map(skill => (
                    <li key={skill} className={`flex items-center gap-3 text-sm ${dark ? "text-gray-400" : "text-gray-600"}`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                      {skill}
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Tools & Platforms */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className={`rounded-xl border p-4 sm:p-6 ${dark ? "border-gray-800 bg-gray-900/60" : "border-gray-200 bg-white"}`}
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-orange-500 flex items-center justify-center mb-4 sm:mb-5">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2 1 3 3 3h10c2 0 3-1 3-3V7c0-2-1-3-3-3H7c-2 0-3 1-3 3zm0 5h16" />
                  </svg>
                </div>
                <h3 className="font-bold text-lg mb-4">Tools & Platforms</h3>
                <ul className="space-y-2.5">
                  {skills.find(s => s.group === "Tools & Platforms")?.items.map(skill => (
                    <li key={skill} className={`flex items-center gap-3 text-sm ${dark ? "text-gray-400" : "text-gray-600"}`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                      {skill}
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* AI/ML & Data */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className={`rounded-xl border p-4 sm:p-6 ${dark ? "border-gray-800 bg-gray-900/60" : "border-gray-200 bg-white"}`}
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-purple-500 flex items-center justify-center mb-4 sm:mb-5">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="font-bold text-lg mb-4">AI/ML & Data</h3>
                <ul className="space-y-2.5">
                  {skills.find(s => s.group === "AI/ML & Data")?.items.map(skill => (
                    <li key={skill} className={`flex items-center gap-3 text-sm ${dark ? "text-gray-400" : "text-gray-600"}`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                      {skill}
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Backend */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className={`rounded-xl border p-4 sm:p-6 ${dark ? "border-gray-800 bg-gray-900/60" : "border-gray-200 bg-white"}`}
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-pink-500 flex items-center justify-center mb-4 sm:mb-5">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                  </svg>
                </div>
                <h3 className="font-bold text-lg mb-4">Backend</h3>
                <ul className="space-y-2.5">
                  {skills.find(s => s.group === "Backend")?.items.map(skill => (
                    <li key={skill} className={`flex items-center gap-3 text-sm ${dark ? "text-gray-400" : "text-gray-600"}`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                      {skill}
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Databases */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.5 }}
                className={`rounded-xl border p-4 sm:p-6 ${dark ? "border-gray-800 bg-gray-900/60" : "border-gray-200 bg-white"}`}
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-blue-500 flex items-center justify-center mb-4 sm:mb-5">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2 1 3 3 3h10c2 0 3-1 3-3V7c0-2-1-3-3-3H7c-2 0-3 1-3 3zm0 5h16" />
                  </svg>
                </div>
                <h3 className="font-bold text-lg mb-4">Databases</h3>
                <ul className="space-y-2.5">
                  {skills.find(s => s.group === "Databases")?.items.map(skill => (
                    <li key={skill} className={`flex items-center gap-3 text-sm ${dark ? "text-gray-400" : "text-gray-600"}`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                      {skill}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Projects */}
        <section
          ref={sections.projects}
          data-section="projects"
          className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-24"
          aria-label="Projects section"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10 md:mb-14"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
              Featured Projects
            </h2>
            <p className={`mt-3 text-sm sm:text-base max-w-2xl mx-auto ${dark ? "text-gray-400" : "text-gray-600"}`}>
              A selection of my recent work and personal projects.
            </p>
          </motion.div>

          {/* Project Cards - Grid Layout */}
          <div className="grid gap-4 sm:gap-5 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((p, index) => (
              <motion.article
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className={`group rounded-xl border p-4 sm:p-5 md:p-6 flex flex-col transition-all duration-300 hover:border-gray-600 ${
                  dark ? "border-gray-800 bg-gray-900/60" : "border-gray-200 bg-white"
                }`}
              >
                {/* Header: Title + GitHub Icon */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <h3 className="font-bold text-base sm:text-lg md:text-xl leading-tight">{p.title}</h3>
                  <a
                    href={p.repo}
                    target="_blank"
                    rel="noreferrer"
                    className={`p-2 rounded-lg transition-all duration-200 flex-shrink-0 ${
                      dark 
                        ? "text-gray-500 hover:text-gray-300 hover:bg-gray-800" 
                        : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                    }`}
                    aria-label={`View ${p.title} on GitHub`}
                  >
                    <FaGithub size={20} />
                  </a>
                </div>

                {/* Description - Simple paragraph */}
                <p className={`text-sm leading-relaxed mb-6 flex-1 ${dark ? "text-gray-400" : "text-gray-600"}`}>
                  {p.id === 1 && "Machine learning-based system for forecasting electricity demand using historical weather data. The model analyzes temperature, humidity, and seasonal trends to improve power load prediction accuracy."}
                  {p.id === 2 && "A real-time facial expression detection system built with CNN and YOLO, achieving 91.3% accuracy. Focused on key expressions for reliable emotion recognition in real-world applications."}
                  {p.id === 3 && "A Python/Flask full-stack web application providing high-quality abstractive summarization using Hugging Face Transformers and the distilbart-cnn-12-6 model."}
                  {p.id === 4 && "Responsive single-page application built with React and TypeScript to showcase proficiency in modern frontend development and state management."}
                  {p.id === 5 && "A console-based Student Management System built with Java and MySQL for managing academic records with full CRUD operations using JDBC."}
                  {p.id === 6 && "A secure text-sharing app with shareable links, time-based expiration, and view limits. Built with Next.js and Prisma ORM."}
                </p>

                {/* Tech Tags - Outlined style */}
                <div className="flex flex-wrap gap-2 mt-auto">
                  {p.tech.slice(0, 3).map(t => (
                    <span
                      key={t}
                      className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
                        dark 
                          ? "border-blue-500/40 text-blue-400 hover:border-blue-400" 
                          : "border-blue-300 text-blue-600 hover:border-blue-500"
                      }`}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </motion.article>
            ))}
          </div>

          {/* Empty State */}
          {filteredProjects.length === 0 && (
            <div className={`text-center py-16 ${dark ? "text-gray-500" : "text-gray-400"}`}>
              <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-lg font-medium">No projects found</p>
              <p className="text-sm mt-1">Try adjusting your search or filters</p>
            </div>
          )}
        </section>

        {/* Education */}
        <section
          ref={sections.education}
          data-section="education"
          className={`py-12 sm:py-16 md:py-24 ${dark ? "bg-gray-900/30" : "bg-gray-50/50"}`}
        >
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center md:text-left mb-10 md:mb-14"
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold inline-flex items-center gap-3">
                <span className="hidden sm:block h-10 w-1 rounded-full bg-gradient-to-b from-indigo-500 to-purple-600" />
                Education
              </h2>
              <p className={`mt-3 text-sm sm:text-base max-w-2xl ${dark ? "text-gray-400" : "text-gray-600"}`}>
                My academic background and qualifications.
              </p>
            </motion.div>
            <ol className="relative border-l-2 border-indigo-500/30 ml-1 sm:ml-2 md:ml-4">
              <motion.li
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="mb-8 sm:mb-10 ml-6 sm:ml-8"
              >
                <span className="absolute -left-3 flex items-center justify-center w-6 h-6 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full ring-4 ring-indigo-500/20">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/></svg>
                </span>
                <div className={`p-4 sm:p-6 rounded-xl border transition-all duration-300 hover:shadow-lg ${dark ? "bg-gray-900/80 border-gray-800/50 hover:border-indigo-500/30" : "bg-white border-gray-200 hover:border-indigo-500/30"}`}>
                  <h3 className="font-semibold text-base sm:text-lg">Avanthi Institute of Engineering and Technology</h3>
                  <time className={`block mt-1 mb-2 text-xs sm:text-sm font-medium ${dark ? "text-indigo-400" : "text-indigo-600"}`}>B.Tech in Computer Science — Oct 2022 – Jul 2025</time>
                  <p className={`text-sm ${dark ? "text-gray-400" : "text-gray-600"}`}>Focused on algorithms, data structures, and distributed systems projects.</p>
                </div>
              </motion.li>

              <motion.li
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="mb-8 sm:mb-10 ml-6 sm:ml-8"
              >
                <span className="absolute -left-3 flex items-center justify-center w-6 h-6 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full ring-4 ring-indigo-500/20">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/></svg>
                </span>
                <div className={`p-4 sm:p-6 rounded-xl border transition-all duration-300 hover:shadow-lg ${dark ? "bg-gray-900/80 border-gray-800/50 hover:border-indigo-500/30" : "bg-white border-gray-200 hover:border-indigo-500/30"}`}>
                  <h3 className="font-semibold text-base sm:text-lg">Teegala Krishna Reddy Engineering College</h3>
                  <time className={`block mt-1 mb-2 text-xs sm:text-sm font-medium ${dark ? "text-indigo-400" : "text-indigo-600"}`}>Diploma in Electronics & Communication Engineering — Jun 2019 – Jun 2022</time>
                  <p className={`text-sm ${dark ? "text-gray-400" : "text-gray-600"}`}>Completed diploma coursework with practical labs in embedded systems and signals.</p>
                </div>
              </motion.li>

              <motion.li
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mb-8 sm:mb-10 ml-6 sm:ml-8"
              >
                <span className="absolute -left-3 flex items-center justify-center w-6 h-6 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full ring-4 ring-indigo-500/20">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/></svg>
                </span>
                <div className={`p-4 sm:p-6 rounded-xl border transition-all duration-300 hover:shadow-lg ${dark ? "bg-gray-900/80 border-gray-800/50 hover:border-indigo-500/30" : "bg-white border-gray-200 hover:border-indigo-500/30"}`}>
                  <h3 className="font-semibold text-base sm:text-lg">SR Digi School</h3>
                  <time className={`block mt-1 mb-2 text-xs sm:text-sm font-medium ${dark ? "text-indigo-400" : "text-indigo-600"}`}>Secondary School Certificate — Jun 2013 – Jun 2019</time>
                  <p className={`text-sm ${dark ? "text-gray-400" : "text-gray-600"}`}>Completed secondary education with emphasis on math and science.</p>
                </div>
              </motion.li>
            </ol>
          </div>
        </section>

        {/* Certifications */}
        <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center md:text-left mb-10 md:mb-14"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold inline-flex items-center gap-3">
              <span className="hidden sm:block h-10 w-1 rounded-full bg-gradient-to-b from-indigo-500 to-purple-600" />
              Certifications
            </h2>
            <p className={`mt-3 text-sm sm:text-base max-w-2xl ${dark ? "text-gray-400" : "text-gray-600"}`}>
              Professional certifications and achievements.
            </p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Java Programming */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className={`group p-5 sm:p-6 rounded-xl border transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${dark ? "bg-gray-900/80 border-gray-800/50 hover:border-indigo-500/30" : "bg-white border-gray-200 hover:border-indigo-500/30"}`}
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 ${dark ? "bg-orange-500/10" : "bg-orange-50"}`}>
                <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">Java Programming</h3>
              <p className={`text-sm mb-3 ${dark ? "text-gray-400" : "text-gray-600"}`}>
                Proficient in Java programming concepts including OOP, collections, and multithreading.
              </p>
              <div className={`inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full ${dark ? "bg-orange-500/10 text-orange-400" : "bg-orange-50 text-orange-600"}`}>
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Certified
              </div>
            </motion.div>

            {/* SQL Intermediate */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className={`group p-5 sm:p-6 rounded-xl border transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${dark ? "bg-gray-900/80 border-gray-800/50 hover:border-indigo-500/30" : "bg-white border-gray-200 hover:border-indigo-500/30"}`}
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 ${dark ? "bg-blue-500/10" : "bg-blue-50"}`}>
                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">SQL (Intermediate)</h3>
              <p className={`text-sm mb-3 ${dark ? "text-gray-400" : "text-gray-600"}`}>
                Skilled in SQL queries, joins, subqueries, and database optimization techniques.
              </p>
              <div className={`inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full ${dark ? "bg-blue-500/10 text-blue-400" : "bg-blue-50 text-blue-600"}`}>
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Certified
              </div>
            </motion.div>
          </div>
        </section>

        {/* Contact */}
        <section
          ref={sections.contact}
          data-section="contact"
          className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-24"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center md:text-left mb-10 md:mb-14"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold inline-flex items-center gap-3">
              <span className="hidden sm:block h-10 w-1 rounded-full bg-gradient-to-b from-indigo-500 to-purple-600" />
              Get In Touch
            </h2>
            <p className={`mt-3 text-sm sm:text-base max-w-2xl ${dark ? "text-gray-400" : "text-gray-600"}`}>
              Feel free to reach out for collaboration, questions about implementation patterns, or code reviews.
            </p>
          </motion.div>
          <div className={`grid md:grid-cols-2 gap-6 sm:gap-8 md:gap-12 rounded-2xl p-4 sm:p-6 md:p-8 lg:p-10 ${
            dark ? "bg-gray-900/50 border border-gray-800/50" : "bg-white border border-gray-200"
          } shadow-lg`}>
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div className={`p-4 sm:p-5 rounded-xl ${dark ? "bg-gray-800/50" : "bg-gray-50"}`}>
                <h3 className="font-semibold mb-4 text-base sm:text-lg">Contact Information</h3>
                <ul className="space-y-4 text-sm sm:text-base">
                  <li className="flex items-center gap-3">
                    <span className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${dark ? "bg-indigo-500/10" : "bg-indigo-50"}`}>
                      <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    </span>
                    <a
                      href="mailto:yadlasunny143@gmail.com"
                      className={`hover:text-indigo-500 transition-colors ${dark ? "text-gray-300" : "text-gray-700"}`}
                    >
                      yadlasunny143@gmail.com
                    </a>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${dark ? "bg-blue-500/10" : "bg-blue-50"}`}>
                      <FaLinkedin className="w-5 h-5 text-blue-600" />
                    </span>
                    <a
                      href="https://linkedin.com/in/yadla-sunny"
                      className={`hover:text-indigo-500 transition-colors ${dark ? "text-gray-300" : "text-gray-700"}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      linkedin.com/in/yadla-sunny
                    </a>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${dark ? "bg-gray-700" : "bg-gray-100"}`}>
                      <FaGithub className={`w-5 h-5 ${dark ? "text-gray-300" : "text-gray-700"}`} />
                    </span>
                    <a
                      href="https://github.com/Yadlasunny"
                      className={`hover:text-indigo-500 transition-colors ${dark ? "text-gray-300" : "text-gray-700"}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      github.com/Yadlasunny
                    </a>
                  </li>
                </ul>
              </div>
            </motion.div>
            <motion.form
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              onSubmit={sendEmail}
              className="space-y-4 sm:space-y-5"
            >
              <div className="flex flex-col gap-1.5">
                <label htmlFor="from_name" className={`text-xs sm:text-sm font-semibold uppercase tracking-wide ${dark ? "text-gray-400" : "text-gray-600"}`}>Name</label>
                <input
                  id="from_name"
                  required
                  name="from_name"
                  className={`px-4 py-3 rounded-xl border text-sm sm:text-base transition-all duration-200 ${
                    dark
                      ? "bg-gray-800 border-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                      : "bg-gray-50 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  } outline-none`}
                  placeholder="Your name"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="from_email" className={`text-xs sm:text-sm font-semibold uppercase tracking-wide ${dark ? "text-gray-400" : "text-gray-600"}`}>Email</label>
                <input
                  id="from_email"
                  required
                  type="email"
                  name="from_email"
                  className={`px-4 py-3 rounded-xl border text-sm sm:text-base transition-all duration-200 ${
                    dark
                      ? "bg-gray-800 border-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                      : "bg-gray-50 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  } outline-none`}
                  placeholder="your@email.com"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="message" className={`text-xs sm:text-sm font-semibold uppercase tracking-wide ${dark ? "text-gray-400" : "text-gray-600"}`}>Message</label>
                <textarea
                  id="message"
                  required
                  name="message"
                  rows={4}
                  className={`px-4 py-3 rounded-xl border text-sm sm:text-base resize-none transition-all duration-200 ${
                    dark
                      ? "bg-gray-800 border-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                      : "bg-gray-50 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  } outline-none`}
                  placeholder="Your message..."
                />
              </div>
              {formStatus && (
                <div className={`p-3 rounded-lg text-sm ${formStatus.type === "success" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}>
                  {formStatus.text}
                </div>
              )}
              <button
                type="submit"
                disabled={sending}
                className={`w-full py-3.5 rounded-xl font-semibold text-sm sm:text-base transition-all duration-300 ${
                  sending 
                    ? "bg-gray-400 cursor-not-allowed" 
                    : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-lg hover:shadow-indigo-500/25 hover:-translate-y-0.5"
                } text-white active:scale-95`}
              >
                {sending ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                    Sending...
                  </span>
                ) : "Send Message"}
              </button>
            </motion.form>
          </div>
        </section>

        {/* Testimonials */}
        <section className={`py-12 sm:py-16 md:py-24 ${dark ? "bg-gray-900/30" : "bg-gray-50/50"}`}>
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-10 md:mb-14"
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold inline-flex items-center justify-center gap-3">
                <span className="hidden sm:block h-10 w-1 rounded-full bg-gradient-to-b from-indigo-500 to-purple-600" />
                Testimonials
              </h2>
              <p className={`mt-3 text-sm sm:text-base max-w-2xl mx-auto ${dark ? "text-gray-400" : "text-gray-600"}`}>
                What colleagues and collaborators say about working with me.
              </p>
            </motion.div>
            <div className="grid md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className={`p-5 sm:p-6 md:p-8 rounded-2xl border relative ${dark ? "bg-gray-900/80 border-gray-800/50" : "bg-white border-gray-200"}`}
              >
                <div className="absolute -top-2 sm:-top-3 left-4 sm:left-6 text-4xl sm:text-5xl text-indigo-500/20">“</div>
                <p className={`italic text-sm sm:text-base md:text-lg leading-relaxed mb-4 sm:mb-6 ${dark ? "text-gray-300" : "text-gray-700"}`}>"Yadla Sunny is a fantastic developer who delivers on time and with quality."</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">JD</div>
                  <div>
                    <div className="font-semibold text-sm sm:text-base">Jane Doe</div>
                    <div className={`text-xs sm:text-sm ${dark ? "text-gray-500" : "text-gray-500"}`}>Manager at Example Corp</div>
                  </div>
                </div>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className={`p-5 sm:p-6 md:p-8 rounded-2xl border relative ${dark ? "bg-gray-900/80 border-gray-800/50" : "bg-white border-gray-200"}`}
              >
                <div className="absolute -top-2 sm:-top-3 left-4 sm:left-6 text-4xl sm:text-5xl text-indigo-500/20">“</div>
                <p className={`italic text-sm sm:text-base md:text-lg leading-relaxed mb-4 sm:mb-6 ${dark ? "text-gray-300" : "text-gray-700"}`}>"Great attention to detail and always ready to help the team."</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold">KV</div>
                  <div>
                    <div className="font-semibold text-sm sm:text-base">Kavali Vishal</div>
                    <div className={`text-xs sm:text-sm ${dark ? "text-gray-500" : "text-gray-500"}`}>Co-Founder of NirvionX</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Blog */}
        <section
          ref={sections.blog}
          data-section="blog"
          className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-24"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center md:text-left mb-10 md:mb-14"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold inline-flex items-center gap-3">
              <span className="hidden sm:block h-10 w-1 rounded-full bg-gradient-to-b from-indigo-500 to-purple-600" />
              Latest Articles
            </h2>
            <p className={`mt-3 text-sm sm:text-base max-w-2xl ${dark ? "text-gray-400" : "text-gray-600"}`}>
              Thoughts and tutorials on web development.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
            <motion.article 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className={`group p-5 sm:p-6 md:p-8 rounded-2xl border transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${dark ? "bg-gray-900/80 border-gray-800/50 hover:border-indigo-500/30" : "bg-white border-gray-200 hover:border-indigo-500/30"}`}
            >
              <div className={`inline-block px-2.5 sm:px-3 py-1 rounded-full text-xs font-medium mb-3 sm:mb-4 ${dark ? "bg-indigo-500/10 text-indigo-400" : "bg-indigo-50 text-indigo-600"}`}>React</div>
              <h3 className="font-semibold text-base sm:text-lg md:text-xl mb-2 sm:mb-3 group-hover:text-indigo-500 transition-colors">How to Structure a React Project</h3>
              <p className={`text-sm sm:text-base mb-3 sm:mb-4 ${dark ? "text-gray-400" : "text-gray-600"}`}>Tips for scalable folder structure and code organization.</p>
              <a href="#" className={`inline-flex items-center gap-2 text-sm font-medium transition-colors ${dark ? "text-indigo-400 hover:text-indigo-300" : "text-indigo-600 hover:text-indigo-700"}`}>
                Read more
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </a>
            </motion.article>
            <motion.article 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className={`group p-5 sm:p-6 md:p-8 rounded-2xl border transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${dark ? "bg-gray-900/80 border-gray-800/50 hover:border-indigo-500/30" : "bg-white border-gray-200 hover:border-indigo-500/30"}`}
            >
              <div className={`inline-block px-2.5 sm:px-3 py-1 rounded-full text-xs font-medium mb-3 sm:mb-4 ${dark ? "bg-purple-500/10 text-purple-400" : "bg-purple-50 text-purple-600"}`}>Performance</div>
              <h3 className="font-semibold text-base sm:text-lg md:text-xl mb-2 sm:mb-3 group-hover:text-indigo-500 transition-colors">Optimizing React Performance</h3>
              <p className={`text-sm sm:text-base mb-3 sm:mb-4 ${dark ? "text-gray-400" : "text-gray-600"}`}>Memoization, lazy loading, and best practices.</p>
              <a href="#" className={`inline-flex items-center gap-2 text-sm font-medium transition-colors ${dark ? "text-indigo-400 hover:text-indigo-300" : "text-indigo-600 hover:text-indigo-700"}`}>
                Read more
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </a>
            </motion.article>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className={`py-6 sm:py-8 md:py-12 pb-28 sm:pb-12 border-t ${dark ? "border-gray-800/50 bg-gray-950/50" : "border-gray-200 bg-gray-50"}`}>
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="font-bold text-lg bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">Yadla Sunny</div>
            <p className={`text-xs sm:text-sm text-center ${dark ? "text-gray-500" : "text-gray-500"}`}>
              © {new Date().getFullYear()} Yadla Sunny. Built with React + Tailwind.
            </p>
            <div className="flex items-center gap-3">
              <a href="https://github.com/Yadlasunny" target="_blank" rel="noreferrer" className={`p-2.5 rounded-lg transition-all duration-200 ${dark ? "bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700" : "bg-gray-100 text-gray-600 hover:text-gray-900 hover:bg-gray-200"}`}>
                <FaGithub size={18} />
              </a>
              <a href="https://linkedin.com/in/yadla-sunny" target="_blank" rel="noreferrer" className={`p-2.5 rounded-lg transition-all duration-200 ${dark ? "bg-gray-800 text-gray-400 hover:text-blue-400 hover:bg-gray-700" : "bg-gray-100 text-gray-600 hover:text-blue-600 hover:bg-gray-200"}`}>
                <FaLinkedin size={18} />
              </a>
              <a href="https://twitter.com/your-handle" target="_blank" rel="noreferrer" className={`p-2.5 rounded-lg transition-all duration-200 ${dark ? "bg-gray-800 text-gray-400 hover:text-sky-400 hover:bg-gray-700" : "bg-gray-100 text-gray-600 hover:text-sky-500 hover:bg-gray-200"}`}>
                <FaTwitter size={18} />
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Project Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-sm" onClick={closeModal}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className={`w-full sm:max-w-lg max-h-[85vh] sm:max-h-[90vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl shadow-2xl p-5 sm:p-6 md:p-8 relative ${dark ? "bg-gray-900 border border-gray-800" : "bg-white"}`}
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${dark ? "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-900"}`}
              aria-label="Close"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <img
              src={selectedProject.image}
              alt={selectedProject.title}
              className="w-full h-48 sm:h-56 object-cover rounded-xl mb-5"
              onError={e => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = placeholder;
              }}
            />
            <div className="flex items-start justify-between gap-3 mb-4">
              <h3 className="text-xl sm:text-2xl font-bold">{selectedProject.title}</h3>
              <button
                onClick={() => toggleFavorite(selectedProject.id)}
                aria-label={favorites.includes(selectedProject.id) ? "Unfavorite project" : "Favorite project"}
                className={`flex-shrink-0 p-2 rounded-lg transition-all duration-200 ${
                  favorites.includes(selectedProject.id) ? "bg-red-500/10 text-red-500" : dark ? "bg-gray-800 text-gray-400" : "bg-gray-100 text-gray-500"
                } hover:scale-105`}
              >
                {favorites.includes(selectedProject.id) ? <FaHeart size={16} /> : <FaRegHeart size={16} />}
              </button>
            </div>
            <div className={`mb-5 text-sm sm:text-base ${dark ? "text-gray-300" : "text-gray-600"}`}>{selectedProject.description}</div>
            <div className="flex flex-wrap gap-2 mb-6">
              {selectedProject.tech.map(t => (
                <span key={t} className={`text-xs sm:text-sm font-medium px-3 py-1.5 rounded-lg ${dark ? "bg-indigo-500/10 text-indigo-400" : "bg-indigo-50 text-indigo-600"}`}>{t}</span>
              ))}
            </div>
            <div className="flex gap-3">
              <a 
                href={selectedProject.live} 
                target="_blank" 
                rel="noreferrer" 
                className="flex-1 py-3 rounded-xl font-semibold text-center text-sm sm:text-base bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-200"
              >
                View Live
              </a>
              <a 
                href={selectedProject.repo} 
                target="_blank" 
                rel="noreferrer" 
                className={`flex-1 py-3 rounded-xl font-semibold text-center text-sm sm:text-base transition-all duration-200 ${dark ? "bg-gray-800 text-gray-100 hover:bg-gray-700" : "bg-gray-100 text-gray-900 hover:bg-gray-200"}`}
              >
                View Code
              </a>
            </div>
          </motion.div>
        </div>
      )}

      {/* Scroll to Top Button */}
      <ScrollToTopButton dark={dark} />

      {/* Mobile sticky CTA bar - visible only on mobile when scrolled past hero */}
      <MobileCTABar dark={dark} />

      {/* toast */}
      {toast && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className={`fixed bottom-6 right-6 px-5 py-3 rounded-xl shadow-lg z-50 ${dark ? "bg-gray-800 text-gray-100" : "bg-gray-900 text-white"}`}
        >
          {toast}
        </motion.div>
      )}
    </div>
  );
}

function ScrollToTopButton({ dark }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  if (!visible) return null;
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`fixed bottom-24 sm:bottom-6 right-3 sm:right-6 z-40 p-2.5 sm:p-3 md:p-3.5 rounded-full shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 ${
        dark ? "bg-indigo-600 text-white hover:bg-indigo-500" : "bg-indigo-600 text-white hover:bg-indigo-500"
      }`}
      aria-label="Scroll to top"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
    </button>
  );
}

// Mobile sticky CTA bar for recruiters - easy access to resume and contact
function MobileCTABar({ dark }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  
  if (!visible) return null;
  
  return (
    <motion.div 
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      exit={{ y: 100 }}
      className={`md:hidden fixed bottom-0 left-0 right-0 z-50 px-4 py-3 border-t backdrop-blur-xl ${
        dark ? "bg-gray-950/95 border-gray-800" : "bg-white/95 border-gray-200"
      }`}
    >
      <div className="flex gap-3 max-w-lg mx-auto">
        <a
          href="https://drive.google.com/file/d/1lf5cQTLcXM-minKaTXSyPcYLL8yVQXg9/view?usp=sharing"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-indigo-600 to-purple-600 text-white active:scale-95 transition-transform"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          Resume
        </a>
        <a
          href="mailto:yadlasunny143@gmail.com"
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm border active:scale-95 transition-transform ${
            dark ? "bg-gray-800 border-gray-700 text-white" : "bg-gray-100 border-gray-200 text-gray-900"
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
          Email
        </a>
        <a
          href="https://linkedin.com/in/yadla-sunny"
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center p-3 rounded-xl bg-[#0077B5] text-white active:scale-95 transition-transform"
          aria-label="LinkedIn"
        >
          <FaLinkedin size={18} />
        </a>
      </div>
    </motion.div>
  );
}


