
module.exports = function timeClock() {
let countDownDate = new Date("Jul 29, 2019 20:37:25").getTime();
  // Update the count down every 1 second
  let x = setInterval(() => {
      let now = new Date().getTime();
      // Find the distance between now and the count down date
      let distance = countDownDate - now;
      let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      let seconds = Math.floor((distance % (1000 * 60)) / 1000);

      $('.countDown').html(`${hours}h ${minutes}m ${seconds}s `)

      if (distance < 0) {
        clearInterval(x);
        $('.countDown').html("EXPIRED");
      }
    }, 1000);
}
