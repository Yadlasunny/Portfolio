import React from "react";
import { useState, useEffect, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import { FaGithub, FaLinkedin, FaTwitter, FaHeart, FaRegHeart } from "react-icons/fa";
import emailjs from "@emailjs/browser";
import facialExpression from "./assets/facial-expression.jpg";
import agroInformatics from "./assets/agro-informatics.jpg";
// use placeholder placed in public/assets/placeholder.jpg
const placeholder = "/assets/placeholder.jpg";

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

  const sections = {
    home: useRef(null),
    about: useRef(null),
    skills: useRef(null),
    experience: useRef(null), // NEW
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
      repo: "#",
      image: agroInformatics, // changed to use the imported asset
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
    },
  ];

  const skills = [
    {
      group: "Frontend",
      items: [
        "React", "TypeScript", "Redux Toolkit", "Tailwind CSS", "HTML", "CSS", "JavaScript", "Vite"
      ]
    },
    {
      group: "Backend",
      items: [
        "Node.js"
      ]
    },
    {
      group: "Languages",
      items: [
        "Python", "Java", "C/C++"
      ]
    },
    {
      group: "Databases",
      items: [
        "MySQL", "MongoDB"
      ]
    },
    {
      group: "Tools & Platforms",
      items: [
        "Git", "Docker", "Google Colab", "VS Code", "Eclipse", "Jupyter"
      ]
    },
    {
      group: "Libraries & Frameworks",
      items: [
        "Pandas", "NumPy", "Matplotlib", "Seaborn"
      ]
    }
  ];

  const allTechs = useMemo(
    () => ["All", ...Array.from(new Set(projects.flatMap(p => p.tech)))],
    [projects]
  );

  const filteredProjects = useMemo(
    () =>
      projects
        .filter(p => projectFilter === "All" || p.tech.includes(projectFilter))
        .filter(p => !searchTerm || p.title.toLowerCase().includes(searchTerm.toLowerCase())),
    [projects, projectFilter, searchTerm]
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
    <div className={`font-sans ${dark ? "bg-gray-950 text-gray-100" : "bg-gray-50 text-gray-900"} min-h-screen`}>
      {/* Navbar */}
      <header className={`fixed top-0 inset-x-0 z-50 backdrop-blur border-b ${dark ? "border-gray-800 bg-gray-950/70" : "border-gray-200 bg-white/70"}`}>
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
          <div className="font-bold text-lg tracking-wide">Yadla Sunny</div>
          <nav className="hidden md:flex gap-6">
            {["home", "about", "skills", "experience", "projects", "contact"].map(item => (
              <button
                key={item}
                onClick={() => scrollTo(item)}
                className={`capitalize text-sm font-medium transition ${
                  activeSection === item
                    ? dark
                      ? "text-indigo-400"
                      : "text-indigo-600"
                    : dark
                      ? "text-gray-300 hover:text-gray-100"
                      : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {item}
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setDark(d => !d)}
              className="p-2 rounded-md border text-sm font-medium transition
              hover:scale-105 active:scale-95
              dark:border-gray-700 dark:hover:border-indigo-500
              border-gray-300 hover:border-indigo-600"
              aria-label="Toggle theme"
            >
              {dark ? "Light" : "Dark"}
            </button>
            <button
              onClick={() => setMobileMenu(m => !m)}
              className="md:hidden p-2 rounded border dark:border-gray-700 border-gray-300"
              aria-label="Toggle menu"
            >
              ☰
            </button>
          </div>
        </div>
        {mobileMenu && (
          <div className={`md:hidden px-4 pb-4 space-y-2 ${dark ? "bg-gray-950" : "bg-white"}`}>
            {["home", "about", "skills", "experience", "projects", "contact"].map(item => (
              <button
                key={item}
                onClick={() => scrollTo(item)}
                className={`block w-full text-left px-3 py-2 rounded text-sm ${
                  activeSection === item
                    ? dark
                      ? "bg-indigo-600 text-white"
                      : "bg-indigo-600 text-white"
                    : dark
                      ? "hover:bg-gray-800"
                      : "hover:bg-gray-100"
                }`}
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="pt-20">
        {/* Hero / Home */}
        <section
          ref={sections.home}
          data-section="home"
          className="max-w-6xl mx-auto px-4 py-24 flex flex-col md:flex-row gap-14 items-center"
        >
          <div className="flex-1 space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Building clean, performant React interfaces.
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-xl">
              I focus on component architecture, accessibility, and smooth developer experience.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => scrollTo("projects")}
                className="px-6 py-3 rounded-md bg-indigo-600 text-white font-medium hover:bg-indigo-500 transition"
              >
                View Projects
              </button>
              <button
                onClick={() => scrollTo("contact")}
                className={`px-6 py-3 rounded-md font-medium border transition ${
                  dark
                    ? "border-gray-700 hover:border-indigo-500"
                    : "border-gray-300 hover:border-indigo-600"
                }`}
              >
                Contact
              </button>
              <a
                href="/resume.pdf"
                download="Resume"
                className="ml-4 px-4 py-2 rounded bg-indigo-600 text-white font-medium hover:bg-indigo-500 transition"
              >
                Resume
              </a>
            </div>
          </div>
          <div className="flex-1 w-full">
            <div
              className={`rounded-xl p-10 border relative overflow-hidden ${
                dark ? "border-gray-800 bg-gradient-to-br from-gray-900 to-gray-800" : "border-gray-200 bg-gradient-to-br from-white to-gray-100"
              }`}
            >
              <div className="absolute inset-0 pointer-events-none opacity-10 bg-[radial-gradient(circle_at_30%_30%,#6366f1,transparent_60%)]" />
              <p className="text-sm uppercase tracking-wider font-semibold mb-4 opacity-70">
                Summary
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Frontend developer specializing in modern React (hooks, performance, state management) with experience
                in building scalable component libraries and integrating REST APIs.
              </p>
            </div>
          </div>
        </section>

        {/* About */}
        <section
          ref={sections.about}
          data-section="about"
          className="max-w-6xl mx-auto px-4 py-20 space-y-10"
        >
          <h2 className="text-3xl font-bold flex items-center gap-3">
            <span className="h-8 w-1.5 rounded bg-indigo-600" /> About Me
          </h2>
          <div className="grid md:grid-cols-2 gap-10">
            <div className={`p-6 rounded-lg border ${dark ? "border-gray-800 bg-gray-900" : "border-gray-200 bg-white"} space-y-4`}>
              <h3 className="font-semibold text-lg">Focus Areas</h3>
              <ul className="space-y-2 text-sm leading-relaxed">
                <li>Component design systems & reusable patterns.</li>
                <li>Accessibility (ARIA roles, keyboard navigation).</li>
                <li>Performance (lazy loading, memoization, code-splitting).</li>
                <li>State management strategy and data fetching.</li>
              </ul>
            </div>
            <div className={`p-6 rounded-lg border ${dark ? "border-gray-800 bg-gray-900" : "border-gray-200 bg-white"} space-y-4`}>
              <h3 className="font-semibold text-lg">Values</h3>
              <p className="text-sm leading-relaxed">
                Maintain readability, predictable architecture, and leverage tooling (TypeScript, ESLint, Prettier) to keep code quality high.
              </p>
              <p className="text-sm leading-relaxed">
                Deliver interfaces that feel fast and intuitive while staying maintainable for teams.
              </p>
            </div>
          </div>
        </section>

        {/* Skills */}
        <section
          ref={sections.skills}
          data-section="skills"
          className="max-w-6xl mx-auto px-4 py-20"
        >
          <h2 className="text-3xl font-bold mb-10 flex items-center gap-3">
            <span className="h-8 w-1.5 rounded bg-indigo-600" /> Skills
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {skills.map(s => (
              <div
                key={s.group}
                className={`rounded-lg border p-6 ${dark ? "border-gray-800 bg-gray-900" : "border-gray-200 bg-white"}`}
              >
                <h3 className="font-semibold mb-4">{s.group}</h3>
                <div className="flex flex-wrap gap-2">
                  {s.items.map(item => (
                    <span
                      key={item}
                      className={`text-xs px-2.5 py-1 rounded-full border ${
                        dark ? "border-gray-700 bg-gray-800" : "border-gray-300 bg-gray-100"
                      }`}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Experience */}
        <section
          ref={sections.experience}
          data-section="experience"
          className="max-w-6xl mx-auto px-4 py-20"
        >
          <h2 className="text-3xl font-bold mb-10 flex items-center gap-3">
            <span className="h-8 w-1.5 rounded bg-indigo-600" /> Experience
          </h2>
          <ol className="relative border-l-2 border-indigo-400 ml-4">
            <li className="mb-10 ml-6">
              <span className="absolute -left-3 flex items-center justify-center w-6 h-6 bg-indigo-600 rounded-full ring-8 ring-indigo-100 dark:ring-gray-900">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20"><circle cx="10" cy="10" r="10"/></svg>
              </span>
              <h3 className="font-semibold text-lg">Frontend Developer, Example Corp</h3>
              <time className="block mb-2 text-xs text-gray-500 dark:text-gray-400">2023 - Present</time>
              <p className="text-sm text-gray-700 dark:text-gray-300">Built and maintained React-based dashboards for analytics products.</p>
            </li>
            <li className="mb-10 ml-6">
              <span className="absolute -left-3 flex items-center justify-center w-6 h-6 bg-indigo-600 rounded-full ring-8 ring-indigo-100 dark:ring-gray-900">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20"><circle cx="10" cy="10" r="10"/></svg>
              </span>
              <h3 className="font-semibold text-lg">Intern, StartupX</h3>
              <time className="block mb-2 text-xs text-gray-500 dark:text-gray-400">2022 - 2023</time>
              <p className="text-sm text-gray-700 dark:text-gray-300">Worked on UI components and API integration for SaaS platform.</p>
            </li>
          </ol>
        </section>

        {/* Projects */}
        <section
          ref={sections.projects}
          data-section="projects"
          className="max-w-6xl mx-auto px-4 py-20"
        >
          <h2 className="text-3xl font-bold mb-10 flex items-center gap-3">
            <span className="h-8 w-1.5 rounded bg-indigo-600" /> Projects
          </h2>
          {/* Filter Bar */}
          <div className="mb-4">
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search projects..."
              className={`w-full md:w-1/3 px-3 py-2 rounded border text-sm mb-3 ${dark ? "bg-gray-900 border-gray-700 text-gray-200" : "bg-white border-gray-300 text-gray-800"}`}
            />
          </div>
          <div className="flex flex-wrap gap-3 mb-8">
            {allTechs.map(tech => (
              <button
                key={tech}
                onClick={() => setProjectFilter(tech)}
                className={`px-4 py-1 rounded-full border text-sm font-medium transition ${
                  projectFilter === tech
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : dark
                    ? "bg-gray-900 border-gray-700 text-gray-300 hover:border-indigo-500"
                    : "bg-white border-gray-300 text-gray-700 hover:border-indigo-600"
                }`}
              >
                {tech}
              </button>
            ))}
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map(p => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className={`group rounded-xl overflow-hidden border flex flex-col cursor-pointer ${
                  dark ? "border-gray-800 bg-gray-900" : "border-gray-200 bg-white"
                }`}
                onClick={() => setSelectedProject(p)}
              >
                <div className="relative">
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleFavorite(p.id); }}
                    aria-label={favorites.includes(p.id) ? "Unfavorite" : "Favorite"}
                    className={`absolute top-2 right-2 z-20 p-2 rounded-full transition
                      ${favorites.includes(p.id) ? "bg-red-100 text-red-600" : "bg-white/90 text-gray-600 dark:bg-gray-800 dark:text-gray-300"}
                      hover:scale-105`}
                  >
                    {favorites.includes(p.id) ? <FaHeart /> : <FaRegHeart />}
                  </button>
                   <img
                     src={p.image}
                     alt={p.title}
                     className="h-40 w-full object-cover transition group-hover:scale-105"
                     onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.style.display = "none"; }}
                     loading="lazy"
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-70 transition" />
                 </div>
                <div className="p-5 flex flex-col gap-3 flex-1">
                  <h3 className="font-semibold text-lg">{p.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{p.description}</p>
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {p.tech.map(t => (
                      <span
                        key={t}
                        className={`text-[10px] uppercase tracking-wide font-medium px-2 py-1 rounded ${
                          dark ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <div className={`px-5 pb-5 flex gap-4 text-sm font-medium ${
                  dark ? "text-indigo-400" : "text-indigo-600"
                }`}>
                  <a
                    href={p.live}
                    className="hover:underline"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Live
                  </a>
                  <a
                    href={p.repo}
                    className="hover:underline"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Code
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Education */}
        <section
          ref={sections.education}
          data-section="education"
          className="max-w-6xl mx-auto px-4 py-20"
        >
          <h2 className="text-3xl font-bold mb-10 flex items-center gap-3">
            <span className="h-8 w-1.5 rounded bg-indigo-600" /> Education
          </h2>
          <ol className="relative border-l-2 border-indigo-400 ml-4">
            <motion.li
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45 }}
              className="mb-10 ml-6"
            >
              <span className="absolute -left-3 flex items-center justify-center w-6 h-6 bg-indigo-600 rounded-full ring-8 ring-indigo-100 dark:ring-gray-900">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20"><circle cx="10" cy="10" r="10"/></svg>
              </span>
              <h3 className="font-semibold text-lg">Avanthi Institute of Engineering and Technology</h3>
              <time className="block mb-2 text-xs text-gray-500 dark:text-gray-400">B.Tech in Computer Science — Oct 2022 – Jul 2025</time>
              <p className="text-sm text-gray-700 dark:text-gray-300">Focused on algorithms, data structures, and distributed systems projects.</p>
            </motion.li>

            <motion.li
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.08 }}
              className="mb-10 ml-6"
            >
              <span className="absolute -left-3 flex items-center justify-center w-6 h-6 bg-indigo-600 rounded-full ring-8 ring-indigo-100 dark:ring-gray-900">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20"><circle cx="10" cy="10" r="10"/></svg>
              </span>
              <h3 className="font-semibold text-lg">Teegala Krishna Reddy Engineering College</h3>
              <time className="block mb-2 text-xs text-gray-500 dark:text-gray-400">Diploma in Electronics & Communication Engineering — Jun 2019 – Jun 2022</time>
              <p className="text-sm text-gray-700 dark:text-gray-300">Completed diploma coursework with practical labs in embedded systems and signals.</p>
            </motion.li>

            <motion.li
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.16 }}
              className="mb-10 ml-6"
            >
              <span className="absolute -left-3 flex items-center justify-center w-6 h-6 bg-indigo-600 rounded-full ring-8 ring-indigo-100 dark:ring-gray-900">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20"><circle cx="10" cy="10" r="10"/></svg>
              </span>
              <h3 className="font-semibold text-lg">SR Digi School</h3>
              <time className="block mb-2 text-xs text-gray-500 dark:text-gray-400">Secondary School Certificate — Jun 2013 – Jun 2019</time>
              <p className="text-sm text-gray-700 dark:text-gray-300">Completed secondary education with emphasis on math and science.</p>
            </motion.li>
          </ol>
        </section>

        {/* Contact */}
        <section
          ref={sections.contact}
          data-section="contact"
          className="max-w-6xl mx-auto px-4 py-20"
        >
          <h2 className="text-3xl font-bold mb-10 flex items-center gap-3">
            <span className="h-8 w-1.5 rounded bg-indigo-600" /> Contact
          </h2>
          <div className={`grid md:grid-cols-2 gap-10 rounded-lg ${
            dark ? "bg-gray-900 p-10 border border-gray-800" : "bg-white p-10 border border-gray-200"
          }`}>
            <div className="space-y-6">
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                Feel free to reach out for collaboration, questions about implementation patterns, or code reviews.
              </p>
              <ul className="space-y-2 text-sm">
                <li>
                  Email:{" "}
                  <a
                    href="mailto:yadlasunny143@gmail.com"
                    className={`no-underline ${dark ? "text-gray-300" : "text-gray-700"}`}
                  >
                    yadlasunny143@gmail.com
                  </a>
                </li>
                <li>
                  LinkedIn:{" "}
                  <a
                    href="https://linkedin.com/in/yadla-sunny"
                    className={`no-underline ${dark ? "text-gray-300" : "text-gray-700"}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    linkedin.com/in/yadla-sunny
                  </a>
                </li>
                <li>
                  GitHub:{" "}
                  <a
                    href="https://github.com/Yadlasunny"
                    className={`no-underline ${dark ? "text-gray-300" : "text-gray-700"}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    github.com/Yadlasunny
                  </a>
                </li>
              </ul>
            </div>
            <form
              onSubmit={sendEmail}
              className="space-y-4"
            >
              <div className="flex flex-col gap-1">
                <label htmlFor="from_name" className="text-xs font-semibold uppercase tracking-wide">Name</label>
                <input
                  id="from_name"
                  required
                  name="from_name"
                  className={`px-3 py-2 rounded border text-sm ${
                    dark
                      ? "bg-gray-950 border-gray-700 focus:border-indigo-500"
                      : "bg-white border-gray-300 focus:border-indigo-600"
                  } outline-none transition`}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="from_email" className="text-xs font-semibold uppercase tracking-wide">Email</label>
                <input
                  id="from_email"
                  required
                  type="email"
                  name="from_email"
                  className={`px-3 py-2 rounded border text-sm ${
                    dark
                      ? "bg-gray-950 border-gray-700 focus:border-indigo-500"
                      : "bg-white border-gray-300 focus:border-indigo-600"
                  } outline-none transition`}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="message" className="text-xs font-semibold uppercase tracking-wide">Message</label>
                <textarea
                  id="message"
                  required
                  name="message"
                  rows={4}
                  className={`px-3 py-2 rounded border text-sm resize-none ${
                    dark
                      ? "bg-gray-950 border-gray-700 focus:border-indigo-500"
                      : "bg-white border-gray-300 focus:border-indigo-600"
                  } outline-none transition`}
                />
              </div>
              {formStatus && (
                <div className={`text-sm ${formStatus.type === "success" ? "text-green-600" : "text-red-600"}`}>
                  {formStatus.text}
                </div>
              )}
              <button
                type="submit"
                disabled={sending}
                className={`w-full py-3 rounded-md ${sending ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-500"} text-white font-medium transition`}
              >
                {sending ? "Sending..." : "Send"}
              </button>
             </form>
          </div>
        </section>

        {/* Testimonials */}
        <section className="max-w-6xl mx-auto px-4 py-20">
          <h2 className="text-3xl font-bold mb-10 flex items-center gap-3">
            <span className="h-8 w-1.5 rounded bg-indigo-600" /> Testimonials
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-6 rounded-lg border bg-white dark:bg-gray-900 dark:border-gray-800 border-gray-200">
              <p className="italic">"Yadla Sunny is a fantastic developer who delivers on time and with quality."</p>
              <div className="mt-4 font-semibold">– Jane Doe, Manager at Example Corp</div>
            </div>
            <div className="p-6 rounded-lg border bg-white dark:bg-gray-900 dark:border-gray-800 border-gray-200">
              <p className="italic">"Great attention to detail and always ready to help the team."</p>
              <div className="mt-4 font-semibold">– Kavali Vishal, Co-Founder of NirvionX</div>
            </div>
          </div>
        </section>

        {/* Blog */}
        <section
          ref={sections.blog}
          data-section="blog"
          className="max-w-6xl mx-auto px-4 py-20"
        >
          <h2 className="text-3xl font-bold mb-10 flex items-center gap-3">
            <span className="h-8 w-1.5 rounded bg-indigo-600" /> Blog
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-6 rounded-lg border bg-white dark:bg-gray-900 dark:border-gray-800 border-gray-200">
              <h3 className="font-semibold text-lg mb-2">How to Structure a React Project</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">Tips for scalable folder structure and code organization.</p>
              <a href="#" className="text-indigo-600 hover:underline text-sm">Read more</a>
            </div>
            <div className="p-6 rounded-lg border bg-white dark:bg-gray-900 dark:border-gray-800 border-gray-200">
              <h3 className="font-semibold text-lg mb-2">Optimizing React Performance</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">Memoization, lazy loading, and best practices.</p>
              <a href="#" className="text-indigo-600 hover:underline text-sm">Read more</a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-10 text-center text-xs opacity-70">
        © {new Date().getFullYear()} Yadla Sunny. Built with React + Tailwind.
      </footer>

      {/* Project Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className={`max-w-lg w-full bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 relative`} onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}>
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-2xl font-bold text-gray-400 hover:text-indigo-600"
              aria-label="Close"
            >
              &times;
            </button>
            <img src={selectedProject.image} alt={selectedProject.title} className="w-full h-48 object-cover rounded mb-4" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = placeholder; }} />
            <h3 className="text-2xl font-bold mb-2">{selectedProject.title}</h3>
            <button
              onClick={() => toggleFavorite(selectedProject.id)}
              aria-label={favorites.includes(selectedProject.id) ? "Unfavorite project" : "Favorite project"}
              className={`ml-3 inline-flex items-center gap-2 text-sm px-2 py-1 rounded ${
                favorites.includes(selectedProject.id) ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-700"
              }`}
            >
              {favorites.includes(selectedProject.id) ? <FaHeart /> : <FaRegHeart />} Favorite
            </button>
            <p className="mb-4">{selectedProject.description}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedProject.tech.map(t => (
                <span key={t} className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded">{t}</span>
              ))}
            </div>
            <div className="flex gap-4">
              <a href={selectedProject.live} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline">Live</a>
              <a href={selectedProject.repo} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline">Code</a>
            </div>
          </div>
        </div>
      )}

      {/* Scroll to Top Button */}
      <ScrollToTopButton />

      {/* Social Links */}
      <div className="fixed top-1/2 left-0 z-40 flex flex-col gap-2 -translate-y-1/2">
        <a href="https://github.com/Yadlasunny" target="_blank" rel="noreferrer" className="p-2 bg-gray-800 text-white rounded-r hover:bg-indigo-600">
          <FaGithub size={20} />
        </a>
        <a href="https://linkedin.com/in/yadla-sunny" target="_blank" rel="noreferrer" className="p-2 bg-blue-700 text-white rounded-r hover:bg-indigo-600">
          <FaLinkedin size={20} />
        </a>
        <a href="https://twitter.com/your-handle" target="_blank" rel="noreferrer" className="p-2 bg-blue-400 text-white rounded-r hover:bg-indigo-600">
          <FaTwitter size={20} />
        </a>
      </div>

      {/* toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-gray-900 text-white px-4 py-2 rounded shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}

function ScrollToTopButton() {
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
      className="fixed bottom-8 right-8 z-50 p-3 rounded-full bg-indigo-600 text-white shadow-lg hover:bg-indigo-500 transition"
      aria-label="Scroll to top"
    >
      ↑
    </button>
  );
}


