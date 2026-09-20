# ResiFlow — Next-Generation Smart Residential & Society Management Platform

![ResiFlow Banner](https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=80)

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL-000000?logo=three.js&logoColor=white)](https://threejs.org/)
[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**ResiFlow** is a modern, ultra-premium society ERP and residential security platform designed for gated communities, apartment associations (RWA), high-rise towers, and residential townships.

---

## 🌟 Key Features

- **3D Interactive Visualizer**: Dynamic Three.js WebGL particle environment and interactive telemetry dock.
- **Spotlight Magnetic Cursor**: Custom 60fps radial spotlight with smooth magnetic hover animations.
- **Interactive Simulator**:
  - Instant Visitor Pass generation with dynamic QR code rendering and download.
  - Interactive Society Maintenance dues calculator with 1-click UPI simulation.
  - Amenity slot booking (Clubhouse, Tennis Court, Banquet).
  - 1-Tap Emergency SOS Security siren simulation.
- **24-Hour Storytelling Simulator**: Interactive time-travel tabs illustrating security and resident operations across morning rush, midday deliveries, evening clubhouse hours, and late-night perimeter patrols.
- **Dynamic "How It Works" Route**: Scroll-driven SVG road drawing and checkpoint activations.
- **Infinite Testimonial Marquee**: Multi-directional vertical review columns with screen-edge fade masks.
- **Transparent Society Pricing**: 20% annual discount toggle, per-flat cost estimator, and expandable feature comparison drawer.
- **Interactive Modals**:
  - Direct UPI payment modal with automated canvas confetti celebration.
  - Resident Portal multi-role login interface (Resident / Guard / Admin).
  - Schedule Live Demo booking flow.

---

## 🚀 Quick Start

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/SubhradipMishra/ResiFlowProject.git
   cd ResiFlowProject/client
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local Vite dev server:**
   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🛠️ Production Build & Deployment

To compile and produce optimized static assets for production:

```bash
cd client
npm run build
```

The optimized production bundle will be generated in `client/dist/`.

### Deployment Options

- **Vercel**: Connect this GitHub repository and set the root directory to `client` or configure build command `npm run build` with output directory `dist`.
- **Netlify**: Set base directory `client`, build command `npm run build`, and publish directory `client/dist`.
- **GitHub Pages / AWS S3 + CloudFront**: Deploy the static contents of `client/dist/`.

---

## 🏗️ Project Structure

```
SmartResidence/
├── .gitignore
├── README.md
└── client/
    ├── index.html
    ├── package.json
    ├── vite.config.ts
    ├── tsconfig.json
    ├── src/
    │   ├── App.tsx
    │   ├── main.tsx
    │   ├── index.css
    │   └── components/
    │       ├── Navbar.tsx
    │       ├── Hero.tsx
    │       ├── ThreeHeroCanvas.tsx
    │       ├── SpotlightCursor.tsx
    │       ├── Pillars.tsx
    │       ├── AboutSection.tsx
    │       ├── FeaturesSection.tsx
    │       ├── InteractiveSimulator.tsx
    │       ├── WhyChooseUs.tsx
    │       ├── HowItWorks.tsx
    │       ├── Testimonials.tsx
    │       ├── PricingSection.tsx
    │       ├── CallToAction.tsx
    │       ├── FAQSection.tsx
    │       ├── Footer.tsx
    │       └── Modals/
    │           ├── PaymentModal.tsx
    │           ├── DemoModal.tsx
    │           └── ResidentPortalModal.tsx
```

---

## 📄 License
This project is licensed under the MIT License.
