import { Snackbar, Alert } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { clearNotification } from '~/redux/slices/notification';

export default function Notification() {
  const dispatch = useDispatch();
  const { notification } = useSelector((state) => state.notification);
  const handleClose = () => {
    if (notification[0].open) {
      dispatch(clearNotification());
    }
  };

  return (
    notification &&
    notification.length > 0 && (
      <Snackbar
        open={notification[0].open}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        onClose={handleClose}
      >
        <Alert severity={notification[0].severity} sx={{ width: '100%', fontSize: 12 }}>
          {notification[0].message}
        </Alert>
      </Snackbar>
    )
  );
}
