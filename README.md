# AI-Pictionary-With-Friends
## An original, online multiplayer web game of Pictionary where you use AI/stable diffusion to generate your pictures

## Features:
- Real-time online chat messaging and private lobbies via Socket.io integration
- Implementation of StabilityAI's Hugging Face Stable Diffusion 1.5 and 2.1 text-to-image models
- Pregame lobby jokes via the JokeAPI (a Rest API) while you wait for other players
- Customized React animations and CSS styling
- React features such as useCallback, useRef, memo, and custom components for minimal re-rendering

## Live Demo:
https://aipictionarywithfriends.netlify.app/

## Full Demo Video:

## Screenshots:
#### Main Menu
![](/screenshots/1.png)

## Tech Stack:
HTML, CSS, JavaScript, React, Express, Node, and Socket.io

## Challenges and Lessons Learned:
- Understanding the complexities involved in online multiplayer web applications where users are constantly sending/requesting information or connecting/disconnecting
  - Learning how this can lead to multiple bugs and discrepancies between individual clients
  - Dealing with so many constant state changes without trying to cause multiple page re-renders
- Being able to adapt and modify code for better scalability
  - Ran into problems when running publically online vs locally
- Learned how to publically deploy a full stack web application with a separately hosted front end and back end
- Learned how to use socket.io to connect multiple websockets and send data between clients and server in real-time
- Learned how to work with AI / stable diffusion / machine learning / data models
- scalability


## How to Run Locally:
- cd .\server\
- npm install
- npm start
- cd .\client\
- npm install
- npm start

## How to Run Online:
- upload server file to server/back end hosting website ex. Railway
- replace "https://localhost3001/" on line 16 in client/src/App.js with "https://yourserverdomain.com"
- upload client file to front end hosting website ex. netlify
