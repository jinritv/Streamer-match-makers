# JinriTV Streamer Matchmakers Project
Creating a website to match the streamer of your type

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### To install

**Note** This guide is for Windows OS only, maybe if someone wants to make a guide for other systems it would be appreciated.
This guide will show how to install these software:

* **Node.js** - The backend environment 

* **MySQL** - The database

## Installing Node.js

Start with downloading Node.js version LTS from the [Node.js](https://nodejs.org/en/) downloads page. Run the installer and leave most settings at default. Make sure that ```npm package manager``` is set to be installed.

After installation, verify that Node was successfully installed by opening up a Command Prompt and typing

```node -v```

It should display the version number of Node installed (v12.18.3).

## Installing MySQL

Now download the [MySQL Installer](https://https://dev.mysql.com/downloads/), choose the "MySQL Installer for Windows". When the installer asks you what to install, you can select:

* "Server Only": We only need the MySQL server so this is all we need to install.

or

* "Developer Default": this will install more than what we need, but it will include other useful tools such as Workbench, which is a GUI for interacting with the databases.


## Setting up the MySQL database

After installation, it will begin the process to setup the database. Keep all settings at default until the **Accounts and Roles** section, where we will setup 2 users:
* Root: this is the super admin account and it is not recommended to develop with this account
* Dev account: the account we will use to develop with

Once you get to the **Account and Roles** section: Setup your password for the root account here. Make sure to keep this password secure.

Then create a new Role, this will be your dev account that you will login to the database with:

Now it will ask if you want MySQL to be configured as a service. This means you will be able to start and stop the database server through the windows services interface. Enter a name for the service, and decide if you want the database server to start every time windows starts.

Press Next and the Execute the installation.

After installation, if you open the Task Manager, you should be able to see the new database service running:

We can now test the MySQL server by connecting to it with Workbench. Add a new connection, leave everything at default and add your username and click "Test Connection" button. You should see a success message:


We need Node to install the module, so open up Command Prompt and run `npm install mysql` so the package manager can install the connector we need.

## Node.js and MySQL problem

It seems like the new version of MySQL's authentication does not play well with Node, so in order to connect to our database server, we need to run a command to change the authentication process.

They are supposed to be working on a fix but it's still not completed yet: [https://github.com/mysqljs/mysql/issues/1507](https://github.com/mysqljs/mysql/issues/1507)

#### The database auth "downgrade" fix

Before we can connect to MySQL with Node, we need to downgrade the authentication system that our server uses, for our dev user.

Open your Command Prompt and run this command ```cd C:\Program Files\MySQL\MySQL Server 8.0\bin```

Now login to the MySQL server with your root user by entering this command:

```mysql -u root -p```

and it will ask for your root password. Then you should be successfully logged into your MySQL server. Run this command to change the authentication method for your dev user:

```ALTER USER 'yourusername'@'%' IDENTIFIED WITH mysql_native_password BY 'yourpassword';```

You should see `Query OK, 0 rows affected (0.00 sec)`

This command tells our server to accept the kind of authentication that we use with the Node module.

## Verify Node server is working

Now we can test if our Node and MySQL connection is working correctly.

Open Command Prompt and `cd` to the location of this project, specifically the `/Node` folder. First we must install the required packages. In this folder, run the command 

`npm install`

And it should install the required packages we need (which are defined in the package.json file).

Now to start the server run the command `npm start`

The console should now display something like 
```  streamer-matcher:server Listening on port 3000 +0ms ```

Now go to `localhost:3000` in a web browser. 

Verify there are no errors on the page, or in the console.

## Verify MySQL database server connection

On the home page, click the link called "Database", or navigate in the browser to `localhost:3000/database`

Enter your username and password for the dev account you created. 

The button will turn green and a success message will display if you are successfully connected. Congrats!

## Authors

* **glottsi** - this readme, Initial work - 
* **

### Links
Trello board for project management: [Trello](https://trello.com/b/026o2aq4/jinri-co-project-2-streammatch)

Google Sheet with the data: [Google sheet](https://docs.google.com/spreadsheets/d/1yQ7YzuM5FhFB13ChTz77W2VyhzYJnjtqMBAEOwJrebI)


