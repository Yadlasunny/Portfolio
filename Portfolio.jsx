import { useState } from "react";

export default function Portfolio() {
  const [activeSection, setActiveSection] = useState("home");

  const projects = [
    {
      id: 1,
      title: "Project Alpha",
      description: "A sample project showcasing feature A.",
      tech: ["React", "Tailwind CSS"],
      link: "#",
      repo: "#",
    },
    {
      id: 2,
      title: "Project Beta",
      description: "A sample project demonstrating integration B.",
      tech: ["Node.js", "Express"],
      link: "#",
      repo: "#",
    },
    {
      id: 3,
      title: "Project Gamma",
      description: "A sample project focused on performance C.",
      tech: ["TypeScript", "Vite"],
      link: "#",
      repo: "#",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      <header className="sticky top-0 bg-white shadow z-10">
        <nav className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          <span className="text-xl font-bold">MyPortfolio</span>
          <ul className="flex gap-6">
            {["home", "about", "projects", "contact"].map((s) => (
              <li key={s}>
                <button
                  onClick={() => {
                    setActiveSection(s);
                    const el = document.getElementById(s);
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  className={`capitalize transition-colors ${
                    activeSection === s
                      ? "text-blue-600 font-semibold"
                      : "text-gray-600 hover:text-blue-600"
                  }`}
                  aria-current={activeSection === s ? "page" : undefined}
                >
                  {s}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main className="flex-1">
        <section
          id="home"
          className="max-w-6xl mx-auto px-6 py-24 flex flex-col md:flex-row items-center gap-12"
        >
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-6">
              Hi, I'm Jane Doe. Building clean, performant web experiences.
            </h1>
            <p className="text-lg text-gray-700 mb-8">
              Front-end engineer focused on accessibility, design systems, and
              delightful user interfaces.
            </p>
            <div className="flex gap-4">
              <a
                href="#projects"
                onClick={() => setActiveSection("projects")}
                className="px-6 py-3 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition"
              >
                View Projects
              </a>
              <a
                href="#contact"
                onClick={() => setActiveSection("contact")}
                className="px-6 py-3 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 transition"
              >
                Contact
              </a>
            </div>
          </div>
          <div className="flex-1 flex justify-center">
            <img
              src="https://via.placeholder.com/360x360"
              alt="Portrait placeholder"
              className="rounded-full w-72 h-72 object-cover shadow-lg"
            />
          </div>
        </section>

        <section
          id="about"
          className="max-w-6xl mx-auto px-6 py-20 border-t border-gray-200"
        >
          <h2 className="text-3xl font-bold mb-6">About</h2>
            <p className="text-gray-700 leading-relaxed max-w-3xl">
              I am a front-end developer with a passion for crafting scalable,
              accessible, and visually engaging applications. I enjoy working
              across the stack when needed, collaborating with designers, and
              refining user journeys. When not coding, I explore new UI
              patterns, write technical notes, and iterate on side projects.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {[
                "JavaScript",
                "TypeScript",
                "React",
                "Next.js",
                "Node.js",
                "REST",
                "GraphQL",
                "Tailwind",
                "Accessibility",
                "Testing",
              ].map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded border border-blue-200"
                >
                  {skill}
                </span>
              ))}
            </div>
        </section>

        <section
          id="projects"
          className="max-w-6xl mx-auto px-6 py-20 border-t border-gray-200"
        >
          <h2 className="text-3xl font-bold mb-10">Projects</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <article
                key={p.id}
                className="bg-white rounded-lg shadow hover:shadow-md transition border border-gray-100 flex flex-col"
              >
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-xl font-semibold mb-2">{p.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 flex-1">
                    {p.description}
                  </p>
                  <ul className="flex flex-wrap gap-2 mb-4">
                    {p.tech.map((t) => (
                      <li
                        key={t}
                        className="text-xs px-2 py-1 bg-gray-100 rounded"
                      >
                        {t}
                      </li>
                    ))}
                  </ul>
                  <div className="flex gap-3 mt-auto">
                    <a
                      href={p.link}
                      className="text-sm px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    >
                      Live
                    </a>
                    <a
                      href={p.repo}
                      className="text-sm px-3 py-1.5 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 transition"
                    >
                      Code
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section
          id="contact"
          className="max-w-6xl mx-auto px-6 py-20 border-t border-gray-200"
        >
          <h2 className="text-3xl font-bold mb-6">Contact</h2>
          <p className="text-gray-700 mb-6 max-w-xl">
            Interested in collaborating or have a question? Reach out using the
            form below.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert("Message submitted (demo).");
            }}
            className="max-w-xl space-y-5"
          >
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Name
              </label>
              <input
                id="name"
                name="name"
                required
                className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Your name"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                required
                className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
                placeholder="Hi, I'd like to discuss..."
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition"
            >
              Send
            </button>
          </form>
        </section>
      </main>

      <footer className="mt-auto bg-white border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Jane Doe. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm">
            <a href="#" className="text-gray-600 hover:text-blue-600">
              LinkedIn
            </a>
            <a href="#" className="text-gray-600 hover:text-blue-600">
              GitHub
            </a>
            <a href="#" className="text-gray-600 hover:text-blue-600">
              Twitter
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}