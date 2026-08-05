<p align="center">
  <a href="https://snippitkit.vercel.app/">
    <img src="./assets/preview.png" alt="SnippitKit Preview">
  </a>
</p>

<h1 align="center">SnippitKit</h1>

<p align="center">
  A lightweight, browser-based code snippet studio for turning plain code into polished, shareable screenshots - with live syntax highlighting, themes, fonts, and full export control.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Status-Maintained-9B72FF?style=flat"/>
  <img src="https://img.shields.io/badge/Stack-HTML%2FCSS%2FJS-9B72FF?style=flat"/>
  <img src="https://img.shields.io/badge/JavaScript-ES6+-9B72FF?style=flat"/>
  <img src="https://img.shields.io/badge/Highlighting-Prism.js-9B72FF?style=flat"/>
  <img src="https://img.shields.io/badge/License-MIT-9B72FF?style=flat"/>
  <img src="https://img.shields.io/badge/Deploy-Vercel-9B72FF?style=flat"/>
</p>

<p align="center">
  <a href="https://snippitkit.vercel.app/">Live Demo</a> •
  <a href="https://github.com/byllzz/snippitkit/issues/new">Report Bug</a> •
  <a href="https://github.com/byllzz/snippitkit/issues/new">Request Feature</a>
</p>

# About SnippitKit

SnippitKit is a lightweight web tool for producing polished code screenshots and shareable code templates. Paste or type code into the editor, pick a language for Prism.js syntax highlighting, choose a theme and font, and fine-tune padding, border radius, and font size until it matches your brand or post style - then export it as a clean PNG or SVG, or copy it straight to your clipboard.

There's no backend, no build pipeline required, and no account to sign up for. Everything - the editor, the highlighting, the themes, and the export - runs entirely in the browser. Open `index.html`, paste your code, and you have a shareable image in seconds.

It's built for developers who want a fast way to produce nice-looking code snippets for documentation, blog posts, tutorials, or social media, without reaching for a full design tool.

# Features

| Category | Highlights |
|-----------|------------|
| **Live Editor** | Type or paste code directly, with real-time Prism.js syntax highlighting as you go |
| **Language Support** | Kotlin, JavaScript, TypeScript, Python, Java, C, C++, C#, Go, Rust, PHP, Ruby, Swift, SQL, HTML, CSS, SCSS, Bash, JSON, YAML, XML, Markdown, and more |
| **Automatic Detection** | Falls back to lightweight pattern-based language detection when no language is manually selected |
| **Themes** | A curated set of gradient backgrounds, selectable from a searchable, keyboard-accessible dropdown |
| **Fonts** | Dynamically loaded Google Fonts, swapped live without a page reload |
| **Layout Controls** | Adjustable padding, border radius, and font size via live-updating range/number inputs |
| **Background Toggle** | Switch the panel background on or off for a transparent export |
| **Dark / Light Mode** | Toggle the code panel between dark and light presentation |
| **Export** | Download as high-quality PNG or SVG |
| **Clipboard Support** | Copy the rendered image or a PNG data URL directly to your clipboard (requires HTTPS) |
| **JSON-Driven Config** | Themes, fonts, and languages are all defined in plain JSON - no code changes needed to add new ones |
| **Accessible UI** | Custom dropdown selects built with proper ARIA roles, full keyboard navigation (arrow keys, Enter, Escape, Home/End), and focus handling |

# Architecture

SnippitKit is intentionally framework-free. The whole app is plain HTML, CSS, and JavaScript, split into a small number of focused files rather than a component tree.

**The editing surface is a two-layer overlay.** A transparent `<textarea>` sits directly on top of a `<pre><code>` block. The textarea captures all real keystrokes, selection, undo/redo, and paste behavior - things browsers handle natively and reliably. The `<pre><code>` block underneath is purely for display: its content mirrors the textarea's value on every input event, and Prism.js re-highlights it. This split exists because merging the two into a single `contenteditable` element causes the cursor to jump around every time Prism rewrites the highlighted HTML - the overlay approach avoids that entirely while keeping typing feel completely native.

