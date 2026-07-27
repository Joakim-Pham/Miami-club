document.addEventListener("DOMContentLoaded", function () {
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

var EVENT_ICONS = {
  Salsa: "💃",
  Party: "🎉",
  "Pop-up": "🎨",
  "DJ set": "🎧"
};

function renderEventRow(item) {
  var icon = EVENT_ICONS[item.type] || "🎶";
  return (
    '<div class="event-row">' +
      '<div class="event-thumb">' + icon + "</div>" +
      '<div class="event-info">' +
        '<span class="event-type">' + escapeHtml(item.type) + "</span>" +
        "<h3>" + escapeHtml(item.title) + "</h3>" +
        '<p class="event-date">' + escapeHtml(item.date_label) + (item.time ? " · " + escapeHtml(item.time) : "") + "</p>" +
        (item.description ? '<p class="desc">' + escapeHtml(item.description) + "</p>" : "") +
      "</div>" +
      '<a href="book.html" class="event-cta">Book now</a>' +
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
