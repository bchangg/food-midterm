$(() => {
  let allDishes;
  let currentOrder = {};

  const createOrderDetailsElement = function(dish) {
    return `
      <div class="dish d-flex flex-row justify-content-between align-items-center">
        <div class="details d-flex flex-column align-items-center">
          <span>${dish.name}</span>
        </div>
        <div class="details d-flex flex-column align-items-center">
          <input type="number" value="${dish.quantity}" min="0" max="100" step="1"/>
          <span>$${dish.price/100}</span>
        </div>
      </div>
    `;
  }

  const createDishElement = function(dish) {
    return `
      <article class="d-flex flex-column m-2">
        <h2>${dish.name}</h2>
        <p>${dish.description}</p>
        <div class="quantity-and-price d-flex flex-row justify-content-between align-items-center">
          <div>
            <input type="number" value="1" min="0" max="100" step="1"/>
          </div>
          <div class="d-flex flex-column justify-content-start align-items-center">
            <label for="select">$${dish.price / 100}</label>
            <input class="select-dish btn btn-primary btn-sm" type="button" name="select" value="Select">
          </div>
        </div>
      </article>
    `;
  };

  const submitOrderToDatabase = function() {
    const $placeOrderButton = $('#place-order');
    $placeOrderButton.click(function(event) {
      // post to a route called users/placeOrder with a sql insertion on orders with current user id
      // then do an sql insertion on orders_details with the order details (quantity, )
      console.log(currentOrder);
      $.post(`/users/${event.currentTarget.value}/placeOrder`, currentOrder)
        .then((response) => {
          if(response) {
            window.location.href = response;
          } else {
            window.location.href = '/';
          }
        });
    });
  }

  const orderDetailsToggler = function() {
    const $checkoutButton = $('#checkout');
    const $closeButton = $('#close');
    $checkoutButton.click(function(event) {
      renderOrderDetails();
      $('.order-details-container').css("display", "block");
    });
    $closeButton.click(function(event) {
      $('.order-details-container').css("display", "none");
    });
  }

  const addItemToOrder = function(selectedDish, currentOrderInfo, dishQuantity) {
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
          this.quantity += dishQuantity;
        } else {
          this.quantity = dishQuantity;
        }
        return this.quantity;
      }()
    }
  }

  const renderDishes = function(allDishes) {
    allDishes.forEach((dishEntry) => {
      $('#menu').append(createDishElement(dishEntry));
    });
  };

  const renderOrderSlider = function() {
    let $allSelectDishButtons = $('input.select-dish');
    let $orderTotal = $('#order-total');
    $allSelectDishButtons.click(function(event) {
      const itemName = $(this).parent().parent().parent().children('h2').text();
      const itemQuantity = Number($(this).parent().parent().children('div').children('input').val());
      addItemToOrder(itemName, currentOrder, itemQuantity);
      let currentTotal = 0;
      for (let dish in currentOrder) {
        currentTotal += Number((currentOrder[dish].price * currentOrder[dish].quantity));
      }
      $orderTotal.text(`$${currentTotal / 100}`);
    });
  }

  const renderOrderDetails = function() {
    $('.dish').remove();
    let $orderPriceSummary = $('.order-price-summary');
    for (let dishSelection in currentOrder) {
      $orderPriceSummary.before(createOrderDetailsElement(currentOrder[dishSelection]));
    }
    $('#final-price').text($('#order-total').text());
  }

  const loadPageFunctions = function() {
    $.get("/dishes/")
      .then((data) => {
        allDishes = data;
        renderDishes(data)
        renderOrderSlider();
        orderDetailsToggler();
        submitOrderToDatabase();
        $("input[type='number']").inputSpinner(); // setting plugin for the quantity input thing
      });
  }

  loadPageFunctions();
});
