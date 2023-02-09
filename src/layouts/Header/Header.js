import { Typography, Box, Button } from '@mui/material';
import DehazeIcon from '@mui/icons-material/Dehaze';

import classNames from 'classnames/bind';
import styles from './Header.module.scss';
import AccountPopover from '../AccountPopover';

const cx = classNames.bind(styles);

function Header({ title, handleOpenSidebar, ...other }) {
  return (
    <Box className={cx('header')} {...other}>
      <div className={cx('page-info')}>
        <Button onClick={handleOpenSidebar}>
          <DehazeIcon
            sx={{
              fontSize: 38,
              color: '#3e4474',
              marginLeft: 2,
              padding: '4px',
            }}
          />
        </Button>
        <Typography sx={{}}>{title}</Typography>
      </div>
      <div className={cx('user-info')}>
        <AccountPopover />
      </div>
    </Box>
  );
}

export default Header;
