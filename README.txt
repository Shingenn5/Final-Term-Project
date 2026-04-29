State Population Explorer

This project was created with help from AI. The AI was used to turn the project requirements into a complete static frontend app with semantic HTML, Bootstrap styling, accessible controls, Data USA API calls, and Chart.js visualization. It also helped keep the code beginner-friendly by using clear names, comments, and simple functions.

AI was also used to check that the implementation followed the project rules in AGENTS.md. The app avoids frameworks, TailwindCSS, backend code, build tools, and Node.js. It can be opened directly in a browser by opening index.html.

Original prompt used:
You are building a complete frontend web application.

An AGENTS.md file already exists in this project. You MUST follow it strictly.

Your task is to generate the FULL project implementation.

GOAL

Create an interactive, accessible, responsive web app for elementary school students to explore U.S. state population changes over time using the Data USA API.

REQUIRED FILES (CREATE ALL)

* index.html
* styles.css
* script.js
* README.txt

Do NOT recreate AGENTS.md.

CORE FEATURES (ALL REQUIRED)

1. Year slider (range input)

   * Updates displayed data dynamically

2. State selection (multi-select)

   * Allow selecting multiple states

3. Data visualization

   * Use Chart.js (CDN)
   * Display a line chart comparing selected states over time

4. API integration

   * Fetch population data from Data USA API
   * Handle errors cleanly

DESIGN REQUIREMENTS

* Use Bootstrap (Bootswatch theme via CDN)
* Clean, colorful, kid-friendly UI
* Clear instructions for users
* Fully responsive layout

ACCESSIBILITY

* Semantic HTML
* Labels for all inputs
* ARIA attributes where appropriate
* Good color contrast
* Chart description for screen readers

CODE QUALITY

* Comment all major logic
* Use simple, readable JavaScript
* No unnecessary complexity
* No placeholders or TODOs

HARD CONSTRAINTS

* NO React / Vue / Angular
* NO TailwindCSS
* NO Node.js
* MUST be static (open index.html to run)

README.txt

Include:

* 2-3 paragraphs explaining how AI was used
* Include the original prompt used
* Brief explanation of features

OUTPUT RULES

* Generate COMPLETE working code
* All files must integrate correctly
* No missing pieces
* No partial implementations

Now generate the full project.

Features:
The app lets students choose multiple U.S. states, load population data from the Data USA API, compare the selected states in a Chart.js line chart, and move a year slider to see population cards for a specific year. It includes loading messages, friendly error handling, responsive Bootstrap layout, labels for controls, and a screen-reader chart description.
