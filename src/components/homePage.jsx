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

import disableInteraction from '../const/disableInteraction';
import disableTextSelection from '../const/disableTextSelection';
import api from '../lib/api';
import { stickerInfo } from './Market/stickerInfo';
import RecentSetsBox from './RecentSetsBox';
import customScrollbarStyles from './thinScrollbar.module.css';

function HomePage({
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
}) {
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
      <ImportDialouge
        open={open}
        handleClose={handleClose}
        onStudyNowComplete={(json) => {
          studyingShared.current = true;
          sharedSetData.current = json;
          setStudyingSetName(json.data.name);
          changePage('studySet');
        }}
        onCopyAndSaveComplete={() => {
          updateRecentSetNames();
        }}
      ></ImportDialouge>
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

const ImportDialouge = ({
  open,
  handleClose,
  onStudyNowComplete,
  onCopyAndSaveComplete,
}) => {
  const [errorText, setErrorText] = useState('');
  const [studleId, setStudleId] = useState('');
  const [loading, setLoading] = useState(false);
  const hasError = errorText.length > 0;

  const validateStudleId = () => {
    const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const STUDLEID_LENGTH = 6;
    const onlyAlphabetRegex = new RegExp(`^[${alphabet}]+$`);

    try {
      if (studleId.value.length !== STUDLEID_LENGTH) {
        throw new Error('The ID must be 6 letters long');
      } else if (!onlyAlphabetRegex.test(studleId.value)) {
        throw new Error("ID's only contain upper/lowercase letters");
      }

      return true;
    } catch (e) {
      setErrorText(e.message);
      return false;
    }
  };

  const handleApiError = (data) => {
    const errorTypes = {
      'Studle Not Found': 'Set not found',
      'No acess': 'Set is not public',
    };

    const errorMessage = errorTypes[data] ?? '';
    setErrorText(errorMessage);
    setLoading(false);
  };

  const turnOnLoadingBeforeTask = () => {
    setErrorText('');
    setLoading(true);
  };

  const studyNow = async () => {
    if (!validateStudleId()) {
      return;
    }

    turnOnLoadingBeforeTask();

    const json = await api(`/sharedStudle/${studleId.value}`);

    if (json.type === 'error') {
      handleApiError();
      return;
    }

    localStorage.setItem('studyingShared', true);
    handleClose();
    onStudyNowComplete?.(JSON.parse(json.data));
  };

  const copyAndSave = async () => {
    if (!validateStudleId()) {
      return;
    }

    turnOnLoadingBeforeTask();

    const json = await api(`/sharedStudle/${studleId.value}`);
    // as you parsed json.data to object, I parsed it as well
    json.data = JSON.parse(json.data);

    if (json.type === 'error') {
      handleApiError();
      return;
    }

    const dataStudleNames = await api(
      `/studleNames/${encodeURIComponent(
        localStorage.getItem('encryptedEmail')
      )}`
    );

    let newStudleName = json.data.name;
    const existingStudleNames = dataStudleNames.data.map(
      (studle) => studle.name
    );

    if (existingStudleNames.includes(newStudleName)) {
      let nextNumber = 1;
      let newLabel = `${newStudleName} (${nextNumber})`;

      while (existingStudleNames.includes(newLabel)) {
        nextNumber++;
        newLabel = `${newStudleName} (${nextNumber})`;
      }

      newStudleName = newLabel;
    }

    await api('/addStudleToUser', {
      method: 'POST',
      body: JSON.stringify({
        encryptedEmail: localStorage.getItem('encryptedEmail'),
        studleName: newStudleName,
        data: JSON.stringify({ ...json.data, name: newStudleName }),
      }),
    });

    onCopyAndSaveComplete?.();
    handleClose();
  };

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
            error={hasError}
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
        <Button onClick={studyNow}>Study Now</Button>
        <Button onClick={copyAndSave}>Copy & Save</Button>
      </DialogActions>
    </Dialog>
  );
};

async function getRecentSetNames(setFetchSetsStatus) {
  try {
    const json = await api(
      `/studleNames/${encodeURIComponent(
        localStorage.getItem('encryptedEmail')
      )}`
    );
    if (json.type == 'error') {
      if (json.data == 'User Not Found') {
        setFetchSetsStatus('user_not_found');
        return [];
      }
    }

    setFetchSetsStatus('success');
    return json.data;
  } catch (e) {
    console.error(e);
    return null;
  }
}

export { HomePage };
