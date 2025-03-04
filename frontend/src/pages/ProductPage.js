// src/pages/ProductPage.js
import React from 'react';
import ProductDetail from '../components/ProductDetail';

function ProductPage({setCartCount}) {
  return (
    <div>
      <ProductDetail setCartCount={setCartCount}/>
    </div>
  );
}

export default ProductPage;
