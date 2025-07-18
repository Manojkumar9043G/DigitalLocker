import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import bg from './assets/imges/bg.jpg';
import Login from './Component/Auth/Login';
import Register from './Component/Auth/Register';
import Layout from './Component/Home/Components/Layout';
import FHome from './Component/Home/Components/options/Fhome';
import MyFiles from './Component/Home/Components/options/Myfile';
import Upload from './Component/Home/Components/options/Uplode';
import ProtectedRoute from './Component/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Login background={bg} />} />
        <Route path="/register" element={<Register background={bg} />} />

        {/* Protected routes wrapped inside Layout */}
        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route path="home" element={<FHome />} />
          <Route path="files" element={<MyFiles />} />
          <Route path="upload" element={<Upload />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
