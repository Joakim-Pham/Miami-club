document.addEventListener("DOMContentLoaded", function () {
  var bgFx = document.createElement("div");
  bgFx.className = "bg-fx";
  bgFx.innerHTML =
    '<span class="bg-orb orb-pink"></span>' +
    '<span class="bg-orb orb-purple"></span>' +
    '<span class="bg-orb orb-amber"></span>';
  document.body.prepend(bgFx);

  var toggle = document.querySelector(".nav-toggle");
  var links = document.querySelector(".nav-links");

  if (toggle && links) {
    toggle.addEventListener("click", function () {
      links.classList.toggle("open");
    });
  }

  var revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length && "IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  document.querySelectorAll("[data-events-app]").forEach(initEventsApp);
});

function escapeHtml(str) {
  var div = document.createElement("div");
  div.textContent = str || "";
  return div.innerHTML;
}

var EVENT_MARK = {
  Salsa: "S",
  Party: "PA",
  "Pop-up": "PU",
  "DJ set": "DJ"
};

function renderEventRow(item) {
  var mark = EVENT_MARK[item.type] || "•";
  // If a class has a sign-up link (a Google Form, say), send people there
  // instead of the general booking form — responses land in a sheet you
  // can actually read, instead of one-off emails.
  var hasSignup = item.signup_url && item.signup_url.trim();
  var ctaHref = hasSignup ? item.signup_url : "book.html";
  var ctaLabel = hasSignup ? "Sign up" : "Book now";
  return (
    '<div class="event-row">' +
      '<div class="event-thumb">' + escapeHtml(mark) + "</div>" +
      '<div class="event-info">' +
        '<span class="event-type">' + escapeHtml(item.type) + "</span>" +
        "<h3>" + escapeHtml(item.title) + "</h3>" +
        '<p class="event-date">' + escapeHtml(item.date_label) + (item.time ? " · " + escapeHtml(item.time) : "") + "</p>" +
        (item.description ? '<p class="desc">' + escapeHtml(item.description) + "</p>" : "") +
      "</div>" +
      '<a href="' + escapeHtml(ctaHref) + '" class="event-cta"' + (hasSignup ? ' target="_blank" rel="noopener"' : "") + ">" + ctaLabel + "</a>" +
    "</div>"
  );
}

function initEventsApp(root) {
  var grid = root.querySelector(".events-list");
  var filterBtns = root.querySelectorAll(".filter-btn");
  var viewBtns = root.querySelectorAll(".view-btn");
  var limit = root.getAttribute("data-limit");
  var allItems = [];

  function render(items) {
    if (!grid) return;
    if (!items.length) {
      grid.innerHTML = '<p style="grid-column: 1 / -1;">No events found.</p>';
      return;
    }
    grid.innerHTML = items.map(renderEventRow).join("");
  }

  fetch("data/classes.json")
    .then(function (res) { return res.json(); })
    .then(function (data) {
      allItems = (data && data.items) || [];
      var initial = limit ? allItems.slice(0, Number(limit)) : allItems;
      render(initial);
    })
    .catch(function () {
      if (grid) grid.innerHTML = '<p style="grid-column: 1 / -1;">Couldn\'t load events right now.</p>';
    });

  filterBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      filterBtns.forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      var type = btn.getAttribute("data-filter");
      var filtered = type === "all" ? allItems : allItems.filter(function (i) { return i.type === type; });
      render(filtered);
    });
  });

  viewBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      viewBtns.forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      var view = btn.getAttribute("data-view");
      if (grid) grid.classList.toggle("grid-view", view === "grid");
    });
  });
}