**Themes, fonts, and languages are data, not code.** Each is defined as an array of plain objects in `data/themes.json`, `data/fonts.json`, and `data/languages.json`. On load, `script.js` fetches all three, then generates the dropdown markup for each from that data. Adding a new theme, font, or language is a JSON edit, not a JavaScript change.

**Export is handled separately.** `export.js` is a standalone file that captures the rendered panel using `dom-to-image-more` and turns it into a downloadable PNG/SVG or a clipboard write. Keeping export logic out of the main editor script keeps each file focused on one job.

## Adding a New Theme

Open `data/themes.json` and add a new entry:

```json
{
  "id": "sunset-glow",
  "label": "Sunset Glow",
  "gradient": "linear-gradient(120deg, #ff512f 0%, #f09819 100%)",
  "icon": "/assets/theme-pngs/017 Sunset Glow.png"
}
```

`gradient` accepts any valid CSS `background` value. `icon` is optional - omit or set it to `null` if you don't have a preview thumbnail.

## Adding a New Language

Open `data/languages.json` and add a new entry:

```json
{
  "id": "dart",
  "label": "Dart",
  "prismClass": "language-dart",
  "icon": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dart/dart-original.svg"
}
```

`prismClass` must match a Prism.js component name so the autoloader can fetch the right highlighting grammar on demand.

## Adding a New Font

Open `data/fonts.json` and add a new entry:

```json
{
  "id": "victor-mono",
  "name": "Victor Mono",
  "fallback": "monospace",
  "weights": [400]
}
```

`name` must exactly match the font's name on Google Fonts, since it's used to build the dynamic stylesheet request.

Once added to the relevant JSON file, the new option automatically appears in its dropdown, works with the live preview, and behaves exactly like every built-in option - no further wiring required.

# Project Structure

```text
snippitkit
├── assets
│   ├── favicon
│   └── theme-pngs
├── data
│   ├── themes.json
│   ├── languages.json
│   └── fonts.json
├── index.html
├── script.js
├── export.js
├── style.css
├── package.json
└── LICENSE
```

## File Overview

| File / Directory | Purpose |
|-------------------|---------|
| `index.html` | App markup - editor panel, selectors, layout controls, and export menu |
| `script.js` | Editor logic: textarea/preview sync, language detection, custom select components, live controls, JSON loading |
| `export.js` | Export logic: PNG/SVG download, copy image, copy data URL, toast notifications |
| `style.css` | All styling - panel, controls, custom selects, toasts, dark/light states |
| `data/` | Theme, language, and font definitions consumed by the dropdowns |
| `assets/` | Favicon, theme preview thumbnails, and other static images |

# Design Principles

| Principle | Description |
|-----------|-------------|
| **No Build Step Required** | The app runs directly from static files - no bundler is required to develop or deploy it |
| **Data-Driven UI** | Themes, languages, and fonts are generated from JSON, not hardcoded into the markup |
| **Native Input First** | Real browser input elements (textarea, range, number) are used wherever possible instead of reimplementing them |
| **Separation of Concerns** | Editing logic and export logic live in separate files with no shared state beyond the DOM |
| **Fully Client-Side** | No server, no API calls beyond fetching local JSON and Google Fonts - everything else happens in-browser |
| **Accessible by Default** | Custom controls follow ARIA combobox/listbox patterns with full keyboard support |

# Tech Stack

SnippitKit is built from a small, deliberate set of tools - each one covering a single job rather than a framework doing everything.

### Core

The foundation. No framework, no bundler - just the browser.

<p align="left">
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5" />
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css&logoColor=white" alt="CSS3" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript ES6+" />
</p>

### Syntax Highlighting & Icons

Renders the code panel and gives every language/tool option its icon in the dropdowns.

