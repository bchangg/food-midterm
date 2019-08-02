$(() => {
  var socket = io();
  socket.on('restaurantHasAcknowledgeOrder', function(msg) {
    $id = $('.formContainingPost').attr('action').replace('/users/', '');;
    $(location).attr('href', `${$id}`);
  });
});
