import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../lib/api";
import { Products } from "../types/types";

export default function AllProducts() {
  const [products, setProducts] = useState<Products[] | null>(null);
  useEffect(() => {
    const getProducts = async () => {
      try {
        const res = await api.get("/");
        setProducts(res.data);
      } catch (error) {
        console.error("Error fetching Products", error);
      }
    };
    getProducts();
  }, []);

  return (
    <div className="flex flex-col">
      <main className="p-4 md:p-6">
        <section className="columns-xs">
          {products &&
            products.map((product) => (
              <div
                key={product.id}
                className="flex flex-col justify-between relative h-96 group overflow-hidden rounded-sm shadow-md hover:shadow-xl transition-transform duration-300 ease-in-out hover:-translate-y-2 mb-4 mx-4"
              >
                <Link
                  to={`/prodect/${product.id}`}
                  className="absolute inset-0 z-10"
                >
                  <span className="sr-only">voir plus</span>
                </Link>
                <img
                  src={product.thumbnail}
                  alt={product.title}
                  width={500}
                  height={400}
                  className="object-cover w-full h-64"
                />
                <div className="flex flex-col justify-between bg-white py-4 h-32 dark:bg-gray-950">
                  <h3 className="font-bold text-lg p-3">{product.title}</h3>

                  <h4 className="font-semibold text-base border-t p-3 border-bgColor">
                
                 
                    <p>Brand: {product.brand}</p>
                    <p>Category: {product.category}</p>
                    <p>Price: ${product.price}</p>
                    <p>Rating: {product.rating}/5</p> </h4>
            
                </div>
              </div>
            ))}
        </section>
      </main>
    </div>
  );
}