# LHL LightResto Project

## Project Description

This is a project chosen from a list of ideas given to students at lighthouse labs for their midterm project.

It is a food ordering and pickup app for a single restaurant. The functionality works (so far) as you would expect it to work for customers to be able to place order, as well as restaurants being able to confirm orders, and notify the customer when their food is ready using the **Twilio API** to send a text message.

Due to a time constraint of 7 days, our team decided to prioritize functionality over the front end looks. We made this decision understanding that the program has to work, and work as expected.

## Team

- [renemroger](https://github.com/renemroger)
- [ssspiderzzz](https://github.com/ssspiderzzz)
- [bchangg](https://github.com/bchangg)

## Features

- Live updates rendered to page when a user places an order. This way the restaurant will never have to refresh their page to get the latest orders, but will rather have them be displayed live as orders come in

  - This feature was implemented by @mrogers using websockets

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

![Home Page](/docs/menu_page.png)

![Placing an Order](/docs/placing_order.png)

![User's Order Page](/docs/user_order_status.png)

![Restaurant Orders Page](/docs/restaurant_order_status.png)
