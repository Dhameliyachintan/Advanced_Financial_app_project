import { Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./component/form/Login";
import Registration from "./component/form/Registration";
import Home from "./pages/Home/Home";
import Navbar from "./component/Navbar";
import EditFinacialForm from "./component/EditFinacialForm";
import { ToastContainer } from "react-toastify";
import FinancialForm from "./component/FinancialForm";

function App() {
  return (
    <div className="App">
      <Navbar />
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/financialForm" element={<FinancialForm />} />
        <Route path="/editFinacialForm" element={<EditFinacialForm/>} />
      </Routes>
    </div>
  );
}

export default App;
