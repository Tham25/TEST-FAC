import { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { config } from '~/config';
import DefaultLayout from '~/layouts/DefaultLayout';

function HomePage() {
  const [title, setTitle] = useState('Statistics');
  const { pathname } = useLocation();

  useEffect(() => {
    const titleNew =
      config.homePage.find((item) => item.linkTo.split('/')[3] === pathname.split('/')[3])?.title ||
      '';
    setTitle(titleNew);
  }, [pathname]);

  return (
    <DefaultLayout title={title}>
      <Routes>
        <Route path="/" element={<Navigate to="statistics" />} />
        {config.homePage.map((item, index) => (
          <Route key={index} path={`${item.navigatePath}/*`} element={item.component} />
        ))}
      </Routes>
    </DefaultLayout>
  );
}

export default HomePage;
