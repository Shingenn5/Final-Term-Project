# AGENTS.md

## Project Overview

This is a static frontend data visualization web app for a college-level project.

The app helps elementary school students explore U.S. state population changes over time using the Data USA API.

## Core Rules

- **Use HTML5, CSS, Bootstrap/Bootswatch, vanilla JavaScript, and Chart.js only.**
- **Do not use React, Vue, Angular, Svelte, or any other frontend framework.**
- **Do not use TailwindCSS.**
- **Do not add backend code, build tools, bundlers, or package managers.**
- **Use semantic HTML.**
- **Make the app responsive on desktop, tablet, and mobile.**
- **Use Hungarian Notation.**

## UI And UX

- **Design for elementary school students.**
- **Use simple, clear language.**
- **Keep instructions visible and easy to follow.**
- **Make controls obvious, such as dropdowns and buttons.**
- **Avoid clutter and unnecessary decoration.**
- **Use friendly colors, but keep the design clean.**
- **Make charts easy to read and clearly labeled.**

## Accessibility

- **Use semantic elements like `header`, `main`, `section`, `form`, and `footer`.**
- **Every input must have a visible label.**
- **Buttons must have clear text.**
- **Use strong color contrast.**
- **Do not rely on color alone to explain data.**
- **Make the app usable with a keyboard.**
- **Show clear loading and error messages.**
- **Add text summaries near charts when useful.**

## Data And API

- **Use the Data USA API.**
- **Fetch population data by state and year.**
- **Sort and structure data before visualizing it.**
- **Do not hard-code population data that should come from the API.**
Useful API base:
- **`https://datausa.io/api/data`**

## JavaScript Guidelines

- **Use vanilla JavaScript only.**
- **Use clear variable and function names.**
- **Comment important logic, especially API and chart code.**
- **Reuse one Chart.js instance when updating the chart.**
- **Avoid complex state management or unnecessary abstractions.**

## Styling Guidelines

- **Use Bootstrap/Bootswatch as the main styling system.**
- **Keep custom CSS minimal.**
- **Use custom CSS only for spacing, readability, chart sizing, or small responsive fixes.**
- **Do not create a large custom design system.**

## Validation Checklist

Before finishing, confirm:

- **The app uses only the approved tech stack.**
- **HTML is semantic and accessible.**
- **The UI is responsive and child-friendly.**
- **Data loads from the Data USA API.**
- **Charts render correctly.**