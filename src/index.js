const API_URL = "https://evening-cautious-century.glitch.me";
const buttons = document.querySelectorAll(".store__category-button");
const productList = document.querySelector(".store__list");
const cartButton = document.querySelector(".store__cart-button");
const cartCount = cartButton.querySelector(".store__cart-cnt");
const modalOverlay = document.querySelector(".modal-overlay");
const modal = document.querySelector(".modal");
const cartItemsList = document.querySelector(".modal__cart-items");
const modalCloseButton = document.querySelector(".modal-overlay__close-button");
const cartTotalPticeElement = document.querySelector(".modal__cart-price");
const cartForm = document.querySelector(".modal__cart-form");

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

const fetchCartItems = async (ids) => {
  try {
    const response = await fetch(
      `${API_URL}/api/products/list/${ids.join(",")}`,
    );
    if (!response.ok) {
      throw new Error(response.status);
    }
    return await response.json();
  } catch (error) {
    console.error(`Ошибка запроса товаров для корзины : ${error}`);
    return [];
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

const calculateTotalPrice = (cartItems, products) =>
  cartItems.reduce((acc, item) => {
    const product = products.find((prod) => prod.id === item.id);
    return acc + product.price * item.count;
  }, 0);

const renderCartItems = async () => {
  cartItemsList.textContent = "";
  // получаем элементы из LocalStorage
  const cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
  const products = JSON.parse(
    localStorage.getItem("cartProductDetails") || "[]",
  );
  console.log(products)
  // на вышеуказанных данных мы делаем перебор массива этих данных
  products.forEach(({ id, photoUrl, name, price }) => {
    const cartItem = cartItems.find((item) => item.id === id);
    console.log(cartItem);
    if (!cartItem) {
      return;
    }
    const listItem = document.createElement("li");
    listItem.classList.add("modal__cart-item");
    listItem.innerHTML = `
         <img class="modal__cart-item-image" src="${API_URL}${photoUrl}" alt="${name}">
         <h3 class="modal__cart-item-title">${name}</h3>
         <div class="modal__cart-otem-count">
             <button class="modal__btn modal__minus" data-id=${id}>-</button>
             <span class="modal__count">${cartItem.count}</span>
             <button class="modal__btn modal__plus" data-id=${id}>+</button>
         </div>
         <p class="modal__cart-item-price">${price * cartItem.count}&nbsp;₽</p>
     `;

    cartItemsList.append(listItem);
  });
  const totalPrice = calculateTotalPrice(cartItems, products);
  cartTotalPticeElement.innerHTML = `${totalPrice}&nbsp;₽`;



};

cartButton.addEventListener("click", async () => {
  modalOverlay.style.display = "flex";

  const cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
  const ids = cartItems.map((item) => item.id);
  // Будем выводить сообщение, если в карзину не будет добавлено ни одной позиции
  if (!ids.length) {
    cartItemsList.textContent = "";
    const listItem = document.createElement("li");
    listItem.textContent = "Корзина пуста";
    cartItemsList.append(listItem);
    return;
  }

  const products = await fetchCartItems(ids);
  localStorage.setItem("cartProductDetails", JSON.stringify(products));
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

const addToCart = (productId) => {
  const cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");

  const existingItem = cartItems.find((item) => item.id === productId);
  console.log(existingItem);

  if (existingItem) {
    existingItem.count += 1;
  } else {
    cartItems.push({ id: productId, count: 1 });
  }

  localStorage.setItem("cartItems", JSON.stringify(cartItems));
  updateCartCount();
};

productList.addEventListener("click", ({ target }) => {
  if (target.closest(".product__btn-add-cart")) {
    const productId = target.dataset.id;
    addToCart(productId);
  }
});


const updateCartItem = () => {
  
}


cartItemsList.addEventListener('click', ({ target }) => {
   if (target.classList.contains('modal__plus')) {
       const productId = target.dataset.id;
       updateCartItem(productId, 1);
   }

   if (target.classList.contains('modal__minus')) {
       const productId = target.dataset.id;
       updateCartItem(productId, -1);
   }
});