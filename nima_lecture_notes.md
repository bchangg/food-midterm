# Friday Lecture with Nima

**Maybe use Trello for team management**<br>
**Functionality** then **looks**

1. Start with your **DATA** ℹ️

  - ERDs will be important

    - <dbdiagram.io>
      </dbdiagram.io>

    - I've been using this one

  - how will we form the database?

    - HARD CODE OUR DATABASE FOR NOW FOR WHAT WE NEED IT FOR
    - BIG SEED FILES (or maybe not as big as 10k lines)
    - Simplify your login pages and stuff

      - Maybe a couple buttons on top, allowing you to log in to different accounts with each button
      - Do something like this

        ```javascript
        app.get('/login/:id', (request, response) => {
        request.session.id = request.params.id;
        app.redirect('/')
        })
        ```

        instead of actually coding a whole login thing<br>
        **NEVER DO THIS IN PRODUCTION**

  - what tables do we need?

    - Tables are nouns

  - how are these tables related?

  - BREAD actions

  - Having our data analysis completed will help us move forward with planning how we want to _show_ the data

  - how can we pivot the data to give more value to the user?

  - what is the data you can access or acquire?

  - can you correlate that data to something else?

2. Features vs Benefits 🎧

  - Look good
  - Feel good
  - Save time
  - Save money
  - REACH AN **MVP**

    - The moment when someone uses your app understand _WHY_ you've spent so much time doing this
    - Decide on your **A-HA** moment!

  - If you aren't gonna demo it, DON'T BUILD IT! 😠

    - FAQ/About pages
    - Signup pages
    - _login pages_ (debatable)

3. User Stories and Scenarios 👀

  - Continuously adjust your user stories as you see fit

    - Don't just write it and forget it

  - "As a **something**, I should be able to **do something** because **some reason**"

    - As a **user**, I should be able to **upload a mixtape** because **I want people to listen to my music**

  - "Given **some scenario during usage**<br>
    When **I do something**<br>
    Then **do this**"

  - Example

    - (Story)<br>
      As a user<br>
      I want to save a story I'm reading<br>
      Because I found it useful
    - (Scenario)<br>
      Given that I'm reading a story<br>
      When I tap the _icon_ to save a story<br>
      Then save it to my 'Saved Stories'<br>
      And alter the _icon_ to show success
    - (Info)<br>
      _icon_ bookmark icon

4. Server framework 🏠

  - **EXPRESS**
  - figure out useful middleware that might be useful for us
  - don't forget --save-dev

5. Routes 🚎

  - if **tables** are the _nouns_, **routes** are the _verbs_
  - RESTful design

    1. What are the resources?

      - dogs, owners, chewtoy
      - /dog/:id/chewtoys
      - /owners, owners/:id, owners/:id/dogs
      - owner might have many dogs
      - dogs might have many chewtoys

    2. What am I doing to the resources?

      - GET /owners --> get all owners
      - POST /owners --> create an owner
      - GET /owners/:id --> get a particular owner
      - GET /owners/:id/dogs --> get a particular owner's dog(s)
      - DELETE /dogs/:id/chewtoy/:chewId --> destroy (delete) a particular dog's particular chewtoy

  - GET/POST/PUT/DELETE

6. Wireframes

  - Wireframes are a way to describe layout, define data hierarchy, and demonstrate interactions
  - Comes from our user stories
  - This is a template that we **DRAW, this is NOT CODED**

    - Be clear on what we want to see in the wireframe, but too many details are not needed

  - [Balsamiq](https://balsamiq.com/)

  - [figma](https://www.figma.com/)

7. Storyboarding

  - Storyboarding is the art of telling a story in a chronological format<br>
    Deciding the scenes<br>
    What happens after?

8. Design

  - Design matters _HOWEVER_ **WE ARE DEVELOPERS, not DESIGNERS**
  - Resources

    - Dribbble
    - Folio Focus
    - Look at other sites to figure out maybe some design things

9. UI Framework

  - **Bootstrap 3, or 4** for this project
  - Skeleton
  - Foundation ZURB
  - Bulma
  - Min
  - PureCSS
  - Groundwork
  - Bourbon + Neat
  - Flexbox

10. Git<br>
  **Don't code on master**

  1. Clone
  2. Branch
  3. Code*
  4. Checkout master
  5. Pull* from master so the branch doesn't fall behind from master edits
  6. Merge* to master after making sure your branch still works after pulling from master
  7. Unit tests maybe
  8. Even list of written test to run through each time before you push
  9. Push* to master as a group
  10. Repeat from step 2

11. Scaffolding

  1. Set up GitHub repo, add collaborators
  2. Download/Install all resources
  3. use CDN links whenever possible
  4. Make sure your app loads, after installing things
  5. Push app to GitHub, so team can clone
  6. Divide up tasks

12. Task Division

  - Nima recommends division by feature, and also pair programming

13. Front-end scaffolding tips

  - Keep using migrations and that process
  - Number your migrations
  - BEM css (google this), essentially REST but for CSS
  - Use placeholders

14. Back-end scaffolding tips

  - Code **atomically**, do **A LITTLE BIT AT A TIME**
  - Make sure you test things in the REPL before making it work in the actual app

15. Communication

  - **_Guys we are only as strong as the weakest link, and therefore we need to make sure we empower each link the best we can as we work through this project_**
  - If we need help, **ask**
  - **We got this shit**
