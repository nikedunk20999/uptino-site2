/* Region preference only. No geolocation, address collection or CDEK API calls. */
(function (root) {
  'use strict';
  const regions = ['Республика Башкортостан','Москва','Московская область','Санкт-Петербург','Ленинградская область','Республика Татарстан','Республика Удмуртия','Республика Марий Эл','Республика Мордовия','Чувашская Республика','Пермский край','Свердловская область','Челябинская область','Оренбургская область','Самарская область','Ульяновская область','Пензенская область','Саратовская область','Нижегородская область','Кировская область','Ростовская область','Краснодарский край','Воронежская область','Белгородская область','Волгоградская область','Тюменская область','Новосибирская область','Омская область','Красноярский край','Иркутская область','Алтайский край','Республика Дагестан','Ставропольский край','Калининградская область','Ярославская область','Тверская область','Тульская область','Владимирская область','Рязанская область'];

  function allowsCashPayment(location) {
    if (!location) return false;
    const inBashkortostan = /^(?:(?:республика|респ\.)\s+)?башкортостан$/i.test(location.region);
    const inUfa = /^(?:(?:г\.\s*|город\s+))?уфа$/i.test(location.city);
    return inBashkortostan && inUfa;
  }

  function init(storage) {
    const core = root.UptinoCore;
    const dialog = document.getElementById('delivery-dialog');
    const regionField = document.getElementById('delivery-region');
    const cityField = document.getElementById('delivery-city');
    const list = document.getElementById('regions');
    const cashNotices = document.querySelectorAll('[data-cash-payment]');
    const cashPreview = document.getElementById('delivery-cash-notice');
    let delivery = core.normalizeDelivery(storage.read(core.DELIVERY_KEY));

    for (const region of regions) {
      const option = document.createElement('option');
      option.value = region;
      list.append(option);
    }
    // The list offers suggestions; any other region can be typed in full.
    function updateLabels() {
      document.querySelectorAll('[data-delivery-label]').forEach(label => {
        label.textContent = delivery ? `${delivery.region}, ${delivery.city}` : 'Выбрать регион доставки';
      });
      const showCash = allowsCashPayment(delivery);
      cashNotices.forEach(notice => {
        notice.hidden = !showCash;
      });
    }

    function readFields() {
      return core.normalizeDelivery({ region: regionField.value, city: cityField.value });
    }

    function updateCashPreview() {
      cashPreview.hidden = !allowsCashPayment(readFields());
    }

    function open() {
      regionField.value = delivery?.region || '';
      cityField.value = delivery?.city || '';
      updateCashPreview();
      if (!dialog.open) dialog.showModal();
      regionField.focus();
    }

    document.querySelectorAll('[data-delivery-open]').forEach(button => button.addEventListener('click', open));
    dialog.querySelectorAll('[data-region]').forEach(button => button.addEventListener('click', () => {
      regionField.value = button.dataset.region;
      cityField.value = button.dataset.city || '';
      updateCashPreview();
      (regionField.value ? cityField : regionField).focus();
    }));
    document.getElementById('delivery-form').addEventListener('submit', event => {
      event.preventDefault();
      const next = readFields();
      if (!next) {
        regionField.setCustomValidity('Введите регион и населённый пункт: от 2 до 80 символов.');
        regionField.reportValidity();
        return;
      }
      regionField.setCustomValidity('');
      delivery = next;
      const saved = storage.write(core.DELIVERY_KEY, next);
      updateLabels();
      dialog.close();
      if (!saved) document.getElementById('shop-status').textContent = 'Регион выбран. Браузер не разрешил сохранить его для следующего визита.';
    });
    [regionField, cityField].forEach(field => field.addEventListener('input', () => {
      regionField.setCustomValidity('');
      updateCashPreview();
    }));
    updateLabels();
    if (!delivery) open();
    return { open, get: () => delivery };
  }

  root.UptinoDelivery = Object.freeze({ init });
})(globalThis);
