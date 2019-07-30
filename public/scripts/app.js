$(() => {
  let allDishes;
  let currentOrder = {};

  const createOrderDetailsElement = function(dish) {
    console.log(dish);
    return `
      <div class="dish d-flex flex-row justify-content-between align-items-center">
        <div class="details d-flex flex-column">
          <span>${dish.name}</span>
        </div>
        <div class="details d-flex flex-column">
          <span>$${dish.price/100}</span>
          <span>x${dish.quantity}</span>
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

  const renderDishes = function(allDishes) {
    allDishes.forEach((dishEntry) => {
      $('#menu').append(createDishElement(dishEntry));
    });
  };

  const renderTotalPrice = function() {
    let $orderTotal = $('#order-total');
    let $selectDishButton = $('.select-dish');
    $selectDishButton.click(function(event) {
      const itemName = $(this).parent().parent().parent().children('h2').text();
      addItemToOrder(itemName, currentOrder);
      let currentTotal = 0;
      for (let dish in currentOrder) {
        currentTotal += (currentOrder[dish].price * currentOrder[dish].quantity);
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
