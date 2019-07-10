const app = require("express")(),
bodyParser = require("body-parser");
const stripe = require("stripe")("sk_test_Uin6yRzNzsTvUWPLjuWpGUGb00njqR181n");

app.use(bodyParser.json({extended: true}));

app.post("/", async (req, res) => {
   try {
       var charge = stripe.charges.create({
           amount: req.body.amount,
           currency: "usd",
           description: "test charge",
           source: req.body.token.id,
       }, function(err, charge) {
           if(err) {
               console.log(err);
               res.send('Failed')
           } else {
               console.log('success payment', charge);
               res.send(charge)
           }
       });
   } catch (err) {
       res.status(500).end();
   }
});

app.listen(8000, () => console.log("Listening on port 8000"));