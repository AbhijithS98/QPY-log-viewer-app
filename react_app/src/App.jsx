import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import { QueryProvider } from "./context/QueryContext";

const App = () => {
  return (
    <Router>
      <QueryProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />}/>
        </Routes>
      </QueryProvider>     
    </Router>
  );
};

export default App;
