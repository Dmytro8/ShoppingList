import jsPDF from 'jspdf';

import { getProducts, deleteProduct, fadeIn, fadeOut } from './utils';

window.addEventListener('DOMContentLoaded', () => {
  const products = getProducts();
  renderProducts(products);
  setTotalCountOfProducts(products);
  setTotalWeightOfProducts(products);
  reassignPointers();
});

let prevEditObject = null;
let productNameBuffer = null;
let newName = '';

// Selectors
const shoppingList = document.querySelector('.shoppingList');
const categorySelect = document.getElementById('categorySelect');
const totalCount = document.getElementById('totalCount');
const totalWeight = document.getElementById('totalWeight');
const editPanel = document.querySelector('.editPanel');
const declineUpdate = document.getElementById('rejectUpdate');
const editForm = document.getElementById('editForm');
const generatePdfButton = document.getElementById('buttonPdf');

// Event listeners
categorySelect.addEventListener('change', filterProducts);
declineUpdate.addEventListener('click', (e) => handleDeclineUpdate(e));
editForm.addEventListener('submit', (e) => handleAcceptUpdate(e));
generatePdfButton.addEventListener('click', handleGeneratePdfAction);

// Functions
function handleGeneratePdfAction() {
  const doc = new jsPDF();
  doc.fromHTML(shoppingList, 20, 20, { width: 500 });
  doc.save('Shopping-list.pdf');
}

// Handle click action on Decline button in the edit panel
function handleDeclineUpdate(e) {
  e.preventDefault();
  const editPanelProductInput = editPanel.children[1].children[0].children[1];
  const editPanelSelect = editPanel.children[1].children[1].children[1];
  fadeOut(editPanel);
  editPanel.classList.add('hidden');
  editPanelProductInput.removeAttribute('value');
  editPanelSelect.firstElementChild.selected = true;
  prevEditObject = null;
  productNameBuffer = null;
}

// Handle click action on Accept button in the edit panel
function handleAcceptUpdate(e) {
  e.preventDefault();
  const categorySelect = editPanel.children[1].children[1].children[1];
  handleChangeSelect(categorySelect);
  const productName = editPanel.children[1].children[0].children[1];

  if (!checkError(productName) && !checkError(categorySelect)) {
    const products = getProducts();
    const editPanelSelect = editPanel.children[1].children[1].children[1];
    const capitalizedName = newName.trim().charAt(0).toUpperCase() + newName.trim().slice(1);
    const newProducts = products.map((product) => {
      if (product.name === productNameBuffer) {
        return {
          ...product,
          name: capitalizedName,
          category: editPanelSelect.options[editPanelSelect.selectedIndex].value,
        };
      }
      return product;
    });
    localStorage.setItem('products', JSON.stringify(newProducts));
    renderProducts(newProducts);
    reassignPointers();
    handleDeclineUpdate(e);
  }
}

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
    checkbox.addEventListener('click', handleCheckbox);
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
      this.parentElement.parentElement.classList.add('crossedOut');
    } else {
      this.parentElement.parentElement.classList.remove('crossedOut');
    }
  }

  function handleEditAction() {
    const descriptionDiv = this.parentElement.children[1];
    const productName = descriptionDiv.children[0].innerHTML;
    const editPanelProductInput = editPanel.children[1].children[0].children[1];
    // const editPanelSelect = editPanel.children[1].children[1].children[1];
    // const foodCategories = editPanel.children[1].children[1].children[1].children[1].children;
    // const othersCategories = editPanel.children[1].children[1].children[1].children[2].children;
    if (prevEditObject !== this && prevEditObject !== null) {
      productNameBuffer = productName;
      editPanelProductInput.value = productName;
      newName = productName;
      editPanelProductInput.addEventListener('change', (e) => {
        newName = e.target.value;
        handleChangeProductName(e.target.value, editPanelProductInput);
      });
    } else if (prevEditObject === null) {
      productNameBuffer = productName;
      fadeIn(editPanel, 'block');
      editPanel.classList.remove('hidden');
      editPanelProductInput.value = productName;
      newName = productName;
      editPanelProductInput.addEventListener('change', (e) => {
        newName = e.target.value;
        handleChangeProductName(e.target.value, editPanelProductInput);
      });
    }
    prevEditObject = this;
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
  checkbox.classList.add('checkbox', 'styled-checkbox');
  checkbox.setAttribute('id', 'styled-checkbox');
  // const label = document.createElement('label');
  // label.setAttribute('for', 'styled-checkbox');
  // label.setAttribute('checked', false);
  // label.classList.add('checkbox');
  checkboxDiv.appendChild(checkbox);
  // checkboxDiv.appendChild(label);

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

//---------------

function handleChangeProductName(value, name) {
  const allLetterRegex = /^([A-Za-z])+(\s)*([A-Za-z])*$/;
  if (value === '') {
    setError(name, '*The field cannot be blank');
  } else if (!value.match(allLetterRegex)) {
    setError(name, '*Enter alphabets only.');
  } else removeError(name);
}

function handleChangeSelect(select) {
  if (select.selectedIndex === 0) {
    setError(select, '*You should select a category');
  } else {
    removeError(select);
  }
}

function setError(element, message) {
  element.classList.add('hasError');
  const formControl = element.parentElement;
  const spanError = formControl.querySelector('span');
  spanError.style.display = 'block';
  spanError.innerText = message;
}

function removeError(element) {
  element.classList.remove('hasError');
  const formControl = element.parentElement;
  const spanError = formControl.querySelector('span');
  spanError.style.display = 'none';
}

function checkError(element) {
  if (element.classList.contains('hasError')) {
    return true;
  }
  return false;
}
