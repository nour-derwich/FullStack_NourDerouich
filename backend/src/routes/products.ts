import express from 'express';
import productsData from '../data/products.json';

const router = express.Router();

// Define the TypeScript interfaces for the data structure
interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  brand?: string; // Made brand optional
  sku: string;
  weight: number;
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  warrantyInformation: string;
  shippingInformation: string;
  availabilityStatus: string;
  reviews: Array<{
    rating: number;
    comment: string;
    date: string;
    reviewerName: string;
    reviewerEmail: string;
  }>;
  returnPolicy: string;
  minimumOrderQuantity: number;
  meta: {
    createdAt: string;
    updatedAt: string;
    barcode: string;
    qrCode: string;
  };
  images: string[];
  thumbnail: string;
}

interface ProductResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

// Preprocess the data to handle missing brand properties
const processedProducts = productsData.products.map((product) => ({
  ...product,
  brand: product.brand || "Unknown Brand", // Provide a default value for missing brands
}));

const products: ProductResponse = {
  ...productsData,
  products: processedProducts,
};

router.get('/', (req, res) => {
  const { search, page = 1, limit = 10 } = req.query;

  // Filter products based on search query
  let filteredProducts = products.products;

  if (search) {
    filteredProducts = filteredProducts.filter((product) =>
      product.title.toLowerCase().includes(String(search).toLowerCase()) ||
      product.description.toLowerCase().includes(String(search).toLowerCase()) ||
      product.category.toLowerCase().includes(String(search).toLowerCase()) ||
      (product.brand && product.brand.toLowerCase().includes(String(search).toLowerCase()))
    );
  }

  // Paginate the filtered products
  const startIndex = (Number(page) - 1) * Number(limit);
  const endIndex = startIndex + Number(limit);
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  res.json({
    products: paginatedProducts,
    total: filteredProducts.length,
    skip: startIndex,
    limit: Number(limit),
  });
});

router.get('/:id', (req, res) => {
  const productId = Number(req.params.id);
  const product = products.products.find((p) => p.id === productId);

  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
});

export default router;
