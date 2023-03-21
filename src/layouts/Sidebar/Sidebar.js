import PropTypes from 'prop-types';
import { useRef } from 'react';
import { Box, Drawer, Slide } from '@mui/material';

import useResponsive from '~/utils/useResponsive';
import SidebarContent from './SidebarContent';

const DRAWER_WIDTH = 250;

Sidebar.propTypes = {
  isOpenSidebar: PropTypes.bool,
  onCloseSidebar: PropTypes.func,
};

export default function Sidebar({ isOpenSidebar, onCloseSidebar }) {
  const isDesktop = useResponsive('up', 'lg');
  const containerRef = useRef(null);

  if (!isDesktop) {
    return (
      <Drawer
        open={isOpenSidebar}
        onClose={onCloseSidebar}
        transitionDuration={500}
        PaperProps={{
          sx: {
            width: DRAWER_WIDTH,
            background: 'linear-gradient(180deg, #434343, #000)',
            height: '100%',
            overflow: 'hidden',
          },
        }}
      >
        <SidebarContent />
      </Drawer>
    );
  }
  return (
    <Slide direction="right" in={isOpenSidebar} container={containerRef.current} timeout={500}>
      <Box
        display={isOpenSidebar ? 'flex' : 'none'}
        sx={{
          width: DRAWER_WIDTH,
          background: 'linear-gradient(180deg, #434343, #000)',
          height: '100%',
          overflow: 'hidden',
        }}
      >
        <SidebarContent />
      </Box>
    </Slide>
  );
}
