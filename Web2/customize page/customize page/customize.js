document.addEventListener("DOMContentLoaded", () => {
  const coffeeTypeSelect = document.querySelector("#form2 select");
  const existingDrinkSelect = document.querySelector("#select1");
  const flavorSelect = document.querySelector("#form3 select");
  const milkSelect = document.querySelector("#selectM");
  const addMilkCheckbox = document.querySelector("#addMilkCheckbox");
  const sizeRadiosContainer = document.querySelector(".cup-size");
  const priceLabel = document.querySelector("#price span");

  let prices = {};

  fetch("prices.json")
    .then((response) => response.json())
    .then((data) => {
      prices = data;
      populateOptionsWithPrices(coffeeTypeSelect, prices.coffeeTypes, true);
      populateOptionsWithPrices(
        existingDrinkSelect,
        prices.drinks,
        true,
        "If your drink already exists, select please"
      );
      populateOptionsWithPrices(flavorSelect, prices.flavors);
      populateOptionsWithPrices(
        milkSelect,
        prices.milkTypes,
        false,
        "Milk Type"
      );
      calculatePrice();
    })
    .catch(() => {});

  function populateOptionsWithPrices(
    selectElement,
    priceObject,
    isCoffee = false,
    placeholder = null
  ) {
    const options = selectElement.querySelectorAll("option");
    const placeholderOption = options[0];

    if (placeholderOption && placeholderOption.hidden) {
      placeholderOption.textContent =
        placeholder ||
        (isCoffee ? "Choose Your Coffee Type" : "Add Your Flavor");
    }

    for (const key in priceObject) {
      let option = selectElement.querySelector(`option[value="${key}"]`);
      if (!option) {
        option = document.createElement("option");
        option.value = key;
        selectElement.appendChild(option);
      }
      option.textContent = isCoffee ? key : `${key} - $${priceObject[key]}`;
    }
  }

  function updateSizeOptions(itemType, type) {
    sizeRadiosContainer.innerHTML = "<h4>Select Your Cup Size:</h4>";
    const sizes = ["small", "medium", "large"];
    if (itemType && prices[type][itemType]) {
      sizes.forEach((size) => {
        const sizeDiv = document.createElement("div");
        const radio = document.createElement("input");
        const label = document.createElement("label");

        radio.type = "radio";
        radio.name = "size";
        radio.value = size;

        label.textContent = `${
          size.charAt(0).toUpperCase() + size.slice(1)
        } - $${prices[type][itemType][size]}`;
        sizeDiv.appendChild(radio);
        sizeDiv.appendChild(label);
        sizeRadiosContainer.appendChild(sizeDiv);
      });
    }
  }

  function calculatePrice() {
    let total = 0;

    const coffeeType = coffeeTypeSelect.value;
    const existingDrink = existingDrinkSelect.value;
    const selectedSize = document.querySelector(
      ".cup-size input[type='radio']:checked"
    )?.value;

    if (coffeeType && selectedSize && prices.coffeeTypes[coffeeType]) {
      total += prices.coffeeTypes[coffeeType][selectedSize];
    }

    if (existingDrink && selectedSize && prices.drinks[existingDrink]) {
      total += prices.drinks[existingDrink][selectedSize];
    }

    const flavor = flavorSelect.value;
    if (flavor && prices.flavors[flavor]) {
      total += prices.flavors[flavor];
    }

    if (addMilkCheckbox.checked) {
      milkSelect.parentElement.style.display = "block";
      const milkType = milkSelect.value;
      if (milkType && prices.milkTypes[milkType]) {
        total += prices.milkTypes[milkType];
      }
    } else {
      milkSelect.parentElement.style.display = "none";
    }

    priceLabel.textContent = `$${total.toFixed(2)}`;
  }

  coffeeTypeSelect.addEventListener("change", (e) => {
    updateSizeOptions(e.target.value, "coffeeTypes");
    calculatePrice();
  });

  existingDrinkSelect.addEventListener("change", (e) => {
    updateSizeOptions(e.target.value, "drinks");

    coffeeTypeSelect.disabled = e.target.value !== "";
    calculatePrice();
  });

  flavorSelect.addEventListener("change", calculatePrice);
  addMilkCheckbox.addEventListener("change", calculatePrice);
  milkSelect.addEventListener("change", calculatePrice);
  sizeRadiosContainer.addEventListener("change", calculatePrice);
});
