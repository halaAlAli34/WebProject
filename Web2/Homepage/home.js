document.addEventListener("DOMContentLoaded", function () {
  fetch("data.json")
    .then((response) => response.json())
    .then((data) => {
      renderSpecials(data.specials);
      renderReviews(data.reviews);
    })
    .catch((error) => console.error("Error loading data:", error));

  updateCart();
  initializeSearchBar();
  initializeReviewHoverEffect();
  toggleCart();
});

let cart = [];
let reviews = [];

let currentPage = 1;

function renderSpecials(specials) {
  const specialsContainer = document.querySelector(".products .product-row");
  const itemsPerPage = 3;
  const totalPages = Math.ceil(specials.length / itemsPerPage);
  let currentPage = 1;

  function displayPage(page) {
    specialsContainer.innerHTML = "";
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const specialsToDisplay = specials.slice(start, end);

    specialsToDisplay.forEach((special) => {
      const productCard = document.createElement("div");
      productCard.classList.add("col-md-3", "text-center", "product-card");
      productCard.innerHTML = `
          <img src="${special.image}" alt="${special.name}" class="img-fluid" />
          <h4>${special.name}</h4>
          <h3>$${special.price}</h3>
          <div class="quantity-control">
            <button class="decrease-btn">-</button>
            <span class="quantity">0</span>
            <button class="increase-btn">+</button>
          </div>
          <button class="add-to-cart-btn">Add To Cart</button>
        `;
      specialsContainer.appendChild(productCard);

      const decreaseBtn = productCard.querySelector(".decrease-btn");
      const increaseBtn = productCard.querySelector(".increase-btn");
      const quantitySpan = productCard.querySelector(".quantity");

      decreaseBtn.addEventListener("click", () => {
        let quantity = parseInt(quantitySpan.textContent);
        if (quantity > 0) {
          quantity--;
          quantitySpan.textContent = quantity;
        }
      });

      increaseBtn.addEventListener("click", () => {
        let quantity = parseInt(quantitySpan.textContent);
        quantity++;
        quantitySpan.textContent = quantity;
      });

      const addToCartBtn = productCard.querySelector(".add-to-cart-btn");
      addToCartBtn.addEventListener("click", () => {
        const quantity = parseInt(quantitySpan.textContent);
        if (quantity > 0) {
          addItemToCart(special, quantity);
        }
      });
    });

    updatePaginationControls(page, totalPages);
  }

  function updatePaginationControls(page, totalPages) {
    const leftArrow = document.querySelector(".pagination-arrow.left-arrow");
    const rightArrow = document.querySelector(".pagination-arrow.right-arrow");

    if (page > 1) {
      leftArrow.style.opacity = "1";
      leftArrow.style.pointerEvents = "auto";
      leftArrow.onclick = () => {
        currentPage--;
        displayPage(currentPage);
      };
    } else {
      leftArrow.style.opacity = "0.5";
      leftArrow.style.pointerEvents = "none";
      leftArrow.onclick = null;
    }

    if (page < totalPages) {
      rightArrow.style.opacity = "1";
      rightArrow.style.pointerEvents = "auto";
      rightArrow.onclick = () => {
        currentPage++;
        displayPage(currentPage);
      };
    } else {
      rightArrow.style.opacity = "0.5";
      rightArrow.style.pointerEvents = "none";
      rightArrow.onclick = null;
    }
  }

  displayPage(currentPage);
}

function renderReviews(reviewData) {
  const reviewsContainer = document.querySelector(".reviews");
  reviewsContainer.innerHTML = "";
  reviews = reviewData;

  reviewData.forEach((review, index) => {
    const reviewElement = document.createElement("div");
    reviewElement.classList.add("review-card");
    reviewElement.setAttribute("data-index", index);
    reviewElement.innerHTML = `
                <h1>COFFEE REVIEW</h1>
                <img src="${review.ratingImage}" class="five" />
                <p>${review.text}</p>
                <h3>- ${review.name} -</h3>
              `;
    reviewsContainer.appendChild(reviewElement);
  });

  initializeReviewHoverEffect();
}

function initializeReviewHoverEffect() {
  document.querySelectorAll(".review-card").forEach((card) => {
    card.addEventListener("mouseover", () => {
      card.style.transition = "transform 0.3s ease, box-shadow 0.3s ease";
      card.style.transform = "scale(1.1)";
      card.style.boxShadow = "0 4px 15px rgba(0, 0, 0, 0.2)";
    });

    card.addEventListener("mouseout", () => {
      card.style.transform = "scale(1)";
      card.style.boxShadow = "none";
    });

    card.addEventListener("click", () => {
      card.classList.toggle("zoomed");
    });
  });
}

