/* Public, browser-local demo. It has no authority to change the live shop. */
(function () {
  'use strict';
  const { products: initial, categories } = UptinoCatalog;
  const storage = UptinoCore.storageFor(() => localStorage);
  const KEY = 'uptino-admin-demo-retail-20261104';
  const $ = id => document.getElementById(id);
  const fields = ['name', 'category', 'description', 'regular', 'unit', 'available'];
  const clone = () => initial.map(item => ({ ...item }));
  let selected;
  let pendingImage = '';

  function safeImage(value) {
    return typeof value === 'string' && value.length < 3000000 && (/^[a-zA-Z0-9_.-]+\.(?:webp|png|jpe?g)$/.test(value) || /^data:image\/(?:png|jpeg|webp);base64,[a-zA-Z0-9+/=]+$/.test(value)) ? value : '';
  }

  function normalizeItems(value) {
    if (!Array.isArray(value) || value.length > 500) return null;
    const ids = new Set();
    const result = [];
    for (const p of value) {
      if (!p || typeof p.id !== 'string' || !/^[\w-]{1,80}$/.test(p.id) || ids.has(p.id) || typeof p.name !== 'string' || !p.name.trim() || p.name.length > 120 || !Number.isFinite(Number(p.regular)) || Number(p.regular) < 0 || Number(p.regular) > 1000000) return null;
      ids.add(p.id);
      result.push({ id: p.id, name: p.name, category: categories.includes(p.category) ? p.category : 'Колбасы', description: typeof p.description === 'string' ? p.description.slice(0, 2000) : '', regular: Number(p.regular), unit: ['кг', 'упаковка', 'уточнить'].includes(p.unit) ? p.unit : 'уточнить', available: p.available === true, image: safeImage(p.image) });
    }
    return result;
  }

  let items = normalizeItems(storage.read(KEY)) || clone();

  function notice(text) { $('notice').textContent = text; }
  function persist(next) {
    if (!storage.write(KEY, next)) { notice('Не удалось сохранить: браузер запретил запись или память заполнена.'); return false; }
    items = next;
    return true;
  }

  function syncList() {
    $('list').replaceChildren();
    for (const item of items) {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = item.name || 'Новый товар';
      button.className = item.id === selected ? 'active' : '';
      button.setAttribute('aria-pressed', String(item.id === selected));
      button.addEventListener('click', () => { selected = item.id; show(); });
      $('list').append(button);
    }
  }

  function show() {
    const product = items.find(p => p.id === selected);
    $('editor').hidden = !product;
    document.querySelector('.preview-card').hidden = !product;
    $('edit-heading').textContent = product ? 'Карточка товара' : 'Добавьте товар кнопкой +';
    syncList();
    if (!product) return;
    for (const field of fields) {
      if (field === 'available') $(field).checked = product[field];
      else $(field).value = product[field] ?? '';
    }
    pendingImage = product.image || '';
    $('photo').value = '';
    notice('');
    preview();
  }

  function preview() {
    $('preview-name').textContent = $('name').value || 'Название товара';
    $('preview-desc').textContent = $('description').value || 'Здесь появится описание';
    const unit = $('unit').value;
    $('preview-price').textContent = new Intl.NumberFormat('ru-RU').format(Number($('regular').value) || 0) + ' ₽' + (unit === 'кг' ? ' / кг' : unit === 'упаковка' ? ' / упаковку' : '');
    $('preview-unit-note').textContent = unit === 'уточнить' ? 'Единица продажи уточняется' : '';
    $('preview-add').textContent = $('available').checked ? 'В корзину +' : 'Нет в наличии';
    $('preview-img').hidden = !pendingImage;
    if (pendingImage) $('preview-img').src = pendingImage;
    else $('preview-img').removeAttribute('src');
  }

  fields.forEach(id => $(id).addEventListener('input', preview));
  $('photo').addEventListener('change', event => {
    const file = event.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024 || !['image/jpeg','image/png','image/webp'].includes(file.type)) {
      notice('Выберите JPG, PNG или WebP до 2 МБ.');
      event.target.value = '';
      return;
    }
    const selectedAtRead = selected;
    const reader = new FileReader();
    reader.onload = () => { if (selected === selectedAtRead) { pendingImage = safeImage(reader.result); preview(); } };
    reader.onerror = () => notice('Не удалось прочитать фотографию. Выберите файл ещё раз.');
    reader.readAsDataURL(file);
  });

  $('editor').addEventListener('submit', event => {
    event.preventDefault();
    const old = items.find(p => p.id === selected);
    if (!old) return;
    const product = { ...old, name: $('name').value.trim(), category: $('category').value, description: $('description').value, regular: Number($('regular').value), unit: $('unit').value, available: $('available').checked, image: pendingImage };
    const next = items.map(p => p.id === selected ? product : p);
    if (!normalizeItems(next)) { notice('Проверьте название и цену товара.'); return; }
    if (persist(next)) { notice('Сохранено только в этом браузере.'); syncList(); }
  });

  $('add').addEventListener('click', () => {
    if (items.length >= 500) { notice('В демо можно добавить до 500 товаров.'); return; }
    const id = 'demo-' + crypto.randomUUID();
    items = [{ id, name: 'Новый товар', category: 'Колбасы', description: '', regular: 0, unit: 'кг', available: true, image: '' }, ...items];
    selected = id;
    show();
  });
  $('remove').addEventListener('click', () => {
    const next = items.filter(p => p.id !== selected);
    if (!persist(next)) return;
    selected = items[0]?.id;
    show();
    notice('Удалено из демо.');
  });
  $('reset').addEventListener('click', () => {
    if (!storage.remove(KEY)) { notice('Браузер не разрешил удалить сохранённые изменения.'); return; }
    items = clone();
    selected = items[0]?.id;
    show();
    notice('Исходный список восстановлен.');
  });
  selected = items[0]?.id;
  show();
})();
