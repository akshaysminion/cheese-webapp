import { Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { CheeseListPage } from './pages/CheeseListPage';
import { CheeseDetailPage } from './pages/CheeseDetailPage';
import { RindversePage } from './pages/RindversePage';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<RindversePage />} />
        <Route path="/library" element={<CheeseListPage />} />
        <Route path="/cheese/:slug" element={<CheeseDetailPage />} />
        <Route path="/index.html" element={<Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
