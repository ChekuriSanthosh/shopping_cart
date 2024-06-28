const _ = require('lodash');
const Order = require('./Order');

class ShoppingCart {
    constructor(customer, products = []) {
        this.customer = customer;
        this.products = products;
    }

    addProduct(product) {
        this.products.push(product);
    }

    removeProduct(product){
        _.remove(this.products,product);
        console.log(`the deleted is ${product.name} and ${product.price} and ${product.code}`);
    }

    checkout() {
        let totalPrice = 0;
        let loyaltyPointsEarned = 0;
        let totaldiscount = 0;

        this.products.forEach(product => {
            let discount = 0;
            if (product.code.startsWith("DIS_10")) {
                discount = Math.floor(product.price * 0.1);
                loyaltyPointsEarned += Math.floor(product.price / 10);
            } else if (product.code.startsWith("DIS_15")) {
                discount = Math.floor(product.price * 0.15);
                loyaltyPointsEarned += Math.floor(product.price / 15);
            } else {
                loyaltyPointsEarned += Math.floor(product.price / 5);
            }
            totaldiscount+=discount;
            totalPrice += product.price - discount;
        });

        return new Order(totaldiscount,totalPrice, loyaltyPointsEarned);
    }

    displaySummary() {

        return `Customer: ${this.customer.name}\n
        Bought:\n${this.products.map(p => `- ${p.name}, ${p.price}`).join('<\n')}`;
    }
}

module.exports = ShoppingCart;
