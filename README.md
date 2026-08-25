# Comp Tree — VFX Compositor Portfolio

A single-page portfolio site themed around a Nuke-style node graph.

- The hero is an interactive comp tree — each node (Showreel, Projects,
  About, Contact) is a real link to that section. Nodes can be dragged,
  rewired, and disconnected just for fun; navigation always still works
  regardless of how the wiring looks.
- A "+ scribble your own" playground lets visitors drop in extra tool
  nodes (Blur, Grade, Grain, Keyer, Transform, Merge), wire them up, move
  them around, then hit **Done** to either download what they made as a
  JSON file or email it straight to you.
- No frameworks, no build step, no paid resources — plain HTML/CSS/JS and
  free Google Fonts.

This README has two parts: **1)** how to personalize the content, and
**2)** how to publish it on GitHub Pages, written for someone who hasn't
used GitHub before.

---

## Part 1 — Personalize it

### File map

```
index.html        page structure
css/style.css      all styling (design tokens at the top)
js/script.js       node graph, playground, and all interactivity
assets/            put your images/video here
README.md          this file
```

### Where to edit things

Open **`js/script.js`** first — most content lives in arrays at the very top:

- `PROJECTS` — one object per project (name, role, description, tags).
  Add or remove entries freely; the grid and modal update automatically.
- `NODES` / `EDGES` — the four main nav nodes and how they're wired by
  default. You can rename a node's `label`/`sub`, or add a fifth one.
- `TOOLS` — the extra nodes available in the playground toolbox. Add,
  remove, rename, or recolor these freely.
- `OWNER_EMAIL` — **update this** to your real email address. It's where
  the playground's "Send it to me" button sends what visitors build, and
  where the Keyer Booth's "Send it to me" button addresses its email too.

### Keyer Booth — swap in your real photo

The `#booth` section (nav label "Booth") is a real, working green-screen
compositor — visitors key out the background, grade it, move/scale/rotate
the subject, paint on it, and drop in their own background, all live in
the browser.

Right now it uses a **placeholder** illustration at
`assets/greenscreen-placeholder.jpg` so you can see it working. To use
your own photo:

1. Take (or find) a photo of yourself in front of a green screen — a
   fairly solid, evenly-lit green background works best; avoid wearing
   green clothing, since that gets keyed out too.
