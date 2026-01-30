import React from "react";
import styles from "./OverlayText.module.scss";
import Typewriter from "./Typewriter";

type PageKey = "about" | "projects" | "experience" | "contact";

export default function OverlayText({
  active,
  show,
}: {
  active: PageKey;
  show: boolean;
}) {
  return (
    <div className={styles.overlay} aria-hidden={!show}>
      {/* About */}
      <section
        data-page="about"
        className={`${styles.section} ${styles.about} ${
          active === "about" ? styles.active : ""
        } ${show ? styles.show : ""}`}
      >
        {[
          "I'm Zac Chen",
          "Computer Engineering Student",
          "@ University of Waterloo",
        ].map((t, i) => (
          <div key={i} className={styles.line} style={{ ["--i" as any]: i }}>
            {t}
          </div>
        ))}

        {/* 最后一行：I'm a + 打字机 */}
        <div className={styles.line} style={{ ["--i" as any]: 3 }}>
          I&apos;m a{" "}
          <Typewriter
            run={active === "about" && show}
            words={[
              "lifelong learner",
              "full-stack tinkerer",
              "automation fan",
              "AI enthusiast",
              "problem solver",
              "systems builder",
              "open-source contributor",
            ]}
            typeMs={75}
            delMs={40}
            holdMs={900}
          />
        </div>
      </section>

      {/* Projects */}
      <section
        data-page="projects"
        className={`${styles.section} ${styles.projects} ${
          active === "projects" ? styles.active : ""
        } ${show ? styles.show : ""}`}
      >
        {[
          {
            label: "LLM MCP RAG",
            href: "https://github.com/Zaaacqwq/LLM_MCP_RAG",
          },
          {
            label: "Personal Blog",
            href: "https://github.com/Zaaacqwq/ZacBlog",
          },
          { label: "Portfolio", href: "https://github.com/Zaaacqwq/portfolio" },
          {
            label: "discord-music-bot",
            href: "https://github.com/Zaaacqwq/discord-music-bot",
          },
        ].map((p, idx) => {
          // 每个项目两段“可渐显”元素：bullet、链接
          const base = idx * 2;
          return (
            <div key={p.href} className={styles.job}>
              <span
                className={`${styles.line} ${styles.bullet}`}
                style={{ ["--i" as any]: base }}
                aria-hidden
              >
                •
              </span>
              <div className={styles.jobText}>
                <a
                  className={`${styles.line} ${styles.link}`}
                  style={{ ["--i" as any]: base + 1 }}
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {p.label}
                </a>
              </div>
            </div>
          );
        })}
      </section>

      {/* Experience */}
      <section
        data-page="experience"
        className={`${styles.section} ${styles.experience} ${
          active === "experience" ? styles.active : ""
        } ${show ? styles.show : ""}`}
      >
        {[
          "Play Station (Software Developer In Test)",
          "Definity Insurance (Test Automation)",
          "WDI Wise Device (Software Verification)",
          "Code Ninjas (Instructor & Developer)",
        ].map((text, idx) => {
          const m = text.match(/^(.*?)\s*(\(.*\))?\s*$/);
          const main = (m?.[1] ?? text).trim();
          const paren = (m?.[2] ?? "").trim();

          // 让每个 job 有 3 个“可渐显”的元素：bullet、主行、括号行
          const base = idx * 3;

          return (
            <div key={idx} className={styles.job}>
              {/* bullet 也加上 .line，并给 --i 参与动画 */}
              <span
                className={`${styles.line} ${styles.bullet}`}
                style={{ ["--i" as any]: base }}
                aria-hidden
              >
                •
              </span>

              <div className={styles.jobText}>
                <div
                  className={styles.line}
                  style={{ ["--i" as any]: base + 1 }}
                >
                  {main}
                </div>

                {paren && (
                  <div
                    className={`${styles.line} ${styles.paren}`}
                    style={{ ["--i" as any]: base + 2 }}
                  >
                    {paren}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </section>

      {/* Contact */}
      <section
        data-page="contact"
        className={`${styles.section} ${styles.contact} ${
          active === "contact" ? styles.active : ""
        } ${show ? styles.show : ""}`}
      >
        <div className={styles.contactInner}>
          {[
            { label: "Github", href: "https://github.com/Zaaacqwq" },
            { label: "LinkedIn", href: "https://www.linkedin.com/in/zaaac/" },
            { label: "Blog", href: "https://zaaac.vip/" },
            { label: "Email", href: "mailto:zacchenzy@gmail.com" },
          ].map((item, i) => (
            <a
              key={item.href}
              className={`${styles.line} ${styles.link}`}
              style={{ ["--i" as any]: i }}
              href={item.href}
              {...(item.href.startsWith("mailto:")
                ? {}
                : { target: "_blank", rel: "noopener noreferrer" })}
            >
              {item.label}
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
