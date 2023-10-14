import './App.css';

import React from 'react';
import { useEffect, useState, useRef, createRef } from 'react';
import { gapi } from 'gapi-script';

import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import SettingsIcon from '@mui/icons-material/Settings'
import MenuIcon from '@mui/icons-material/Menu';
import FeedbackIcon from '@mui/icons-material/Feedback';
import StorefrontIcon from '@mui/icons-material/Storefront';
import LogoutIcon from '@mui/icons-material/Logout';
import AutoAwesomeMotionIcon from '@mui/icons-material/AutoAwesomeMotion';
import HomeIcon from '@mui/icons-material/Home';
import Draggable from 'react-draggable';
import CssBaseline from "@mui/material/CssBaseline";

import { ThemeProvider, Box, SpeedDial, SpeedDialAction, Backdrop, Typography, useMediaQuery } from '@mui/material';

import { CLIENT_ID } from './loginManager';
import { LandingPage } from './landingPage';
import { HomePage } from './homePage';
import { CreateSetPage } from './Create_Set/createSetPage';
import { StudySetPage } from './Study_Set/studySetPage';
import { SettingsPage } from './Settings/settingsPage';
import { MarketPage } from './Market/marketPage';
import disableInteraction from './disableInteraction';

import { InfoDialog } from './infoDialog';

import { BACKEND_URL } from './constants';

import { stickerInfo } from './Market/stickerInfo';
import getPageInfo from './pageInfo';

import { lightTheme, darkTheme } from './themes';


function handleBeforeUnload(e) {
  var confirmationMessage = 'It looks like you have been editing something. '
    + 'If you leave before saving, your changes will be lost.';

  (e || window.event).returnValue = confirmationMessage;
  return confirmationMessage;
}

