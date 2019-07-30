
const timeClock = function(id, expiredTime) {
  // let countDownDate = new Date("Jul 29, 2019 20:37:25").getTime();
  // let now = new Date().getTime();

  // Update the count down every 1 second
  console.log(expiredTime);
  let x = setInterval(() => {
      // Find the distance between now and the count down date
      let countDown = expiredTime;
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

module.exports = {timeClock}
