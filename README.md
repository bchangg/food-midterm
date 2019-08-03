# LHL LightResto Project

## Project Description

This is a project chosen from a list of ideas given to students at lighthouse labs for their midterm project.

It is a food ordering and pickup app for a single restaurant. The functionality works (so far) as you would expect it to work for customers to be able to place order, as well as restaurants being able to confirm orders, and notify the customer when their food is ready using the __Twilio API__ to send a text message. 

Due to a time constraint of 7 days, our team decided to prioritize functionality over the front end looks. We made this decision understanding that the program has to work, and work as expected.

- ### Improvements

  - A place for users to create accounts and log in can be created (database currently supports multiple users and restaurants already, for this feature to work we need to implement some updates to our front side JS and our server routes)
  - CSS and design can be improved upon
  - Multi-restaurant support can be added (the database should be robust enough to scale nicely)

## Dependencies

Please run `npm i` to install all dependencies

Run `npm run local` to get the server up and running

- body-parser
- chalk
- cookie-session
- dotenv
- ejs
- express
- jquery
- morgan
- node-sass-middleware
- pg
- pg-native
- socket.io
- twilio

## Screenshots

![Home Page]()
![User's Order Page]()
![Restaurant Orders Page]()
