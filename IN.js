/* ── 1. Active Nav Link ─────────────────────────────────── */

(function highlightActiveNav() {
  const currentFile = location.pathname.split("/").pop() || "index.html";
  const navLinks = document.querySelectorAll("nav a");

  navLinks.forEach(function (link) {
    const linkFile = link.getAttribute("href");
    if (linkFile === currentFile) {
      link.classList.add("nav-active");
    }
  });
})();


/* ── 2. Scroll Fade-In for Panels ───────────────────────── */

(function initScrollFade() {
  const panels = document.querySelectorAll(".panel");

  panels.forEach(function (panel) {
    panel.classList.add("fade-hidden");
  });

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.remove("fade-hidden");
          entry.target.classList.add("fade-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08 }
  );

  panels.forEach(function (panel) {
    observer.observe(panel);
  });
})();


/* ── 3. Search Bar ──────────────────────────────────────── */

(function initSearch() {
  const form = document.querySelector(".search-bar");
  if (!form) return;

  /* Keyword → page mapping
     Each entry has a page and a list of keywords that point to it.
     Keywords are lowercase. Add more as needed. */
  const searchMap = [
    {
      page: "findings.html",
      keywords: [
        "findings", "lanes", "lane", "severity", "speed", "speed limit",
        "traffic control", "signals", "stop signs", "intersection",
        "chart", "results", "analysis", "wider", "roads", "roadway design",
        "injury", "fatal", "serious", "crash severity", "interpretation",
        "takeaway", "key finding"
      ]
    },
    {
      page: "locations.html",
      keywords: [
        "locations", "location", "map", "streets", "corridors", "gratiot",
        "greenfield", "7 mile", "grand river", "livernois", "outer drive",
        "mcnichols", "high injury network", "hin", "clustering", "cluster",
        "concentration", "detroit streets", "high risk", "high-risk",
        "where", "neighborhood", "arterial"
      ]
    },
    {
      page: "index.html",
      keywords: [
        "home", "overview", "project", "highlights", "problem",
        "recommendations", "recommend", "introduction", "about", "summary"
      ]
    }
  ];

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const input = document.getElementById("site-search");
    const query = input.value.trim().toLowerCase();

    if (!query) return;

    /* Score each page by counting how many keywords match the query */
    let bestPage = "index.html";
    let bestScore = 0;

    searchMap.forEach(function (entry) {
      let score = 0;
      entry.keywords.forEach(function (keyword) {
        if (query.includes(keyword) || keyword.includes(query)) {
          /* Exact keyword matches score higher than partial */
          score += query === keyword ? 3 : 1;
        }
      });
      if (score > bestScore) {
        bestScore = score;
        bestPage = entry.page;
      }
    });

    /* Navigate to the best match.
       If score is 0, nothing matched — show a small inline message instead
       of sending the user somewhere random. */
    if (bestScore === 0) {
      showSearchFeedback(input, "No results found. Try: lanes, map, or locations.");
    } else {
      window.location.href = bestPage;
    }
  });

  function showSearchFeedback(input, message) {
    /* Remove any existing message first */
    const existing = document.getElementById("search-feedback");
    if (existing) existing.remove();

    const msg = document.createElement("p");
    msg.id = "search-feedback";
    msg.textContent = message;
    msg.style.cssText =
      "color:#ffd166; font-size:0.9rem; margin:0.5rem 0 0; font-weight:600;";

    input.closest(".search-bar").insertAdjacentElement("afterend", msg);

    setTimeout(function () {
      msg.remove();
    }, 3500);
  }
})();
