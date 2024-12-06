"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const products_json_1 = __importDefault(require("../data/products.json"));
const router = express_1.default.Router();
// Preprocess the data to handle missing brand properties
const processedProducts = products_json_1.default.products.map((product) => (Object.assign(Object.assign({}, product), { brand: product.brand || "Unknown Brand" })));
const products = Object.assign(Object.assign({}, products_json_1.default), { products: processedProducts });
router.get('/', (req, res) => {
    const { search, page = 1, limit = 10 } = req.query;
    // Filter products based on search query
    let filteredProducts = products.products;
    if (search) {
        filteredProducts = filteredProducts.filter((product) => product.title.toLowerCase().includes(String(search).toLowerCase()) ||
            product.description.toLowerCase().includes(String(search).toLowerCase()) ||
            product.category.toLowerCase().includes(String(search).toLowerCase()) ||
            (product.brand && product.brand.toLowerCase().includes(String(search).toLowerCase())));
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
    }
    else {
        res.status(404).json({ message: 'Product not found' });
    }
});
exports.default = router;
