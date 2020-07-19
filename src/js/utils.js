export const fadeOut = (el) => {
  el.style.opacity = 1;

  function fade() {
    el.style.opacity -= 0.1;
    if (el.style.opacity < 0) {
      el.style.display = 'none';
    } else {
      requestAnimationFrame(fade);
    }
  }
  fade();
};

export const fadeIn = (el, display) => {
  el.style.opacity = 0;
  el.style.display = display || 'block';

  function fade() {
    let value = parseFloat(el.style.opacity);
    value += 0.1;
    if (!(value > 1)) {
      el.style.opacity = value;
      requestAnimationFrame(fade);
    }
  }
  fade();
};

// Function to get shopping list from Localstorage
export const getProducts = () => {
  let products;
  if (localStorage.getItem('products') === null) {
    products = [];
  } else {
    products = JSON.parse(localStorage.getItem('products'));
  }
  return products;
};

// Function to update shopping list
export const updateProduct = () => {};

// Function to delete product from shopping list
export const deleteProduct = (e, setTotalCountOfProducts, setTotalWeightOfProducts) => {
  const products = getProducts();
  const descriptionDiv = e.target.parentElement.children[1];
  const targetProductName = descriptionDiv.children[0].innerHTML;
  const newProducts = products.filter((product) => !(product.name === targetProductName));
  setTotalCountOfProducts(newProducts);
  setTotalWeightOfProducts(newProducts);
  localStorage.setItem('products', JSON.stringify(newProducts));
  e.target.parentElement.remove();
};
