import * as mdb from 'mdb-ui-kit';
import { fadeIn, fadeOut, getProducts } from './utils';

// Timers
let messageTimer;

// Selectors
const productName = document.querySelector('#productName');
const unitInput = document.querySelector('#inputUnit');
const unitSelect = document.querySelector('#unit');
const message = document.querySelector('.message');
const iconCloseMessage = document.querySelector('#icon-close-message');
const form = document.getElementById('form');
const categorySelect = document.getElementById('categorySelect');

// Event Listeners
form.addEventListener('submit', submitForm);
iconCloseMessage.addEventListener('click', closeMessage);
unitSelect.addEventListener('change', handleChangeUnitSelect);
unitInput.addEventListener('change', handleChangeUnitInput);
productName.addEventListener('change', handleChangeProductName);
categorySelect.addEventListener('change', handleChangeCategorySelect);

function submitForm(e) {
  e.preventDefault();
  checkInputs();
  if (!checkError(productName) && !checkError(unitInput) && !checkError(categorySelect)) {
    const existProducts = getProducts();
    const coincidence = existProducts.filter(
      (existProduct) => existProduct.name === productName.value.trim()
    );
    if (coincidence.length === 0) {
      const capitalizedName =
        productName.value.trim().charAt(0).toUpperCase() + productName.value.trim().slice(1);
      const product = {
        name: capitalizedName,
        [unitSelect.options[unitSelect.selectedIndex].value]: unitInput.value,
        category: categorySelect.options[categorySelect.selectedIndex].value,
      };
      const products = getProducts();
      products.push(product);
      localStorage.setItem('products', JSON.stringify(products));
      showMessage('Your product was successfully added', 'success');
      clearAfterSubmit();
    } else showMessage('This product is already on your list', 'warning');
  }
}

function clearAfterSubmit() {
  unitInput.value = '';
  productName.value = '';
  categorySelect.firstElementChild.selected = true;
}

function checkInputs() {
  handleChangeProductName();
  handleChangeUnitInput();
  handleChangeCategorySelect();
}

function handleChangeProductName() {
  const allLetterRegex = /^([A-Za-z])+(\s)*([A-Za-z])*$/;
  if (productName.value === '') {
    setError(productName, '*The field cannot be blank');
  } else if (!productName.value.match(allLetterRegex)) {
    setError(productName, '*Enter alphabets only.');
  } else removeError(productName);
}

function showMessage(messageBody, messageStatus) {
  message.classList.remove('hidden');
  fadeIn(message, 'grid');
  message.firstElementChild.innerHTML = messageBody;
  message.classList.add(messageStatus);
  if (messageTimer) {
    clearTimeout(messageTimer);
    messageTimer = null;
  }
  messageTimer = setTimeout(() => {
    closeMessage();
  }, 3000);
}

function handleChangeCategorySelect() {
  if (categorySelect.selectedIndex === 0) {
    setError(categorySelect, '*You should select a category');
  } else {
    removeError(categorySelect);
  }
}

function handleChangeUnitInput() {
  if (unitInput.value.trim() === '') {
    setError(unitInput.parentElement, '*The field cannot be blank');
  } else removeError(unitInput.parentElement);
}

function handleChangeUnitSelect() {
  const option = unitSelect.options[unitSelect.selectedIndex].value;
  if (option === 'weight') {
    unitInput.step = '0.01';
    unitInput.placeholder = '0.0 (kg / L)';
  } else if (option === 'unit') {
    unitInput.placeholder = '0';
    unitInput.step = '1';
  }
}

function closeMessage() {
  fadeOut(message);
  message.classList = 'message';
  message.classList.add('hidden');
}

function checkError(element) {
  if (element.classList.contains('hasError')) {
    return true;
  }
  return false;
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

export default {
  mdb,
};
