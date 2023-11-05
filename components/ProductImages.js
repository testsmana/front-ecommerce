import { useState } from "react";
import styled from "styled-components";

 const Image=styled.img`
    max-width:100%;
    max-height:100%;
    `;

    const BigImage=styled.img`
    max-width100%;
    max-height:200px;
    `;

    const ImageButtons=styled.div`
    display:flex;
    gap:10px;
    flex-grow:0;
    margin-top:10px;
    cursor:pointer;
    `;

    {/* you can change the opacity of non selected image if you change opacity properties*/}
    const ImageButton=styled.div`
    border:2px solid #aaa;
    ${props=>props.active ? `
    border-color:#ccc;
    ` : `
    border-color: transparent;
    opacity: .7;
    `}
    
    height:40px;
    padding:2px;
    border-radius:5px;
    
    `;

    const BigImageWrapper=styled.div`
    text-align-center;
    `;

export default function ProductImages({images}){
  const [activeImage,setActiveImage]=useState(images?.[0]);
return (
        <>
          <BigImageWrapper>
          <BigImage src={activeImage} alt="Unable to display" />
          </BigImageWrapper>
          
          <ImageButtons>
             {images.map(image=> (
                <ImageButton 
                key={image}
                active ={image===activeImage} 
                onClick={()=>setActiveImage(image)}>
                    <Image src={image} alt="Unable to display"/>
                </ImageButton>
            ))}
          </ImageButtons>
    
        </>
    );

}