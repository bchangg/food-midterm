const express = require('express');
const router = express.Router();

module.exports = (db) => {
  router.get("/", (request, response) => {
    const queryConfig = {
      text: `
      SELECT * FROM dishes;
      `,
      values: []
    }

    db.query(queryConfig)
      .then((queryResponse) => {
        response.json(queryResponse.rows);
      })
  });
  return router;
};
