import Featured from "@/components/Featured";
import Header from "@/components/Header";
import NewProducts from "@/components/NewProducts";
import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Products";

export default function HomePage({featuredProduct, newProducts}){
  return(
    <div>
      <Header/>
      <Featured product={featuredProduct}/>
      <NewProducts products={newProducts}/>
    </div>
  );
}

export async function getServerSideProps(){
  {/* change the featuredProductId with the Id that you decide to put in firs image
      You can find your ID in http://localhost:3001/products/edit/6544646caa0d60c93564bf32 URL */}
  const featuredProductId='6544646caa0d60c93564bf32';
  await mongooseConnect();
  const featuredProduct= await Product.findById(featuredProductId);
  const newProducts= await Product.find({}, null, {sort: {'_id':-1}, limit:10});
  return {
    props:{
      featuredProduct:JSON.parse(JSON.stringify(featuredProduct)),
      newProducts: JSON.parse(JSON.stringify(newProducts)),
    
    },
  }

  
}