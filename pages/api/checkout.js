import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/models/Order";
import { Product } from "@/models/Products";
const stripe=require('stripe')(process.env.STRIPE_SK);


export default async function handler(req,res){
    if(req.method!=='POST'){
        res.json('should be a Post request');
        return;
    }

    const {name,email,phoneNumber,city,postalCode,
           streetAddress,country,cartProducts,}=req.body;
    
    await mongooseConnect();

    const productsIds=cartProducts;
    const uniqueIds=[...new Set(productsIds)];
    const productInfos= await Product.find({_id:uniqueIds});
    
    let line_items= [];
    for (const productId of uniqueIds){
        const productInfo=productInfos.find(p=>p._id.toString()  === productId);
        const quantity=productsIds.filter(id=> id === productId)?.length || 0;
        if ( quantity > 0 && productInfo ){
         line_items.push({
            quantity,
        //Here you can change currency, if your Ecommerce use United State Dollar write insted of EUR -> USD
        // A reference of currency of stripe: https://stripe.com/docs/currencies
            price_data:{currency: "EUR",
                        product_data:{name:productInfo.title},
                        unit_amount: quantity * productInfo.price *100,
                       },
        });    
        }
}

const orderDoc= await Order.create({
    line_items,name,email,phoneNumber,city,postalCode,streetAddress,country,paid:false,
});

const session = await stripe.checkout.sessions.create({
    line_items,
    mode:'payment',
    customer_email: email,
    success_url: process.env.PUBLIC_URL + '/cart?success=1',
    cancel_url: process.env.PUBLIC_URL + '/cart?canceled=1',
    metadata: {orderId:orderDoc._id.toString(),test:'ok'},
});

res.json({
    url:session.url,
})


}