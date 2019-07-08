const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

console.log(process.env.STRIPE_SECRET_KEY)
const stripeChargeCallback = res => (stripeErr, stripeRes) => {
    if (stripeErr) {
        res.status(500).send({ error: stripeErr });
    } else {
        res.status(200).send({ success: stripeRes });
    }
};
const paymentApi = app => {
    app.get("/", (req, res) => {
        res.send({
            message: "Hello Stripe checkout server!",
            timestamp: new Date().toISOString()
        });
    });
    app.post("/", (req, res) => {
       // Create a new customer and then a new charge for that customer:
        stripe.customers
            .create({
                email: 'foo-customer@example.com',
            })
            .then((customer) => {
                return stripe.customers.createSource(customer.id, {
                    source: 'tok_visa',
                });
            })
            .then((source) => {
                return stripe.charges.create({
                    amount: req.body.amount,
                    currency: 'usd',
                    customer: source.customer,
                });
            })
            .then((charge) => {
                // New charge created on a new customer
            })
            .catch((err) => {
                // Deal with an error
            });
        const body = {
            source: req.body.token.id,
            amount: req.body.amount,
            currency: "usd"
        };
        console.log(body)

    });
    return app;
};
module.exports = paymentApi;
