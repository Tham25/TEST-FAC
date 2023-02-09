import { useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { Button, Box, Divider, Typography, Avatar } from '@mui/material';
import classNames from 'classnames/bind';

import MenuPopover from '~/components/MenuPopover';
import { userLogout } from '~/redux/slices/user';
import images from '~/assets/images';
import styles from './AccountPopover.module.scss';

const cx = classNames.bind(styles);

export default function AccountPopover() {
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  if (!user) return null;

  return (
    <div className={cx('account-popper')}>
      <Button ref={anchorRef} onClick={handleOpen}>
        {user.displayName ? (
          <div className={cx('box-avatar')}>{user.displayName.charAt(0)}</div>
        ) : (
          <Avatar src={images.imageAvatar} alt="avatar" />
        )}
      </Button>
      <MenuPopover
        className={cx('menu-popper')}
        open={open}
        onClose={handleClose}
        anchorEl={anchorRef.current}
        sx={{ width: 220 }}
        sxArrow={{ top: -8 }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: 16 }} noWrap>
            {user.user_name}
          </Typography>
        </Box>

        <Divider sx={{ my: 1 }} />

        <Box sx={{ p: 2, pt: 1.5 }}>
          <Button className={cx('logout-button')} fullWidth onClick={() => dispatch(userLogout())}>
            Logout
          </Button>
        </Box>
      </MenuPopover>
    </div>
  );
}
