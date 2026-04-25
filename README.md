# 🌍 GeoSentinel – Deforestation Alert System for Nyungwe National Park

<p align="center">
  <img src="docs/banner.png" alt="GeoSentinel Banner" width="800" />
</p>

> AI & GIS-powered satellite monitoring platform that detects deforestation in real-time and alerts park rangers via SMS and a web dashboard.

[![SDG 15](https://img.shields.io/badge/SDG%2015-Life%20on%20Land-4C9F38?style=for-the-badge)](https://sdgs.un.org/goals/goal15)
[![SDG 13](https://img.shields.io/badge/SDG%2013-Climate%20Action-3F7E44?style=for-the-badge)](https://sdgs.un.org/goals/goal13)
[![SDG 11](https://img.shields.io/badge/SDG%2011-Sustainable%20Cities-F99D26?style=for-the-badge)](https://sdgs.un.org/goals/goal11)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

---

## 📋 Table of Contents

- [About the Project](#-about-the-project)
- [The Problem](#-the-problem)
- [Our Solution](#-our-solution)
- [System Architecture](#-system-architecture)
- [Demo](#-demo)
- [Getting Started](#-getting-started)
- [Tech Stack](#-tech-stack)
- [Project Roadmap](#-project-roadmap)
- [Team](#-team)
- [Links](#-links)
- [License](#-license)

---

## 🌿 About the Project

**GeoSentinel** is an AI and GIS-powered web platform that automatically analyses freely available ESA Sentinel-2 satellite imagery to detect deforestation and vegetation loss in and around **Nyungwe National Park, Rwanda**. The system computes NDVI (Normalized Difference Vegetation Index) changes between successive satellite passes every 5 days, identifies newly cleared patches, estimates their area in hectares, and delivers alerts to park rangers and conservation authorities.

**Submitted for:** YESIST12 / iEXPLORE Innovation Challenge Track at the IEEE Africa Entrepreneurship Summit 2026.

---

## 🔴 The Problem

- **Nyungwe National Park** (1,019 km²) is Rwanda's largest montane rainforest and one of Africa's most biodiverse ecosystems — home to **13 primate species** and over **300 bird species**.
- The park is losing an estimated **1,000+ hectares annually** to illegal deforestation, agricultural encroachment, and fire damage.
- Park rangers rely on **manual foot patrols** to detect threats across this vast terrain, meaning illegal clearing events go **undetected for weeks or months**.
- **No automated, affordable, and locally-adapted** land monitoring system exists for park authorities in East Africa.
- Free satellite imagery from ESA Sentinel-2 revisits the region every 5 days but is **never systematically analysed** or converted into operational alerts.

---

## ✅ Our Solution

GeoSentinel operates in **four automated steps**:

| Step | Process | Description |
|------|---------|-------------|
| 1️⃣ | **Data Ingestion** | Downloads Sentinel-2 multispectral imagery (Bands 4 & 8) every 5 days via the free ESA Copernicus API |
| 2️⃣ | **Change Detection** | Computes NDVI for each image and compares against a 30-day rolling baseline. Flags patches with NDVI decline above threshold |
| 3️⃣ | **Alert Generation** | Maps flagged zones on a GIS dashboard with GPS location, area estimate, and detection date. Dispatches SMS alerts to rangers |
| 4️⃣ | **Dashboard & Reports** | Mobile-responsive web interface for viewing active alerts, historical trends, and downloading monthly reports |

**Key advantages:**
- 100% free satellite data (ESA Copernicus Sentinel-2)
- No physical hardware — fully cloud-native
- Reduces detection time from weeks to 5 days
- Scalable to any African protected area
- Designed for low-bandwidth environments

---

## 🏗 System Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐     ┌──────────────────┐
│  ESA Sentinel-2  │────▶│  NDVI Change      │────▶│  Alert Engine    │────▶│  Web Dashboard    │
│  Copernicus API  │     │  Detection        │     │  + SMS Gateway   │     │  (Leaflet.js)     │
│  Bands 4 & 8     │     │  30-day baseline  │     │  GPS + Area (ha) │     │  Mobile-responsive │
└─────────────────┘     └──────────────────┘     └─────────────────┘     └──────────────────┘
       ▲                                                                          │
       │                    Every 5 days (automated)                              │
       └──────────────────────────────────────────────────────────────────────────┘
```

---

## 🖥 Demo

This repository contains an **interactive prototype dashboard** demonstrating the GeoSentinel platform.

### Features in the Demo

- **Map View** — Interactive map of Nyungwe with color-coded alert markers (click to inspect)
- **Alerts List** — Filterable list of all deforestation events with severity indicators
- **NDVI Trends** — 6-month vegetation health chart showing decline over time
- **SMS Simulation** — Button to simulate an SMS alert dispatch to park rangers
- **Live Stats** — Real-time sidebar with active alerts, area at risk, and NDVI average

### 🎥 Video Demo

[![Watch the GeoSentinel Demo](https://img.shields.io/badge/▶%20Watch%20Demo-Google%20Drive-4285F4?style=for-the-badge&logo=googledrive&logoColor=white)](https://drive.google.com/file/d/1hzwlP8dOS0FldPJtag7yNOKv8Y5Mpir1/view?usp=sharing)

> Click the button above to watch the full platform walkthrough.

### Screenshots

<!-- Add your screenshots here -->
<!-- ![Map View](docs/screenshot-map.png) -->
<!-- ![Alerts View](docs/screenshot-alerts.png) -->
<!-- ![Trends View](docs/screenshot-trends.png) -->

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- npm (comes with Node.js)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Tetoalia/Geosentinel_project.git
cd Geosentinel_project

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open **http://localhost:5173** in your browser.

### Build for Production

```bash
npm run build
```

The output will be in the `dist/` folder, ready to deploy to any static hosting service (GitHub Pages, Vercel, Netlify, etc.).

### Deploy to GitHub Pages

```bash
# Install gh-pages
npm install --save-dev gh-pages

# Add to package.json scripts:
# "deploy": "gh-pages -d dist"

# Build and deploy
npm run build
npm run deploy
```

---

## 🛠 Tech Stack

| Component | Technology |
|-----------|-----------|
| **Satellite Data** | ESA Sentinel-2 (Copernicus Open Access Hub) |
| **Vegetation Index** | NDVI Change Detection Algorithm |
| **Validation** | Google Earth Engine |
| **Backend** | Python, REST API |
| **GIS Mapping** | Leaflet.js |
| **Frontend** | React, Vite |
| **Notifications** | SMS Gateway API |
| **Hosting** | Cloud-native (AWS/GCP) |

---

## 📅 Project Roadmap

| Quarter | Phase | Milestones |
|---------|-------|------------|
| Q1 2026 | **MVP Development** | Core NDVI pipeline, Sentinel-2 integration, basic web dashboard |
| Q2 2026 | **Pilot Launch** | Nyungwe deployment, ranger training, SMS alert system |
| Q3 2026 | **Validation** | Accuracy benchmarking, user feedback, Sentinel-1 SAR fallback |
| Q4 2026 | **Scale & Partner** | Expand to 3+ parks, RDB/WCS partnerships, grant applications |
| 2027+ | **Pan-African Expansion** | Deploy across 50+ protected areas with institutional partnerships |

---

## 👥 Team

| Name | Role |
|------|------|
| **Alia Teto** | Researcher & Team Leader |
| **Robert Uwitonze** | AI/GIS Engineer |
| **Sostene Munezero Bagira** | AI & GIS Engineer |
| **Anny Christelle Irakoze** | Researcher |
| **Patrick Nshimiyimana** | Software Engineer |

---

## 🔗 Links

<!-- Update these links as needed -->

| Resource | Link |
|----------|------|
| **Live Demo** | _Coming soon_ |
| **Pitch Deck (PDF)** | _Add link_ |
| **Video Demo** | [Watch on Google Drive](https://drive.google.com/file/d/1hzwlP8dOS0FldPJtag7yNOKv8Y5Mpir1/view?usp=sharing) |
| **YESIST12 Competition** | [IEEE YESIST12](https://yesist12.org) |
| **ESA Copernicus** | [Copernicus Open Access Hub](https://scihub.copernicus.eu/) |
| **Global Forest Watch** | [globalforestwatch.org](https://www.globalforestwatch.org/) |

---

## 📚 References

1. Hansen, M.C., et al. (2013). High-Resolution Global Maps of 21st-Century Forest Cover Change. *Science*, 342(6160), 850–853.
2. Reiche, J., et al. (2021). Forest disturbance alerts for the Congo Basin using Sentinel-1. *Environmental Research Letters*, 16(2).
3. Giglio, L., et al. (2003). An enhanced contextual fire detection algorithm for MODIS. *Remote Sensing of Environment*, 87(2–3), 273–282.
4. Rwanda Development Board. (2024). Nyungwe National Park Management Annual Report.
5. United Nations. (2023). The Sustainable Development Goals Report 2023.
6. European Space Agency. (2024). Copernicus Open Access Hub – Sentinel-2 Mission Overview.
7. Rouse, J.W., et al. (1974). Monitoring vegetation systems in the Great Plains with ERTS.
8. World Resources Institute. (2024). Global Forest Watch Platform.

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  <strong>GeoSentinel</strong> — Protecting Africa's forests with open data and AI<br/>
  <em>IEEE Africa Entrepreneurship Summit 2026</em>
</p>
