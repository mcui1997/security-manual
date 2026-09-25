# Field Manual

A one-hour refresher on what my M.S. in Cybersecurity (Johns Hopkins, 2023–2026) actually left me with: the big ideas, the architecture, and how they map to application security work. Plain HTML, CSS, and JavaScript. No build step.

## Structure

```
index.html               Start here: the map and the five big ideas
foundations.html         01 How machines really work
security-thinking.html   02 Thinking like security
cryptography.html        03 Cryptography
pki-tls.html             04 PKI & TLS
appsec.html              05 Application security (the centerpiece)
ai-security.html         06 AI: tool & target (Packets to Pixels)
organization.html        07 Security in the organization
assured-autonomy.html    08 Assured autonomy (living chapter)
quantum.html             09 Quantum & post-quantum (living chapter)
interview.html           10 Interview mode: 2-minute story + flashcards
css/style.css            All shared styles and theme tokens (light/dark)
js/site.js               Nav, theme toggle, reading progress, read-tracking
```

Each chapter's interactive lab is a small inline `<script>` at the bottom of its own page.

## Publish on GitHub Pages

1. Create a new repository (for example, `field-manual`) and push these files to the `main` branch, at the repository root.
2. In the repo, go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to *Deploy from a branch*, then choose **main** and **/ (root)**. Save.
4. After a minute the site is live at `https://<your-username>.github.io/field-manual/`.

The empty `.nojekyll` file tells GitHub Pages to serve the files as-is.

To keep it private, make the repo private. Private-repo Pages sites require a paid GitHub plan; on a free plan the Pages site is public even if the repo isn't. Alternatively, just open `index.html` locally.

## Run locally

Open `index.html` in a browser. A couple of the crypto labs use the Web Crypto API, which needs a secure context. If they don't run from a `file://` URL, serve the folder instead:

```
python3 -m http.server 8000
```

Then visit http://localhost:8000.

## Editing

- Add a chapter: copy any chapter page, give `<body>` a new `data-page` id, and add an entry to the `CHAPTERS` array at the top of `js/site.js`. The sidebar, pager, and home cards update automatically.
- Every chapter follows the same template: core idea → sections → where it breaks → on the job → say it in 60 seconds → check yourself.
- Chapters 08 and 09 cover courses in progress (Fall 2026). Revise them as the semester goes on.
- In chapter 06, fill in the "How I talk about it" box with my role, headline numbers, and configuration details from the paper.
