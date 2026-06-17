# 🎬 Movie Download Online

![Movie Download Online Logo](public/favicons/logo-light.png)

> A free, non-ad movie download catalog built for local network media workflows.

---

## About this project
**Movie Download Online** is a lightweight catalog site for discovering movie download links and metadata.

It is designed to work with **local media stacks** like **Jellyfin** and **qBittorrent**. The core idea is to provide searchable movie listings, language collections, and download references without ads.

- Fully **free**
- **Ad-free** design
- Configurable API endpoint via a single global setting
- Supports discoverability for movie downloads and streaming metadata
- Deployable to **GitHub Pages** with a custom domain

![Cover Image](public/cover.png)

## How it works

1. The app loads movie metadata from a configurable API endpoint in `src/config.js`.
2. Top movie sections are generated for language-specific and popularity-based lists.
3. A shared API base constant is used throughout the codebase so endpoint changes happen in one place.
4. The site can be deployed straight to GitHub Pages with the included workflow.

## Branding
This project is branded as **Movie Download Online** and is intended to be a no-cost download catalog for movie metadata and links.

- Logo: `public/favicons/logo-light.png`
- Cover art: `public/cover.png`

## Deployment
The repo includes a GitHub Actions workflow for deploying to GitHub Pages.

Current production hostname:

- `movie.world.qd.je`

## Legal safety and disclaimer
This project is a **movie catalog** and download link reference site. It does not claim ownership of content.

- The site provides **download links and metadata** only.
- No intellectual property is claimed for any movie content.
- If a valid **DMCA takedown** or other legal notice is received, this site will comply and remove content promptly.
- This site is intended for **local network use only**, with tools such as Jellyfin and qBittorrent.
- It is provided **as-is** with no warranties.

> This is a legal safety net: if the website is brought down, the project accepts takedown requests and will comply with all applicable laws.

## Local network use
Recommended pairing:

- **Jellyfin** for local media streaming
- **qBittorrent** for torrent management

The site is best used as a metadata/catalog frontend for these services, not as a host for copyrighted files.

## Contribution and community
We are looking for contributors to help improve this project.

See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

### Want to help?
- UI improvements
- Better local network integration
- API compatibility updates
- Documentation and legal clarity

## Notes
If the API endpoint changes, update `src/config.js` or set `REACT_APP_API_BASE_URL`.

Enjoy using Movie Download Online.
