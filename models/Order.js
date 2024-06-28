class Order {
    constructor(totaldiscount, totalPrice, loyaltyPoints) {
        this.totaldiscount=totaldiscount;
        this.totalPrice = totalPrice;
        this.loyaltyPoints = loyaltyPoints;
    }

    displaySummary() {
        return `Total price: ${this.totalPrice}\nTotal discount: ${this.totaldiscount}\nWill receive ${this.loyaltyPoints} loyalty points`;
    }
}

module.exports = Order;
