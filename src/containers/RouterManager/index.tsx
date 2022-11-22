import { FC } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { routes } from 'router';

const RouteManager: FC = () => {
  const router = Object.values(routes).map(({ path, component, name }) => {
    return <Route path={path} element={component} key={name} />;
  });
  return (
    <Routes>
      {router}
      <Route path="*" element={<Navigate to="/explore" />} />
    </Routes>
  );
};

export default RouteManager;
