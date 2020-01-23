
let ITEM_ID = 0;

class Item {
	constructor(name, count, price) {
		this.name = name;
		this.count = count;
		this.price = price;
		this.id = ITEM_ID++;
	}
	setName(name) {
		this.name = name;
	}
	setCount(count) {
		this.count = count;
	}
	setPrice(price) {
		this.price = price;
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
		let sep = this.price.indexOf('.');
		sep = sep !== -1 ? sep : this.price.length;

		let dollars = this.price.substr(0, sep);
		let cents = this.price.substr(sep + 1, this.price.length);

		if (!dollars) {
			dollars = '0';
		}
		for (let i = dollars.length - 3; i > 0; i -= 3) { 
			dollars = dollars.slice(0,i) + ',' + dollars.slice(i) 
		};

		while (cents.length < 2) {
			cents += '0';
		}
		return  `$${dollars}.${cents}`;
	}
	getID() {
		return this.id;
	}
}