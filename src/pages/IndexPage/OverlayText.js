"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = OverlayText;
var react_1 = __importDefault(require("react"));
var OverlayText_module_scss_1 = __importDefault(require("./OverlayText.module.scss"));
var Typewriter_1 = __importDefault(require("./Typewriter"));
function OverlayText(_a) {
    var _b;
    var active = _a.active, show = _a.show;
    return (<div className={OverlayText_module_scss_1.default.overlay} aria-hidden={!show}>
      {/* About */}
      <section data-page="about" className={"".concat(OverlayText_module_scss_1.default.section, " ").concat(OverlayText_module_scss_1.default.about, " ").concat(active === "about" ? OverlayText_module_scss_1.default.active : "", " ").concat(show ? OverlayText_module_scss_1.default.show : "")}>
        {[
            "I'm Zac Chen",
            "Computer Engineering Student",
            "@ University of Waterloo",
        ].map(function (t, i) {
            var _a;
            return (<div key={i} className={OverlayText_module_scss_1.default.line} style={_a = {}, _a["--i"] = i, _a}>
            {t}
          </div>);
        })}

        {/* 最后一行：I'm a + 打字机 */}
        <div className={OverlayText_module_scss_1.default.line} style={_b = {}, _b["--i"] = 3, _b}>
          I&apos;m a{" "}
          <Typewriter_1.default run={active === "about" && show} words={[
            "lifelong learner",
            "full-stack tinkerer",
            "automation fan",
            "AI enthusiast",
            "problem solver",
            "systems builder",
            "open-source contributor",
        ]} typeMs={75} delMs={40} holdMs={900}/>
        </div>
      </section>

      {/* Projects */}
      <section data-page="projects" className={"".concat(OverlayText_module_scss_1.default.section, " ").concat(OverlayText_module_scss_1.default.projects, " ").concat(active === "projects" ? OverlayText_module_scss_1.default.active : "", " ").concat(show ? OverlayText_module_scss_1.default.show : "")}>
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
        ].map(function (p, idx) {
            var _a, _b;
            // 每个项目两段“可渐显”元素：bullet、链接
            var base = idx * 2;
            return (<div key={p.href} className={OverlayText_module_scss_1.default.job}>
              <span className={"".concat(OverlayText_module_scss_1.default.line, " ").concat(OverlayText_module_scss_1.default.bullet)} style={_a = {}, _a["--i"] = base, _a} aria-hidden>
                •
              </span>
              <div className={OverlayText_module_scss_1.default.jobText}>
                <a className={"".concat(OverlayText_module_scss_1.default.line, " ").concat(OverlayText_module_scss_1.default.link)} style={_b = {}, _b["--i"] = base + 1, _b} href={p.href} target="_blank" rel="noopener noreferrer">
                  {p.label}
                </a>
              </div>
            </div>);
        })}
      </section>

      {/* Experience */}
      <section data-page="experience" className={"".concat(OverlayText_module_scss_1.default.section, " ").concat(OverlayText_module_scss_1.default.experience, " ").concat(active === "experience" ? OverlayText_module_scss_1.default.active : "", " ").concat(show ? OverlayText_module_scss_1.default.show : "")}>
        {[
            "Definity Insurance (Test Automation)",
            "WDI Wise Device (Software Verification)",
            "Code Ninjas (Instructor & Developer)",
        ].map(function (text, idx) {
            var _a, _b, _c;
            var _d, _e;
            var m = text.match(/^(.*?)\s*(\(.*\))?\s*$/);
            var main = ((_d = m === null || m === void 0 ? void 0 : m[1]) !== null && _d !== void 0 ? _d : text).trim();
            var paren = ((_e = m === null || m === void 0 ? void 0 : m[2]) !== null && _e !== void 0 ? _e : "").trim();
            // 让每个 job 有 3 个“可渐显”的元素：bullet、主行、括号行
            var base = idx * 3;
            return (<div key={idx} className={OverlayText_module_scss_1.default.job}>
              {/* bullet 也加上 .line，并给 --i 参与动画 */}
              <span className={"".concat(OverlayText_module_scss_1.default.line, " ").concat(OverlayText_module_scss_1.default.bullet)} style={_a = {}, _a["--i"] = base, _a} aria-hidden>
                •
              </span>

              <div className={OverlayText_module_scss_1.default.jobText}>
                <div className={OverlayText_module_scss_1.default.line} style={_b = {}, _b["--i"] = base + 1, _b}>
                  {main}
                </div>

                {paren && (<div className={"".concat(OverlayText_module_scss_1.default.line, " ").concat(OverlayText_module_scss_1.default.paren)} style={_c = {}, _c["--i"] = base + 2, _c}>
                    {paren}
                  </div>)}
              </div>
            </div>);
        })}
      </section>

      {/* Contact */}
      <section data-page="contact" className={"".concat(OverlayText_module_scss_1.default.section, " ").concat(OverlayText_module_scss_1.default.contact, " ").concat(active === "contact" ? OverlayText_module_scss_1.default.active : "", " ").concat(show ? OverlayText_module_scss_1.default.show : "")}>
        <div className={OverlayText_module_scss_1.default.contactInner}>
          {[
            { label: "Github", href: "https://github.com/Zaaacqwq" },
            { label: "LinkedIn", href: "https://www.linkedin.com/in/zaaac/" },
            { label: "Blog", href: "https://zaaac.vip/" },
            { label: "Email", href: "mailto:zacchenzy@gmail.com" },
        ].map(function (item, i) {
            var _a;
            return (<a key={item.href} className={"".concat(OverlayText_module_scss_1.default.line, " ").concat(OverlayText_module_scss_1.default.link)} style={_a = {}, _a["--i"] = i, _a} href={item.href} {...(item.href.startsWith("mailto:")
                ? {}
                : { target: "_blank", rel: "noopener noreferrer" })}>
              {item.label}
            </a>);
        })}
        </div>
      </section>
    </div>);
}
