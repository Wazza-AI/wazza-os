/* Wazza OS user manual: theme toggle, phone drawer, instant offline search, copy buttons, heading links,
   "On this page" highlight and the screenshot viewer. No network, no framework: works from file:// too. */
(function () {
  "use strict";
  var THEME_KEY = "wazza-manual-theme";
  // Dark is the default. Only when the reader never chose does a system asking for light win (owner's rule).
  var FOLLOW_SYSTEM_WHEN_UNSET = true;
  var root = document.documentElement;

  function stored() { try { return localStorage.getItem(THEME_KEY); } catch (e) { return null; } }
  function store(value) { try { localStorage.setItem(THEME_KEY, value); } catch (e) { /* private mode: not kept */ } }
  function systemLight() { return !!(window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches); }
  function apply(theme) {
    root.setAttribute("data-theme", theme === "light" ? "light" : "dark");
    var btn = document.querySelector(".theme-btn");
    if (btn) {
      var light = theme === "light";
      btn.setAttribute("aria-pressed", String(light));
      btn.setAttribute("title", light ? "Switch to dark mode" : "Switch to light mode");
      btn.setAttribute("aria-label", light ? "Switch to dark mode" : "Switch to light mode");
    }
  }
  function initialTheme() {
    var chosen = stored();
    if (chosen === "light" || chosen === "dark") return chosen;
    return FOLLOW_SYSTEM_WHEN_UNSET && systemLight() ? "light" : "dark";
  }
  apply(initialTheme());

  function onReady(fn) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn); else fn();
  }

  function copyText(text, done) {
    function fallback() {
      var area = document.createElement("textarea");
      area.value = text; area.setAttribute("readonly", ""); area.style.position = "fixed"; area.style.opacity = "0";
      document.body.appendChild(area); area.select();
      var ok = false;
      try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
      document.body.removeChild(area);
      done(ok);
    }
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(function () { done(true); }, fallback);
    } else { fallback(); }
  }

  onReady(function () {
    apply(initialTheme());

    // ---- theme toggle
    var themeBtn = document.querySelector(".theme-btn");
    if (themeBtn) themeBtn.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
      store(next); apply(next);
    });
    if (window.matchMedia) {
      var mq = window.matchMedia("(prefers-color-scheme: light)");
      var follow = function () { if (!stored()) apply(initialTheme()); };
      if (mq.addEventListener) mq.addEventListener("change", follow); else if (mq.addListener) mq.addListener(follow);
    }

    // ---- phone drawer
    var menuBtn = document.querySelector(".menu-btn");
    function closeNav() { document.body.classList.remove("nav-open"); if (menuBtn) menuBtn.setAttribute("aria-expanded", "false"); }
    if (menuBtn) menuBtn.addEventListener("click", function () {
      var open = document.body.classList.toggle("nav-open");
      menuBtn.setAttribute("aria-expanded", String(open));
    });
    document.addEventListener("click", function (event) {
      if (!document.body.classList.contains("nav-open")) return;
      if (event.target.closest(".sidebar") && !event.target.closest("a")) return;
      if (event.target.closest(".menu-btn")) return;
      closeNav();
    });
    // Centre the current page's link inside the sidebar only: scrollIntoView would scroll the page itself too.
    var current = document.querySelector('.sidebar a[aria-current="page"]');
    var sidebar = document.querySelector(".sidebar");
    if (current && sidebar && sidebar.scrollHeight > sidebar.clientHeight) {
      var r = current.getBoundingClientRect(), box = sidebar.getBoundingClientRect();
      sidebar.scrollTop += (r.top - box.top) - (sidebar.clientHeight - r.height) / 2;
    }

    // ---- copy buttons on command blocks
    Array.prototype.forEach.call(document.querySelectorAll("pre"), function (pre) {
      if (pre.classList.contains("no-copy")) return;
      var btn = document.createElement("button");
      btn.type = "button"; btn.className = "copy-btn"; btn.textContent = "Copy";
      btn.setAttribute("aria-label", "Copy this command");
      btn.addEventListener("click", function () {
        var text;
        if (pre.querySelector(".prompt")) {
          // only the commands: the lines that start with a prompt, without the prompt
          text = Array.prototype.map.call(pre.querySelectorAll(".cmd"), function (c) { return c.textContent; }).join("\n");
        } else {
          var clone = pre.cloneNode(true);
          Array.prototype.forEach.call(clone.querySelectorAll(".copy-btn,.out"), function (n) { n.remove(); });
          text = clone.textContent.replace(/\n+$/, "");
        }
        copyText(text, function (ok) {
          btn.textContent = ok ? "Copied" : "Select and copy";
          btn.classList.toggle("done", ok);
          setTimeout(function () { btn.textContent = "Copy"; btn.classList.remove("done"); }, 1600);
        });
      });
      pre.appendChild(btn);
    });

    // ---- heading links: a click copies the heading's full address
    Array.prototype.forEach.call(document.querySelectorAll(".anchor"), function (a) {
      a.addEventListener("click", function () {
        var url = location.href.split("#")[0] + a.getAttribute("href");
        copyText(url, function (ok) {
          if (!ok) return;
          a.classList.add("copied");
          setTimeout(function () { a.classList.remove("copied"); }, 1400);
        });
      });
    });

    // ---- "On this page": the section being read is marked
    var tocLinks = document.querySelectorAll(".toc a[href^='#']");
    if (tocLinks.length && "IntersectionObserver" in window) {
      var byId = {};
      Array.prototype.forEach.call(tocLinks, function (a) { byId[decodeURIComponent(a.getAttribute("href").slice(1))] = a; });
      var heads = Array.prototype.filter.call(document.querySelectorAll(".doc h2[id], .doc h3[id]"), function (h) { return byId[h.id]; });
      var visible = {};
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { visible[e.target.id] = e.isIntersecting; });
        var first = null;
        for (var i = 0; i < heads.length; i++) { if (visible[heads[i].id]) { first = heads[i]; break; } }
        if (!first) {
          for (var j = heads.length - 1; j >= 0; j--) {
            if (heads[j].getBoundingClientRect().top < 120) { first = heads[j]; break; }
          }
        }
        Array.prototype.forEach.call(tocLinks, function (a) { a.classList.remove("active"); });
        if (first && byId[first.id]) byId[first.id].classList.add("active");
      }, { rootMargin: "-56px 0px -60% 0px" });
      heads.forEach(function (h) { observer.observe(h); });
    }

    // ---- screenshot viewer
    var box = document.createElement("div");
    box.className = "lightbox"; box.hidden = true; box.setAttribute("role", "dialog"); box.setAttribute("aria-label", "Screenshot");
    document.body.appendChild(box);
    function closeBox() { box.hidden = true; box.innerHTML = ""; }
    box.addEventListener("click", closeBox);
    Array.prototype.forEach.call(document.querySelectorAll("figure.shot .shot-frame"), function (frame) {
      // A very wide, short screenshot (a strip: a tab bar, a banner) keeps a readable size on a phone: it scrolls
      // sideways there instead of shrinking until its numbered marks cover each other (CSS: figure.shot.strip).
      // A big screenshot with many numbered marks does the same, so that the marks never cover each other.
      var img = frame.querySelector("img");
      var w = img ? parseInt(img.getAttribute("width"), 10) : 0, h = img ? parseInt(img.getAttribute("height"), 10) : 0;
      var marks = frame.querySelectorAll(".mark").length;
      if (w && h && frame.parentNode && (w / h >= 5 || (marks >= 5 && w >= 900))) {
        frame.parentNode.classList.add("strip");
        frame.style.setProperty("--strip-w", Math.min(w, w / h >= 5 ? 1000 : 760) + "px");
      }
      frame.classList.add("shot-zoom");
      frame.setAttribute("tabindex", "0");
      frame.setAttribute("role", "button");
      frame.setAttribute("aria-label", "Show this screenshot larger");
      function open() {
        var copy = frame.cloneNode(true);
        copy.classList.remove("shot-zoom"); copy.removeAttribute("tabindex"); copy.removeAttribute("role");
        box.innerHTML = ""; box.appendChild(copy); box.hidden = false;
      }
      frame.addEventListener("click", open);
      frame.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } });
    });

    // ---- search
    setupSearch(closeNav);

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") { closeBox(); closeNav(); }
    });
  });

  function fold(text) {
    return String(text || "").toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "");
  }
  function escapeHtml(text) {
    return String(text).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function highlight(text, terms) {
    var html = escapeHtml(text);
    terms.forEach(function (t) {
      if (t.length < 2) return;
      var re = new RegExp("(" + t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")", "ig");
      html = html.replace(re, "<mark>$1</mark>");
    });
    return html;
  }

  function setupSearch(closeNav) {
    var input = document.getElementById("search-input");
    var list = document.getElementById("search-results");
    var index = window.WAZZA_MANUAL_INDEX || [];
    if (!input || !list) return;
    var prepared = index.map(function (e) {
      return { e: e, h: fold(e.h), t: fold(e.t), k: fold(e.k || ""), x: fold(e.x || "") };
    });
    var selected = -1;
    var results = [];

    function score(row, terms) {
      var total = 0;
      for (var i = 0; i < terms.length; i++) {
        var t = terms[i];
        var s = 0;
        var hi = row.h.indexOf(t);
        if (hi === 0) s += 14; else if (hi > 0) s += (row.h.charAt(hi - 1) === " " ? 11 : 7);
        var ti = row.t.indexOf(t);
        if (ti >= 0) s += 5;
        if (row.k.indexOf(t) >= 0) s += 6;
        var xi = row.x.indexOf(t);
        if (xi >= 0) s += 1 + (row.x.charAt(xi - 1) === " " || xi === 0 ? 1 : 0);
        if (!s) return 0;
        total += s;
      }
      if (row.e.a === "") total += 2;    // a page itself ranks above its sections on a tie
      return total;
    }
    function render(query) {
      var terms = fold(query).split(/[^a-z0-9%.+#-]+/).filter(Boolean);
      if (!terms.length) { list.hidden = true; list.innerHTML = ""; results = []; return; }
      results = prepared.map(function (row) { return { row: row, s: score(row, terms) }; })
        .filter(function (r) { return r.s > 0; })
        .sort(function (a, b) { return b.s - a.s; })
        .slice(0, 14);
      selected = results.length ? 0 : -1;
      if (!results.length) {
        list.innerHTML = '<li class="r-empty">Nothing found for “' + escapeHtml(query) + '”. Try another word, or the ' +
          '<a href="glossary.html">Glossary</a>.</li>';
      } else {
        list.innerHTML = results.map(function (r, i) {
          var e = r.row.e;
          var href = e.u + (e.a ? "#" + e.a : "");
          return '<li role="option" id="sr-' + i + '" aria-selected="' + (i === selected) + '"><a href="' + escapeHtml(href) + '">' +
            '<span class="r-title">' + highlight(e.h, terms) + '</span>' +
            '<span class="r-path">' + escapeHtml(e.p) + '</span>' +
            (e.x ? '<span class="r-text">' + highlight(e.x.slice(0, 180), terms) + (e.x.length > 180 ? "…" : "") + '</span>' : '') +
            '</a></li>';
        }).join("");
      }
      list.hidden = false;
      input.setAttribute("aria-expanded", "true");
    }
    function move(delta) {
      if (!results.length) return;
      selected = (selected + delta + results.length) % results.length;
      Array.prototype.forEach.call(list.querySelectorAll("li[role=option]"), function (li, i) {
        li.setAttribute("aria-selected", String(i === selected));
        if (i === selected && li.scrollIntoView) li.scrollIntoView({ block: "nearest" });
      });
      input.setAttribute("aria-activedescendant", "sr-" + selected);
    }
    function close() { list.hidden = true; input.setAttribute("aria-expanded", "false"); }

    input.addEventListener("input", function () { render(input.value); });
    input.addEventListener("focus", function () { if (input.value) render(input.value); });
    input.addEventListener("keydown", function (event) {
      if (event.key === "ArrowDown") { event.preventDefault(); move(1); }
      else if (event.key === "ArrowUp") { event.preventDefault(); move(-1); }
      else if (event.key === "Enter") {
        var link = list.querySelector('li[aria-selected="true"] a') || list.querySelector("li a");
        if (link) { event.preventDefault(); close(); closeNav(); location.href = link.getAttribute("href"); }
      } else if (event.key === "Escape") { close(); input.blur(); }
    });
    list.addEventListener("click", function (event) { if (event.target.closest("a")) { close(); closeNav(); } });
    document.addEventListener("click", function (event) { if (!event.target.closest(".search")) close(); });
    document.addEventListener("keydown", function (event) {
      var typing = /^(INPUT|TEXTAREA|SELECT)$/.test((event.target.tagName || "")) || event.target.isContentEditable;
      if ((event.key === "/" && !typing) || ((event.ctrlKey || event.metaKey) && (event.key === "k" || event.key === "K"))) {
        event.preventDefault(); input.focus(); input.select();
      }
    });
  }
})();
