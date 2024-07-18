const buttons = document.querySelectorAll(".store__category-button");
console.log(buttons);

const changeActiveBtn = (event) => {
  const target = event.target;
  console.log(target);
  // изначально убираем у всех активный клас
  buttons.forEach((button) => {
    button.classList.remove("store__category-button--active");
  });

  // а потом добавляем только нажатой
  target.classList.add("store__category-button--active");
};

buttons.forEach((button) => {
  button.addEventListener("click", changeActiveBtn);
});

const API_URL = "https://evening-cautious-century.glitch.me";
// /api/products/category
const productList = document.querySelector(".store__list");

const createProductCard = (product) => {
  console.log("product: ", product);
  const productCard = document.createElement("li");
  productCard.classList.add("store__item");
  productCard.innerHTML = `
   <article class="store__product product">
       <img class="product__img" src="${API_URL}${product.photoUrl}" alt="${product.name}" width="388" height="261">
       <div class="product__content">
       <h3 class="product__title">${product.name}</h3>
       <p class="product__price">${product.price}&nbsp;₽</p>
       <button class="product__btn-add-cart btn btn--purple"data-id="${product.id}">Заказать</button>
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
    console.log(products); 
    renderProducts(products);
  } catch (error) {
    console.error(`Ошибка запроса товаров: ${error}`);
  }
};

fetchProductByCategory("Лежанки");
