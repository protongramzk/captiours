# Captiours

Captiours is a client-side web application designed for content creators to generate Instagram carousel posts in bulk efficiently, consistently, and adhering to Material Design 3 guidelines.

![Status](https://img.shields.io/badge/status-active-success)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## Overview

Captiours streamlines the workflow of designing multi-page Instagram carousels. By utilizing a dynamic form management system, users can generate multiple pages simultaneously, maintain visual continuity through automated image inheritance, and export high-resolution assets locally using client-side rendering technologies.

## Key Features

- **Bulk Page Creator:** Dynamically add and remove carousel pages with automated sequence calculation and updates.
- **Image Inheritance:** Newly generated pages automatically inherit the image asset from the preceding page to preserve visual context and reduce redundancy.
- **Dynamic Global Customization:**
  - Real-time adjustment of the creator handle identifier.
  - Cover image height ratio slider (20% to 80%).
  - Font size scaling factor configuration.
  - Multiple color theme selections (Light, Dark, Ocean, Forest, Sunset, Coffee, and Cyberpunk).
- **Integrated Preview and Bulk Export:** Modal-based sequence review and automated sequential downloading of all pages utilizing `html2canvas`.

## Technology Stack

- **Markup & Styling:** HTML5, CSS3 (CSS Custom Properties)
- **Scripting:** Vanilla JavaScript (ES6+)
- **Typography & Icons:** Google Fonts (Inter), Google Material Icons
- **Rendering Library:** `html2canvas`

## Getting Started

As a purely static frontend application, Captiours requires no complex build tools, package managers, or server-side configurations.

### Installation

1. Clone the repository:
   ```bash
   git clone [https://github.com/username-kamu/captiours.git](https://github.com/username-kamu/captiours.git)

```
 2. Navigate to the project directory.
### Usage
Open the index.html file directly in any modern web browser (Google Chrome, Mozilla Firefox, Microsoft Edge, or Apple Safari).
## License
This project is distributed under the terms of the MIT License. Refer to the LICENSE file for further details.
