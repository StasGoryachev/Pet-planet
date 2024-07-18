const buttons = document.querySelectorAll(".store__category-button");
console.log(buttons);

const changeActiveBtn = (event) => {
   const target = event.target;
   console.log(target)
   // изначально убираем у всех активный клас
   buttons.forEach((button) => {
      button.classList.remove('store__category-button--active')
    }); 

    // а потом добавляем только нажатой 
    target.classList.add('store__category-button--active')
};

buttons.forEach((button) => {
  button.addEventListener("click", changeActiveBtn);
});


const API_URL = 'https://evening-cautious-century.glitch.me/'
// /api/products/category