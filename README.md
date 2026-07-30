# Miami Bar Oslo

Oslo's top Latin party place — parties, birthdays, salsa classes, pop-ups, art shows and DJs.

Plain HTML, CSS and a little JavaScript. No menu or drink pricing on the site, by design (no alcohol promotion). Classes/events are editable through a free admin login (no code) — see below.

## Files

```
index.html              Home
events.html              Events — renders data/classes.json
book.html                Booking request form (table, birthday, private party, salsa class, pop-up)
book-confirmation.html   Shown after a booking is submitted
contact.html             Contact form + map
css/style.css            All styles
js/script.js             Mobile menu toggle
images/                  Put real photos here (logo.png is the site logo, used in the nav + footer)
data/classes.json        Classes & events list — edited via /admin, or by hand
admin/                   The admin login + editor (Decap CMS)
netlify.toml             Tells Netlify this is a plain static site
```

To edit page text (headings, hours, etc.), open the relevant `.html` file in a text editor and change the text. Classes/events are the one thing meant to be edited through `/admin` instead (see below), though editing `data/classes.json` by hand works too.

## Classes & events admin (`/admin`)

This gives you a real login page where you can add, edit or remove classes and events without touching any code — powered by a free tool called Decap CMS. It needs the site hosted on **Netlify** with a **free GitHub account** behind it (both free, one-time setup). Here's the full path from zero to a working login:

1. **Put this code on GitHub.**
   Create a free account at [github.com](https://github.com) if you don't have one, create a new repository, and push this project to it.

2. **Deploy the site on [Netlify](https://netlify.com).**
   Sign up free, "Add new site" → "Import an existing project" → pick the GitHub repo. Netlify will detect `netlify.toml` automatically — no build settings needed. Deploy.

3. **Turn on Netlify Identity** (the login system).
   In the Netlify dashboard for this site: **Site configuration → Identity → Enable Identity**.

4. **Turn on Git Gateway** (lets the CMS save changes back to GitHub for you).
   Still under Identity settings: **Services → Git Gateway → Enable Git Gateway**.

5. **Invite yourself as a user.**
   Identity tab → **Invite users** → enter the email that should be able to log in. You'll get an email with a link to set a password.

6. **Log in.**
   Go to `https://yoursite.netlify.app/admin/` (or your real domain once connected), log in, and you'll see a "Classes & Events" editor — add/edit/remove entries there. Publishing saves straight to the site; it goes live within about a minute.

After that first setup, using it day-to-day is just: go to `/admin`, log in, edit, publish.

## Instagram

There's no dedicated gallery page — the site just links out to `instagram.com/miami.oslo` (nav, footer, and the homepage "Follow us" section) instead of hosting a feed itself. To update the handle, search for `miami.oslo` across the `.html` files and replace it.

## Class sign-ups you can actually see a list of

The general booking form (below) just emails you each submission one at a time — fine for one-off table/party requests, but not great for a recurring class where you want to see who's coming. For classes, use a **Google Form** instead: responses land in a spreadsheet automatically, so you get a sortable, filterable list of everyone signed up.

Setup (2 minutes, one-time, per class):

1. Go to [forms.google.com](https://forms.google.com), create a new form (e.g. "Salsa Class Sign-Up") with whatever fields you want (name, email, phone).
2. Click **Send**, then the link icon, and copy the shareable link.
3. To see responses as a spreadsheet: in the form, go to the **Responses** tab → click the green Sheets icon → "Create spreadsheet."
4. In `/admin`, open that class under Classes & Events, and paste the link into the **Sign-up link** field.

That's it — the Events page automatically shows a "Sign up" button (instead of "Book now") for any class with a sign-up link set, and takes people straight to your Google Form. Leave the field blank for anything that should just go through the normal booking form.

## Booking & contact forms

Since this is a static site with no server, the booking and contact forms use **[Web3Forms](https://web3forms.com)** — a free service that emails form submissions straight to you.

Setup (2 minutes, one-time):

1. Go to [web3forms.com](https://web3forms.com) and enter the email address that should receive bookings/messages.
2. They'll email you an **Access Key**.
3. Open `book.html` and `contact.html`, and replace `YOUR_WEB3FORMS_ACCESS_KEY` with that key in both files.
4. Once the site is live at its real domain, open `book.html` and change the `redirect` value to the full URL of `book-confirmation.html` on that domain (e.g. `https://miamibaroslo.no/book-confirmation.html`).

That's it — no backend, no accounts to manage, submissions just show up in the inbox you registered.

## Placeholder content — replace before launch

- Classes/events in `data/classes.json` (edit via `/admin` once set up, or by hand)
- The `YOUR_WEB3FORMS_ACCESS_KEY` placeholders (see above)

## Running it locally

The Events page fetches `data/classes.json` with JavaScript, which browsers block when you open a file directly (`file://`) — so use a local server:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`. (Other pages work fine opened directly, but the server works for all of them, so it's simplest to always use it.)

## Hosting

The classes admin (above) requires **Netlify** specifically, since it relies on Netlify Identity + Git Gateway. Everything else about the site works on any static host if you decide not to use the admin panel — Vercel, GitHub Pages, etc.
