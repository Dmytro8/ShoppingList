import { getProducts, deleteProduct } from './utils';

window.addEventListener('DOMContentLoaded', () => {
  const products = getProducts();
  renderProducts(products);
  setTotalCountOfProducts(products);
  setTotalWeightOfProducts(products);
  reassignPointers();
});

// Selectors
const shoppingList = document.querySelector('.shoppingList');
const categorySelect = document.getElementById('categorySelect');
const totalCount = document.getElementById('totalCount');
const totalWeight = document.getElementById('totalWeight');

// Event listeners
categorySelect.addEventListener('change', filterProducts);

// Functions
// Filter products
function filterProducts() {
  const products = getProducts();
  const selectedCategory = categorySelect.options[categorySelect.selectedIndex].value;

  if (selectedCategory === 'All products') {
    renderProducts(products);
    setTotalCountOfProducts(products);
    setTotalWeightOfProducts(products);
  } else {
    const filteredProducts = products.filter((product) => product.category === selectedCategory);
    renderProducts(filteredProducts);
    setTotalCountOfProducts(filteredProducts);
    setTotalWeightOfProducts(filteredProducts);
  }
  reassignPointers();
}

// Update field totalCount
function reassignPointers() {
  const checkboxes = document.querySelectorAll('.checkbox');
  const editButtons = document.querySelectorAll('.btn-edit');
  const deleteButtons = document.querySelectorAll('.btn-delete');

  // Event listeners
  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener('change', handleCheckbox);
  });
  editButtons.forEach((editButton) => {
    editButton.addEventListener('click', handleEditAction);
  });
  deleteButtons.forEach((deleteButton) => {
    deleteButton.addEventListener('click', (e) =>
      deleteProduct(e, setTotalCountOfProducts, setTotalWeightOfProducts)
    );
  });
  // Functions
  function handleCheckbox() {
    if (this.checked) {
      // Checkbox is checked..
      this.parentElement.parentElement.classList.add('crossedOut');
    } else {
      // Checkbox is not checked..
      this.parentElement.parentElement.classList.remove('crossedOut');
    }
  }

  function handleEditAction() {
    console.log('handle edit click');
  }
}

// Set total count of products
export const setTotalCountOfProducts = (products) => {
  const weightOfProducts = products
    .map((product) => {
      return product.weight ? product.weight : 0;
    })
    .reduce((acc, weight) => (acc += Number(weight)), 0);
  totalWeight.innerHTML = weightOfProducts;
};

// Set total weight of products
export const setTotalWeightOfProducts = (products) => {
  const countOfUnits = products.reduce((acc, product) => {
    return product.unit ? (acc += Number(product.unit)) : (acc += 0);
  }, 0);
  totalCount.innerHTML = countOfUnits;
};

// Function to build div element of product
function createProductDomElement(
  productNameValue,
  unitKey,
  productUnitValue,
  productCategoryValue
) {
  // Product div wrapper
  const productDiv = document.createElement('div');
  productDiv.classList.add('product');

  // Checkbox div
  const checkboxDiv = document.createElement('div');
  const checkbox = document.createElement('input');
  checkbox.setAttribute('type', 'checkbox');
  checkbox.classList.add('checkbox');
  checkboxDiv.appendChild(checkbox);

  // Description of product div
  const descriptionDiv = document.createElement('div');
  const productName = document.createElement('h5');
  const productUnit = document.createElement('h6');
  const productCategory = document.createElement('h6');
  productName.setAttribute('id', 'productName');
  productUnit.setAttribute('id', 'productUnit');
  productCategory.setAttribute('id', 'productCategory');
  productName.innerHTML = productNameValue;
  if (unitKey === 'unit') {
    productUnit.innerHTML = `units: ${productUnitValue}`;
  } else {
    productUnit.innerHTML = `weight: ${productUnitValue}`;
  }
  productCategory.innerHTML = productCategoryValue;
  descriptionDiv.appendChild(productName);
  descriptionDiv.appendChild(productUnit);
  descriptionDiv.appendChild(productCategory);
  descriptionDiv.classList.add('descriptionProduct');

  // Button to edit product
  const editButton = document.createElement('button');
  editButton.classList.add('btn', 'btn-edit');
  const iconEdit = document.createElement('i');
  iconEdit.classList.add('far', 'fa-edit');
  editButton.appendChild(iconEdit);

  // Button to delete product
  const deleteButton = document.createElement('button');
  deleteButton.classList.add('btn', 'btn-delete');
  const iconDelete = document.createElement('i');
  iconDelete.classList.add('far', 'fa-trash-alt');
  deleteButton.appendChild(iconDelete);

  // Wrapping all together
  productDiv.appendChild(checkboxDiv);
  productDiv.appendChild(descriptionDiv);
  productDiv.appendChild(editButton);
  productDiv.appendChild(deleteButton);
  return productDiv;
}

// function renderProducts
export const renderProducts = (products) => {
  shoppingList.innerHTML = '';
  products.forEach((product) => {
    if (product.unit) {
      const productDOMElement = createProductDomElement(
        product.name,
        'unit',
        product.unit,
        product.category
      );
      shoppingList.appendChild(productDOMElement);
    } else {
      const productDOMElement = createProductDomElement(
        product.name,
        'weight',
        product.weight,
        product.category
      );
      shoppingList.appendChild(productDOMElement);
    }
  });
};
