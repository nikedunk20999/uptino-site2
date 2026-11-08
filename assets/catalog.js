/* Единственный исходный каталог магазина и демо-редактора. Цены: прайс для сайта, 04.11.2026. */
(function (root) {
  "use strict";
  const catalog = {
  "products": [
    {
      "id": "retail-5",
      "name": "Колбаса Домашняя полукопчёная",
      "category": "Колбасы",
      "image": "domashnyaya-hd.webp",
      "description": "Свинина, черный перец, чеснок, кориандр, лук, пажитник, тмин, паприка, томаты, петрушка, укроп, сахар, соль нитритная, поваренная.",
      "regular": 990,
      "unit": "кг",
      "available": true
    },
    {
      "id": "retail-7",
      "name": "Колбаса Домашняя полукопчёная «Плюс»",
      "category": "Колбасы",
      "image": "domashnyaya_plus-hd.webp",
      "description": "Свинина, говядина, черный перец, чеснок, кориандр, лук, пажитник, тмин паприка, томаты, петрушка, укроп, сахар, соль нитритная, поваренная.",
      "regular": 1210,
      "unit": "кг",
      "available": true
    },
    {
      "id": "retail-9",
      "name": "Колбаса Краковская полукопчёная",
      "category": "Колбасы",
      "image": "krakow-hd.webp",
      "description": "Свинина, говядина, перцы, мускатный орех, чеснок гранулированный, глюкоза, соль.",
      "regular": 1050,
      "unit": "кг",
      "available": true
    },
    {
      "id": "retail-11",
      "name": "Колбаса Московская летняя варёно-копчёная",
      "category": "Колбасы",
      "image": "moscow-hd.webp",
      "description": "Говядина, шпик свинной, перцы, кардамон, мускатный орех, соль.",
      "regular": 2530,
      "unit": "кг",
      "available": true
    },
    {
      "id": "retail-13",
      "name": "Мортаделла",
      "category": "Деликатесы",
      "image": "mortadella-hd.webp",
      "description": "Свинина, перец черный, перец душистый, глюкоза, имбирь, кориандр, чеснок, мускатный орех, тмин, гвоздика, корица, экстракт дрожжей, аскорбат натрия.",
      "regular": 1700,
      "unit": "кг",
      "available": true
    },
    {
      "id": "retail-15",
      "name": "Ветчина Домашняя",
      "category": "Деликатесы",
      "image": "vetchina-hd.webp",
      "description": "Свинина, перец, кориандр, чеснок молотый, глюкоза, соль.",
      "regular": 930,
      "unit": "кг",
      "available": true
    },
    {
      "id": "retail-17",
      "name": "Окорок Тамбовский варёно-копчёный",
      "category": "Копчёности",
      "image": "ham_tambov-hd.webp",
      "description": "Свинина, соль, глюкоза, экстракт черного перца, экстракт чеснока, экстракт дрожжей.",
      "regular": 1310,
      "unit": "кг",
      "available": true
    },
    {
      "id": "retail-19",
      "name": "Грудинка варёно-копчёная",
      "category": "Копчёности",
      "image": "grudinka-v2.webp",
      "description": "Грудинка свиная, соль, глюкоза, экстракт черного перца, экстракт чеснока, экстракт дрожжей.",
      "regular": 960,
      "unit": "кг",
      "available": true
    },
    {
      "id": "retail-21",
      "name": "Мясной хлеб",
      "category": "Деликатесы",
      "image": "meatloaf-hd.webp",
      "description": "Свинина, соль, глюкоза, экстракт черного перца, экстракт чеснока, экстракт дрожжей.",
      "regular": 750,
      "unit": "кг",
      "available": true
    },
    {
      "id": "retail-23",
      "name": "Рёбра свиные варёно-копчёные",
      "category": "Копчёности",
      "image": "ribs-v2.webp",
      "description": "Ребра свинные, соль, глюкоза, экстракт черного перца, экстракт чеснока, экстракт дрожжей.",
      "regular": 930,
      "unit": "кг",
      "available": true
    },
    {
      "id": "retail-25",
      "name": "Колбаса Говяжья варёно-копчёная",
      "category": "Колбасы",
      "image": "beef_sausage-hd.webp",
      "description": "Говядина, кориандр, глюкоза, чеснок, перец черный, тмин, перец красный, соль, кардамон, экстракт дрожжей, экстракт дыма натуральный.",
      "regular": 2310,
      "unit": "кг",
      "available": true
    },
    {
      "id": "retail-28",
      "name": "Прошутто сыровяленый",
      "category": "Сыровяленые",
      "image": "prosciutto-v2.webp",
      "description": "Свинина, нитритная соль, повареная соль, экстракты (черного перца, мускатного ореха, можжевельника, перца кубеба), сахара.",
      "regular": 2750,
      "unit": "кг",
      "available": true
    },
    {
      "id": "retail-30",
      "name": "Дедушкин гостинец",
      "category": "Сыровяленые",
      "image": "gostinets-hd.webp",
      "description": "Свинина, соль, можжевельник, черный перец, душистый перец, тмин, перец кубеба, чеснок, аскорбат натрия, моносахара.",
      "regular": 2750,
      "unit": "кг",
      "available": true
    },
    {
      "id": "retail-32",
      "name": "Брауншвейгская колбаса сыровяленая",
      "category": "Сыровяленые",
      "image": "",
      "description": "Свинина, говядина, глюкоза, перец черный, мускатный орех, кардамон.",
      "regular": 2750,
      "unit": "кг",
      "available": true
    },
    {
      "id": "retail-34",
      "name": "Салями Корсика",
      "category": "Сыровяленые",
      "image": "salami-v2.webp",
      "description": "Свинина, соль, перцы, чеснок, тмин, можжевельник, имбирь, розмарин, сахара, аскорбат натрия.",
      "regular": 2750,
      "unit": "кг",
      "available": true
    },
    {
      "id": "retail-36",
      "name": "Финоккьона",
      "category": "Сыровяленые",
      "image": "finocchiona-hd.webp",
      "description": "Свинина, соль, фенхель, перцы, чеснок, мускатный орех, кардамон, сахара.",
      "regular": 2750,
      "unit": "кг",
      "available": true
    },
    {
      "id": "retail-38",
      "name": "Чоризо сыровяленая",
      "category": "Сыровяленые",
      "image": "chorizo-hd.webp",
      "description": "Свинина,соль,копченая паприка, перец, орегано, чеснок.",
      "regular": 2750,
      "unit": "кг",
      "available": true
    },
    {
      "id": "retail-40",
      "name": "Салями Милано",
      "category": "Сыровяленые",
      "image": "",
      "description": "Свинина, соль, перцы, розмарин, имбирь, чеснок, сахара тмин, перец кубеба, чеснок, аскорбат натрия, моносахара.",
      "regular": 2750,
      "unit": "кг",
      "available": true
    },
    {
      "id": "retail-43",
      "name": "Сосиски Ганноверские",
      "category": "Сосиски",
      "image": "hannover-hd.webp",
      "description": "Свинина, вода, имбирь, глюкоза, кориандр, черный перец, аскорбат,соль мускатный орех, экстракт дрожжей, ароматизатор дым.",
      "regular": 820,
      "unit": "кг",
      "available": true
    },
    {
      "id": "retail-45",
      "name": "Сосиски Венские",
      "category": "Сосиски",
      "image": "vienna-hd.webp",
      "description": "Свинина, вода, соль, перец черный, перец белый мускатный орех, мацис, имбирь, кардамон, горчица.",
      "regular": 820,
      "unit": "кг",
      "available": true
    },
    {
      "id": "retail-47",
      "name": "Сосиски Молочные",
      "category": "Сосиски",
      "image": "sausages-v2.webp",
      "description": "Свинина, молоко цельное, соль, душистый перец, черный перец, экстракты перцев, соль.",
      "regular": 820,
      "unit": "кг",
      "available": true
    },
    {
      "id": "retail-49",
      "name": "Сардельки Молочные",
      "category": "Сосиски",
      "image": "",
      "description": "Свинина, молоко цельное, соль, душистый перец, черный перец, экстракты перцев, соль.",
      "regular": 820,
      "unit": "кг",
      "available": true
    },
    {
      "id": "retail-51",
      "name": "Сардельки Говяжьи",
      "category": "Сосиски",
      "image": "sardelki-hd.webp",
      "description": "Говядина, вода, соль, кориандр, тмин, чеснок, перец красный, кардамон, мускатный орех, глюкоза.",
      "regular": 1650,
      "unit": "кг",
      "available": true
    },
    {
      "id": "retail-54",
      "name": "Утиная грудка варёно-копчёная",
      "category": "Копчёности",
      "image": "duck-hd.webp",
      "description": "Утиная грудка,соль, глюкоза, экстракт черного перца, экстракт чеснока, экстракт дрожжей.",
      "regular": 1750,
      "unit": "кг",
      "available": true
    },
    {
      "id": "retail-56",
      "name": "Утиные окорочка варёно-копчёные",
      "category": "Копчёности",
      "image": "",
      "description": "Утиные окорочка,соль, глюкоза, экстракт черного перца, экстракт чеснока, экстракт дрожжей.",
      "regular": 1650,
      "unit": "кг",
      "available": true
    },
    {
      "id": "retail-58",
      "name": "Утиные сердечки варёно-копчёные",
      "category": "Копчёности",
      "image": "",
      "description": "Утиные сердечки,соль, глюкоза, экстракт черного перца, экстракт чеснока, экстракт дрожжей.",
      "regular": 600,
      "unit": "кг",
      "available": true
    },
    {
      "id": "retail-60",
      "name": "Утиные желудочки варёно-копчёные",
      "category": "Копчёности",
      "image": "",
      "description": "Утиные желудочки,соль, глюкоза, экстракт черного перца, экстракт чеснока, экстракт дрожжей.",
      "regular": 500,
      "unit": "кг",
      "available": true
    },
    {
      "id": "retail-62",
      "name": "Бекон сырокопчёный",
      "category": "Копчёности",
      "image": "",
      "description": "Состав уточняется у производителя.",
      "regular": 1540,
      "unit": "кг",
      "available": true
    },
    {
      "id": "retail-63",
      "name": "Охотничьи сыровяленые",
      "category": "Сыровяленые",
      "image": "",
      "description": "Состав уточняется у производителя.",
      "regular": 3000,
      "unit": "кг",
      "available": true
    },
    {
      "id": "retail-65",
      "name": "Филе утки сыровяленое — нарезка",
      "category": "Нарезки",
      "image": "",
      "description": "Состав уточняется у производителя.",
      "regular": 360,
      "unit": "уточнить",
      "available": true
    },
    {
      "id": "retail-66",
      "name": "Грудка утки сырокопчёная — нарезка",
      "category": "Нарезки",
      "image": "",
      "description": "Состав уточняется у производителя.",
      "regular": 420,
      "unit": "уточнить",
      "available": true
    },
    {
      "id": "retail-67",
      "name": "Прошутто — нарезка",
      "category": "Нарезки",
      "image": "",
      "description": "Состав уточняется у производителя.",
      "regular": 395,
      "unit": "уточнить",
      "available": true
    }
  ],
  "categories": [
    "Сыровяленые",
    "Колбасы",
    "Копчёности",
    "Деликатесы",
    "Сосиски",
    "Нарезки"
  ]
};
  catalog.products.forEach(Object.freeze);
  Object.freeze(catalog.products);
  Object.freeze(catalog.categories);
  root.UptinoCatalog = Object.freeze(catalog);
  if (typeof module !== "undefined" && module.exports) module.exports = root.UptinoCatalog;
})(globalThis);
