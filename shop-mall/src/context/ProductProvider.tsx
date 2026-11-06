import { useState } from "react";
import { ProductContext } from "./ProductContext";
import type { Product, NewProduct } from "../types/product";
import { initialProducts } from "../datas/products";

const ProductProvider = ({children} : {children: React.ReactNode}) => {
    const [products, setProducts] = useState<Product[]>(initialProducts);

    //상품 추가 함수
    const addProduct = (newProduct: NewProduct) => {
        //순번으로 자동 저장(유일해야 하므로 날짜와 시간으로 사용)
        const product: Product = {...newProduct, id: Date.now()};
        setProducts([...products, product])
    }
    return(
        <ProductContext.Provider value={{products, addProduct}}>
            {children}
        </ProductContext.Provider>
    )
}

export default ProductProvider;