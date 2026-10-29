
# Ionovante Aeros — Configurator Project Brief

## Objective
Create a standalone, responsive vehicle configurator for the Ionovante Aeros that works both:

1. As a consumer-facing web experience
2. As an embeddable iframe for dealer training

---

## Vehicle Overview

Ionovante Aeros:
- Compact electric crossover
- Urban performance focus
- Tech-forward, software-defined experience
- Clean, minimalist design philosophy

Target audience:
- Tech-forward professionals
- EV adopters
- Urban drivers

---

## Core Experience

The configurator is a **single-page interactive experience** with:

1. Trim selection
2. Paint selection (visual)
3. Powertrain + technology options
4. Real-time pricing updates
5. Finance calculator
6. Final summary

---

## Configuration Model

### Trims

#### Base
- Entry configuration
- Fully customizable

#### Excellence
- Includes:
  - Long-range battery
- Positioned as premium upgrade
- Reduces need for manual upgrades

---

### Options

#### Paint
- Electric Blue
- Silver
- Black
- White

#### Powertrain
- AWD (Dual Motor)

#### Battery
- Standard battery
- Long-range battery (included in Excellence)

#### Technology
- Autonomous / driver assistance package

---

## Pricing Strategy (Fictional but Realistic)

Baseline targets:

- Base trim: ~$45,000
- Excellence trim: ~$52,000

Example option pricing:
- AWD: +$4,000
- Long-range battery: +$6,000
- Autonomy package: +$5,000

Pricing must:
- Feel realistic
- Scale logically
- Update instantly

---

## Finance Experience

### Modes

#### Purchase
- Shows MSRP only

#### Financing
- Monthly payment calculation
- Default:
  - 6.9% APR
  - 60 months

#### Lease
- Estimated monthly payment
- Simplified (no backend calculation required)

---

## Visual System

### Design Goals
- Minimal
- Technical
- High-contrast
- Clean layout

### Interaction Style
- Fast
- Responsive
- No lag on option changes

### Imagery
- Single hero angle of vehicle
- Paint changes swap image variants
- No 3D or heavy rendering

---

## Technical Requirements

- Pure HTML / CSS / JS
- No frameworks
- No backend
- No dependencies

---

## Responsive Requirements

Must work on:
- Desktop
- Tablet (primary secondary target)

Must support:
- Embedded iframe usage
- Flexible container sizes

---

## Constraints

- Session-based only (no save/share yet)
- No external APIs
- No authentication
- No persistence beyond session

---

## Future Enhancements (Do NOT build yet)

- Save/share configurations
- Dealer mode with presets
- Multi-vehicle (Vanta)
- Regional pricing
- API integration

---

## Success Criteria

The experience is successful if:

- Users can configure a vehicle intuitively
- Pricing updates instantly and accurately
- Finance calculations feel realistic
- Works seamlessly in iframe and browser
- Visual experience feels premium and clean

---

## First Tasks for Codex

1. Review current implementation
2. Normalize state management
3. Implement full trim logic
4. Ensure pricing consistency
5. Implement finance calculator cleanly
6. Improve tablet responsiveness
7. Clean up layout for iframe embedding

---