function initializeSearchBar() {
  const searchBtn = document.getElementById("search-btn");
  const searchInput = document.getElementById("search-input");
  const searchResults = document.getElementById("search-results");
  const searchCloseBtn = document.getElementById("search-close-btn");

  if (searchBtn) {
    searchBtn.addEventListener("click", () => {
      const searchBarContainer = document.getElementById(
        "search-bar-container"
      );
      if (searchBarContainer.style.display === "block") {
        searchBarContainer.style.display = "none";
        searchInput.value = "";
        clearSearchResults();
      } else {
        searchBarContainer.style.display = "block";
        searchInput.focus();
        clearSearchResults();
      }
    });
  }

  if (searchCloseBtn) {
    searchCloseBtn.addEventListener("click", () => {
      const searchBarContainer = document.getElementById(
        "search-bar-container"
      );
      searchBarContainer.style.display = "none";
      searchInput.value = "";
      clearSearchResults();
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", () => {
      const query = searchInput.value.trim().toLowerCase();

      if (query) {
        fetch("data.json")
          .then((response) => response.json())
          .then((data) => searchMenuItems(data.menuItems, query))
          .catch((error) => console.error("Error fetching menu data:", error));
      } else {
        clearSearchResults();
      }
    });
  }

  function searchMenuItems(menuItems, query) {
    const results = [];

    menuItems.forEach((item) => {
      item.products.forEach((product) => {
        if (product.toLowerCase().includes(query)) {
          results.push(product);
        }
      });
    });

    displaySearchResults(results);
  }

  function displaySearchResults(results) {
    clearSearchResults();

    if (results.length > 0) {
      results.forEach((result) => {
        const resultElement = document.createElement("div");
        resultElement.className = "search-result";
        resultElement.textContent = result;
        resultElement.addEventListener("click", () => {
          searchInput.value = result;
          clearSearchResults();
        });
        searchResults.appendChild(resultElement);
      });
    } else {
      const noResults = document.createElement("p");
      noResults.textContent = "No matching items found.";
      searchResults.appendChild(noResults);
    }
  }

  function clearSearchResults() {
    searchResults.innerHTML = "";
  }
}

function addItemToCart(product, quantity) {
  const item = {
    name: product.name,
    image: product.image,
    price: product.price,
    quantity: quantity,
  };

  const existingItemIndex = cart.findIndex(
    (cartItem) => cartItem.name === product.name
  );
  if (existingItemIndex >= 0) {
    cart[existingItemIndex].quantity += quantity;
  } else {
    cart.push(item);
  }

  updateCart();
}

function updateCart() {
  const cartContainer = document.querySelector(".cart-container");
  cartContainer.innerHTML = "<h2>Your Cart</h2>";

  if (cart.length === 0) {
    const emptyMessage = document.createElement("p");
    emptyMessage.textContent = "Your cart is empty.";
    cartContainer.appendChild(emptyMessage);
  } else {
    let totalPrice = 0;
    cart.forEach((item, index) => {
      totalPrice += item.price * item.quantity;

      const cartItem = document.createElement("div");
      cartItem.classList.add("cart-item");
      cartItem.style.display = "flex";
      cartItem.style.alignItems = "center";
      cartItem.style.justifyContent = "space-between";

      cartItem.innerHTML = `
        <div style="display: flex; align-items: center;">
          <img src="${item.image}" alt="${item.name}" class="cart-item-img" style="width: 50px; height: 50px; margin-right: 10px;" />
          <div>
            <h4>${item.name}</h4>
            <p>${item.quantity} x $${item.price}</p>
          </div>
        </div>
        <div class="remove-buttons">
          <button class="remove-btn">-</button>
          <button class="delete-btn">Remove</button>
        </div>
      `;

      const removeBtn = cartItem.querySelector(".remove-btn");
      removeBtn.addEventListener("click", () => removeItemFromCart(index));

      const deleteBtn = cartItem.querySelector(".delete-btn");
      deleteBtn.addEventListener("click", () => {
        cart.splice(index, 1);
        updateCart();
      });

      cartContainer.appendChild(cartItem);
    });

    const totalElement = document.createElement("h3");
    totalElement.textContent = `Total: $${totalPrice.toFixed(2)}`;
    cartContainer.appendChild(totalElement);

    // Only display the checkout button if there are items in the cart
    const checkoutBtn = document.createElement("button");
    checkoutBtn.textContent = "Checkout";
    checkoutBtn.classList.add("checkout-btn");
    cartContainer.appendChild(checkoutBtn);
    checkoutBtn.addEventListener("click", () => handleCheckout());
  }
}

function removeItemFromCart(index) {
  if (cart[index].quantity > 1) {
    cart[index].quantity--;
  } else {
    cart.splice(index, 1);
  }
  updateCart();
}

function toggleCart() {
  const cartBtn = document.getElementById("cart-btn");
  if (cartBtn) {
    cartBtn.onclick = function () {
      const cartContainer = document.querySelector(".cart-container");
      if (cartContainer.style.display === "block") {
        cartContainer.style.display = "none";
      } else {
        cartContainer.style.display = "block";
      }
    };
  }
}
