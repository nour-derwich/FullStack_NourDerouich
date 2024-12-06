import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../lib/api";
import { Products } from "../types/types";
import Searchbar from "./Searchbar";
import { Star, ShoppingCart } from "lucide-react";

export default function AllProducts() {
  const [products, setProducts] = useState<Products[] | null>(null);
  useEffect(() => {
    const getProducts = async () => {
      try {
        const res = await api.get("/");
        setProducts(res.data.products);
      } catch (error) {
        console.error("Error fetching Products", error);
      }
    };
    getProducts();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <Searchbar products={products} setProducts={setProducts} />
        
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
          {products?.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 group"
            >
              <Link
                to={`/prodect/${product.id}`}
                className="block relative"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                </div>
                
                <div className="p-4">
                  <h3 className="text-xl font-bold text-gray-800 mb-2 truncate">
                    {product.title}
                  </h3>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.round(product.rating)
                              ? 'text-yellow-500'
                              : 'text-gray-300'
                          }`}
                          fill={i < Math.round(product.rating) ? 'currentColor' : 'none'}
                        />
                      ))}
                      <span className="text-sm text-gray-500 ml-2">
                        ({product.rating}/5)
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-primary">
                      ${product.price.toFixed(2)}
                    </span>
                    <button className="bg-primary text-white rounded-full p-2 hover:bg-primary-dark transition-colors">
                      <ShoppingCart className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="mt-4 text-sm text-gray-600">
                    <p>Brand: {product.brand}</p>
                    <p>Category: {product.category}</p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}