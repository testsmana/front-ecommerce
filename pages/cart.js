import Button from "@/components/Button";
import { CartContext } from "@/components/CartContext";
import Center from "@/components/Center";
import Header from "@/components/Header";
import Input from "@/components/Input";
import Table from "@/components/Table";
import CreditCartIcon from "@/components/icons/CreditCartIcon";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import styled from "styled-components";

const ColumnsWrapper = styled.div`
display:grid;
grid-template-columns: 1fr;
@media screen and (min-width:768px) {
    grid-template-columns: 1.2fr .8fr;
}
gap: 40px;
margin-top:40px;
`;

const Box = styled.div`
background-color:#fff;
border-radius: 10px;
padding: 30px;
`;

const ProductInfoCell= styled.td`
padding:10px 0;
`;

//for border in ProductImageBox, you can delete it and add box-shadow: 0 0  10px rgba(0,0,0,.1); if you like this display
const ProductImageBox= styled.div`
width:70px;
height:100px;
padding:2px;
border:1px solid rgba(0,0,0,.1);
display:flex;
align-items:center;
justify-content:center;
border-radius: 10px;
img{
    max-width:60px;
    max-height:60px;

 }

 @media screen and (min-width:768px) {
    padding:10px;
    width:100px;
    height:100px;
    img{
        max-width:80px;
        max-height:80px;
    
     }
 }
`;

const QuantityLable = styled.span`
padding: 0 15px;
display:block;
@media screen and (min-width:768px) {
    display:inline-block;
    padding: 0 10px;

}
`;

const CityHolder=styled.div`
display:flex;
gap:5px;
`;

export default function CartPage(){
    const {cartProducts,addProduct,removeProduct,clearCart}= useContext(CartContext);
    const [products, setProducts]= useState([]);
    const [name,setName]=useState('');
    const [email, setEmail]=useState('');
    const [phoneNumber,setPhoneNumber]=useState('');
    const [city, setCity]= useState('');
    const [postalCode, setPostalCode]=useState('');
    const [streetAddress, setStreetAddress]=useState('');
    const [country, setCountry]=useState('');
    const [isSuccess, setIsSuccess]=useState(false);

    useEffect(()=> {
        if(cartProducts.length > 0) {
          axios.post('/api/cart', {ids:cartProducts}).then(response =>{
            setProducts(response.data);
          })
        } else {
            setProducts([]);
        }
    }, [cartProducts]);

useEffect(()=>{
    if(typeof window === 'undefined') {
        return;
    }
    if (window?.location.href.includes('success')){
       setIsSuccess(true);
       clearCart();
    }
},[]);


function moreOfThisProduct(id){
    addProduct(id);
}

function lessOfThisProduct(id){
    removeProduct(id);
}

async function goToPayment(){
    const response= await axios.post('/api/checkout', {
        name,email,phoneNumber,city,postalCode,streetAddress,country,
        cartProducts,
    });
    if(response.data.url){
        window.location=response.data.url;
    }
}

let total=0;
for(const productId of cartProducts){
    const price=products.find(p=> p._id === productId)?.price || 0;
    total +=price;
}

if (isSuccess){
    return (
      <>
       <Header/>
       <Center>
        <ColumnsWrapper>
        <Box>
            <h1>Thanks for your order!</h1>
            <p>We will email you when your order will be sent.</p>
        </Box>
        </ColumnsWrapper>
        
       </Center>
      </>
    );
}

    return (
      <>
      <Header/>
      <Center>
      <ColumnsWrapper>
        <Box>
            
          <h2>Cart</h2>    
          {!cartProducts?.length && (
            <div>Your cart is empty</div>
          )}
          {products?.length > 0 && (
          <Table>
            <thead>
                <tr>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Price</th>
                </tr>
            </thead>

            <tbody>
            {products.map(product => (
                <tr>
                    <ProductInfoCell>
                    <ProductImageBox>
                    {/*  for test you can replace img tag with <img src="https://ifixindia.in/wp-content/uploads/2018/09/macbook-air-png-transparent-background-6.png" alt="Unable to display"/>    */}
                     
                     <img src={product.images[0]} alt="Unable to display"/> 
                    </ProductImageBox>
                    {product.title}
                    </ProductInfoCell>
                    <td>
                        <Button onClick={()=>lessOfThisProduct(product._id)}>-</Button>
                        <QuantityLable>{cartProducts.filter(id => id===product._id).length}</QuantityLable>
                        <Button onClick={()=> moreOfThisProduct(product._id)}>+</Button>
                    </td>
                    <td>€{cartProducts.filter(id => id===product._id).length * product.price}</td>
                </tr>
               ))}
            <tr>
                <td></td>
                <td></td>
                <td>€{total}</td>
            </tr>
            </tbody>
          </Table>
          )}  
          
        </Box>
          {!!cartProducts?.length && (
            <Box>
            <h2>Order Iformation</h2>
        
            {/* if you want to add another input put here your changes */}
            <Input type="text" placeholder="Name" value={name} name="name" onChange={ev => setName(ev.target.value)}/>
            <Input type="email" placeholder="Email"value={email} name="email" onChange={ev => setEmail(ev.target.value)} />
            {/* If you want a input to be required add required in Input */}
            <Input type="tel" placeholder="Phone number (ex. 3556xxxxxxxx)" value={phoneNumber} name="phoneNumber" pattern="[0-9]{12}" onChange={ev => setPhoneNumber(ev.target.value)}/>
            <CityHolder>
                <Input type="text" placeholder="City" value={city} name="" onChange={ev => setCity(ev.target.value)}/>
                <Input type="text" placeholder="Postal code" value={postalCode} name="postalCod" onChange={ev => setPostalCode(ev.target.value)}/>
            </CityHolder>
            
            <Input type="text" placeholder="Street Address" value={streetAddress} name="streetAddress" onChange={ev => setStreetAddress(ev.target.value)}/>
            <Input type="text" placeholder="Country" value={country} name="country" onChange={ev => setCountry(ev.target.value)}/>
        
            <Button block black 
            onClick={goToPayment}>
            <CreditCartIcon/>
            Continue to payment
            </Button>
        
            </Box>
          )}
        
      </ColumnsWrapper>
      </Center>
      </>
    )
}