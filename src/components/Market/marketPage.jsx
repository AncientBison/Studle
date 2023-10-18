import {
  AppBar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Pagination,
  Paper,
  Stack,
  Typography,
  useMediaQuery,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { useEffect,useState } from 'react';

import { BACKEND_URL } from '../../const/constants';
import disableTextSelection from '../../const/disableTextSelection';
import { stickerInfo, tierOrder, tierPrices } from './stickerInfo';

async function getTicketCount() {
  let data;
  try {
    data = await fetch(
      BACKEND_URL +
        '/ticketCount/' +
        encodeURIComponent(localStorage.getItem('encryptedEmail')),
      {
        method: 'GET',
        credentials: 'include',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Credentials': 'true',
        },
      }
    );
  } catch (e) {
    // ignore
  }
  const json = await data.json();

  if (json.type == 'error') {
    return -1;
  }

  return json.data;
}

async function getOwnedStickers() {
  let data;
  try {
    data = await fetch(
      BACKEND_URL +
        '/ownedStickers/' +
        encodeURIComponent(localStorage.getItem('encryptedEmail')),
      {
        method: 'GET',
        credentials: 'include',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Credentials': 'true',
        },
      }
    );
  } catch (e) {
    // ignore
  }
  const json = await data.json();

  if (json.type == 'error') {
    return -1;
  }

  return json.data;
}

const PreloadedImage = (properties) => {
  return <link rel="preload" as="image" href={properties.src} />;
};

function MarketPage(properties) {
  const { mainTheme, changePage, handleBuySticker } =
    properties;
  const [ownedStickers, setOwnedStickers] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [ticketCount, setTicketCount] = useState(0);
  const mediumScreen = useMediaQuery(mainTheme.breakpoints.down('lg'));
  const largeScreen = useMediaQuery(mainTheme.breakpoints.down('xl'));

  useEffect(() => {
    getTicketCount().then((ticketCount) => {
      setTicketCount(ticketCount);
    });

    getOwnedStickers().then((ownedStickers) => {
      setOwnedStickers(ownedStickers.map((sticker) => sticker.id));
    });
  }, []);

  const addSticker = (stickerId) => {
    setOwnedStickers([...ownedStickers, stickerId]);
  };

  return (
    <Box sx={{ height: '100%' }}>
      {Object.values(stickerInfo).map((sticker, index) => (
        <PreloadedImage
          src={sticker.image}
          key={index}
          sx={{ display: 'none' }}
        />
      ))}
      <AppBar position="sticky" color="primary" sx={{ height: '3.75em' }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: '100%',
          }}
        >
          <Box marginLeft="0.5em" display="flex">
            <Typography
              marginLeft="0.25em"
              cursor="pointer"
              sx={{
                ...disableTextSelection,
                cursor: 'pointer',
                fontSize: {
                  xl: '2.2em',
                  lg: '2.2em',
                  md: '2.2em',
                  sm: '2em',
                  xs: '1.5em',
                },
              }}
              onClick={() => {
                changePage('home');
              }}
            >
              Studle
            </Typography>
          </Box>
          <Box>
            <Typography
              sx={{
                ...disableTextSelection,
                fontSize: {
                  xl: '2.2em',
                  lg: '2.2em',
                  md: '2.2em',
                  sm: '1.9em',
                  xs: '1.5em',
                },
              }}
              align="center"
            >
              Sticker Market
            </Typography>
          </Box>
          <Box
            display="flex"
            sx={{ marginRight: '1em', height: '100%', alignItems: 'center' }}
          >
            <Typography sx={{ fontSize: '2em', marginRight: '0.7em' }}>
              {ticketCount}
            </Typography>
            <img
              src="src/images/ticket.png"
              style={{
                width: 'auto-adjust',
                height: '90%',
                imageRendering: 'pixelated',
              }}
            />
          </Box>
        </Box>
      </AppBar>
      <StickerShop
        mainTheme={mainTheme}
        largeScreen={largeScreen}
        pageNumber={pageNumber}
        handleBuySticker={handleBuySticker}
        mediumScreen={mediumScreen}
        ownedStickers={ownedStickers}
        addSticker={addSticker}
        ticketCount={ticketCount}
        setTicketCount={setTicketCount}
      />
      <Stack
        display="flex"
        sx={{
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'center',
          ...(!largeScreen ? { bottom: '4em' } : { top: '4em' }),
          position: 'absolute',
        }}
      >
        <Pagination
          size="large"
          sx={{
            backgroundColor: mainTheme.palette.popup.main,
            color: mainTheme.palette.popup.contrastText,
            position: 'fixed',
            borderRadius: '10px',
            padding: '5px',
            border: '2px solid ' + mainTheme.palette.popup.border,
          }}
          count={Math.ceil(
            Object.keys(stickerInfo).length / (mediumScreen ? 8 : 9)
          )}
          onChange={(event, value) => {
            setPageNumber(value);
          }}
        />
      </Stack>
    </Box>
  );
}

