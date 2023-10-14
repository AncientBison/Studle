import { Button, Box, Typography, Dialog, DialogContentText, DialogActions, DialogContent, DialogTitle, useMediaQuery, CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import ShareIcon from '@mui/icons-material/Share';
import EditIcon from '@mui/icons-material/Edit';

import disableTextSelection from './disableTextSelection';

export default function RecentSetsBox(properties) {
  const { mainTheme, handleClickOpen, changePage, setStudyingSetName, handleCreateSetClick, setEditingSet, recentSetNames, updateRecentSetNames, fetchSetsStatus, studyingShared } = properties;

  useEffect(() => {
    updateRecentSetNames();
  }, []);

  return (
    <Box sx={{
      marginTop: '1em',
      width: "100%",
      height: "100%",
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      borderRadius: "10px",
    }}>
      <Box sx={{
        width: "100%",
        height: "100%",
        marginBottom: '1em',
        flexWrap: 'wrap',
        display: "flex",
        justifyContent: 'center',
        alignItems: "center"
      }}>
        <Box display="flex"
          sx={{
            width: "70%",
            height: "min(5em, 10vh)",
            marginTop: "2%",
            marginBottom: "2%",
            borderRadius: "5px",
            justifyContent: "space-between",
          }}
        >
          <Button
            variant='contained'
            onClick={handleCreateSetClick}
            sx={{
              backgroundColor: mainTheme.palette.buttonDarker.main,
              textTransform: 'none',
              color: mainTheme.palette.primary.contrastText,
              fontWeight: 'bold',
              height: "100%",
              width: "48%",
              fontSize: { xl: "2.2em", lg: "2em", md: "1.7em", sm: "1.2em", xs: "0.8em" },
              '&:hover': {
                backgroundColor: mainTheme.palette.buttonPrimary.hover,
              }
            }}>
            Create Set
          </Button>
          <Button
            variant='contained'
            onClick={handleClickOpen}
            sx={{
              backgroundColor: mainTheme.palette.buttonDarker.main,
              textTransform: 'none',
              color: mainTheme.palette.primary.contrastText,
              fontWeight: 'bold',
              height: "100%",
              width: "48%",
              fontSize: { xl: "2.2em", lg: "2em", md: "1.7em", sm: "1.2em", xs: "0.8em" },
              '&:hover': {
                backgroundColor: mainTheme.palette.buttonPrimary.hover,
              }
            }}>
            Import Set
          </Button>
        </Box>
        {recentSetNames.map(set => (
          <RecentSetBox studyingShared={studyingShared} changePage={changePage} setStudyingSetName={setStudyingSetName} setName={set.name} shareId={set.shareId} mainTheme={mainTheme} setEditingSet={setEditingSet} key={set.name}></RecentSetBox>
        ))}
        <Box display="flex" alignItems="center" sx={{
          justifyContent: "center",
          alignItems: 'center',
          width: "100%",
          height: "100%",
          flexDirection: "column"
        }}>
          {recentSetNames.length == 0 && fetchSetsStatus === "success" && (
            <Box display="flex" sx={{ alignItems: "center", flexDirection: "column" }}>
              <Typography sx={{ ...disableTextSelection, fontSize: "4em", textAlign: "center", color: mainTheme.palette.background.contrastText }}>You have no sets!</Typography>
              <Button variant="contained" sx={{ 
                textTransform: "none",
                fontSize: "1.5em",
                width: "50%",
                backgroundColor: mainTheme.palette.buttonDarker.main,
                textTransform: 'none',
                color: mainTheme.palette.primary.contrastText,
                '&:hover': {
                  backgroundColor: mainTheme.palette.buttonPrimary.hover,
                }
              }} onClick={handleCreateSetClick}>Create One</Button>
            </Box>
          )}
          {fetchSetsStatus === "" && (
            <CircularProgress />
          )}
        </Box>
      </Box>
    </Box>
  );
}

function RecentSetBox(properties) {
  const { setName, shareId, changePage, setStudyingSetName, mainTheme, setEditingSet, studyingShared } = properties;

  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const smallScreen = useMediaQuery(mainTheme.breakpoints.down("md"));


  const StudyButton = (properties) => {
    const { setName } = properties;
    const [hovered, setHovered] = useState(false);
    const [showText, setShowText] = useState(false);

    useEffect(() => {
      let timeoutId;

      if (hovered) {
        timeoutId = setTimeout(() => {
          setShowText(true);
        }, 100);
      } else {
        clearTimeout(timeoutId);
        setShowText(false);
      }

      return () => {
        clearTimeout(timeoutId);
      };
    }, [hovered]);

    const handleHover = () => {
      setHovered(!hovered);
    };

    return (
      <Button
        variant="outlined"
        onClick={() => {
          studyingShared.current = false;
          localStorage.setItem("studyingShared", false);
          changePage("studySet");
          setStudyingSetName(setName);
        }}
        sx={{
          border: 'none',
          textTransform: 'none',
          backgroundColor: mainTheme.palette.buttonSuccess.main,
          borderRadius: "0 5px 5px 0",
          transition: 'width 0.3s',
          padding: 0,
          minWidth: 0,
          width: "100%",
          height: "100%",
          '&:hover': {
            border: 'none',
            backgroundColor: mainTheme.palette.buttonSuccess.main,
          },
        }}
        onMouseEnter={handleHover}
        onMouseLeave={handleHover}
      >
        <KeyboardDoubleArrowRightIcon
          color="contrast"
          sx={{
            height: "50%",
            width: "50%",
            transform: hovered ? 'translateX(50%)' : "",
            transition: 'transform 0.3s',
          }}
        />
        {showText && !smallScreen && (
          <Typography
            sx={{
              position: 'absolute',
              top: '50%',
              left: '35%',
              transform: 'translate(-50%, -50%)',
              fontSize: { xl: "1.8rem", lg: "1.1rem", md: "0.8rem", sm: "0.8rem", xs: "0.5rem" },
              fontWeight: 'bold',
              color: mainTheme.palette.buttonSuccess.contrastText2,
            }}
          >
            Study
          </Typography>
        )}
      </Button>
    );
  };

  const ShareDialouge = (properties) => {
    const { open, handleClose, shareId } = properties;
    return (
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <Box display="flex" alignItems="center" flexDirection="column" >
          <DialogTitle id="alert-dialog-title">
            {"Share this set!"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description" sx={{ fontSize: "3em", textAlign: "center" }}>
              {shareId}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button color="primary" onClick={handleClose}>Cancel</Button>
            <Button color="primary" onClick={() => {
              handleClose();
              navigator.clipboard.writeText(shareId);
            }}>
              Copy code
            </Button>
            <Button color="primary" onClick={() => {
              handleClose();
              navigator.share({
                text: "Import my set: " + shareId + ", at",
                title: "Share your set ID.",
                url: "https://studle-old.liambridgers.repl.co/"
              });
            }} autoFocus>
              Share code
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    );
  }

  const ShareButton = (properties) => {
    const { shareId, setShareDialogOpen } = properties;
    const [hovered, setHovered] = useState(false);

    const handleShareClickOpen = () => {
      setShareDialogOpen(true);
    };

    const handleShareClose = () => {
      setShareDialogOpen(false);
    };

    const handleHover = () => {
      setHovered(!hovered);
    };

    return (
      <Button
        variant="outlined"
        onMouseEnter={handleHover}
        onMouseLeave={handleHover}
        onClick={handleShareClickOpen}
        sx={{
          border: "none",
          minWidth: 0,
          backgroundColor: mainTheme.palette.buttonShare.main,
          borderRadius: "5px 0 0 5px",
          padding: 0,
          width: "100%",
          height: "100%",
          '&:hover': {
            backgroundColor: mainTheme.palette.buttonShare.main,
            border: "none"
          },
        }}
      >
        <ShareIcon
          color="contrast"
          sx={{
            height: "40%",
            width: "40%",
            transition: "all 300ms",
            transform: hovered ? "scale(1.2)" : "scale(1)"
          }} />
      </Button>
    );
  };

  const EditButton = (properties) => {
    const { setName, setEditingSet } = properties
    const [hovered, setHovered] = useState(false);

    const handleHover = () => {
      setHovered(!hovered);
    };

    return (
      <Button
        variant="outlined"
        onMouseEnter={handleHover}
        onMouseLeave={handleHover}
        onClick={() => {
          setEditingSet(setName);
        }}
        sx={{
          border: "none",
          minWidth: 0,
          backgroundColor: mainTheme.palette.buttonEdit.main,
          borderRadius: "0px",
          padding: 0,
          width: "100%",
          height: "100%",
          '&:hover': {
            backgroundColor: mainTheme.palette.buttonEdit.main,
            border: "none"
          },
        }}
      >
        <EditIcon
          color="contrast"
          sx={{
            height: "35%",
            width: "35%",
            transition: "all 300ms",
            transform: hovered ? "rotate(-90deg)" : ""
          }} />
      </Button>
    );
  };

  return (
    <Box display="flex"
      sx={{
        backgroundColor: mainTheme.palette.primary.main,
        width: "70%",
        marginTop: "2%",
        marginBottom: "2%",
        borderRadius: "5px",
        justifyContent: "space-between",
      }}
    >
      <ShareDialouge open={shareDialogOpen} handleClose={() => setShareDialogOpen(false)} shareId={shareId}></ShareDialouge>
      <Box sx={{
        width: smallScreen ? "50%" : "70%",
        display: "flex",
        justifyContent: "center"
      }}>
        <Typography width="fit-content" display="flex" sx={{ color: mainTheme.palette.contrast.main, marginLeft: "0.3em", width: "100%", alignItems: 'center', fontSize: { xl: "4.5em", lg: "3.5em", md: "2em", sm: "1.9em", xs: "1.75em" }, overflow: "hidden", ...disableTextSelection }}>
          {setName}
        </Typography>
      </Box>
      <Box display="flex" sx={{ width: smallScreen ? "50%" : "30%", overflow: "auto" }}>
        <ShareButton setName={setName} setEditingSet={setEditingSet} shareId={shareId} setShareDialogOpen={setShareDialogOpen} />
        <EditButton setName={setName} setEditingSet={setEditingSet} />
        <StudyButton setName={setName} />
      </Box>
    </Box>
  );
}