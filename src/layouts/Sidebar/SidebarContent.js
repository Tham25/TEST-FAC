import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Collapse,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';

import images from '~/assets/images';
import { config } from '~/config';
import { userLogout } from '~/redux/slices/user';

function SidebarContent() {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  return (
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        color: '#fff',
        p: 2,
        width: '100%',
        height: '100%',
      }}
    >
      <>
        <Box sx={{ fontSize: 24 }}>XOR Admin!</Box>
        <Box
          sx={{
            mt: '24px',
            alignSelf: 'center',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: 160,
            height: 160,
            borderRadius: '50%',
          }}
        >
          <img
            style={{ width: '85%', height: '85%', borderRadius: '50%' }}
            src={images.imageLogoXorCircle}
            alt="avatar"
          />
        </Box>
        <Box sx={{ mt: 2 }}>
          <p style={{ marginBottom: '4px', color: '#ccc' }}>Wellcome,</p>
          <p>{user.user_email}</p>
        </Box>
      </>
      <Box
        sx={{
          flex: 1,
          mt: '20px',
          overflowY: 'overlay',
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#ccc',
            borderRight: 'none',
            borderLeft: 'none',
          },
          '&::-webkit-scrollbar': {
            width: '5px',
          },
        }}
      >
        <SidebarMenu />
      </Box>
      <Box
        sx={{
          backgroundColor: '#171b1e',
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '48px',
          display: 'flex',
          p: 2,
          justifyContent: 'end',
        }}
      >
        <Tooltip title="Log out">
          <IconButton onClick={() => dispatch(userLogout())}>
            <PowerSettingsNewIcon sx={{ color: '#ccc' }} />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
}

export default SidebarContent;

const activeColor = '#434648';

export function SidebarMenu() {
  const { pathname } = useLocation();
  const [openSubnav, setOpenSubnav] = useState(true);
  const [itemCurrent, setItemCurrent] = useState(0);
  const navigate = useNavigate();
  // const { pathname } = useLocation();

  const handleOnClick = (index) => {
    if (itemCurrent === index) {
      setOpenSubnav(!openSubnav);
    } else {
      setItemCurrent(index);
      setOpenSubnav(true);
    }
  };

  // check open
  useEffect(() => {
    let itemOpen = 0;
    config.sidebarData.forEach((item, index) => {
      item.subnav.forEach((element) => {
        if (element.linkTo.includes(pathname)) {
          itemOpen = index;
        }
      });
    });
    setItemCurrent(itemOpen);
  }, [pathname]);

  return (
    <List sx={{ color: '#ccc' }}>
      {config.sidebarData.map((item, index) => {
        const isOpen = index === itemCurrent;
        return (
          <Box key={index}>
            <ListItemButton
              disableRipple
              sx={{
                '&:hover': { backgroundColor: activeColor },
                boxShadow:
                  openSubnav &&
                  isOpen &&
                  'rgb(0 0 0 / 25%) 0 1px 0, inset rgb(255 255 255 / 16%) 0 1px 0',
              }}
              component="nav"
              onClick={() => handleOnClick(index)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.title} />
              <ListItemIcon sx={{ minWidth: '24px' }}>
                {openSubnav && isOpen ? (
                  <ExpandMoreIcon sx={{ color: '#ccc' }} />
                ) : (
                  <ChevronRightIcon sx={{ color: '#ccc' }} />
                )}
              </ListItemIcon>
            </ListItemButton>
            <Collapse in={openSubnav && isOpen} timeout="auto">
              {item.subnav.map((item, id) => {
                const isActive = item.linkTo.split('/')[3] === pathname.split('/')[3];
                return (
                  <ListItemButton
                    key={id}
                    component="div"
                    disableRipple
                    sx={{
                      userSelect: 'none',
                      ml: 2,
                      mt: 1,
                      backgroundColor: isActive ? activeColor : 'transparent',
                      '&:hover': { backgroundColor: activeColor },
                    }}
                    onClick={() => navigate(item.linkTo, { replace: true })}
                  >
                    <ListItemIcon sx={{ minWidth: '44px' }}>{item.icon}</ListItemIcon>
                    <Box sx={{ fontSize: 14 }}>{item.title} </Box>
                  </ListItemButton>
                );
              })}
            </Collapse>
          </Box>
        );
      })}
    </List>
  );
}