function App() {
  const [signedInEmail, setSignedInEmail] = useState();
  const [pageName, setPageName] = useState("landing");
  const [studyingSetName, setStudyingSetName] = useState();
  const [editingSetName, setEditingSetName] = useState();
  // const [editingSetName, setEditingSetName] = useState("Cables");  // For testing data
  const [settings, setSettings] = useState({});
  const [mainTheme, setMainTheme] = useState(darkTheme);
  const [infoDialogOpen, setInfoDialogOpen] = useState(false);
  const [createSetPageInfoPage, setCreateSetPageInfoPage] = useState("");
  const [studySetPageInfoPage, setStudySetPageInfoPage] = useState("");
  const [showStickerDialog, setShowStickerDialog] = useState(false);
  const [stickers, setStickers] = useState([]);
  const savedStickers = useRef([]);

  useEffect(() => {
    for (const sticker of stickers) {
      if (savedStickers.current.find(savedSticker => savedSticker.id === sticker.id && (savedSticker.x !== sticker.x || savedSticker.y !== sticker.y || savedSticker.enabled !== sticker.enabled))) {
        saveStickerValues(sticker.id, sticker.x, sticker.y, sticker.enabled);
      }
    }
    savedStickers.current = stickers;
  }, [stickers]);

  const placeSticker = (id) => {
    setStickers(
      stickers.map(sticker => {
        if (sticker.id === id) {
          return { ...sticker, enabled: true, x: 0.5, y: 0.5 };
        } else {
          return sticker;
        }
      }),
    );
  };

  const handleBuySticker = (id) => {
    setStickers(
      [...stickers, { id, enabled: false, x: 0, y: 0 }],
    );
  }

  const moveSticker = (id, x, y) => {
    setStickers(
      stickers.map(sticker => {
        if (sticker.id === id) {
          return { ...sticker, x, y };
        } else {
          return sticker;
        }
      })
    );
  };

  const removeSticker = (id) => {
    setStickers(
      stickers.map(sticker => {
        if (sticker.id === id) {
          return { ...sticker, enabled: false };
        } else {
          return sticker;
        }
      })
    );
  };

  let studyingShared = useRef(false);
  let sharedSetData = useRef({});

  const pageInfo = getPageInfo(mainTheme, useMediaQuery(mainTheme.breakpoints.up('sm')));

  const changePage = (pageName) => {
    setPageName(pageName);
    localStorage.setItem('savedPageName', pageName);
    if (pageName !== "createSet") {
      setEditingSetName(null);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    } else {
      window.addEventListener("beforeunload", handleBeforeUnload);
    }
  }

  const settingEnabled = (settingId) => {
    return settings[settingId] ?? false;
  }

  const fetchUserSettings = async () => {
    setSettings(await getUserSettings());
  }

  useEffect(() => {
    async function start() {
      if ((await verifyTokenAndUser()) === "Success") {
        await fetchUserSettings();
        if (JSON.parse(localStorage.getItem("studyingShared"))) {
          changePage("home");
        }
        setSignedInEmail(localStorage.getItem("email"));
        const savedPageName = localStorage.getItem('savedPageName');
        if (savedPageName) {
          changePage(savedPageName);
        }
      } else {
        changePage("landing");
        gapi.client.init({
          client_id: CLIENT_ID,
          scope: "email"
        })
      }
    }
    gapi.load('client:auth2', start);
  }, []);

  useEffect(() => {
    setMainTheme(settingEnabled("dark_mode") ? darkTheme : lightTheme);
  }, [settings]);

  useEffect(() => {
    if (signedInEmail) {
      fetchUserSettings();
      getOwnedStickers().then(ownedStickers => {
        setStickers(ownedStickers);
      });
    }
  }, [signedInEmail]);

  const calculatePixelWidth = (widthPercentage) => {
    const containerWidth = window.screen.width * 0.8;
    const calculatedWidth = Math.ceil(containerWidth * (widthPercentage / 100));
    return calculatedWidth;
  };

  return (
    <ThemeProvider theme={mainTheme}>
      <CssBaseline />
      {pageName && (
        <InfoDialog open={infoDialogOpen} setOpen={setInfoDialogOpen} mainTheme={mainTheme}
          title={(pageName.replace(pageName.charAt(0), pageName.charAt(0).toUpperCase()) + " Page").replace("Landing Page", "Welcome!").replace("CreateSet", camelCaseToTitleCase(createSetPageInfoPage)).replace("StudySet", camelCaseToTitleCase(studySetPageInfoPage))}
          content={pageName === "createSet" ? (pageInfo[pageName] ? pageInfo[pageName][createSetPageInfoPage] : "") : (pageName === "studySet" ? (pageInfo[pageName] ? pageInfo[pageName][studySetPageInfoPage] : "") : pageInfo[pageName])}
        />
      )}
      <HamburgerMenu pageName={pageName} changePage={changePage} setSettings={setSettings} setShowStickerDialog={setShowStickerDialog} setSignedInEmail={setSignedInEmail} setInfoDialogOpen={setInfoDialogOpen} mainTheme={mainTheme} />
      {pageName === "landing" && (
        <LandingPage mainTheme={lightTheme} signedInEmail={signedInEmail} changePage={changePage} setSignedInEmail={setSignedInEmail} />
      )}
      {pageName === "home" && signedInEmail && (
        <HomePage mainTheme={mainTheme} stickers={stickers} placeSticker={placeSticker} removeSticker={removeSticker} showStickerDialog={showStickerDialog} setShowStickerDialog={setShowStickerDialog} email={signedInEmail} changePage={changePage} setStudyingSetName={setStudyingSetName} setEditingSetName={setEditingSetName} studyingShared={studyingShared} sharedSetData={sharedSetData} />
      )}
      {pageName === "createSet" && signedInEmail && (
        <CreateSetPage mainTheme={mainTheme} changePage={changePage} email={signedInEmail} editingSetName={editingSetName} setCreateSetPageInfoPage={setCreateSetPageInfoPage} />
      )}
      {pageName === "studySet" && signedInEmail && (
        <StudySetPage mainTheme={mainTheme} changePage={changePage} studyingSetName={studyingSetName} setStudySetPageInfoPage={setStudySetPageInfoPage} setStudyingSetName={setStudyingSetName} email={signedInEmail} settingEnabled={settingEnabled} studyingShared={studyingShared} sharedSetData={sharedSetData} />
      )}
      {pageName === "settings" && signedInEmail && (
        <SettingsPage mainTheme={mainTheme} changePage={changePage} settings={settings} setSettings={setSettings} />
      )}
      {pageName === "market" && signedInEmail && (
        <MarketPage mainTheme={mainTheme} changePage={changePage} handleBuySticker={handleBuySticker} />
      )}
      <Box sx={{ width: "100%", height: "100%", position: "absolute", top: 0, pointerEvents: "none", overflow: "hidden" }}>
        {stickers ? stickers.filter(sticker => sticker.enabled && pageName === "home").map((sticker) => {
          const size = calculatePixelWidth(15);
          return (
            <DraggableSticker mainTheme={mainTheme} id={sticker.id} xPos={sticker.x} yPos={sticker.y} size={size} moveSticker={moveSticker} key={sticker.id} />
          );
        }) : ""}
      </Box>
      <style>
        {mainTheme.palette.mode === "dark" ? ":root { color-scheme: dark; }" : ":root { color-scheme: light; }"}
      </style>
    </ThemeProvider>
  );
}

