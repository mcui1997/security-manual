/* Field Manual — shared behavior: nav, theme, progress, read tracking, reveal. */
(function () {
  const CHAPTERS = [
    { id: "home", file: "index.html", n: "00", title: "Start here", group: "Orientation", blurb: "The map, the big ideas, and how to use this site." },
    { id: "foundations", file: "foundations.html", n: "01", title: "How machines really work", group: "Ground floor", blurb: "Abstractions, memory, data structures, and the hardness everything rests on." },
    { id: "thinking", file: "security-thinking.html", n: "02", title: "Thinking like security", group: "Ground floor", blurb: "CIA, risk, threat modeling, trust boundaries, defense in depth." },
    { id: "crypto", file: "cryptography.html", n: "03", title: "Cryptography", group: "Trust", blurb: "What crypto guarantees, what it doesn't, and why it breaks in practice." },
    { id: "pki", file: "pki-tls.html", n: "04", title: "PKI & TLS", group: "Trust", blurb: "Who am I actually talking to? Certificates, chains, and the handshake." },
    { id: "appsec", file: "appsec.html", n: "05", title: "Application security", group: "Applications", blurb: "Data becoming code, broken access control, and how AppSec teams work." },
    { id: "ai", file: "ai-security.html", n: "06", title: "AI: tool & target", group: "AI", blurb: "ML for defense, MLOps, attacks on models, and Packets to Pixels." },
    { id: "org", file: "organization.html", n: "07", title: "Security in the organization", group: "The business", blurb: "Risk language, frameworks, compliance vs. security, operations." },
    { id: "autonomy", file: "assured-autonomy.html", n: "08", title: "Assured autonomy", group: "Frontier", blurb: "How to trust a system that decides for itself." },
    { id: "quantum", file: "quantum.html", n: "09", title: "Quantum & post-quantum", group: "Frontier", blurb: "What quantum breaks, what survives, and the migration ahead." },
    { id: "interview", file: "interview.html", n: "10", title: "Interview mode", group: "Review", blurb: "Flashcards, your 2-minute story, and the questions to rehearse." }
  ];

  const store = {
    get(k) { try { return JSON.parse(localStorage.getItem("fm:" + k)); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem("fm:" + k, JSON.stringify(v)); } catch (e) { /* storage unavailable */ } }
  };
  const readSet = () => new Set(store.get("read") || []);

  /* ---------- theme ---------- */
  const savedTheme = store.get("theme");
  if (savedTheme) document.documentElement.setAttribute("data-theme", savedTheme);
  function toggleTheme() {
    const cur = document.documentElement.getAttribute("data-theme") ||
      (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    const next = cur === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    store.set("theme", next);
  }

  document.addEventListener("DOMContentLoaded", () => {
    const pageId = document.body.dataset.page;
    const idx = CHAPTERS.findIndex(c => c.id === pageId);
    const read = readSet();

    /* ---------- sidebar ---------- */
    const side = document.getElementById("sidebar");
    if (side) {
      let html = '<a class="brand" href="index.html"><b>Field Manual</b><span>M.S. Cybersecurity · the big picture</span></a><nav class="nav">';
      let group = "";
      CHAPTERS.forEach(c => {
        if (c.group !== group) { group = c.group; html += `<div class="nav-group">${group}</div>`; }
        html += `<a href="${c.file}" class="${c.id === pageId ? "active" : ""}"><span class="num">${c.n}</span><span>${c.title}</span>${read.has(c.id) ? '<span class="done" title="Read">✓</span>' : ""}</a>`;
      });
      html += '</nav><div class="side-foot"><button class="btn" id="themeBtn" type="button">◐ Theme</button><button class="btn" id="resetBtn" type="button" title="Clear read checkmarks">Reset progress</button></div>';
      side.innerHTML = html;
      document.getElementById("themeBtn").addEventListener("click", toggleTheme);
      document.getElementById("resetBtn").addEventListener("click", () => { store.set("read", []); location.reload(); });
    }

    /* ---------- topbar (mobile) ---------- */
    const top = document.getElementById("topbar");
    if (top) {
      const cur = CHAPTERS[idx] || CHAPTERS[0];
      top.innerHTML = `<button class="btn" id="menuBtn" type="button" aria-label="Open chapters">☰</button><b>${cur.n} · ${cur.title}</b><button class="btn" id="themeBtn2" type="button" aria-label="Toggle theme">◐</button>`;
      document.getElementById("menuBtn").addEventListener("click", () => document.body.classList.toggle("nav-open"));
      document.getElementById("themeBtn2").addEventListener("click", toggleTheme);
      document.addEventListener("click", e => {
        if (document.body.classList.contains("nav-open") && !e.target.closest(".sidebar") && !e.target.closest("#menuBtn")) document.body.classList.remove("nav-open");
      });
    }

    /* ---------- chapter end: mark read + pager ---------- */
    const end = document.getElementById("chapterEnd");
    if (end && idx >= 0) {
      const prev = CHAPTERS[idx - 1], next = CHAPTERS[idx + 1];
      const isRead = read.has(pageId);
      end.innerHTML = `
        <div class="row" style="display:flex;gap:12px;align-items:center;flex-wrap:wrap">
          <button class="btn ${isRead ? "" : "primary"}" id="markRead" type="button">${isRead ? "✓ Marked as read" : "Mark chapter as read"}</button>
          <span class="small" style="font-family:var(--sans)">${read.size} of ${CHAPTERS.length - 1} chapters read</span>
        </div>
        <div class="pager">
          ${prev ? `<a class="prev" href="${prev.file}"><small>← Previous</small>${prev.n} · ${prev.title}</a>` : "<span></span>"}
          ${next ? `<a class="next" href="${next.file}"><small>Next →</small>${next.n} · ${next.title}</a>` : ""}
        </div>`;
      document.getElementById("markRead").addEventListener("click", e => {
        const r = readSet();
        if (r.has(pageId)) r.delete(pageId); else r.add(pageId);
        store.set("read", [...r]);
        location.reload();
      });
    }

    /* ---------- home map cards ---------- */
    const map = document.getElementById("chapterMap");
    if (map) {
      map.innerHTML = CHAPTERS.slice(1).map(c => `
        <a class="card" href="${c.file}"><span class="n">${c.n} · ${c.group}</span><h3>${c.title}</h3><p>${c.blurb}</p>
        <span class="read">${read.has(c.id) ? "✓ read" : ""}</span></a>`).join("");
    }

    /* ---------- progress bar ---------- */
    const bar = document.getElementById("progress");
    if (bar) {
      const onScroll = () => {
        const h = document.documentElement;
        const max = h.scrollHeight - h.clientHeight;
        bar.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + "%";
      };
      addEventListener("scroll", onScroll, { passive: true }); onScroll();
    }

    /* ---------- reveal on scroll ---------- */
    const els = document.querySelectorAll(".reveal");
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(entries => entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } }), { rootMargin: "0px 0px -8% 0px" });
      els.forEach(el => io.observe(el));
    } else els.forEach(el => el.classList.add("in"));

    /* ---------- reading time ---------- */
    const rt = document.getElementById("readTime");
    if (rt) {
      const words = (document.querySelector("article")?.innerText || "").split(/\s+/).length;
      rt.textContent = Math.max(1, Math.round(words / 230)) + " min read";
    }
  });

  /* Tiny helpers shared by labs */
  window.FM = {
    $: (s, r = document) => r.querySelector(s),
    $$: (s, r = document) => [...r.querySelectorAll(s)],
    seg(el, onChange) {
      el.addEventListener("click", e => {
        const b = e.target.closest("button"); if (!b) return;
        el.querySelectorAll("button").forEach(x => x.setAttribute("aria-pressed", x === b ? "true" : "false"));
        onChange(b.dataset.v);
      });
    },
    esc: s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]))
  };
})();
