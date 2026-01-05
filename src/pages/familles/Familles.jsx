import { Routes, Route } from 'react-router-dom';

import FamilleListPage from './FamilleListPage';
import FamilleFormPage from './FamilleFormPage';

const Familles = () => {
  return (
    <Routes>
      <Route index element={<FamilleListPage />} />
      <Route path="new" element={<FamilleFormPage />} />
      <Route path="edit/:code" element={<FamilleFormPage />} />
    </Routes>
  );
};

export default Familles;
