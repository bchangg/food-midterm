$(() => {
  const createDishElement = function(dish) {
    const dishName = dish.name;
    const dishDescription = dish.description.charAt(0).toUpperCase() + dish.description.slice(1);
    const dishPrice = dish.price / 100;
    const elementString = `
      <article class="d-flex flex-column m-2">
        <h2>${dishName}</h2>
        <p>${dishDescription}</p>
        <div class="quantity-and-price d-flex flex-row justify-content-between align-items-center">
          <div class="">some quantity counter</div>
          <div class="d-flex flex-column justify-content-start align-items-center">
            <label for="select">$${dishPrice}</label>
            <input class="select-dish btn btn-primary btn-sm" type="button" name="select" value="Select">
          </div>
        </div>
      </article>
      `;
    return elementString;
  };
  const renderDishes = function(allDishes) {
    allDishes.forEach((dishEntry) => {
      $('#menu').append(createDishElement(dishEntry));
    });
  };

  // COMBAK: THIS IMPLEMENTATION IS NOT SAFE
  // it works by grabbing the price from the parent element directly
  // if someone was to go into the developer tools and change the prices
  // and then click order, they will be able to get everything for free (theoretically)
  const addOrderToTotal = function() {
    let $orderTotal = $('#order-total');
    let $selectDish = $('.select-dish');
    let $currentTotal = Number($orderTotal.text().slice(1));
    $selectDish.click(function(event) {
      for (let dish in allDishes) {
        const itemName = $(this).parent().parent().parent().children('h2').text();
        if (allDishes[dish].name === itemName) {
          $currentTotal += Number(allDishes[dish].price / 100);
          break;
        }
      }
      $orderTotal.text(`$${$currentTotal}`);
    });
  }

  const showOrderDetails = function() {
    const $checkoutButton = $('#checkout');
    const $closeButton = $('#close');
    $checkoutButton.click(function(event) {
      $('.order-details-container').css("display", "block");
    });
    $closeButton.click(function(event) {
      $('.order-details-container').css("display", "none");
    });
  }

  const setPageInteractions = function() {
    addOrderToTotal();
    showOrderDetails();
  }

  let allDishes;
  const loadDishes = function() {
    $.get("/dishes/")
      .then((data) => {
        allDishes = data;
        renderDishes(data)
        setPageInteractions();
      });
  }

  loadDishes();

});
