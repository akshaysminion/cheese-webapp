import { Navigate, Route, Routes } from 'react-router-dom';
import { CheeseListPage } from './pages/CheeseListPage';
import { CheeseDetailPage } from './pages/CheeseDetailPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<CheeseListPage />} />
      <Route path="/cheese/:slug" element={<CheeseDetailPage />} />
      <Route path="/index.html" element={<Navigate to="/" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
