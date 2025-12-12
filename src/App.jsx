import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import PaginaPrincipal from './pages/PaginaPrincipal'
import Ingreso from './pages/ingresos/Ingreso'
import Egreso from './pages/egresos/Egreso'
import LoginUsuario from './pages/usuario/LoginUsuario';
import Concepto from './pages/conceptos/Concepto';
import Registro from './pages/usuario/Registro';



function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginUsuario />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/auth/:id" element={<LoginUsuario />} />
        <Route path="/paginaPrincipal" element={<PaginaPrincipal />} />
        <Route path="/ingresos" element={<Ingreso />} />
        <Route path="/egresos" element={<Egreso />} />
        <Route path="/conceptos" element={<Concepto />} />
      </Routes>
    </Router>
  );
}

export default App;
