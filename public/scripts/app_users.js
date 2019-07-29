$(() => {
  console.log(`test app_users.js`)
  $.ajax('/users/:id', { method: 'GET' }).then(renderTweets);
  $('.currentOrder').append(currentOrder(db));

  const currentOrder = function(orders) {
    let $current = $('<div>').addClass('status');
    $current.html(`
      <span class="user_status_text">Your Order Status:</span>
      <span class="user_status_show">${orders.order_status}</span>
    `)
    return $current;
    };

});
