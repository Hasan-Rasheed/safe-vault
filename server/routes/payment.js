const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
var exports = module.exports = {};

console.log(process.env.STRIPE_SECRET_KEY)z
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

   app.post('/', function (req, res) {
      exports.newPayment(req.body.amount).then((response) => {
           //SUCCESS
           res.status(201).send(
               {
                   responseCode: 201,
                   responseMessage: "Success",
                   data: {
                       result: response
                   }
               }
           )
       }).catch((error) => {
           //ERROR
           res.status(500).send(
               {
                   responseCode: 500,
                   responseMessage: error.message
               }
           )
       });
   });

exports.newPayment = (amount ) => {
   try {
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
                   amount: amount,
                   currency: 'usd',
                   customer: source.customer,
               });
           })
           .then((charge) => {
               return charge;
               // New charge created on a new customer
           })
           .catch((err) => {
               throw new Error(err);
               // Deal with an error
           });
   }catch (e) {
       throw new Error(err);

   }
};
};
module.exports = paymentApi;