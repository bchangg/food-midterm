const express = require('express');
const router = express.Router();
const { queryConfig, getOrdersPerUser, getItemsPerUser } = require('../query/userQueries');


module.exports = (db) => {
  router.post('/', (request, response) => {
    const username = request.body.currentUsername;
    const queryConfig = {
      text: `
      SELECT id
      FROM users
      WHERE name = $1;`,
      values: [username]
    }
    db.query(queryConfig)
      .then((queryResponse) => {
        response.redirect(`/users/${queryResponse.rows[0].id}`);
      })
      .catch((error) => {
        response.redirect('/');
      })

  });

  // show the current status of user's order
  router.get("/:id", (request, response) => {
    const userId = request.params.id;

    queryConfig(db, userId)
      .then(user => {
        if (user) {
          getOrdersPerUser(db, userId)
            .then(orders => {
              getItemsPerUser(db, userId)
                .then(status => {
                  response.render("user", { user, orders, status });
                });
            })
        }
      })
      .catch((error) => {
        console.error(`query error on order retrieval`, error.stack);
        reponse.redirect(`/`);
      });
  });
  return router;
};
