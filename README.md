# JinriTV Streamer Matchmakers Project

Creating a website to match the streamer of your type: [twiri.net](https://twiri.net)

# Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

## Installation

**Note** This guide is for Windows OS only, maybe if someone wants to make a guide for other systems it would be appreciated.
This guide will show how to install these software:

- **git** - The version control system
- **Node.js** - The backend environment

### Installing GitHub Desktop

If you don't already have git and don't want to use terminal commanads, GitHub Desktop is for you.

You can install it from [here](https://desktop.github.com)

### Installing Node.js

Start with downloading Node.js version LTS from the [Node.js](https://nodejs.org/en/) downloads page. Run the installer and leave most settings at default. Make sure that **npm package manager** is set to be installed.

After installation, verify that Node was successfully installed by opening up a Command Prompt and typing

`node -v`

It should display the version number of Node installed (v12.18.3).

### Environment setup

Please go to the project root directory and make a copy of the `.sample-env` file, renaming it to `.env`. Open your newly created `.env` file with a text editor and enter your local DB credentials. Please make sure to not commit the `.env` file that contains the connection string.

You will need a Twitch API client id and secret to run the application locally. To generate a key follow these steps:

1. Go to https://dev.twitch.tv/console/apps/create and register an application
2. For the "OAuth Redirect URLs" just add one and set URL to "https://"
3. You can set the Name and Category to whatever you like.
4. After clicking create copy the client ID and client secret into your .env file (TWITCH_CLIENT_ID, TWITCH_CLIENT_SECRET)

### Install dependencies

Open Command Prompt and `cd` to the location of this project. First we must install the required packages. In this folder, run the command

`npm install`

And it should install the required packages we need (which are defined in the package.json file).

## Download CSV file from Google spreadsheet

1. Get permission to [Google sheet](https://docs.google.com/spreadsheets/d/18HgxdbECnDFavSUQEoTYImz1QsYzEojbvRR7CUBClZM) from the Boss
2. Open the spreadsheet, go to "Twiri Data Collection Sheet" sheet
3. Download the sheet into CSV file
4. Rename the file to db.csv and copy to the project root directory (where package.json is)

## Verify Node server is working

To start the server, run the command `npm start`

Go to [localhost:3000](http://localhost:3000) in a web browser. Verify there are no errors on the page, or in the console.

## Play with the website

Now you're ready to start!

# Project Structure

I tried to keep the structure as simple as possible, so that anyone who wants to learn can follow along easier. Our Node server doesn't use any view engine, we are only displaying the static html file with the css and js. For now this is the simplest way, until, or if, we need to add something more.

- **/admin** : this folder contains various custom admin scripts you can run to manipulate data.
- **/backend** : this folder contains the code that will run server-side
- **/db** : this folder contains DB-related code.
- **/models** : this folder has auto-generated Sequelize model files. You wouldn't need to touch this folder unless there is change in DB schema. /models/README.md has information about how to re-generate models in schema change
- **/node_modules** : this folder is automatically filled when you run `npm install`, don't worry about it.
- **/public** : this folder contains our website files (html, css, and js) for all of our client-side activities.
- **/util** : some common utility functions used in other modules.
- **/validation** : data validation between business logic and data access layer
- **app.js** : the 'base' module that will run our server. Here we define the endpoints and serve the static pages
- **package.json** : this outlines our project and contains information such as the name and what other modules we need. When we run `npm install`, it reads the package names from the "dependancies" section and installs them for us. It also gets updated if we install any packages using `npm install package-name`. Don't worry about this file.
- **package-lock.json** : automatically generated, don't worry about it.
- **.env** : This file needs to be created so we can connect to the database hosted on heroku. It should never be commited to github.

# Release Notes

## 2021-06-22

For now, the temporary database is CSV file, which is a copy of Twiri Data Collection sheet v2.

## 2021-02-01

_EJS view engine_

- implemented the EJS templating engine
- divided the quiz into reusable partials, stored in the /partials folder
- changed how the website is loaded on the client-side
- renders the html on the server with the proper language text before sending it back to the client
- fixed german/french language
- removed translated names for languages, now all languages are just simply called what they are in their native language (for example English will always display as English, French will always display as Français, etc)
- removed html_helpers.js
- removed create_quiz.js
- added quiz_questions.js to the backend folder (storing the question data)
- implementing routing system for endpoints
- organized client-side javascript into their own files (confetti, setup, text-handling, etc..)

## 2020-12-11

_dark mode_

- added a dark/light theme toggle to the bottom-right of the site (click it to toggle theme change)
- added the chosen font from the poll (grandstander)
- removed unneccesary stylesheet references
- removed body.css, heading.css, styles.css, so we now load the bootstrap directly from the cdn to clear up some of the clutter
- created 'themes.css' to contain all of the css color variables the site uses, which defines a class 'light-theme' and 'dark-theme', which will change the variables used to color html elements according to the selected class. all of the color properties were moved from the other css files into this one.

## 2020-11-28

_Localization_

- Moved the entire localization system to the backend
- Language texts are now stored in their own JSON files
- We retreive the browser's language and use that as default language
- On site load, we send a POST request to the server with that default language
- The server reads the appropriate file and sends the JSON data back to the client, with other information such as other available languages and icons for the drop-down menu.
- The language JSON data is stored and the rest of the site is loaded

## 2020-11-14

- Moved a bunch of the html strings into a separate file `html_helpers.js` to reduce clutter in our create_quiz file.
- Added an override feature when generating questions: For questions that include buttons, you can now just add the property `buttonsPerRow` to the question object and it will override the default buttons per row for that question type.
- Combined the MultipleSelection and SingleSelection button types, because they are basically the exact same, aside from the function we call in the onclick handler. So now, when making a new question with either type of button, there is no difference in structure between the two types of questions when making them. The name of the onclick function can also be overridden by simply adding the property `onclickFunctionName` to the question schema object.
- Simplification for defining the answers in a button-type question: we now need to pass only the values in the array, and we do not need to provide any label for it, since our new localizations system will handle displaying the text.
- Removed all hard-coded text from the HTML, and put them in a separate file `localizations.js`.
- New system for handling languages, where users can now change the language quickly by selecting it from the drop-down menu at the top right of the site. Any missing translations for that language will display an error message in place of the desired text.
- The `localizations.js` is where we can now add translations to the site very easily (see Discord for tutorial)
- I re-wrote the text animation function that erases and writes the text, because we needed to be able to stop the loop when we changed the language (it was running forever before), so I've changed the setTimeout to setInterval, where once we change the language, we clearInterval() so we can restart it with the new language. **Note:** I've noticed once the animation seemed to be going really fast after leaving the site on in the background for a while then coming back to it. Not sure if it was just a visual bug or if the timings are messed up, making the animation increase speed for some reason after a while. I might have broken the animation while adding the setInterval, not sure.

## 2020-11-02

New script file 'create_quiz.js' added, that will build the html for the questions when the page loads.

## 2020-10-26

Streamer ranking backend is added

## 2020-10-22

All code changes in other repositories are merged. streamer-mtchmkr-postgres repositories should not be used anymore, and people should fork jinritv/Streamer-match-makers from now on.

## 2020-10-19

jinritv/Streamer-match-makers is now the central repository, and code from other places is merged into this repository.

All previous commit histories and list of contributors (from this and other repositories) are also merged here.

## 2020-10-12

Updated the quiz and the database query logic, and many UI changes

- quiz is now only 5 questions long, as decided on stream
- added new question: viewing hours, where the user can select when they can watch a stream
- the switches have been changed for toggle buttons
- the slide left/right animation has been replaced with a fade in/out animation
- the mascot image has been changed to the one with the magnifying glass
- a new time picker has been added to the final question about viewing hours (see Notes below)
- the results page now displays 5 'top' streamers returned from the query, based off the mockup
- results now returns the logo URL, as well as a 'match_value' (see Notes below)

**Notes**

- The SQL query we run fails to return any streamers. This could mean that the query is too strict, or we are not passing enough data, or the data it specifically needs to find any streamer. Someone who wants to look into more about [Sequelize](https://sequelize.org/) could help us here
- The 'match_value' is supposed to represent a % value of how the streamer matched against the answers provided, BUT: we don't have a system or algorithm in place to actually calculate this yet. So right now I just set the 1st result as 98% (jinri), and the other 4 streamers get random values.
- The 'Viewing hours" question (question #5) doesn't provide anything to the database query yet. We receive that data but the SQL WHERE methods have not been implemented, so right now it's just doing nothing.

## 2020-09-18

Major updates in backend and custom admin script to facilitate dev works.

1. In server, /calculateStreamer endpoint now returns a matching streamer based on the user answers
2. Validation is added between business logic and data access layer. Eventually, communication between the two layers should be done by passing JSON object in specific formats, which is validated by this validation logic.
3. Two admin scripts were added: test_db_connection.js and recreate_database.js. Please take a look at admin/README.md for more information.
4. ORM library [Sequelize](https://sequelize.org/) was introduced into the project to work with the database more easily. Also, all models under /models are automatically generated by [sequelize-auto](https://github.com/sequelize/sequelize-auto)
5. This README.md now includes how to run a working streamer match maker service from localhost from scratch. Please look at Getting Started section.

## 2020-09-14

Really scuffed update, this one includes a new modal to the main page where we can add a streamer to the database. A record is created only for the base 'streamers' table, the rest still needs to be updated. But when we insert a new streamer, we retreive the id, so we can use it in subsequent insert queries for things like nationality, stats, language, etc.

## 2020-09-08

Small update to actually send user's answers to the server, and retreive a streamer from the database. Includes a "results" page with a button to reveal the streamer.

We're now using kyroskoh's API gateway to interact with the database, but for right now we only retrieve Jinri's record and return it.

Still need to figure out an algorithm, or best strategy to determine the streamer based on the quiz answers.

## 2020-09-04

The main flow for the quiz is complete for the 9 example questions. I've added different examples of quiz elements so we can pick the best ones to use:

- **Range Slider**: I used Mark's suggestion to add [https://github.com/seiyria/bootstrap-slider](https://github.com/seiyria/bootstrap-slider), it is in use for questions 1 and 3.
- **'Radio'-type radio buttons**: These are radio buttons (only one selection allowed), with circle-style normal radio button style, used for question 2 and 6.
- **'Button'-type radio buttons**: These are radio buttons, with a 'button' style, used for questions 7, 8 and 9.
- **Switches**: These are toggles, which allow for multiple selection, used in questions 4 and 5.

To reset the quiz, refresh the page.

# Authors

Contributors please add your name to this readme in the Authors section

- **glottsi** - this readme, initial work -
- **kalaloon** - inital work, spreadsheet -
- **kookehs** - initial work, loading data -
- **Proshuto** - meme captain -
- **kyroskoh** - providing the DreamFactory database API
- **9_dog_9_dog** - some backend work and admin scripts
- **ysfchapterzero** - ranking algorithm
- **[YOUR NAME HERE]**

# Links

Trello board for project management: [Trello](https://trello.com/b/026o2aq4/jinri-co-project-2-streammatch)

Google Sheet with the data: [Google sheet](https://docs.google.com/spreadsheets/d/1yQ7YzuM5FhFB13ChTz77W2VyhzYJnjtqMBAEOwJrebI)
