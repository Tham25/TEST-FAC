import { Box } from '@mui/material';
import images from '~/assets/images';

function Logo({ sx, styles }) {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(180deg, #434343, #000)',
        p: 1,
        borderRadius: 10,
        ...sx,
      }}
    >
      <img
        alt="login"
        src={images.imageLogoXor}
        // eslint-disable-next-line react/style-prop-object
        style={{
          width: '100%',
          height: '100%',
          ...styles,
        }}
      />
    </Box>
  );
}

export default Logo;
