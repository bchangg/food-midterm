$(document).ready(function() {
  console.log('LETS POLL');
  restaurantPolling();
  function restaurantPolling() {
    setTimeout(function() {
      $.ajax('/restaurants', { method: 'GET' }).then((res) => {
        console.log(res.body);
        restaurantPolling();
      })
    }, 3000);
  }
})
