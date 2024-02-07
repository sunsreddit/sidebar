<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/sunsreddit/sidebar/">
    <img src="docs/images/logo.png" alt="Logo" width="235" height="177">
  </a>
  <h3 align="center">☀️ Phoenix Suns Sidebar Generator 📊</h3>
  <p align="center">
    An automated service that updates the r/SUNS sub-reddit sidebar with the latest Phoenix Suns roster & schedules!
    <br />
    <a href="https://github.com/sunsreddit/sidebar"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://agile.sunsreddit.net/projects/suns-sidebar-project/">View Project</a>
    ·
    <a href="https://github.com/sunsreddit/sidebar/issues">Report Bug</a>
    ·
    <a href="https://github.com/sunsreddit/sidebar/issues">Request Feature</a>
  </p>
</div>

<div align="center">
 <a href="https://github.com/sunsreddit/sidebar/actions/workflows/ci.yaml">
 <img src="https://github.com/sunsreddit/sidebar/actions/workflows/ci.yaml/badge.svg" alt="CI/CD">
</div>

<!-- TABLE OF CONTENTS -->
<a name="readme-top"></a>
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
      <ul>
        <li><a href="#i-environment-variables">Environment Variables</a></li>
        <li><a href="#ii-configuration-parameters">Configuration Parameters</a></li>
        <li><a href="#iii-main-module">Main Module</a></li>
        <li><a href="#iv-cron">Cron</a></li>
        <li><a href="#v-docker">Docker</a></li>
      </ul>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
        <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

## About The Project

As our amazing basketball community grows, the r/SUNS subreddit is developing tools like
this sidebar generator to help automate tasks which helps promote the highest quality of content.
The "Phoenix Suns Sidebar Generator" retrieves the latest NBA data and creates a subreddit sidebar
tables with the pertinent details of game scores, players, and other fun statistics.

## Getting Started

  The following prerequisites and requirements are necessary for the success of this project:

### Prerequisites

- [![Node][node-shield]][node-url]
- [![Docker][docker-shield]][docker-url]

## Usage

  Setup your project environment by installing node dependencies (`npm i`),
  add variables, add parameters, & select a deployment method:

- *(ad-hoc)* [Using main module](#iii-main-module)
- *(ad-hoc)* [Using built-in cron](#iv-cron)
- *(automation)* [Using Docker](#v-docker)

### I. Environment Variables

  Rename `.env.sample` to `.env` and add the variables with the appropriate values.
  
  ```bash
  TZ=America/New_York # TimeZone  
  CRON=0|1 # Enable Cron support
  VERSION=1.0.0 # package.json project version
  CLIENT_ID=ABcD0fghIj2kLMNopqRSTUv # See Reddit API documentation
  CLIENT_SECRET=A1Bc_D_EfG2hIjK3LmnoPQrs4tu # See Reddit API documentation
  ACCESS_TOKEN=abcDeFghiJKlMnOPqRsTUVWxYz01234567890... #See Reddit API documentation
  REFRESH_TOKEN=01234567890123-abcDEfGhIJKLmnopqRst0UV12Wxy-z # See Reddit API documentation
  ```

### II. Configuration Parameters

Rename `config/parameters.sample` to `config/parameters.json`and add the keys
with the appropriate values.

### III. Main Module

- Run the following NPM script: `npm run start` or `node ./bin/index.mjs`

### IV. Cron

- Specify a cron schedule in `config/parameters.json`
- Add `CRON=1` in `.env`
- Run the following NPM script: `npm run start:cron` or `node ./bin/cron.mjs`

### V. Docker

- Add version number to the `VERSION` in `.env`
- Add `CRON=1` in `.env`
- For no prompting, build with the following NPM script: `npm run build:docker:force`
- For prompting, build with the following NPM script: `npm run build:docker`

  ```bash
  # example
  #
  docker run -d --env-file .env --name sidebar-1.0.0 sunsreddit/sidebar:1.0.0
  ```

## Contributing

  If you have a suggestion that would make this better, please fork the repo and create
  a pull request. You can also simply open an issue with the tag "enhancement".
  Don't forget to give the project a star! Thanks again!

  1. Fork the Project
  2. Create your Feature Branch (`git checkout -b feature/project-id`)
  3. Commit your Changes (`git commit -m 'Add the thing'`)
  4. Push to the Branch (`git push origin feature/project-id`)
  5. Open a Pull Request

## Roadmap

  | TO DO          | Description                                          | Status
  | --             | --                                                   | --
  | Usage          | Add "Usage" instructions in the README.md            | ✅
  | Automation     | A Docker service that automates the projects actions | ✅
  | Unit Tests     | Jest UTs for all project modules                     | ✅
  | GitHub Actions | Continuous integration and project automation        | 🚧 Ongoing

## License

  Distributed under the MIT License. See [LICENSE][license-url] for more information.

## Contact

<html>
  <body>
    <p><img src="./docs/images/reddit.svg" alt="u/bruxc"
    style="width:1%;
      filter: invert(32%)
      sepia(91%) saturate(2585%)
      hue-rotate(0deg)
      brightness(100%)
      contrast(110%);">
    <a href="https://reddit.com/u/bruxc/">u/bruxc</a>
    </p>
  </body>
</html>

<p align="right">(<a href="#readme-top">back to top</a>)</p>

  <!-- Shields -->

  [docker-shield]: https://img.shields.io/badge/Docker-%5E25.0.2-green?style=appveyor&logo=docker
  [docker-url]:    https://docs.docker.com/engine/install/
  [node-shield]:   https://img.shields.io/badge/Node.js-%5E21.6.1-green?style=appveyor&logo=nodedotjs
  [node-url]:      https://nodejs.org/en/docs/

  <!-- License -->
  [license-url]: LICENSE