function camelCaseToTitleCase(input) {
  const titleCase = input.replace(/([A-Z])/g, ' $1');

  return titleCase.charAt(0).toUpperCase() + titleCase.slice(1);
}

function HamburgerMenu(properties) {
  const { pageName, changePage, mainTheme, setInfoDialogOpen, setSignedInEmail, setSettings, setShowStickerDialog } = properties;

  const [open, setOpen] = React.useState(false);

  const iconStyle = {
    color: "#000",
    height: "1.5em",
    width: "1.5em",
    color: mainTheme.palette.background.contrastText,
  };

  const actions = [
    {
      icon: <LogoutIcon sx={iconStyle} />, name: 'Logout', run: () => {
        changePage("landing");
        setSignedInEmail("");
        setSettings({});
        localStorage.removeItem("email");
        localStorage.removeItem("encryptedEmail");
      }
    },
    {
      icon: <HomeIcon sx={iconStyle} />, name: 'Home', run: () => {
        if (pageName === "createSet") {
          if (confirm("Leave Page? Your set will not be saved.")) {
            changePage("home");
          }
        } else {
          changePage("home");
        }
      }
    },
    { icon: <HelpOutlineIcon sx={iconStyle} />, name: 'Info', run: () => { setInfoDialogOpen(true) } },
    {
      icon: <SettingsIcon sx={iconStyle} />, name: 'Settings', run: () => {
        if (pageName === "createSet") {
          if (confirm("Leave Page? Your set will not be saved.")) {
            changePage("settings");
          }
        } else {
          changePage("settings");
        }
      }
    },
    { icon: <FeedbackIcon sx={iconStyle} />, name: 'Feedback', run: () => { window.open('https://forms.gle/9KExw4FGXMRUK8uG7', '_blank') } },
    {
      icon: <StorefrontIcon sx={iconStyle} />, name: 'Market', run: () => {
        if (pageName === "createSet") {
          if (confirm("Leave Page? Your set will not be saved.")) {
            changePage("market");
          }
        } else {
          changePage("market");
        }
      }
    },
    { icon: <AutoAwesomeMotionIcon sx={iconStyle} />, name: 'Stickers', run: () => { setShowStickerDialog(true) } }
  ];

  return (
    <Box>
      <Backdrop open={open} sx={{ zIndex: 100 }} />
      <SpeedDial
        ariaLabel="Help/Settings"
        sx={{
          position: 'fixed',
          bottom: "1rem",
          right: "1rem",
          '& .MuiSpeedDial-fab': {
            backgroundColor: mainTheme.palette.buttonDarker.main,
            '&:hover': {
              backgroundColor: mainTheme.palette.buttonPrimary.hover,
            },
          }
        }}
        icon={<MenuIcon sx={{
          transform: open ? "rotate(-90deg)" : "",
          transition: "all 300ms",
          color: mainTheme.palette.background.contrastText,
        }} />}
        onClick={() => setOpen(!open)}
        open={open}
      >
        {actions
          .filter(action =>
            pageName !== "landing" ?
              (action.name === "Stickers" ? pageName === "home" : (action.name.toLowerCase() !== pageName))
              : action.name === "Info")
          .map((action) => (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              tooltipTitle={
                <Typography sx={{ fontWeight: "1000", fontSize: "1.3rem", color: mainTheme.palette.contrast.main }}>
                  {action.name}
                </Typography>
              }
              FabProps={{
                sx: {
                  height: "3rem",
                  width: "3rem",
                  backgroundColor: mainTheme.palette.buttonDarker.main,
                  '&:hover': {
                    backgroundColor: mainTheme.palette.buttonPrimary.hover,
                  }
                },
              }}
              tooltipOpen
              onClick={() => {
                setOpen(false);
                action.run();
              }}
            />
          ))}
      </SpeedDial>
    </Box>
  );
}

