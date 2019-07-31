$(document).ready(function() {
  $('.disable').click(function(event) {
    var $this = $(this);


    dataForMessage = {
      sendText: $this.siblings('.sendText').val(),
      userName: $this.siblings('.userName').val()
    }

    console.log(dataForMessage);

    $.ajax({
      type: "POST",
      url: '/restaurants/sendMessage',
      data: dataForMessage,
      dataType: 'Json'
    });
    $this.prop('disabled', true).css('opacity', 0.5);
    setTimeout(function() {
      $this.prop('disabled', false).css('opacity', 1);
    }, 2000);
  });
})
