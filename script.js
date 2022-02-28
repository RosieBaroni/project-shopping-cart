// Containers:
const productsContainer = document.querySelector('.items');
const cartItemsContainer = document.querySelector('.cart__items');
const cartItemsTotalContainer = document.querySelector('.cart__items__total');

// Função que cria a imagem na tela.
function createProductImageElement(imageSource) {
  const img = document.createElement('img');

  img.className = 'item__image';
  img.src = imageSource;

  return img;
}

// Função que cria um elemento na tela.
function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);

  e.className = className;
  e.innerText = innerText;

  return e;
}

// Função que add o texto de "carregando".
function addLoadingMsg() {
  const loading = createCustomElement('p', 'loading', 'Carregando...');

  productsContainer.appendChild(loading);
}

// Função que remove o texto "carregando".
function removeLoadMsg() {
  const selectLoading = document.querySelector('.loading');

  productsContainer.removeChild(selectLoading);
}

// Função que cria o valor total na tela.
function totalPrice(subTotal) {
  const totalPriceElement = `<p class="total-price">${subTotal}</p>`;

  cartItemsTotalContainer.innerHTML = totalPriceElement;
}

// Função que calcula o valor total dos items do "Meu Carrinho".
/** Source: https://stackoverflow.com/questions/222841/most-efficient-way-to-convert-an-htmlcollection-to-an-array
 * OBS: Array.from() para converter o HTMLCollection em um array.
 * OBS: Math.round() para resolver as casas decimais (Monitoria Thalles).
*/
function calculateTotalPrice() {
  const cartItemListElements = cartItemsContainer.childNodes;

  if (!cartItemListElements) {
    return;
  }

  const total = Array.from(cartItemListElements)
    .reduce((accumulator, item) => {
      const priceItemElement = item.querySelector('.price').innerHTML;
      return accumulator + Number(priceItemElement);
    }, 0);

  const subTotal = Math.round(total * 100) / 100;

  return subTotal;
}

// Função que cria os produtos na tela.
function createProductItemElement({ sku, name, image, price }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createCustomElement('span', 'item__price', `R$ ${(price).toFixed(2)
    .replace('.', ',')}`));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

// Função que retorna o id do produto que foi clicado, para add no "Meu carrinho".
function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

// Função que remove do "Meu Carrinho" o item que recebeu o eventListener de click.
/** Source: https://developer.mozilla.org/en-US/docs/Web/API/Node/parentElement
 * OBS: parentElement para remover o li, pois a função createCartItemElement cria as tags 'img' e 'p'.
 */
function cartItemClickListener(event) {
  event.target.parentElement.remove();

  totalPrice(calculateTotalPrice());
  saveCartItems(cartItemsContainer.innerHTML);
}

// Função que cria o item do "Meu carrinho" e já add um eventListener de click.
function createCartItemElement({ sku, name, salePrice, image }) {
  const li = document.createElement('li');
  const img = `<img class="cart__img" src=${image} />`;
  const id = `SKU: ${sku}`;
  const infoName = `| NAME: ${name}`;
  // Add um span com class específica para o preço para usar na função calculateTotalPrice.
  const price = `| PRICE: $<span class="price">${salePrice}</span>`;

  li.className = 'cart__item';

  li.innerHTML = `${img}<p>${id} ${infoName} ${price}</p>`;
  li.addEventListener('click', cartItemClickListener);

  return li;
}

// Função que busca os produtos chamando a função assíncrona fetchProducts.
/** Source: Dica no slack do Thiago Nóbrega para melhorar a img, trocando 'I.jpg' para 'W.webp' */
async function loadProducts() {
  const { results } = await fetchProducts('computador');

  removeLoadMsg();

  results.forEach(({ id, title, thumbnail, price }) => {
    const elementProduct = createProductItemElement({
      sku: id, name: title, image: thumbnail.replace('I.jpg', 'W.webp'), price,
    });

    productsContainer.appendChild(elementProduct);
  });
}

// Função que verifica se o eventListener foi no botão de add, caso sim, add o 
// produto no "Meu carrinho" chamando a função createCartItemElement.
async function addProduct(event) {
  const { target } = event;

  if (!target.classList.contains('item__add')) {
    return;
  }

  const itemId = getSkuFromProductItem(target.parentElement);
  const { id, title, price, thumbnail } = await fetchItem(itemId);
  const cartItemElement = createCartItemElement({
    sku: id, name: title, salePrice: price, image: thumbnail,
  });

  cartItemsContainer.appendChild(cartItemElement);

  totalPrice(calculateTotalPrice());
  saveCartItems(cartItemsContainer.innerHTML);
}

// Função que verifica se existe items no carrinho, caso sim, remove eles.
function clearCart() {
  const listCart = document.querySelectorAll('.cart__item');

  if (listCart !== null) {
    listCart.forEach((item) => {
      // Remove cada um dos "filhos" items do container do carrinho.
      cartItemsContainer.removeChild(item);

      totalPrice(0);
      saveCartItems(cartItemsContainer.innerHTML);
    });
  }
}

// Função que recebe o eventListener no container e chama a função addProduct.
function setAddProductListener() {
  productsContainer.addEventListener('click', addProduct);
}

// Função que recebe o eventListener no botão "Esvaziar carrinho" e chama a função clearCart.
function setclearCartListener() {
  const buttonClearCart = document.querySelector('.empty-cart');

  buttonClearCart.addEventListener('click', clearCart);
}

// Função que verifica o localStorage, caso tenha algo, exibe na tela.
function buildCartItems() {
  const cartItems = getSavedCartItems();

  if (!cartItems) {
    return '';
  }

  cartItemsContainer.innerHTML = cartItems;
  cartItemsContainer.addEventListener('click', cartItemClickListener);
}

// Função que inicializa as funções que carregam os items na tela e os eventListeners.
function init() {
  buildCartItems();
  addLoadingMsg();
  loadProducts();
  setAddProductListener();
  totalPrice(calculateTotalPrice());
  setclearCartListener();
}

window.onload = () => { init(); };