<p align="left">
  <img src="https://img.shields.io/badge/Prism.js-1a1a2e?style=for-the-badge&logoColor=white" alt="Prism.js" />
  <img src="https://img.shields.io/badge/Devicons-1a1a2e?style=for-the-badge&logoColor=white" alt="Devicons" />
</p>

### Fonts & Export

Handles live font swapping in the editor and turning the finished panel into a downloadable image.

<p align="left">
  <img src="https://img.shields.io/badge/Google_Fonts-4285F4?style=for-the-badge&logo=googlefonts&logoColor=white" alt="Google Fonts" />
  <img src="https://img.shields.io/badge/dom--to--image--more-1a1a2e?style=for-the-badge&logoColor=white" alt="dom-to-image-more" />
</p>

### Tooling & Hosting

Version control and where the site actually lives.

<p align="left">
  <img src="https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white" alt="Git" />
  <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />
</p>

# Getting Started

Running SnippitKit locally takes seconds - there's no build step.

## Prerequisites

- A modern web browser such as Chrome, Edge, Firefox, or Safari
- Optionally, a local static server (Live Server, `npx serve`, etc.) - recommended over opening the file directly, since `fetch()` for the theme/font/language JSON is blocked on `file://` URLs by browser security rules

## Installation

Clone the repository.

```bash
git clone https://github.com/byllzz/snippitkit.git
```

Move into the project directory.

```bash
cd snippitkit
```

Serve the project with any static file server. For example, with the VS Code Live Server extension, right-click `index.html` and select **Open with Live Server**. Or, using Node:

```bash
npx serve .
```

Then open the local address shown in your terminal.

# Usage

- Open the app in your browser.
- Paste or type code into the editor.
- Choose a **Language** from the dropdown to apply Prism highlighting (or let auto-detection handle it).
- Pick a **Theme** to change the background gradient.
- Select a **Font** to load a Google Font dynamically.
- Adjust **Font Size**, **Padding**, and **Border Radius** to style the output.
- Toggle **Background** and **Dark/Light** for different looks.
- Click **Export** to open PNG/SVG download and copy options.
- Double-click the export button to copy the raw code text to your clipboard.
- Keyboard users: Arrow keys + Enter navigate custom selects; Escape closes an open menu.

# Contributing

Contributions of every size are welcome - fixing a typo, improving accessibility, adding a new theme or language, or introducing a new feature all help.

The fastest way to contribute a new theme, language, or font is described above under [Architecture](#architecture) - most additions are a single JSON entry and require no other code changes.

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Open a pull request describing what changed and why

# Author

<img src="https://github.com/byllzz.png" width="90" alt="Bilal Malik"/>

## Bilal Malik

[![GitHub](https://img.shields.io/badge/GitHub-byllzz-9B72FF?style=flat&logo=github&logoColor=white)](https://github.com/byllzz)
[![X](https://img.shields.io/badge/X-@bilalmlkdev-9B72FF?style=flat&logo=x&logoColor=white)](https://x.com/bilalmlkdev)
[![Portfolio](https://img.shields.io/badge/Portfolio-bilalmlkdev.vercel.app-9B72FF?style=flat&logo=vercel&logoColor=white)](https://bilalmlkdev.vercel.app)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Bilal%20Malik-9B72FF?style=flat&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/bilalmlkdev/)
[![Email](https://img.shields.io/badge/Email-bilalmlkdev@gmail.com-9B72FF?style=flat&logo=gmail&logoColor=white)](mailto:bilalmlkdev@gmail.com)

If you find SnippitKit useful, consider giving it a ⭐ on GitHub - it helps others discover the project.

<p align="right">
  <a href="#snippitkit">⬆ Back to Top</a>
</p>

# License (MIT)

This project is licensed under the **MIT License**.

```text
MIT License

Copyright (c) 2025 Bilal Malik

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software. The above copyright notice and this permission notice shall
be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

© 2025 SnippitKit. Licensed under the MIT License.
