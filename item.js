
let ITEM_ID = 0;

formatPrice = (price) => {
  let sep = price.indexOf('.');
  sep = sep !== -1 ? sep : price.length;

  let dollars = price.substr(0, sep);
  let cents = price.substr(sep + 1, price.length);

  if (!dollars) {
    dollars = '0';
  }
  for (let i = dollars.length - 3; i > 0; i -= 3) { 
    dollars = dollars.slice(0,i) + ',' + dollars.slice(i) 
  };

  while (cents.length < 2) {
    cents += '0';
  }
  return  `$${dollars}.${cents}`
}

class Item {
  constructor(name, count, price) {
    this.name = name;
    this.count = count ? Number(count) : 0;
    this.price = price ? Number(price) : 0;
    this.id = ITEM_ID++;
  }
  setName(name) {
    this.name = name;
  }
  setCount(count) {
    this.count = count ? Number(count) : 0;
  }
  setPrice(price) {
    this.price = price ? Number(price) : 0;
  }
  getName() {
    return this.name;
  }
  getCount() {
    return this.count;
  }
  getPrice() {
    return this.price;
  }
  getFormattedPrice() {
    return formatPrice(this.price.toString());
  }
  getID() {
    return this.id;
  }
}