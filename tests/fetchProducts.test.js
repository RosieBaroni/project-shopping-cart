require('../mocks/fetchSimulator');
const { fetchProducts } = require('../helpers/fetchProducts');
const computadorSearch = require('../mocks/search');

/** Source:https://jestjs.io/pt-BR/docs/expect#tohavebeencalled
 * OBS: .toHaveBeenCalled  para garantir que uma função de simulação (mock, em inglês) foi chamada.
 * OBS: .toHaveBeenCalledWith para garantir que uma função de simulação (mock, em inglês) foi chamada com argumentos específicos
*/
describe('1 - Teste a função fecthProducts', () => {
  // fail('Teste vazio');

  it('Teste se fecthProducts é uma função', () => {
    expect(typeof fetchProducts).toBe('function');
  });

  it('Teste se a função fetchProducts com o argumento "computador" a fetch foi chamada', async () => {
    await fetchProducts('computador');

    expect(fetch).toHaveBeenCalled();
  });

  it('Teste se, ao chamar a função fetchProducts com o argumento "computador", a função fetch utiliza o endpoint "https://api.mercadolibre.com/sites/MLB/search?q=computador"', async () => {
    await fetchProducts('computador');

    expect(fetch).toHaveBeenCalledWith("https://api.mercadolibre.com/sites/MLB/search?q=computador");
  });

  it('Teste se o retorno da função fetchProducts com o argumento "computador" é uma estrutura de dados igual ao objeto computadorSearch, que já está importado no arquivo.', async () => {
    const products = await fetchProducts('computador');

    expect(products).toEqual(computadorSearch);
  });

  it('Teste se, ao chamar a função fetchProducts sem argumento, retorna um erro com a mensagem: You must provide an url', async () => {
    const products = await fetchProducts();

    expect(products).toEqual(new Error('You must provide an url'));
  });
});
