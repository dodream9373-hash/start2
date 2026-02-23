
# Blueprint: Global Lotto Generator - Cyber Edition

## Overview

A web application that generates lottery numbers with a futuristic, cyber-themed interface. The application will feature a waiting list to manage high demand.

## Implemented Features

*   **Initial Design:**
    *   Cyberpunk-inspired aesthetic with a dark theme, neon green text, and animated background gradients.
    *   Custom font ("Orbitron") for a futuristic feel.

## Current Plan: Waiting List Feature

1.  **Create a waiting list form:**
    *   Add an HTML form to `index.html` allowing users to enter their email address to join a waiting list.
    *   The form will be encapsulated in a `<waiting-list>` custom element.
2.  **Style the form:**
    *   Create CSS rules in `style.css` to match the form's appearance with the existing cyber theme.
    *   The form will be visually distinct but cohesive with the overall design.
3.  **Add interactivity with JavaScript:**
    *   In `main.js`, define the `WaitingList` custom element.
    *   The custom element will handle form submission.
    *   Upon submission, the user's email will be added to a conceptual "waiting list," and a confirmation message will be displayed.
