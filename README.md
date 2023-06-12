# Green: Keep Track Of Your Money. Stay On Track Of Your Life.

This is our final project for CSCI 3230U - Web Application Development. We decided to make an online banking software called Green.

## Contributors
 * Gagandeep Pabla:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;CrownPab
 * Atharva Shinde:&nbsp;&nbsp;&nbsp; &nbsp; &nbsp;&nbsp;   Atharva93
 * Lucas Simone:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp; &nbsp;&nbsp; LucasSimone 
 * Vital Golub: &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; VitalGolub 
 * Isaiah von Uders: &nbsp;  &nbsp;&nbsp; isaiahsgithub


## Setup Instructions
 **1**. Pull or clone the repository. This can be done by typing in:
```git clone https://github.com/CrownPab/WebDevFinalProject.git```. Or you can simply click the green "Clone or download button" and download the repository as a .ZIP file.

 **2**. In the folder that you put the repository in, open Terminal or Windows PowerShell (you can do this by holding shift and right clicking the folder, then selecting 'Open PowerShell window here').

**3**. In the Terminal window, type: ```npm install``` followed by these libraries:
* express
* express-session
* body-parser
* uuid
* sqlite3
* bcrypt-nodejs
* socket.io

**4**. When all of the libraries are done installing, type ```nodemon``` in the terminal. This will create a server to run our website on. The port number will be sent to the Terminal, and upon successfully connecting you will see a message saying: 

 * "Node.js/Express is listening on port 3000"

 * "Connected to the SQLite database"

**5**. Leave this window running, as it is the server that allows you to connect to the website.

**6**. To load up the website on any browser go to the URL: localhost:3000

**7**. To close it when finished, open Terminal and press `CTRL-C`. A prompt will come up confirming if you want to close. To confirm, type `Y`. 

**Randy Fortier login information**
* Username: Randyfortier
* Password: webdev

* Starts off at current week showing transactions for this week.
* Can change to month view and year view in the carousel.
* If you go to date 2019-10-15 and press update button, you  will see transaction for that week moth and year view.


## Key Features

**Registration Features.**
* Gets all of the required information about a user.
* Checks for conflicts with registration details, such as having a taken username, or passwords not matching.
* Passwords entered are hashed using bcrypt.
* Upon completion, the data is added to the SQLite database.


**Login Features.**
* The login page simply asks the user for a username and password.
* If the user enters in incorrect details, they are unable to login. An error message also gets displayed.

**Admin Specific Features.** 
 * There is an admin account with the username "admin" and password "admin".
 * When logged into this admin account, the homepage will display a fourth carousel option. This fourth option is a "Registration Log", and uses Socket.io to receive signals from our signup form, to inform the admin any new users that register. This feature is hidden to regular users.
* When the admin account is offline, the server still processes newly registered accounts, and stores them in an array. When the admin logs in again later, Socket.io informs them of all new users who registered while the admin was offline. This is done in a ![#ff0000](https://placehold.it/15/FFFFFF/ff0000?text=+RED) colour, to signify that it is a registration that the admin missed.
 
**Homepage Charts.**
* Easily keep track of weekly, monthly and yearly transactions.
* As you scroll through the top carousel, the D3 charts will animate to show the changes over time.
* You can choose specific weeks, months, and years through the calendar box above the charts.

**News.**
* View financial news and updates live with our implemented API. Upon selecting "Read" you will be directed to the website the information is coming from.
* View live conversion rates from across the globe. 

**Add Transactions.**
* By selecting the "New Transaction" button, you can easily add any transactions that you have made. These transactions added will be added into the database, and the charts on the homepage will reflect these transactions.
* Any transaction added will be added to a chart underneath the "New Transaction" button. From here, you can view your transactions from between any dates, the amount you spent, the transaction category, and the description of the transaction.


**Fully Functional Navbar.**
* "How can I navigate through all of these different web pages?" you may ask. Our navbar allows navigation throughout the site seamless. 
* The navbar is animated, so you can see what page you are on without getting bored.

**Goals.**
* Set Goals for yourself in any of the 9 categories on the Goal Page
* Insert the amount of money that you are stashing away in your piggy bank 
* Hit View to keep track of the progress of your goal

**Bugs(or Features depending on how you look at it).**
* Sometimes on the goals page when the save changes button is pressed the website will freeze

### Want to learn more? View the "About Us" section on our website.
