import React, { useState } from "react";
import "../styles/Contact.css";
import { HiOutlineMail } from "react-icons/hi";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import emailjs from "@emailjs/browser";
import FadeInSection from "./FadeInSection";

const Contact = () => {
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState(null);

  async function sendEmail(e) {
    e.preventDefault();
    setSending(true);
    setStatus(null);
    const serviceID = import.meta.env.VITE_EMAILJS_SERVICE_ID || "service_ok4zv3a";
    const templateID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "template_p2t0si7";
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "15kc-iZa0Y2AqSoU0";

    try {
      await emailjs.sendForm(serviceID, templateID, e.target, publicKey);
      setStatus({ type: "success", text: "Message sent successfully." });
      e.target.reset();
    } catch (err) {
      console.error("EmailJS send failed:", err);
      setStatus({ type: "error", text: "Error sending message. Please try again later." });
    } finally {
      setSending(false);
    }
  }

  return (
    <div id="contact">
      <FadeInSection>
        <div className="section-header">
          <span className="section-title">/ say hi</span>
        </div>
        <div className="contact-content">
          <div>
            <p className="contact-intro">
              Open to new opportunities and collaborations. Reach out and I'll get back to you.
            </p>
            <ul className="contact-links">
              <li>
                <a href="mailto:yadlasunny143@gmail.com">
                  <span className="contact-icon"><HiOutlineMail size={18} /></span>
                  yadlasunny143@gmail.com
                </a>
              </li>
              <li>
                <a href="https://linkedin.com/in/yadlasunny" target="_blank" rel="noreferrer">
                  <span className="contact-icon"><FaLinkedin size={16} /></span>
                  linkedin.com/in/yadlasunny
                </a>
              </li>
              <li>
                <a href="https://github.com/yadlasunny" target="_blank" rel="noreferrer">
                  <span className="contact-icon"><FaGithub size={16} /></span>
                  github.com/yadlasunny
                </a>
              </li>
            </ul>
          </div>
          <form className="contact-form" onSubmit={sendEmail}>
            <div>
              <label htmlFor="from_name">Name</label>
              <input id="from_name" name="from_name" required placeholder="Your name" />
            </div>
            <div>
              <label htmlFor="from_email">Email</label>
              <input id="from_email" name="from_email" type="email" required placeholder="your@email.com" />
            </div>
            <div>
              <label htmlFor="message">Message</label>
              <textarea id="message" name="message" required placeholder="Your message..." />
            </div>
            {status && <div className={`contact-status ${status.type}`}>{status.text}</div>}
            <button type="submit" className="contact-submit" disabled={sending}>
              {sending ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </FadeInSection>
    </div>
  );
};

export default Contact;
