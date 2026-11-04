(function () {
  'use strict';
  const { products, categories } = UptinoCatalog;
  const core = UptinoCore;
  const storage = core.storageFor(() => localStorage);
  const $ = id => document.getElementById(id);
  const cart = $('cart');
  const rub = kopecks => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2 }).format(kopecks / 100) + ' ₽';
  let bag = core.normalizeCart(storage.read(core.CART_KEY), products);
  let currentCategory = 'Все продукты';
  let toastTimer;

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function button(text, action, id, className) {
    const node = el('button', className, text);
    node.type = 'button';
    node.dataset.action = action;
    node.dataset.productId = id;
    return node;
  }

  function photo(product, cartPhoto = false) {
    const placeholder = () => el('div', cartPhoto ? 'cart-photo-pending' : 'photo-pending', 'Фотография готовится');
    if (!product.image) return placeholder();
    const image = el('img');
    image.src = product.image;
    image.alt = cartPhoto ? '' : product.name;
    image.loading = 'lazy';
    image.addEventListener('error', () => image.replaceWith(placeholder()), { once: true });
    return image;
  }

  function rate(product) {
    return rub(product.regular * 100) + (product.unit === 'кг' ? ' / кг' : product.unit === 'упаковка' ? ' / упаковку' : '');
  }

  function renderFilters() {
    $('filters').replaceChildren(...['Все продукты', ...categories].map(category => {
      const node = el('button', 'chip' + (category === currentCategory ? ' active' : ''), category);
      node.type = 'button';
      node.dataset.category = category;
      node.setAttribute('aria-pressed', String(category === currentCategory));
      return node;
    }));
  }

  function renderProducts() {
    const fragment = document.createDocumentFragment();
    for (const product of products.filter(p => currentCategory === 'Все продукты' || p.category === currentCategory)) {
      const card = el('article', 'card');
      const pic = el('div', 'pic');
      pic.append(photo(product));
      const content = el('div', 'content');
      const composition = el('details', 'product-composition');
      composition.append(el('summary', '', 'Состав'), el('p', '', product.description));
      const row = el('div', 'row');
      const price = el('span', 'price-details');
      price.append(el('strong', '', rate(product)));
      if (product.unit === 'уточнить') price.append(el('small', '', 'Единица продажи уточняется'));
      const add = button('В корзину +', 'add', product.id);
      add.setAttribute('aria-label', 'Добавить: ' + product.name);
      row.append(price, add);
      content.append(el('h3', '', product.name), composition, row);
      card.append(pic, content);
      fragment.append(card);
    }
    $('products').replaceChildren(fragment);
  }

  function announce(message) {
    clearTimeout(toastTimer);
    $('shop-status').textContent = message;
    toastTimer = setTimeout(() => { $('shop-status').textContent = ''; }, 2800);
  }

  function saveCart() {
    storage.write(core.CART_KEY, bag);
    // Count product lines; weights and quantities are shown inside the cart.
    $('count').textContent = bag.length;
  }

  function cartLine(item) {
    const product = products.find(p => p.id === item.id);
    const line = el('div', 'cart-line');
    line.dataset.productId = product.id;
    const info = el('div');
    info.append(el('div', 'cart-name', product.name), el('div', 'cart-price', rate(product)));
    const total = core.lineTotal(product, item.amount);
    info.append(el('div', 'cart-line-total', total === null ? 'Сумму и фасовку уточнит менеджер' : rub(total)));
    const controls = el('div', 'cart-controls');
    const minus = button('−', 'minus', product.id);
    minus.setAttribute('aria-label', 'Уменьшить: ' + product.name);
    const plus = button('+', 'plus', product.id);
    plus.setAttribute('aria-label', 'Увеличить: ' + product.name);
    controls.append(minus);
    if (product.unit === 'кг') {
      const label = el('label');
      const input = el('input');
      input.type = 'text';
      input.inputMode = 'decimal';
      input.value = String(item.amount / 1000).replace('.', ',');
      input.dataset.weight = product.id;
      input.setAttribute('aria-label', 'Вес в килограммах: ' + product.name);
      input.title = 'От 0,1 до 100 кг. Кнопки изменяют вес на 100 г.';
      label.append(input, 'кг');
      controls.append(label);
    } else controls.append(el('span', 'cart-qty', item.amount + (product.unit === 'упаковка' ? ' уп.' : ' поз.')));
    const remove = button('Удалить', 'remove', product.id, 'remove');
    remove.setAttribute('aria-label', 'Удалить: ' + product.name);
    controls.append(plus, remove);
    line.append(photo(product, true), info, controls);
    return line;
  }

  function drawCart() {
    $('items').replaceChildren(...(bag.length ? bag.map(cartLine) : [el('p', 'cart-hint', 'Пока здесь пусто. Выберите продукты в каталоге.')]));
    drawSummary();
  }

  function drawSummary() {
    const summary = core.summarize(bag, products);
    $('cart-total').textContent = rub(summary.subtotalKopecks);
    $('minimum-progress').value = Math.min(core.MINIMUM_KOPECKS, summary.subtotalKopecks);
    $('minimum-note').textContent = summary.minimumMet ? 'Минимальная сумма заказа набрана.' : 'До минимального заказа ещё ' + rub(summary.missingKopecks) + '.';
    $('unpriced-note').hidden = !summary.hasUnpriced;
    $('unpriced-note').textContent = 'Нарезки с неуточнённой единицей продажи не включены в сумму. Их стоимость и фасовку согласуем отдельно.';
  }

  $('filters').addEventListener('click', event => {
    const target = event.target.closest('[data-category]');
    if (!target) return;
    currentCategory = target.dataset.category;
    // Keep the clicked filter focused instead of replacing it.
    $('filters').querySelectorAll('button').forEach(node => {
      const active = node.dataset.category === currentCategory;
      node.classList.toggle('active', active);
      node.setAttribute('aria-pressed', String(active));
    });
    renderProducts();
  });

  $('products').addEventListener('click', event => {
    const target = event.target.closest('[data-action="add"]');
    if (!target) return;
    const product = products.find(p => p.id === target.dataset.productId);
    bag = core.changeAmount(bag, product.id, product.unit === 'кг' ? 1000 : 1, products);
    saveCart();
    announce('В корзине: ' + product.name);
  });

  $('items').addEventListener('click', event => {
    const target = event.target.closest('button[data-action]');
    if (!target) return;
    const product = products.find(p => p.id === target.dataset.productId);
    if (!product) return;
    const { action } = target.dataset;
    if (action === 'remove') bag = bag.filter(item => item.id !== product.id);
    else bag = core.changeAmount(bag, product.id, (action === 'minus' ? -1 : 1) * (product.unit === 'кг' ? 100 : 1), products);
    saveCart();
    drawCart();
    // Preserve keyboard focus after replacing a cart line.
    const sameAction = [...$('items').querySelectorAll('button')].find(node => node.dataset.productId === product.id && node.dataset.action === action);
    (sameAction || cart.querySelector('.close')).focus({ preventScroll: true });
  });

  $('items').addEventListener('change', event => {
    const input = event.target.closest('input[data-weight]');
    if (!input) return;
    const grams = core.parseWeight(input.value);
    if (grams === null) {
      input.setCustomValidity('Укажите вес от 0,1 до 100 кг, до трёх знаков после запятой.');
      input.reportValidity();
      input.focus();
      return;
    }
    input.setCustomValidity('');
    bag = bag.map(item => item.id === input.dataset.weight ? { ...item, amount: grams } : item);
    saveCart();
    drawSummary();
  });
  $('items').addEventListener('input', event => {
    const input = event.target.closest('input[data-weight]');
    if (!input) return;
    input.setCustomValidity('');
    const grams = core.parseWeight(input.value);
    if (grams === null) return;
    const product = products.find(p => p.id === input.dataset.weight);
    bag = bag.map(item => item.id === product.id ? { ...item, amount: grams } : item);
    input.closest('.cart-line').querySelector('.cart-line-total').textContent = rub(core.lineTotal(product, grams));
    saveCart();
    drawSummary();
  });

  $('open-cart').addEventListener('click', () => { drawCart(); cart.showModal(); });
  document.querySelectorAll('[data-close]').forEach(node => node.addEventListener('click', () => $(node.dataset.close).close()));
  $('customer-phone').addEventListener('input', event => { event.target.value = core.normalizePhone(event.target.value); });
  renderFilters();
  renderProducts();
  saveCart();
  UptinoDelivery.init(storage);
})();
