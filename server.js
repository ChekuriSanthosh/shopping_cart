const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const Customer = require('./models/Customer');
const Product = require('./models/Product');
const ShoppingCart = require('./models/ShoppingCart');
const { disconnect } = require('process');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

let customer;
let shoppingCart;
let cart;
// Serve index.ejs for the root URL '/'
app.get('/', (req, res) => {
    let summary = '';
    let checkoutSummary = {
        discount:0,
        totalPrice: 0,
        loyaltyPoints: 0
    };

    if (shoppingCart) {
        summary = shoppingCart.displaySummary();

        // Calculate checkout summary if products are available
        const order = shoppingCart.checkout();
        checkoutSummary.discount=order.totaldiscount;
        checkoutSummary.totalPrice = order.totalPrice;
        checkoutSummary.loyaltyPoints = order.loyaltyPoints;
    }

    res.render('index', { summary, checkoutSummary });
});

// Handle form submission to add products
app.post('/add-product', (req, res) => {
    const { customerName, productName, productPrice, productCode } = req.body;

    if (!customer) {
        customer = new Customer(customerName);
        cart=new ShoppingCart(customer);
        shoppingCart = new ShoppingCart(customer);
    }

    const product = new Product(productPrice, productCode, productName);
    shoppingCart.addProduct(product);

    res.redirect('/');
});


app.post('/delete-product',(req,res)=>{
    const { productName} = req.body;
    // const product=new Product(productPrice,productCode,productName);
    if(shoppingCart){
        shoppingCart.products = shoppingCart.products.filter(product => product.name !== productName);
        // shoppingCart=shoppingCart.removeProduct(product);
    }
    // let cart;
    // for(let i=0;i<shoppingCart.products.length;i++){
    //     if(shoppingCart.products[i].name!==productName){
    //         const product=shoppingCart.products[i];
    //         cart.addProduct(product);
    //     }
    // }
    // shoppingCart=cart;
    // cart.products.splice(0, cart.products.length);
    res.redirect('/');
});


// Handle checkout process
app.post('/checkout', (req, res) => {
    if (!shoppingCart) {
        return res.redirect('/');
    }

    // Calculate checkout summary
    const order = shoppingCart.checkout();
    const checkoutSummary = {
        discount: 0,
        totalPrice: 0,
        loyaltyPoints: 0
    };
    customer=null;
    shoppingCart=null;
    res.render('index',{
        summary:'',
        checkoutSummary
    });
});

app.listen(PORT,()=>{
    console.log(`Server is runing on port ${PORT}`);
});
