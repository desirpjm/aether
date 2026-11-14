# AETHER — Astronaut Environmental Telemetry, Health & Emergency Response

Built for the **2026 NASA International Space Apps Challenge** (*Create Health Monitoring Software for Astronauts on Space Missions*).

## Overview
**AETHER** is an offline-ready, high-contrast astronaut biometric and life-support monitoring dashboard designed for low-glare readability and night-vision preservation in dimly lit spacecraft cabins.

### Key Features
- **Individualized Crew Risk Engine:** Cross-references live wearable bio-band vitals against each astronaut's age, biological sex, BMI, and prior medical history (including SANS ocular sensitivity, lumbar loading, and genomic radiation thresholds).
- **Interactive Anatomical Hazard Explorer:** Clickable 5-node human anatomy schematic mapping sensor checks directly to NASA HRP's 5 Hazards of Human Spaceflight.
- **Calibrated Space Sectors & Light-Time Latency:** Models environmental pressures, gravity, temperatures, and one-way Earth communication delays across ISS Low Earth Orbit, Lunar Gateway, Artemis South Pole Base, Mars Transit, and Jezero Crater.
- **O₂ Mask & Suit Seal Diagnostic:** 5-second simulated pressure/seal scan (`ppO₂`, CO₂ scrubber capacity, seal integrity) paired with tailored emergency checklists and interactive habitat navigation routing.
- **Autonomous Flight Surgeon Dispatch:** Compiles priority clinical telemetry packets when Earth communication delays exceed real-time response windows.

## NASA & Partner Scientific References
- **NASA Human Research Program (HRP):** 5 Hazards of Human Spaceflight & Spaceflight Associated Neuro-ocular Syndrome (SANS) Evidence Reports
- **NASA-STD-3001:** Spaceflight Human-System Standard
- **Artemis II / Lunar Gateway / LRO Diviner:** Exploration Atmosphere & Lunar South Pole Environmental Models
- **Mars 2020 Perseverance MEDA & MSL RAD:** Martian Surface & Deep-Space Transit Telemetry
- **Canadian Space Agency (CSA):** CANS Neutron Radiation Monitoring (~30% ISS neutron dose modeling)

## Tools & AI Attribution
- UI/UX Architecture, Ergonomic Design System & Clinical Logic designed by the creator.
- Frontend React/TypeScript application scaffolded and iterated using **Lovable** (AI-assisted development tool), in compliance with NASA Space Apps AI disclosure guidelines.
