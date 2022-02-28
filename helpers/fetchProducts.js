const fetchProducts = async (product) => {
  try {
    const URL = `https://api.mercadolibre.com/sites/MLB/search?q=${product}`;
    const promiseFetch = await fetch(URL);
    const results = await promiseFetch.json();

    return results;
  } catch (error) {
    return error;
  }
};

if (typeof module !== 'undefined') {
  module.exports = {
    fetchProducts,
  };
}
