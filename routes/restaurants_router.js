const express = require('express');
const router = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    // render order status
    console.log("I HAVE REACHED RESTO page");

    res.render("restaurant", { user: true });
    // db.query(`SELECT * FROM orders;`)
    //   .then(data => {
    //     const orders = data.rows;
    //     res.json({ orders });
    //   })
    //   .catch(err => {
    //     res
    //       .status(500)
    //       .json({ error: err.message });
    //   });
  });
  return router;
};
