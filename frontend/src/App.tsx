import { Route, Routes } from "react-router-dom";
import AllProducts from "./components/ProductList";
import ProductDetail from "./components/ProductDetail";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<AllProducts />} />
        <Route path="/prodect/:id" element={<ProductDetail />} />
      </Routes>
    </div>
  );
}

export default App;
