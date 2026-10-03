import type { JSX } from 'react/jsx-runtime';

import { Routes, Route } from 'react-router';

import App from '@/components/App/App';
import HomePage from '@/pages/home-page';
import ProductsPage from '@/pages/products-page';

export const AppRouter = (): JSX.Element => {
  return (
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<HomePage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="*" element={<div>404 Not Found</div>} />
      </Route>
    </Routes>
  );
};
