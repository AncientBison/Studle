import { Box, Typography, createTheme, ThemeProvider } from '@mui/material';

import { GoogleOAuthLogin } from './loginManager';
import disableTextSelection from './disableTextSelection';

const centeringFlexBox = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
}

function LandingPage(properties) {
  const { mainTheme, signedInEmail, setSignedInEmail, changePage } = properties;

  return (
    <Box maxWidth="100%" height="100vh" backgroundColor={mainTheme.palette.contrastPrimary.main}
      sx={centeringFlexBox}
    >
      <Typography variant="h1" sx={disableTextSelection} >
        Studle
      </Typography>
      <GoogleOAuthLogin signedInEmail={signedInEmail} setSignedInEmail={setSignedInEmail} changePage={changePage} />
    </Box>
  );
}

export { LandingPage };