$(() => {
  // get database query from server, and then use oder_id and order_duration for countdownClock
  $.get("/users").then((request, response) => {
    for (let idDruation of request) {
      let id = idDruation.order_id;
      let dura = idDruation.sum * 1000;
      let cre = idDruation.created_at;
      if (id = $(`#order${id}`).val()) {
        console.log(`what is the id ====== ${id} dura ===== ${dura}`)
        timeClock(id, cre, dura);
      }

    }
  })

});

const timeClock = function(id, createdTime, expiredTime) {
  let countDownDate = new Date(createdTime).getTime();
  let realexpire = countDownDate + expiredTime;
  // Update the count down every 1 second

  let x = setInterval(() => {
      let now = new Date().getTime();
      // Find the distance between now and the count down date
      let countDown = realexpire - now;
      let hours = Math.floor((countDown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      let minutes = Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60));
      let seconds = Math.floor((countDown % (1000 * 60)) / 1000);

      $(`.countDown${id}`).html(`${hours}h ${minutes}m ${seconds}s `)

      if (countDown < 0) {
        clearInterval(x);
        $(`.countDown${id}`).html("EXPIRED");
      }
    }, 1000);
}
