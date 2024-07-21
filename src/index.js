const API_URL = "https://evening-cautious-century.glitch.me";
const buttons = document.querySelectorAll(".store__category-button");
const productList = document.querySelector(".store__list");
const cartButton = document.querySelector(".store__cart-button");
const cartCount = cartButton.querySelector(".store__cart-cnt");
const modalOverlay = document.querySelector(".modal-overlay");
const modal = document.querySelector(".modal");
const cartItemsList = document.querySelector(".modal__cart-items");
const modalCloseButton = document.querySelector(".modal-overlay__close-button");

// /api/products/category

const createProductCard = ({ id, photoUrl, name, price }) => {
  // console.log('product: ', product);
  const productCard = document.createElement("li");
  productCard.classList.add("store__item");
  productCard.innerHTML = `
    <article class="store__product product">
        <img class="product__img" src="${API_URL}${photoUrl}" alt="${name}" width="388" height="261">
        <div class="product__content">
        <h3 class="product__title">${name}</h3>
        <p class="product__price">${price}&nbsp;₽</p>
        <button class="product__btn-add-cart btn btn--purple"data-id="${id}">Заказать</button>
    </article>
    `;

  return productCard; //Возвращает созданный элемент карточки продукта.
};

const renderProducts = (products) => {
  productList.textContent = "";
  products.forEach((product) => {
    const productCard = createProductCard(product);
    productList.append(productCard);
  });
};

const fetchProductByCategory = async (category) => {
  try {
    const response = await fetch(
      `${API_URL}/api/products/category/${category}`,
    );
    // так как 404ая ошибка не выводится в catch по умолчанию, то мы её добавим сами для вывода.
    // И выведем эту ошибку
    if (!response.ok) {
      throw new Error(response.status);
    }
    const products = await response.json();
    //  console.log(products);
    renderProducts(products);
  } catch (error) {
    console.error(`Ошибка запроса товаров: ${error}`);
  }
};

const changeCategory = ({ target }) => {
  console.log(target);
  // у этого таргета мы получаем категорию
  const category = target.textContent;
  console.log(target.textContent);
  // изначально убираем у всех активный клас
  buttons.forEach((button) => {
    button.classList.remove("store__category-button--active");
  });
  // а потом добавляем только нажатой
  target.classList.add("store__category-button--active");
  // и на основе текста это кнопки мы отрисовываем категории
  fetchProductByCategory(category);
};
// перебираем все кнопки и на каждую кнопку вешаем клик и выполняем функцию ChangeCategory, которая сначала убирает у всех кнопок активный класс, а потом добавляет нажатой  кнопке активный класс
buttons.forEach((button) => {
  button.addEventListener("click", changeCategory);
  console.log(button.textContent);

  if (button.classList.contains("store__category-button--active")) {
    fetchProductByCategory(button.textContent);
  }
});

const renderCartItems = () => {
  cartItemsList.textContent = "";
  const cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
  console.log(cartItems)

  cartItems.forEach((item) => {
    const listItem = document.createElement('li');
    listItem.textContent = item;
    cartItemsList.append(listItem)
  })

};

cartButton.addEventListener("click", () => {
  modalOverlay.style.display = "flex";
  renderCartItems();
});

modalOverlay.addEventListener("click", ({ target }) => {
  if (
    target === modalOverlay ||
    target.closest(".modal-overlay__close-button")
  ) {
    modalOverlay.style.display = "none";
  }
});

const updateCartCount = () => {
  const cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
  cartCount.textContent = cartItems.length;
};

const addToCart = (productName) => {
  const cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
  cartItems.push(productName);
  localStorage.setItem("cartItems", JSON.stringify(cartItems));
  updateCartCount();
};

productList.addEventListener("click", ({ target }) => {
  console.log(target);
  if (target.closest(".product__btn-add-cart")) {
    console.log("это то что нам надо");
    const productCard = target.closest(".store__product");
    const productName =
      productCard.querySelector(".product__title").textContent;
    addToCart(productName);
  }
});
