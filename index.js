import express from "express";
import Stripe from "stripe";
import cors from "cors";

const app = express(); 

app.use(cors({ origin: "*" }));

app.use(express.json()); 

app.post("/create-checkout-session", async (req, res) => {
  try {
    const { api_key, name, amount } = req.body; 
    const stripe = new Stripe(api_key);
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "boleto"],
      line_items: [
        {
          price_data: {
            currency: "brl",
            product_data: { name: name},
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "/sucesso",
      cancel_url: "/cancelado",
    });
    res.json({ url: session.url });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});


app.listen();