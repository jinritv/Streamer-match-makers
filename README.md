# JinriTV Streamer Matchmakers Project
Creating a website to match the streamer of your type

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### To install

**Note** This guide is for Windows OS only, maybe if someone wants to make a guide for other systems it would be appreciated.
This guide will show how to install these software:

* **Node.js** - The backend environment 

## Installing Node.js

Start with downloading Node.js version LTS from the [Node.js](https://nodejs.org/en/) downloads page. Run the installer and leave most settings at default. Make sure that **npm package manager** is set to be installed.

After installation, verify that Node was successfully installed by opening up a Command Prompt and typing

```node -v```

It should display the version number of Node installed (v12.18.3).

## Verify Node server is working

Now we can test if our Node and MySQL connection is working correctly.

Open Command Prompt and `cd` to the location of this project. First we must install the required packages. In this folder, run the command 

`npm install`

And it should install the required packages we need (which are defined in the package.json file).

Now to start the server run the command `npm start`

The console should now display something like 
```  streamer-matcher:server Listening on port 3000 +0ms ```

Now go to `localhost:3000` in a web browser. 

Verify there are no errors on the page, or in the console.

## Verify Postgresql database server connection

On the home page, at the bottom there should be a button called "DEBUG-Get streamer result". This button sends some quiz result values to the server and receives a streamer in response.

## Project Structure
I tried to keep the structure as simple as possible, so that anyone who wants to learn can follow along easier. Our Node server doesn't use any view engine, we are only displaying the static html file with the css and js. For now this is the simplest way, until, or if, we need to add something more.

* **/backend** : this folder contains the code that will run server-side
* **/node_modules** : this folder is automatically filled when you run `npm install`, don't worry about it.
* **/public** : this folder contains our website files (html, css, and js) for all of our client-side activities. 
* **app.js** : the 'base' module that will run our server. Here we define the endpoints and serve the static pages
* **package.json** : this outlines our project and contains information such as the name and what other modules we need. When we run `npm install`, it reads the package names from the "dependancies" section and installs them for us. It also gets updated if we install any packages using `npm install package-name`. Don't worry about this file.
* **package-lock.json** : automatically generated, don't worry about it.
* **.env** : This file needs to be created so we can connect to the database hosted on heroku. It should never be commited to github. 

## Next Steps

Fill database with data...

Contributors please add your name to this readme in the Authors section, sorry if I didn't put everyone

## Authors

* **glottsi** - this readme, initial work - 
* **kalaloon** - inital work, spreadsheet -
* **kookehs** - initial work, loading data -
* **Proshuto** - meme captain -
* **your names here**

### Links
Trello board for project management: [Trello](https://trello.com/b/026o2aq4/jinri-co-project-2-streammatch)

Google Sheet with the data: [Google sheet](https://docs.google.com/spreadsheets/d/1yQ7YzuM5FhFB13ChTz77W2VyhzYJnjtqMBAEOwJrebI)

