# Zephyria Hall of Fame
This project is a fictional landing page inspired by the universe of Zephyria. The goal is to present a Hall of Fame where characters can be displayed in a carousel and new ones can be added through a registration form. The system uses HTML, CSS and JavaScript on the frontend and Node.js on the backend to store characters in a local JSON file. The project was created as a practical exercise in web development, connecting interface design, API communication and simple data storage.

# Overview
The website displays a carousel of characters from the Zephyria universe. Each character includes information such as name, title or description. New characters can be added using a form, and the data is saved in a local JSON file that works as a simple database.

# Technologies Used

HTML for page structure CSS for layout and styling JavaScript for interactions and API communication Node.js for the backend server JSON for simple data storage

# Project Structure
  Zephyria 
    index.html 
    style.css 
    script.js
  JS 
    server.js
  JSON 
    characters.json

index.html contains the main page structure and the character carousel.

style.css defines the visual design of the website.

script.js controls the carousel behavior and sends form data to the server.

server.js creates the API responsible for reading and saving characters.

characters.json works as a simple database where characters are stored.

# How to Run the Project
Install Node.js on your computer.

Open a terminal inside the project folder.

Start the server using the command:

node JS/server.js

Open your browser and go to:
http://localhost:3000

With the server running, the page will load the characters stored in the JSON file and allow new characters to be added.

API
The project uses a simple API created with Node.js.

GET /api/characters Returns the list of stored characters.

POST /api/characters Adds a new character to the characters.json file.

Data Storage
Characters are stored in a file called characters.json located inside the JSON folder. The file should initially contain an empty list:

[]

Each new character submitted through the form is added to this list.

# Project Purpose
This project was developed to practice important web development concepts such as:
creating interactive interfaces building and consuming APIs handling JSON data files connecting frontend and backend systems. It also explores a fictional universe called Zephyria, where characters can be recorded in a digital Hall of Fame.

Author
Vinícius Gonçalo