async function saveStickerValues(stickerId, x, y, enabled) {
  let data;
  try {
    data = await fetch(BACKEND_URL + "/setStickerValues/" + stickerId + "/" + x + "/" + y + "/" + enabled + "/" + encodeURIComponent(localStorage.getItem("encryptedEmail")), {
      method: "GET",
      credentials: "include",
      mode: 'cors',
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": "true",
      }
    })
  } catch (e) {
    // ignore
  }
  const json = await data.json();

  return json.type;
}

function DraggableSticker(properties) {
  const { mainTheme, id, xPos, yPos, size, moveSticker } = properties;
  const [aspectRatio, setAspectRatio] = useState(1);

  const imageSizePx = Math.ceil(size - (size / 10));

  useEffect(() => {
    const img = new Image();
    img.src = stickerInfo[id].image;

    img.onload = () => {
      const imgAspectRatio = img.height / img.width;
      setAspectRatio(imgAspectRatio);
    };
  }, []);

  return (
    <Draggable width="100%" bounds={"parent"} defaultPosition={{ x: Math.ceil((xPos * window.innerWidth) - (imageSizePx / 2)), y: Math.max(Math.min(Math.ceil((yPos * window.innerHeight) - (imageSizePx / 2)), window.innerHeight - (imageSizePx)), 0) }} onStop={(e, value) => {
      moveSticker(id, (value.x + (imageSizePx / 2)) / window.innerWidth, (value.y + (imageSizePx / 2)) / window.innerHeight);
    }}>
      <Box width={"min-content"} height={"min-content"} sx={{
        // aspectRatio: 1,
        pointerEvents: "auto",
        position: 'absolute',
        display: 'flex',
        boxSizing: "border-box",
        zIndex: 5,
        // justifyContent: 'center',
        // alignItems: 'center',
      }}>
        <img aria-labelledby={id + "/handle"} src={stickerInfo[id].image} style={{ ...disableInteraction, width: (imageSizePx + "px"), height: Math.ceil(aspectRatio * imageSizePx), imageRendering: "pixelated" }} />
      </Box>
    </Draggable>
  );
}

async function getUserSettings() {
  let data;
  try {
    data = await fetch(BACKEND_URL + "/settings/" + encodeURIComponent(localStorage.getItem("encryptedEmail")), {
      method: "GET",
      credentials: "include",
      mode: 'cors',
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": "true",
      }
    })
  } catch (e) {
    // ignore
  }
  const json = await data.json();

  if (json.type == "error") {
    return {};
  }

  return json.data;
}

async function verifyTokenAndUser() {
  let data;
  try {
    data = await fetch(BACKEND_URL + "/verifyTokenAndUser/" + encodeURIComponent(localStorage.getItem("encryptedEmail")), {
      method: "GET",
      credentials: "include",
      mode: 'cors',
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": "true",
      }
    })
  } catch (e) {
    // ignore
  }
  const json = await data.json();

  return json.data;
}

async function getOwnedStickers() {
  let data;
  try {
    data = await fetch(BACKEND_URL + "/ownedStickers/" + encodeURIComponent(localStorage.getItem("encryptedEmail")), {
      method: "GET",
      credentials: "include",
      mode: 'cors',
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": "true",
      }
    })
  } catch (e) {
    // ignore
  }
  const json = await data.json();

  if (json.type == "error") {
    return -1;
  }

  return json.data;
}

export { App };