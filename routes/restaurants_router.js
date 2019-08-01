const express = require('express');
const router = express.Router();
const { sendMessage } = require('../twilio/send_sms');
const { getPendingAndInProgressOrders, getItemsPerOrder, updateOrderStatus, checkDb, getCompletedAndCancelledOrders, getReadyForPickup } = require('../query/restaurantQueries');

module.exports = (db) => {
  router.get("/", (req, res) => {
    getPendingAndInProgressOrders(db)
      .then((orders) => {
        getItemsPerOrder(db)
          .then(items => {
            res.render("restaurantCurOrders", { user: 'Restaurant', orders, items });
          })
      })
      .catch(err => {
        console.log('error:', err);
        res.status(500)
          .json({ error: err.message });
      });
  });

  router.get('/complete', (req, res) => {
    console.log('complete');
    getCompletedAndCancelledOrders(db)
      .then((orders) => {
        getItemsPerOrder(db)
          .then(items => {
            res.render("restaurantHistOrders", { user: true, orders, items });
          })
      })
      .catch(err => {
        console.log('error:', err);
        res.status(500)
          .json({ error: err.message });
      });
  });

  router.post('/sendMessage', (request, response) => {
    sendMessage(request)
      .then(() => {
        response.redirect('/restaurants/pickup');
      })
      .catch(err => {
        console.log('error:', err);
        response.redirect('/restaurants/pickup');
      });
  });



  router.get('/pickup', (req, res) => {
    getReadyForPickup(db)
      .then((orders) => {
        res.render("restaurantPickup", { user: true, orders });
      })
      .catch(err => {
        console.log('error:', err);
        res.status(500)
          .json({ error: err.message });
      });
  });

  router.post("/pickup", (request, response) => {
    checkDb(db, request)
      .then(data => {
        if (data) {
          updateOrderStatus(db, request)
            .then(() => {
              response.redirect("/restaurants/pickup")
            })
            .catch(err => {
              console.log('error:', err);
              response.status(500)
                .json({ error: err.message });
            });
        } else {
          response.redirect("/restaurants/pickup");
        }
      })
  });

  router.post("/", (request, response) => {
    checkDb(db, request)
      .then(data => {
        if (data) {
          updateOrderStatus(db, request)
            .then(() => {
              response.redirect("/restaurants")
            })
            .catch(err => {
              console.log('error:', err);
              response.status(500)
                .json({ error: err.message });
            });
        } else {
          response.redirect("/restaurants");
        }
      })
  });

  return router;
};
