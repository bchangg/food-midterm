$(() => {
  let allDishes;
  let currentOrder = {};

  const createOrderDetailsElement = function(dish) {
    return `
      <div class="dish d-flex flex-row justify-content-between align-items-center">
        <span>${dish.name}</span>
        <div class="details d-flex flex-column align-items-center">
          <input name="decidingQuantity" type="number" value="${dish.quantity}" min="0" max="100" step="1"/>
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
            <input class="select-dish btn btn-primary btn-sm" type="button" name="select" value="Add to Order">
          </div>
        </div>
      </article>
    `;
  };

  const createDishSelectionElement = function(dish) {
    return `
      <div class="order-item d-flex flex-row align-items-center justify-content-between">
        <span>Added: ${dish.name}</span>
      </div>
    `;
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

  const findDish = function(arrayOfObjects, givenDish) {
    return arrayOfObjects.find((dish) => {
      return dish.name === givenDish;
    })
  }

  const addItemToOrder = function(selectedDish, currentOrderInfo, dishQuantity) {
    currentOrderInfo[findDish(allDishes, selectedDish).id] = {
      name: findDish(allDishes, selectedDish).name,
      description: findDish(allDishes, selectedDish).description,
      duration: findDish(allDishes, selectedDish).duration,
      price: findDish(allDishes, selectedDish).price,
      quantity: function() {
        if (currentOrderInfo[findDish(allDishes, selectedDish).id]) {
          this.quantity += dishQuantity;
        } else {
          this.quantity = dishQuantity;
        }
        return this.quantity;
      }()
    }
  }

  const renderDishSelectionToSlider = function(parentElement, dish) {
    parentElement.children('label').before(createDishSelectionElement(dish))
    let windowHeight = $(window).height();
    if (parentElement.height() > 0.2 * windowHeight) {
      parentElement.children()[0].remove();
    }
  }

  const renderDishes = function(allDishes) {
    allDishes.forEach((dishEntry) => {
      $('#menu').append(createDishElement(dishEntry));
    });
  };

  const renderOrderSlider = function() {
    let $allSelectDishButtons = $('input.select-dish');
    let $orderSlider = $('.order-slider')
    let $orderTotal = $orderSlider.children('span#order-total');
    let itemTimeout;
    $allSelectDishButtons.click(function(event) {
      clearInterval(itemTimeout);
      const itemName = $(this).parent().parent().parent().children('h2').text();
      const itemQuantity = Number($(this).parent().parent().children('div').children('input').val());
      addItemToOrder(itemName, currentOrder, itemQuantity);
      let currentTotal = 0;
      for (let dish in currentOrder) {
        currentTotal += Number((currentOrder[dish].price * currentOrder[dish].quantity));
      }
      renderDishSelectionToSlider($orderSlider, findDish(Object.values(currentOrder), itemName));
      $orderTotal.text(`$${currentTotal / 100}`);
      itemTimeout = setTimeout(() => {
        $orderSlider.children('.order-item').remove();
      }, 1500);
    });
  }

  const renderOrderDetails = function() {
    $('.dish').remove();
    let $orderPriceSummary = $('.order-price-summary');
    for (let dishSelection in currentOrder) {
      $orderPriceSummary.before(createOrderDetailsElement(currentOrder[dishSelection]));
    }

    $("input[name='decidingQuantity']").change((event) => {
      const updatedQuantity = $(event.currentTarget).val();
      const itemToUpdate = $($(event.currentTarget).parent().siblings('span')).text();
      currentOrder[findDish(allDishes, itemToUpdate).id].quantity = updatedQuantity;
      let currentTotal = 0;
      for (let entry in currentOrder) {
        currentTotal += currentOrder[entry].quantity * currentOrder[entry].price;
      }
      $('#final-price').text(`$${currentTotal/100}`);
    })
    $('#final-price').text($('#order-total').text());
  }

  const submitOrderToDatabase = function() {
    const $placeOrderButton = $('#place-order');
    $placeOrderButton.click(function(event) {
      // post to a route called users/placeOrder with a sql insertion on orders with current user id
      // then do an sql insertion on orders_details with the order details
      $.post(`/users/${event.currentTarget.value}/placeOrder`, currentOrder)
        .then((response) => {
          if (response) {
            // response will be a url so we change the window to look at that address instead
            window.location.href = response;
          } else {
            window.location.href = '/';
          }
        });
    });
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
