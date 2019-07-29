$(() => {
  const createDishElement = function(dish) {
    const dishName = dish.name.charAt(0).toUpperCase() + dish.name.slice(1).split('_').join(' ');
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
            <input class="btn btn-primary btn-sm" type="button" name="select" value="Select">
          </div>
        </div>
      </article>
      `;
    return elementString;
  };
  const renderDishes = function(allDishes) {
    allDishes.forEach((dishEntry) => {
      const dish = createDishElement(dishEntry);
      $('#menu').append(dish);
    });
  };

  const loadDishes = function() {
    $.get("/dishes/")
      .then((data) => {
        console.log(data);
        console.log(data[0].description.charAt(0).toUpperCase() + data[0].description.slice(1));
        renderDishes(data)
      });
  }
  loadDishes();
});
