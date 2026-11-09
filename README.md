# Wheelhaus — On-Demand Vehicle Wash & Detailing Platform

Wheelhaus is a hyper-local, multi-tenant vehicle care and detailing platform pilot for Kazhakoottam and Technopark, Trivandrum.

---

## 🌟 Highlights & Capabilities

### 1. 📱 Dual Phone Interactive Stage (`apps` view)
Experience real-time end-to-end synchronization between the **Customer App** and the **Vendor Partner Console** side-by-side:
- **Instant Booking Dispatch:** Arjun books a full wash with Pick & Drop on the customer phone.
- **10-Minute Acceptance SLA:** The vendor phone receives the incoming request with a live timer, customer location, and net earnings calculation.
- **Driver Checklist & OTP Handover:** Step-by-step progress tracking (Accepted &rarr; Picked up &rarr; In Progress &rarr; Out for delivery &rarr; Completed) with 4-digit handover OTP validation.
- **Dynamic Fallbacks:** If a vendor declines or lets a request expire, the customer app automatically recommends nearby alternate live centres without charging the customer.
- **Live Mode & Radius Tuning:** Toggling delivery radius or service modes in the Vendor portal immediately reflects across customer search results.

### 2. 🚗 Customer App Solo (`customer` view)
- **Multi-Vehicle Garage:** Switch between Hatchbacks, Sedans, SUVs, and Bikes with vehicle-specific pricing.
- **Discovery & Distance Filtering:** Real-time distance, rating, and service mode filters (*At Centre*, *Pick & Drop*, *At Home*).
- **Interactive Multi-Centre Comparison:** Compare up to 3 car spas side-by-side with color-coded best value indicators.
- **2-Step Checkout:** Transparent cost breakdown including service mode fees and platform tech fee (₹19).
- **Post-Wash Reviews:** Star rating and verified review submission that updates partner ratings immediately.
- **Customer Profile:** Saved addresses, vehicles, and Phase 2 *WashPass* teaser.

### 3. 🏪 Vendor Partner Portal Solo (`vendor` view)
- **Multi-Centre Switcher:** Test different garage consoles (*BlueDrop*, *Technopark Foam Wash*, *Shine Bay*, etc.).
- **Incoming Requests:** 10-minute countdown SLA with net payout calculation `(base + mode fee) - commission`.
- **Active Jobs Stepper:** Step advancement with customer OTP verification at pickup, collection, or home wash completion.
- **Service Configuration:** Switch Walk-in, Pick & Drop, and Doorstep modes on/off with custom service radius (km) and extra fees (₹).
- **Earnings & Settlement:** GMV metrics, platform commission deduction, and Monday payout forecast.

### 4. 📊 Super Admin Operations Dashboard (`admin` view)
- **Real-Time Dispatch Feed:** Live tabular telemetry with flash highlight updates.
- **Cluster KPIs:** Today's Orders, Gross Merchandise Value (GMV), Platform Revenue, Live Partner count, Customer Rating average, and Partner Acceptance SLA %.
- **Service Mode Breakdown:** Distribution bars across Walk-in, Pick & Drop, and Doorstep washes.
- **Partner KYC & Commission Control:** Configure partner commission percentages (e.g. 10%–15%) and approve pending partners (*Pothencode Wash Point*).
- **Cluster Roadmap:** Operational zones overview (*Kazhakoottam live*, *Trivandrum City Phase 2*, *Kochi Phase 4*).

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v20+)
- npm

### Running the App Locally
```bash
# Install dependencies
npm install

# Start the Vite development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production
```bash
npm run build
npm run preview
```

---

## 🛠️ Tech Stack
- **Framework:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS v4
- **Icons:** Lucide React
- **Effects:** Canvas Confetti
- **State Architecture:** React Context + LocalStorage persistence
