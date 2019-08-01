$(() => {
  var socket = io();
  socket.on('updateOrders', function(msg) {
    console.log('updateOrders')
    $.get("/restaurants", function(html) {
      $newOrder = $(html).find('.orders')[0];
      console.log($newOrder);
      if ($('.ordersBody').length) {
        $('.ordersBody').prepend($newOrder);
      } else {
        console.log('no Body');
        $('.ordersHead').after(`
          <tbody class='ordersBody'>

          `);
        $('.ordersBody').prepend($newOrder).append(`</tbody>`);
      }
    });
  });
  socket.on('updateStatusFieldAfterCancel', function(msg) {
    $(location).attr('href', `/restaurants`);
  });
});
