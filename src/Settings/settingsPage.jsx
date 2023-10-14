import { AppBar, Toolbar, Button, Tooltip, Box, Typography, createTheme, ThemeProvider, useTheme, Switch } from '@mui/material';
import { useState, useEffect } from 'react';

import disableTextSelection from '../disableTextSelection';
import { BACKEND_URL } from '../constants';

function SettingsPage(properties) {
  const { mainTheme, changePage, settings, setSettings } = properties;
  const [newSettings, setNewSettings] = useState(settings);

  const saveSettings = async () => {
    fetch(BACKEND_URL + "/setSettings", {
      method: "POST",
      credentials: "include",
      mode: 'cors',
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": "true",
      },
      body: JSON.stringify({
        ...newSettings,
        encryptedEmail: localStorage.getItem('encryptedEmail')
      })
    }).then(async res => {
      setSettings(newSettings);
    });
  }

  return (
    <Box sx={{ height: "100vh" }} >
      <AppBar position='static' color="primary" sx={{ height: "3.75em" }}>
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: "100%"
        }}>
          <Box marginLeft="0.5em" display="flex">
            <Typography marginLeft="0.25em" cursor="pointer" sx={{ ...disableTextSelection, cursor: "pointer", fontSize: { xl: "2.2em", lg: "2.2em", md: "2.2em", sm: "2em", xs: "1.5em" } }}
              onClick={() => {
                saveSettings();
                changePage("home");
              }}>
              Studle
            </Typography>
          </Box>
          <Typography sx={{ ...disableTextSelection, fontSize: { xl: "2.2em", lg: "2.2em", md: "2.2em", sm: "1.9em", xs: "1.5em" } }} align='center' >
            Settings
          </Typography>
          <Box sx={{
            marginRight: "0.5em",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <Button
              variant='outlined'
              onClick={() => {
                saveSettings();
                changePage("home");
              }}
              sx={{
                textTransform: 'none',
                backgroundColor: mainTheme.palette.buttonPrimary.main,
                borderColor: mainTheme.palette.primary.contrastText,
                borderWidth: '0.15em',
                color: mainTheme.palette.buttonPrimary.contrastText,
                fontWeight: 'bold',
                height: "calc(100% - 1em)",
                fontSize: { xl: "1em", lg: "1em", md: "1em", sm: "1em", xs: "0.8em" },
                '&:hover': {
                  backgroundColor: mainTheme.palette.buttonPrimary.hover,
                  borderColor: mainTheme.palette.primary.contrastText,
                  borderWidth: '0.15em',
                }
              }}>
              Done
            </Button>
          </Box>
        </Box>
      </AppBar>
      <SettingsInputs mainTheme={mainTheme} settings={newSettings} setSettings={setNewSettings} />
    </Box>
  );
}

import { settingsInfo } from './settings';

function SettingsInputs(properties) {
  const { mainTheme, settings, setSettings } = properties;

  const handleChange = (event) => {
    setSettings({
      ...settings,
      [event.target.name]: event.target.checked,
    });
  };

  return (
    <Box margin="2em" width="calc(100%-4em)" >
      {Object.entries(settings).filter(settingEntry => settingsInfo[settingEntry[0]]).map((settingEntry) => (
        <SettingToggle
          mainTheme={mainTheme}
          name={settingsInfo[settingEntry[0]].name}
          id={settingEntry[0]}
          description={settingsInfo[settingEntry[0]].description}
          checked={settingEntry[1]}
          handleChange={handleChange}
          key={settingEntry[0]}
        >
        </SettingToggle>
      ))}
    </Box>
  );
};

function SettingToggle(properties) {
  const { mainTheme, id, name, description, checked, handleChange } = properties;
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <Tooltip open={showTooltip} sx={{ 
      marginTop: "1rem",
      width: "fit-content",
    }} onClose={() => setShowTooltip(false)} onOpen={() => setShowTooltip(true)} title={
      <Typography display="inline">
        {description}
      </Typography>
    }
      placement="right-start">
      <Box display="flex" alignItems="center" onClick={() => setShowTooltip(true)} >
        <Typography display="inline-block" marginRight="1em" sx={{ color: mainTheme.palette.contrast.main, fontSize: "1.5em", fontWeight: "bold", display: "inline-block" }}>
          {name}
        </Typography>
        <Switch name={id} checked={checked} onChange={(event) => {
          handleChange(event);
        }} />
      </Box>
    </Tooltip>
  );
}

export { SettingsPage };