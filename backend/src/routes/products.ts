import express from 'express';
import productsData from '../data/products.json';

const router = express.Router();

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
  brand?: string;  // Optional brand, handled with a default value
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


const processedProducts = productsData.products.map((product) => ({
  ...product,
  brand: product.brand || "Unknown Brand", // Default brand if missing
}));

// Create the final response structure with paginated products
const products: ProductResponse = {
  ...productsData,
  products: processedProducts,
};

// GET all products with search and pagination
router.get('/', (req, res) => {
  const { search, page = 1, limit = 10 } = req.query;

  // Filtering logic
  let filteredProducts = products.products;

  if (search) {
    filteredProducts = filteredProducts.filter((product) =>
      product.title.toLowerCase().includes(String(search).toLowerCase()) ||
      product.description.toLowerCase().includes(String(search).toLowerCase()) ||
      product.category.toLowerCase().includes(String(search).toLowerCase()) ||
      (product.brand && product.brand.toLowerCase().includes(String(search).toLowerCase()))
    );
  }

  // Pagination logic
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

// GET single product by ID
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
