const express = require('express');
const router = express.Router();

module.exports = (db) => {
  router.get("/orders", (req, res) => {
    // render order status

    res.render("restaurant");
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
