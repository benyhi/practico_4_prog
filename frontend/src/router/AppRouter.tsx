import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TableView from "./producto/views/TableView";
import AuthFormView from "./auth/views/AuthFormView";
import Home from "./Home";
import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';

function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<AuthFormView />} />
        <Route path="/productos" element={<TableView />} />
      </Routes>
    </Router>
  );
}

export default AppRouter;
