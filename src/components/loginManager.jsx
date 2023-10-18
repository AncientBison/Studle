import { Button } from '@mui/material';
import { GoogleLogin } from '@react-oauth/google';
import { GoogleOAuthProvider } from '@react-oauth/google';
import jwt_decode from 'jwt-decode';

const CLIENT_ID =
  '818941265959-2cr05g4l51om6lu98f9k7mo6r99d9o2n.apps.googleusercontent.com';

import { BACKEND_URL } from '../const/constants';

function getUserInfoFromCredential(credential) {
  return jwt_decode(credential);
}

function GoogleOAuthLogin(properties) {
  const { setSignedInEmail, changePage } = properties;

  const onSuccess = (response) => {
    const userInfo = getUserInfoFromCredential(response.credential);

    fetch(BACKEND_URL + '/signIn', {
      method: 'POST',
      credentials: 'include',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Credentials': 'true',
      },
      body: JSON.stringify({
        credential: response.credential,
      }),
    }).then(async (res) => {
      const encryptedEmail = (await res.json()).data;
      localStorage.setItem('encryptedEmail', encryptedEmail);
      fetch(BACKEND_URL + '/newUser', {
        method: 'POST',
        credentials: 'include',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Credentials': 'true',
        },
        body: JSON.stringify({
          encryptedEmail: encryptedEmail,
        }),
      }).then(async () => {
        localStorage.setItem('email', userInfo.email);
        setSignedInEmail(userInfo.email);

        changePage('home');
      });
    });
  };

  const onFailure = (response) => {
    console.log(response);
  };

  return (
    <GoogleOAuthProvider client_id={CLIENT_ID}>
      <Button>
        <GoogleLogin
          client_id={CLIENT_ID}
          onSuccess={onSuccess}
          onFailure={onFailure}
          cookiePolicy={'single-host-origin'}
          isSignedIn={true}
        ></GoogleLogin>
      </Button>
    </GoogleOAuthProvider>
  );
}

export { CLIENT_ID, GoogleOAuthLogin };
