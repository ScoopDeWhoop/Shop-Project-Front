import axios from "axios";
import { useEffect, useState } from "react";
import Product from "./components/Product";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Register from "./components/Register";
import Footer from "./components/Footer";
import ProductPage from "./components/ProductPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./components/Products.css";
import "./App.css";

function App() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  useEffect(getProducts, [selectedCategory]);
  useEffect(getCategories, []);


  function handleCategoryClick(categoryId) {
    setSelectedCategory(categoryId);
  }
  function getCategories() {
    axios
      .get("https://danielshop.onrender.com/category")
      .then((response) => {
        console.log("categories", response.data);
        setCategories(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }

  function getProducts(search = null) {
    let url = "https://danielshop.onrender.com/product";
    if (search) {
      url += `?search=${search}`;
      setSelectedCategory("searchcontent");
    }
  
    axios
      .get(url)
      .then((response) => {
        console.log(response.data);
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }
  function search(search) {
    getProducts(search);
    
  }

  return (
    <>
      <BrowserRouter>
        <Navbar
          categories={categories}
          onCategoryClick={handleCategoryClick}
          searchProduct={search}
        />
        <Routes>
          <Route
            path="/Shop-Project-Front"
            element={
              <>
                <div className="product_body">
                  {products.map((product) => (
                    <div key={product.id}>
                      <Product product={product} />
                    </div>
                  ))}
                </div>
                <br />
              </>
            }
          ></Route>
          <Route
            path="Shop-Project-Front/nutrition"
            element={<><div className="product_body">{products
              .filter((product) => product.category === 1)
              .map((product) => (
                <div key={product.id} >
                  <Product product={product} />
                </div>
              ))}</div></>}
          ></Route>
          <Route
            path="Shop-Project-Front/clothing"
            element={<><div className="product_body">{products
              .filter((product) => product.category === 2)
              .map((product) => (
                <div key={product.id} >
                  <Product product={product} />
                </div>
              ))}</div></>}
          ></Route>
          <Route path="Shop-Project-Front/login" element={<Login />}></Route>
          <Route path="Shop-Project-Front/product/:productId" element={<ProductPage />} />
          <Route path="Shop-Project-Front/register" element={<Register />}></Route>
          
        </Routes>
        <Footer></Footer>
      </BrowserRouter>
    </>
  );
}

export default App;