function BuyDialog(properties) {
  const {
    mainTheme,
    open,
    setOpen,
    stickerId,
    setTicketCount,
    addSticker,
    handleBuySticker,
  } = properties;

  const [text, setText] = useState(
    `Are you sure you would like to buy the ${
      stickerInfo[stickerId].tier.toUpperCase() +
      ' ' +
      camelCaseToTitleCase(stickerId)
    } sticker?`
  );
  const [attempted, setAttempted] = useState(false);

  return (
    <Dialog open={open}>
      <DialogTitle sx={{ fontWeight: 'bold' }}>
        Sticker Confirmation
      </DialogTitle>
      <DialogContent>
        <DialogContentText
          sx={{ color: mainTheme.palette.contrast.main, fontWeight: 'bold' }}
        >
          {text}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        {!attempted && (
          <Button
            variant="contained"
            sx={{
              textTransform: 'none',
              backgroundColor: mainTheme.palette.buttonPrimary.main,
              '&:hover': {
                backgroundColor: mainTheme.palette.buttonPrimary.hover,
              },
            }}
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
        )}
        <Button
          variant="contained"
          sx={{
            textTransform: 'none',
            backgroundColor: mainTheme.palette.buttonPrimary.main,
            '&:hover': {
              backgroundColor: mainTheme.palette.buttonPrimary.hover,
            },
          }}
          onClick={async () => {
            if (!attempted) {
              const attemptResults = await buyStickerAndUpdateTicketCount(
                stickerId,
                setTicketCount
              );
              if (attemptResults.type === 'success') {
                handleBuySticker(stickerId);
                addSticker(stickerId);
                setText(
                  'Successfully bought the ' +
                    stickerInfo[stickerId].tier.toUpperCase() +
                    ' ' +
                    camelCaseToTitleCase(stickerId) +
                    ' sticker!'
                );
              } else {
                setText(
                  'There was an error while buying the ' +
                    stickerInfo[stickerId].tier.toUpperCase() +
                    ' ' +
                    camelCaseToTitleCase(stickerId) +
                    ' sticker. If the issue continues, please report it on the feedback form in the hamburger menu.'
                );
              }

              setAttempted(true);
            } else {
              setOpen(false);
            }
          }}
        >
          {!attempted ? 'Confirm' : 'Close'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

async function buyStickerAndUpdateTicketCount(id, setTicketCount) {
  let data;
  try {
    data = await fetch(
      BACKEND_URL +
        '/buySticker/' +
        id +
        '/' +
        encodeURIComponent(localStorage.getItem('encryptedEmail')),
      {
        method: 'GET',
        credentials: 'include',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Credentials': 'true',
        },
      }
    );
  } catch (e) {
    // ignore
  }
  const json = await data.json();

  if (json.type === 'success') {
    getTicketCount().then((ticketCount) => {
      setTicketCount(ticketCount);
    });
  }

  return json;
}

function stickerSort(a, b) {
  if (tierOrder[stickerInfo[a].tier] < tierOrder[stickerInfo[b].tier]) {
    return -1;
  } else {
    return 1;
  }
}

function StickerShop(properties) {
  const {
    mainTheme,
    largeScreen,
    pageNumber,
    handleBuySticker,
    mediumScreen,
    addSticker,
    ticketCount,
    setTicketCount,
    ownedStickers,
  } = properties;
  const [buyDialogOpen, setBuyDialogOpen] = useState(false);
  const [buyingStickerId, setBuyingStickerId] = useState();

  useEffect(() => {
    if (buyingStickerId) {
      setBuyDialogOpen(true);
    }
  }, [buyingStickerId]);

  useEffect(() => {
    if (!buyDialogOpen) {
      setBuyingStickerId();
    }
  }, [buyDialogOpen]);

  return (
    <Box
      height="calc(100%-3.75em)"
      width="100%"
      display="flex"
      sx={{
        alignItems: 'center',
        flexDirection: 'column',
        marginTop: largeScreen ? '4em' : '2em',
        paddingBottom: '100px',
      }}
    >
      {buyingStickerId && (
        <BuyDialog
          mainTheme={mainTheme}
          addSticker={addSticker}
          open={buyDialogOpen}
          setOpen={setBuyDialogOpen}
          stickerId={buyingStickerId}
          setTicketCount={setTicketCount}
          handleBuySticker={handleBuySticker}
        />
      )}
      <Grid
        sx={{
          justifyContent: 'left',
          alignItems: 'center',
          flexDirection: 'row',
        }}
        height="90%"
        width="75%"
        container
        spacing={4}
      >
        {Object.keys(stickerInfo)
          .sort(stickerSort)
          .filter(
            (stickerId, index) =>
              index < pageNumber * (mediumScreen ? 8 : 9) &&
              index >
                pageNumber * (mediumScreen ? 8 : 9) -
                  ((mediumScreen ? 8 : 9) + 1)
          )
          .filter((stickerId) => stickerInfo[stickerId].tier !== 'special')
          .map((stickerId, index) => (
            <Sticker
              id={stickerId}
              mainTheme={mainTheme}
              setBuyingStickerId={setBuyingStickerId}
              canBuy={
                ticketCount >= tierPrices[stickerInfo[stickerId].tier] &&
                !ownedStickers.includes(stickerId)
              }
              owned={ownedStickers.includes(stickerId)}
              key={index}
            />
          ))}
      </Grid>
    </Box>
  );
}

function Sticker(properties) {
  const { mainTheme, id, setBuyingStickerId, canBuy, owned } = properties;

  return (
    <Grid
      xl={4}
      lg={6}
      md={6}
      sm={12}
      display="flex"
      sx={{
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      <Paper
        elevation={8}
        sx={{
          width: '20em',
          height: '20em',
          padding: 0,
          aspectRatio: 1,
          border: '1em solid',
          boxSizing: 'border-box',
          borderColor: mainTheme.palette.stickerTiers[stickerInfo[id].tier],
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%',
          }}
        >
          <img
            src={stickerInfo[id].image}
            style={{
              width: 'auto-adjust',
              height: '90%',
              imageRendering: 'pixelated',
            }}
          />
        </Box>
      </Paper>
      <Box
        sx={{
          width: '20em',
          borderRadius: '10px',
          border: '2px solid ' + mainTheme.palette.contrast.main,
          marginTop: '1em',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxSizing: 'border-box',
        }}
      >
        <Box display="flex" sx={{ alignItems: 'center' }}>
          <Typography
            sx={{
              fontSize: '1.3em',
              width: 'fit-content',
              marginLeft: '10px',
              display: 'inline-block',
              marginRight: '10px',
            }}
          >
            {tierPrices[stickerInfo[id].tier]}
          </Typography>
          <img
            src="src/images/ticket.png"
            style={{
              width: 'auto-adjust',
              height: '2rem',
              imageRendering: 'pixelated',
            }}
          />
        </Box>
        <Button
          variant="contained"
          disabled={!canBuy}
          onClick={() => setBuyingStickerId(id)}
          color="buttonPrimary"
          sx={{
            borderRadius: '0 8px 8px 0',
            fontSize: {
              xl: '1.2em',
              lg: '1.2em',
              md: '1.2em',
              sm: '1.2em',
              xs: '1em',
            },
            width: '35%',
            height: '100%',
            textTransform: 'none',
          }}
        >
          {!owned ? 'Buy' : 'Owned'}
        </Button>
      </Box>
    </Grid>
  );
}

function camelCaseToTitleCase(input) {
  const titleCase = input.replace(/([A-Z])/g, ' $1');

  return titleCase.charAt(0).toUpperCase() + titleCase.slice(1);
}

export { MarketPage };
