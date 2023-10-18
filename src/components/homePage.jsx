import {
  AppBar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { CircularProgress } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { useState } from 'react';
import Draggable from 'react-draggable';

import { BACKEND_URL } from '../const/constants';
import disableInteraction from '../const/disableInteraction';
import disableTextSelection from '../const/disableTextSelection';
import { stickerInfo } from './Market/stickerInfo';
import RecentSetsBox from './RecentSetsBox';
import customScrollbarStyles from './thinScrollbar.module.css';

function HomePage(properties) {
  const {
    changePage,
    stickers,
    placeSticker,
    removeSticker,
    mainTheme,
    setStudyingSetName,
    setEditingSetName,
    studyingShared,
    sharedSetData,
    showStickerDialog,
    setShowStickerDialog,
  } = properties;
  const [open, setOpen] = useState(false);
  const [recentSetNames, setRecentSetNames] = useState([]);
  const [fetchSetsStatus, setFetchSetsStatus] = useState('');

  const setEditingSet = (name) => {
    setEditingSetName(name);
    changePage('createSet');
  };

  const updateRecentSetNames = async () => {
    const newSetNames = [];

    for (const set of await getRecentSetNames(setFetchSetsStatus)) {
      newSetNames.push({ name: set.name, shareId: set.shareId });
    }

    setRecentSetNames(newSetNames);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCreateSetClick = () => {
    changePage('createSet');
  };

  const ImportDialouge = (properties) => {
    const { open, handleClose } = properties;
    const [errorText, setErrorText] = useState('');
    const [error, setError] = useState(false);
    const [studleId, setStudleId] = useState('');
    const [loading, setLoading] = useState(false);

    return (
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        disableRestoreFocus
      >
        <DialogTitle id="alert-dialog-title">
          {!loading ? 'Import a set!' : 'Importing...'}
        </DialogTitle>
        <DialogContent>
          {!loading ? (
            <TextField
              autoFocus
              id="studleIdInput"
              margin="dense"
              label="Studle Id"
              variant="outlined"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="none"
              inputProps={{
                maxLength: 6,
                minLength: 6,
                autoCorrect: 'off',
                autoCapitalize: 'none',
              }}
              error={error}
              helperText={errorText}
              onChange={(event) => {
                setStudleId(event.target.value);
              }}
            />
          ) : (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <CircularProgress />
            </Box>
          )}
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: 'space-between',
            display: loading ? 'none' : 'block',
          }}
        >
          <Button
            onClick={async () => {
              const alphabet =
                'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
              if (studleId.value.length !== 6) {
                setErrorText('The ID must be 6 letters long');
                setError(true);
                return;
              }

              const onlyAlphabetRegex = new RegExp(`^[${alphabet}]+$`);

              if (!onlyAlphabetRegex.test(studleId.value)) {
                setErrorText("ID's only contain upper/lowercase letters");
                setError(true);
                return;
              }

              setError(false);
              setErrorText('');
              setLoading(true);

              const data = await fetch(
                BACKEND_URL + '/sharedStudle/' + studleId.value,
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

              const json = await data.json();

              if (json.type == 'error') {
                if (json.data == 'Studle Not Found') {
                  setError(true);
                  setErrorText('Set not found');
                  setLoading(false);
                  return;
                } else if (json.data == 'No acess') {
                  setError(true);
                  setErrorText('Set is not public');
                  setLoading(false);
                  return;
                }
              }

              studyingShared.current = true;
              localStorage.setItem('studyingShared', true);
              sharedSetData.current = JSON.parse(json.data);
              setStudyingSetName(JSON.parse(json.data).name);
              changePage('studySet');
              handleClose();
            }}
          >
            Study Now
          </Button>
          <Button
            onClick={async () => {
              const alphabet =
                'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
              if (studleId.value.length !== 6) {
                setErrorText('The ID must be 6 letters long');
                setError(true);
                return;
              }

              const onlyAlphabetRegex = new RegExp(`^[${alphabet}]+$`);

              if (!onlyAlphabetRegex.test(studleId.value)) {
                setErrorText("ID's only contain upper/lowercase letters");
                setError(true);
                return;
              }

              setError(false);
              setErrorText('');
              setLoading(true);

              const data = await fetch(
                BACKEND_URL + '/sharedStudle/' + studleId.value,
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

              const json = await data.json();

              if (json.type == 'error') {
                if (json.data == 'Studle Not Found') {
                  setError(true);
                  setErrorText('Set not found');
                  setLoading(false);
                  return;
                } else if (json.data == 'No acess') {
                  setError(true);
                  setErrorText('Set is not public');
                  setLoading(false);
                  return;
                }
              }

              let dataStudleNames;

              setLoading(true);

              try {
                dataStudleNames = await fetch(
                  BACKEND_URL +
                    '/studleNames/' +
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

              let newStudleName = JSON.parse(json.data).name;

              const existingStudleNames = (
                await dataStudleNames.json()
              ).data.map((studle) => studle.name);

              if (existingStudleNames.includes(newStudleName)) {
                let nextNumber = 1;
                let newLabel = `${newStudleName} (${nextNumber})`;

                while (existingStudleNames.includes(newLabel)) {
                  nextNumber++;
                  newLabel = `${newStudleName} (${nextNumber})`;
                }

                newStudleName = newLabel;
              }

              json.data = (() => {
                const newData = JSON.parse(json.data);

                newData.name = newStudleName;

                return JSON.stringify(newData);
              })();

              fetch(BACKEND_URL + '/addStudleToUser', {
                method: 'POST',
                credentials: 'include',
                mode: 'cors',
                headers: {
                  'Content-Type': 'application/json',
                  'Access-Control-Allow-Credentials': 'true',
                },
                body: JSON.stringify({
                  encryptedEmail: localStorage.getItem('encryptedEmail'),
                  studleName: newStudleName,
                  data: json.data,
                }),
              }).then(async () => {
                updateRecentSetNames();
                handleClose();
              });
            }}
          >
            Copy & Save
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <Box sx={{ height: 'max-content', width: '100%' }}>
      <StickerLibrary
        open={showStickerDialog}
        stickers={stickers}
        placeSticker={placeSticker}
        removeSticker={removeSticker}
        setOpen={setShowStickerDialog}
        mainTheme={mainTheme}
      />
      <ImportDialouge open={open} handleClose={handleClose}></ImportDialouge>
      <AppBar
        position="sticky"
        color="primary"
        sx={{ height: '3.75rem', zIndex: 1 }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            height: '100%',
          }}
        >
          <Typography
            sx={{
              ...disableTextSelection,
              marginLeft: '0.5em',
              textAlign: 'center',
              fontSize: {
                xl: '2.2em',
                lg: '2.2em',
                md: '2.2em',
                sm: '2em',
                xs: '1.5em',
              },
              marginRight: '0.5em',
            }}
          >
            Studle
          </Typography>
          <Typography
            sx={{
              ...disableTextSelection,
              textAlign: 'center',
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
            Recent Sets
          </Typography>
          <Typography
            sx={{
              ...disableTextSelection,
              visibility: 'hidden',
              marginRight: '0.5em',
              textAlign: 'center',
              fontSize: {
                xl: '2.2em',
                lg: '2.2em',
                md: '2.2em',
                sm: '2em',
                xs: '1.5em',
              },
            }}
          >
            Studle
          </Typography>
        </Box>
      </AppBar>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <RecentSetsBox
          studyingShared={studyingShared}
          handleClickOpen={handleClickOpen}
          setEditingSet={setEditingSet}
          mainTheme={mainTheme}
          handleCreateSetClick={handleCreateSetClick}
          setStudyingSetName={setStudyingSetName}
          setEditingSetName={setEditingSetName}
          changePage={changePage}
          recentSetNames={recentSetNames}
          setRecentSetNames={setRecentSetNames}
          updateRecentSetNames={updateRecentSetNames}
          fetchSetsStatus={fetchSetsStatus}
          setFetchSetsStatus={setFetchSetsStatus}
        />
      </Box>
    </Box>
  );
}

function DisplaySticker(properties) {
  const { mainTheme, id, canPlace, placeSticker, removeSticker } = properties;

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
              ...disableInteraction,
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
          marginBottom: '1em',
        }}
      >
        <Button
          variant="contained"
          color="buttonPrimary"
          onClick={() => {
            if (canPlace) {
              placeSticker(id);
            } else {
              removeSticker(id);
            }
          }}
          sx={{
            borderRadius: '8px',
            fontSize: {
              xl: '1.2em',
              lg: '1.2em',
              md: '1.2em',
              sm: '1.2em',
              xs: '1em',
            },
            width: '100%',
            height: '100%',
            textTransform: 'none',
          }}
        >
          {canPlace ? 'Place' : 'Remove'}
        </Button>
      </Box>
    </Grid>
  );
}

function StickerLibrary(properties) {
  const { open, setOpen, mainTheme, placeSticker, removeSticker, stickers } =
    properties;

  return (
    <Draggable handle="#dialog-main">
      <Dialog
        sx={{ zIndex: 2 }}
        aria-labelledby="dialog-main"
        open={open}
        hideBackdrop={true}
      >
        <DialogTitle
          sx={{
            ...disableTextSelection,
            textAlign: 'center',
            fontSize: '1.5rem',
            fontWeight: 'bold',
          }}
        >
          Your Stickers
        </DialogTitle>
        <DialogContent className={customScrollbarStyles.customScrollContainer}>
          {stickers &&
            stickers.map((sticker, index) => (
              <DisplaySticker
                mainTheme={mainTheme}
                id={sticker.id}
                canPlace={!sticker.enabled}
                placeSticker={placeSticker}
                removeSticker={removeSticker}
                key={index}
              />
            ))}
          {stickers.length === 0 && (
            <Typography
              sx={{
                ...disableTextSelection,
                textAlign: 'center',
                fontSize: '1rem',
                fontWeight: 'bold',
              }}
            >
              You have no stickers! Buy stickers in the market.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            sx={{ textTransform: 'none' }}
            onClick={() => setOpen(false)}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Draggable>
  );
}

async function getRecentSetNames(setFetchSetsStatus) {
  let data;
  try {
    data = await fetch(
      BACKEND_URL +
        '/studleNames/' +
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
    if (json.data == 'User Not Found') {
      setFetchSetsStatus('user_not_found');
      return [];
    }
  }

  setFetchSetsStatus('success');
  return json.data;
}

export { HomePage };
