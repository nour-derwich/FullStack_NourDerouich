import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../lib/api";
import { Products } from "../types/types";
import { Button } from "../components/ui/button";
import { Star, ShoppingCart } from "lucide-react";

export default function ProductDetail() {
  const [product, setProduct] = useState<Products | null>(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/${id}`);
        setProduct(res.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching product details", error);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!product) return <div>Product not found</div>;

  return (
    <div className="container mx-auto p-6 grid md:grid-cols-2 gap-8">
      <div className="product-images">
        <img 
          src={product.thumbnail} 
          alt={product.title} 
          className="w-full h-96 object-cover rounded-lg mb-4" 
        />
        <div className="flex gap-2 overflow-x-auto">
          {product.images.map((image, index) => (
            <img 
              key={index} 
              src={image} 
              alt={`${product.title} - View ${index + 1}`} 
              className="w-20 h-20 object-cover rounded-lg cursor-pointer"
            />
          ))}
        </div>
      </div>
      
      <div className="product-info">
        <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
        
        <div className="flex items-center gap-2 mb-4">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`w-5 h-5 ${i < Math.round(product.rating) ? 'text-yellow-500' : 'text-gray-300'}`} 
                fill={i < Math.round(product.rating) ? 'currentColor' : 'none'}
              />
            ))}
          </div>
          <span className="text-gray-600">({product.rating}/5)</span>
        </div>
        
        <div className="price-section mb-4">
          <p className="text-2xl font-bold text-primary">
            ${product.price.toFixed(2)}
            {product.discountPercentage > 0 && (
              <span className="ml-2 text-sm text-green-600">
                {product.discountPercentage.toFixed(2)}% off
              </span>
            )}
          </p>
        </div>
        
        <div className="product-details mb-6">
          <h2 className="text-xl font-semibold mb-2">Product Description</h2>
          <p className="text-gray-700">{product.description}</p>
        </div>
        
        <div className="product-meta grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="font-medium">Brand: {product.brand}</p>
            <p className="font-medium">Category: {product.category}</p>
          </div>
          <div>
            <p className="font-medium">SKU: {product.sku}</p>
            <p className="font-medium">Stock: {product.stock}</p>
          </div>
        </div>
        
        <div className="actions flex gap-4">
          <Button className="flex-1 flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Add to Cart
          </Button>
          <Button variant="outline" className="flex-1">
            Buy Now
          </Button>
        </div>
        
        <div className="reviews mt-8">
          <h2 className="text-xl font-semibold mb-4">Customer Reviews</h2>
          {product.reviews.map((review, index) => (
            <div key={index} className="review border-b pb-4 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-medium">{review.reviewerName}</span>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-4 h-4 ${i < review.rating ? 'text-yellow-500' : 'text-gray-300'}`} 
                      fill={i < review.rating ? 'currentColor' : 'none'}
                    />
                  ))}
                </div>
              </div>
              <p>{review.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}