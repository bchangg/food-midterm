$(() => {
  let allDishes;
  let orderDetails = {};

  const createOrderDetailsElement = function(dish) {
    console.log(dish[0].name);
    return `
      <div class="dish d-flex flex-row justify-content-around align-items-center">
        <div class="details d-flex flex-column">
          <span>Dish NAME</span>
          <span>Dish DETAILS THIS CALKSDJFLKASJ FLKSADFJL KASDJFLKASD JFLKSADJFLK ASDJFKLSAJLKFJASLKFJLKSADJFKLSADJFLKASDJLKCLAHDFLKASJCLKADSHFLASDKJCL;KASJDF;LASDKJF;LSKADJF;LASKDJF;LKJ</span>
        </div>
        <span>Dish QUANTITY</span>
      </div>
    `;
  }

  const createDishElement = function(dish) {
    return `
      <article class="d-flex flex-column m-2">
        <h2>${dish.name}</h2>
        <p>${dish.description}</p>
        <div class="quantity-and-price d-flex flex-row justify-content-between align-items-center">
          <div class="">some quantity counter</div>
          <div class="d-flex flex-column justify-content-start align-items-center">
            <label for="select">$${dish.price / 100}</label>
            <input class="select-dish btn btn-primary btn-sm" type="button" name="select" value="Select">
          </div>
        </div>
      </article>
    `;
  };

  const addItemToOrder = function(selectedDish, currentOrderInfo) {
    const selectedDishObject = function() {
      return allDishes.find((dish) => {
        return dish.name === selectedDish;
      })
    }
    currentOrderInfo[selectedDishObject().id] = {
      name: selectedDishObject().name,
      description: selectedDishObject().description,
      duration: selectedDishObject().duration,
      price: selectedDishObject().price,
      quantity: function() {
        if (currentOrderInfo[selectedDishObject().id]) {
          return ++this.quantity;
        } else {
          return this.quantity = 1;
        }
      }()
    }
  }

  const renderTotalPrice = function() {
    let $orderTotal = $('#order-total');
    let $selectDishButton = $('.select-dish');
    $selectDishButton.click(function(event) {
      const itemName = $(this).parent().parent().parent().children('h2').text();
      addItemToOrder(itemName, orderDetails);
      let currentTotal = 0;
      for (dish in orderDetails) {
        currentTotal += (orderDetails[dish].price * orderDetails[dish].quantity);
      }
      $orderTotal.text(`$${currentTotal / 100}`);
    });
  }

  const renderDishes = function(allDishes) {
    allDishes.forEach((dishEntry) => {
      $('#menu').append(createDishElement(dishEntry));
    });
  };

  const orderDetailsToggler = function() {
    const $checkoutButton = $('#checkout');
    const $closeButton = $('#close');
    $checkoutButton.click(function(event) {
      $('.order-details-container').css("display", "block");
    });
    $closeButton.click(function(event) {
      $('.order-details-container').css("display", "none");
    });
  }

  const loadDishes = function() {
    $.get("/dishes/")
      .then((data) => {
        allDishes = data;
        renderDishes(data)
        renderTotalPrice();
        orderDetailsToggler();
      });
  }

  loadDishes();
});
