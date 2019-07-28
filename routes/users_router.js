/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router = express.Router();

module.exports = (db) => {
  router.get('/', (request, response) => {

  });
  router.get("/:id", (request, response) => {
    const userId = request.params.id;
    const queryConfig = {
      text: `SELECT name FROM users WHERE id = $1`,
      values: [userId]
    }

    db.query(queryConfig)
      .then((queryResponse) => {
        console.log(queryResponse.rows);
        const userName = queryResponse.rows[0].name;
        console.log(userName);
        response.render('user', { user: userName })
      })
      .catch((error) => {
        reponse.redirect(`/`);
      });
  });

  router.get("/", (req, res) => {
    db.query(`SELECT * FROM users;`)
      .then(data => {
        const users = data.rows;
        res.json({ users });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });
  return router;
};
