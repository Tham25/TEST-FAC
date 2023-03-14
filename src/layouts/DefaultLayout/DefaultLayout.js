import { useState } from 'react';
import { Box, Stack } from '@mui/material';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import Page from '~/components/Page';
import styles from './DefaultLayout.module.scss';
import Header from '../Header';
import Sidebar from '../Sidebar';

const cx = classNames.bind(styles);
function DefaultLayout({ children, title, description = title }) {
  const [isOpenSidebar, setIsOpenSidebar] = useState(true);

  return (
    <Box sx={{ display: 'flex', height: '100vh'}}>
      <Sidebar isOpenSidebar={isOpenSidebar} onCloseSidebar={() => setIsOpenSidebar(false)} />
      <Stack sx={{ flex: 1 }}>
        <Header title={description} handleOpenSidebar={() => setIsOpenSidebar(!isOpenSidebar)} />
        <Page className={cx('container')} title={title}>
          {children}
        </Page>
      </Stack>
    </Box>
  );
}

DefaultLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default DefaultLayout;
