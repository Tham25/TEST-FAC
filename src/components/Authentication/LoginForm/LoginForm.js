import * as Yup from 'yup';
import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useFormik, Form, FormikProvider } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames/bind';
// material
import {
  Link,
  Stack,
  Checkbox,
  TextField,
  IconButton,
  InputAdornment,
  FormControlLabel,
  Alert,
} from '@mui/material';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { LoadingButton } from '@mui/lab';

import { userLogin } from '~/redux/slices/user';
import styles from './LoginForm.module.scss';

// ----------------------------------------------------------------------

const cx = classNames.bind(styles);

function LoginForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const { error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const LoginSchema = Yup.object().shape({
    username: Yup.string().min(2, 'Mininum 2 characters').required('User name is required'),
    password: Yup.string().required('Password is required'),
  });

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      remember: true,
    },
    validationSchema: LoginSchema,
    onSubmit: (values, { setSubmitting }) => {
      dispatch(userLogin(values, navigate));
      setSubmitting(false);
    },
  });

  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps } = formik;

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit} className={cx('login-form')}>
        <Stack>
          <TextField
            onFocus={() => ''}
            sx={{ '& input': { padding: '8px 12px' }, mb: '24px' }}
            fullWidth
            variant="standard"
            autoComplete="username"
            type="text"
            label="User name"
            {...getFieldProps('username')}
            error={Boolean(touched.username && errors.username)}
            helperText={touched.username && errors.username}
          />
          <TextField
            sx={{ '& input': { padding: '8px 12px' } }}
            fullWidth
            variant="standard"
            autoComplete="current-password"
            type={showPassword ? 'text' : 'password'}
            label="Password"
            {...getFieldProps('password')}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleShowPassword} edge="end">
                    {showPassword ? <RemoveRedEyeIcon /> : <VisibilityOffIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            error={Boolean(touched.password && errors.password)}
            helperText={touched.password && errors.password}
          />
        </Stack>
        <Stack className={cx('login-control')} direction="row">
          <FormControlLabel
            control={<Checkbox {...getFieldProps('remember')} checked={values.remember} />}
            label="Remember me"
          />
          <Link component={RouterLink} variant="subtitle2" to="#" underline="hover">
            Forgot password?
          </Link>
        </Stack>

        <LoadingButton
          className={cx('login-button')}
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
        >
          Login
        </LoadingButton>
        {error && (
          <Alert variant="outlined" severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </Form>
    </FormikProvider>
  );
}

export default LoginForm;
