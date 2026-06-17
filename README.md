<a id="readme-top"></a>

<!--
*** Thanks for checking out Movie Download Online.
*** If you have a suggestion that would make this better, please fork the repo
*** and submit a pull request, or open an issue.
***
*** Want to make this project better? Create something AMAZING!
-->


<!-- PROJECT SHIELDS -->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![License][license-shield]][license-url]


<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://movie.world.qd.je">
    <img src="public/favicons/logo-light.png" alt="Movie Download Online Logo" width="320" height="120">
  </a>

 

  <p align="center">
    A free, ad-free movie download catalog for local network media workflows.
    <br />
    <a href="https://movie.world.qd.je"><strong>Visit the site »</strong></a>
    <br />
    <br />
    <a href="https://movie.world.qd.je">Live Site</a>
    &middot;
    <a href="https://github.com/QaisarRajput/movie/issues/new?labels=bug&template=bug-report.md">Report Bug</a>
    &middot;
    <a href="https://github.com/QaisarRajput/movie/issues/new?labels=enhancement&template=feature-request.md">Request Feature</a>
  </p>
</div>


<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#deployment">Deployment</a></li>
    <li><a href="#legal-safety-and-disclaimer">Legal Safety and Disclaimer</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>


## About The Project

Movie Download Online is a lightweight catalog website for discovering movie download links and metadata.

This website is built for local network media workflows and supports movie discovery with download references and metadata.

### Built With

- [React](https://reactjs.org/)
- [Chakra UI](https://chakra-ui.com/)
- [React Router](https://reactrouter.com/)
- [GitHub Pages](https://pages.github.com/)


## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js
- npm

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/QaisarRajput/movie.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Start the app
   ```sh
   npm start
   ```


## Usage

The site loads movie metadata from a global API base URL defined in `src/config.js`.

Use the language sections to browse Hindi and French movie collections, and click `See all` for full category pages.

The app is designed to be used with local services like Jellyfin and qBittorrent for a private media workflow.


## Deployment

This project includes a GitHub Actions workflow for deploying to GitHub Pages.

Current custom domain:

- `movie.world.qd.je`

If the API endpoint changes, update `src/config.js` or set `REACT_APP_API_BASE_URL`.


## Legal Safety and Disclaimer

Movie Download Online is a catalog website and does not claim ownership of any movie content.

- The site provides **download links and metadata** only.
- No intellectual property is claimed for any movie content.
- If a valid **DMCA takedown** or other legal notice is received, this site will comply and remove content promptly.
- This site is intended for **local network use only**, with tools such as Jellyfin and qBittorrent.
- It is provided **as-is** with no warranties.

> This is a legal safety net: if the website is brought down, the project accepts takedown requests and will comply with all applicable laws.


## Contributing

We are looking for contributors.

See [CONTRIBUTING.md](CONTRIBUTING.md) for how to help.

### Want to help?

- UI improvements
- Local network integration
- API compatibility updates
- Documentation and legal clarity


## License

Distributed under the MIT License.


## Contact

Project Link: [https://github.com/QaisarRajput/movie](https://github.com/QaisarRajput/movie)


<!-- MARKDOWN LINKS & IMAGES -->
[contributors-shield]: https://img.shields.io/github/contributors/QaisarRajput/movie.svg?style=for-the-badge
[contributors-url]: https://github.com/QaisarRajput/movie/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/QaisarRajput/movie.svg?style=for-the-badge
[forks-url]: https://github.com/QaisarRajput/movie/network/members
[stars-shield]: https://img.shields.io/github/stars/QaisarRajput/movie.svg?style=for-the-badge
[stars-url]: https://github.com/QaisarRajput/movie/stargazers
[issues-shield]: https://img.shields.io/github/issues/QaisarRajput/movie.svg?style=for-the-badge
[issues-url]: https://github.com/QaisarRajput/movie/issues
[license-shield]: https://img.shields.io/github/license/QaisarRajput/movie.svg?style=for-the-badge
[license-url]: https://github.com/QaisarRajput/movie/blob/main/LICENSE.md
