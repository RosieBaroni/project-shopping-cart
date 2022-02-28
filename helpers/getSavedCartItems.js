const getSavedCartItems = () => {
  const cartItemsList = localStorage.getItem('cartItems');

  return cartItemsList;
};

if (typeof module !== 'undefined') {
  module.exports = getSavedCartItems;
}