2. Save it as `assets/greenscreen-placeholder.jpg` (same filename, so
   you don't need to touch any code) — or use a different filename and
   update the path in `js/script.js`:
   ```js
   boothPhoto.src = "assets/greenscreen-placeholder.jpg";
   ```
3. Refresh the page — the booth will use your photo automatically. The
   default key settings work for most standard green screens; if your
   green is a different shade, you can adjust the sensitivity by editing
   the numbers inside `buildKeyedVersion()` in `js/script.js` (look for
   the comment `// simple chroma key`).

The keying, grading, and painting all happen with plain Canvas 2D in the
visitor's own browser — nothing is uploaded anywhere unless they choose
"Send it to me", which just opens their own email client.

Then in **`index.html`**:

- **Showreel**: replace the empty `<source src="">` inside `#reelVideo`
  with a path to your video (e.g. `assets/reel.mp4`), and set the
  `poster` attribute to a still frame.
- **About**: swap in your real name, role, bio, and toolset in the
  `#about` section.
- **Contact**: update the email/vimeo/linkedin/imdb values in the
  `#contact` section (both the "script" text and the button `href`s) —
  keep this in sync with `OWNER_EMAIL` in the script.

Project thumbnails currently use CSS gradients as stand-ins (no external
image dependency). To use real stills, replace a `.project-card__thumb`
div's inline background with an `<img>` tag pointing at
`assets/your-thumb.jpg`.

### Fonts & assets — all free

Space Grotesk, IBM Plex Sans, and IBM Plex Mono are loaded from Google
Fonts (free, OFL license) via a `<link>` in `index.html` — no API key,
no cost. No icon library or stock imagery is used; everything visual is
generated with CSS/SVG.

### Preview locally before publishing

If you have Python installed, open a terminal in the project folder and run:

```bash
cd vfx-portfolio
python3 -m http.server 8000
```

Then visit `http://localhost:8000` in your browser. (You can also just
double-click `index.html`, but a local server avoids some browser
restrictions, so it's worth doing if something looks off.)

---

## Part 2 — Publish it on GitHub Pages (beginner-friendly)

GitHub Pages turns a GitHub repository into a free, live website. Here's
the whole process, using **GitHub Desktop** — a visual app, no typing
commands required. A command-line alternative is at the bottom if you
prefer that.

### Step 1 — Create a free GitHub account

Go to [github.com](https://github.com) and sign up if you don't already
have an account.

### Step 2 — Create a new repository

1. Once logged in, click the **+** icon top-right → **New repository**.
2. Name it anything you like — e.g. `vfx-portfolio`. (If you want the
   site at `https://your-username.github.io` with no extra path, name
   the repo exactly `your-username.github.io` instead.)
3. Leave it **Public**.
4. Don't check "Add a README" — leave everything else default.
5. Click **Create repository**. Keep this page open — it shows you the
   repo's URL, which you'll need in Step 4.

### Step 3 — Install GitHub Desktop

Download and install it from
[desktop.github.com](https://desktop.github.com). Open it and sign in
with the GitHub account from Step 1 when prompted.

### Step 4 — Add your project folder to GitHub Desktop

1. In GitHub Desktop, go to **File → Add local repository**.
2. Browse to and select your `vfx-portfolio` folder (the one containing
   `index.html`).
3. It'll say this folder isn't a Git repository yet and offer to
   **create a repository here** — click that.
4. Fill in a name (matches your folder) and click **Create Repository**.

### Step 5 — Publish it

1. In GitHub Desktop you'll now see all your files listed as changes,
   ready to commit.
2. At the bottom left, type a short summary like `Initial portfolio`
   and click **Commit to main**.
3. Click **Publish repository** in the top toolbar.
4. Make sure "Keep this code private" is **unchecked** (Pages needs a
   public repo on the free plan), then click **Publish repository**.

Your code is now on GitHub. Next, turn on Pages so it's live as a site.

### Step 6 — Turn on GitHub Pages

1. On GitHub.com, open your repository page.
2. Click **Settings** (top menu of the repo) → **Pages** (left sidebar).
3. Under "Build and deployment" → **Source**, choose **Deploy from a
   branch**.
4. Under **Branch**, choose **main** and folder **/ (root)**, then
   **Save**.
5. Wait a minute or two, then refresh the page — GitHub will show a
   green box with your live URL:
   - `https://your-username.github.io/vfx-portfolio/` (project repo), or
   - `https://your-username.github.io/` (if you named the repo
     `your-username.github.io`)

That's it — your portfolio is live. Share that URL with anyone.

### Making changes later

Whenever you edit files locally (new project, updated bio, etc.):

1. Open GitHub Desktop — it'll show your changed files.
2. Type a short commit summary (e.g. `Add new project`) and click
   **Commit to main**.
3. Click **Push origin** (top toolbar).
4. GitHub Pages automatically rebuilds — refresh your live site after
   about a minute to see the update.

### Command-line alternative

If you're comfortable with a terminal, this replaces Steps 3–5 above:

```bash
cd vfx-portfolio
git init
git add .
git commit -m "Initial portfolio"
git branch -M main
git remote add origin https://github.com/your-username/your-repo.git
git push -u origin main
```

Then do Step 6 as above. For future updates:

```bash
git add .
git commit -m "Describe what changed"
git push
```

---

## Notes

- Everything is a static file — no server, no dependencies to install,
  so it works as-is with GitHub Pages, Netlify, or any static host.
- The node graph and playground are plain inline SVG generated by
  `js/script.js`, so they stay crisp at any size with no image assets.
- The playground's "Send it to me" button opens the visitor's own email
  app with a prefilled message — nothing is sent from a server, so there's
  no backend or database involved, and no cost.
- Reduced-motion is respected (animations are disabled automatically if
  the visitor's OS has that preference set).
