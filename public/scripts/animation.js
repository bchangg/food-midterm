$(() => {
  $(document).on("scroll", function() {
      let scrollPosition = $(document).scrollTop();
      let bodyHeight = $(document.body).height();
      $('#circle').css({
        'transform': 'rotate(' + (scrollPosition / bodyHeight * 360) + 'deg)'
      });
  });
});
