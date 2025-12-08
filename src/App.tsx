import { Route, Routes } from "react-router-dom";
import "./App.css";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { Notice } from "./components/Notice";
import Home from "./pages/Home";
import Common from "./pages/scss/Common";
import Login from "./pages/login";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/common" element={<Common />} />
        <Route path="/login" element={<Login />} />
      </Routes>
      <Notice />
      <Footer />
    </>
  );
}

export default App;
