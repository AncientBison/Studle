import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import {
  Box,
  Button,
  createTheme,
  ThemeProvider,
  Typography,
} from '@mui/material';
import { ToggleButton,ToggleButtonGroup } from '@mui/material';
import { useState } from 'react';

import disableTextSelection from '../../const/disableTextSelection';
import { pathSplitSeparator } from '../CreateSet/createSetPage';

const robotoTheme = createTheme({
  typography: {
    fontFamily: ['RobotoSlab-Light'].join(','),
  },
});

function StudySetOptions(properties) {
  const {
    mainTheme,
    studyMode,
    setStudyMode,
    topics,
    togglePath,
    pathIsEnabled,
    useLastSetting,
  } = properties;

  return (
    <Box
      display="flex"
      alignItems="center"
      flexDirection="column"
      height="85%"
      marginTop="5%"
    >
      <SetModeSelector
        mainTheme={mainTheme}
        studyMode={studyMode}
        setStudyMode={setStudyMode}
      />
      {topics.map((topic) => (
        <StaticTopicBox
          mainTheme={mainTheme}
          topicName={topic.name}
          path={topic.path}
          indent={topic.path.split(pathSplitSeparator).length - 1}
          pathIsEnabled={pathIsEnabled}
          togglePath={togglePath}
          useLastSetting={useLastSetting}
          key={topic.id}
        />
      ))}
    </Box>
  );
}

function SetModeSelector(properties) {
  const { mainTheme, studyMode, setStudyMode } = properties;

  return (
    <ToggleButtonGroup
      value={studyMode}
      exclusive
      onChange={(event, newMode) => {
        if (newMode) {
          setStudyMode(newMode);
        }
      }}
      sx={{
        margin: '0.5em',
        marginBottom: '3em',
        border: `0.08em solid ${mainTheme.palette.contrast.ma}`,
        borderRadius: '9px',
      }}
    >
      <ToggleButton
        value="multiple"
        sx={{
          textTransform: 'none',
          fontSize: '2em',
          color: mainTheme.palette.contrast.main,
          '&.Mui-selected': {
            backgroundColor: mainTheme.palette.buttonPrimary.main,
            color: mainTheme.palette.buttonPrimary.contrastText,
          },
          '&.Mui-selected:hover': {
            backgroundColor: mainTheme.palette.buttonPrimary.hover,
            color: mainTheme.palette.buttonPrimary.contrastText,
          },
          '&:hover': {
            color: mainTheme.palette.contrast.main,
            backgroundColor: mainTheme.palette.contrast.half,
          },
        }}
      >
        Multiple Choice
      </ToggleButton>
      <ToggleButton
        value="written"
        sx={{
          textTransform: 'none',
          fontSize: '2em',
          color: mainTheme.palette.contrast.main,
          '&.Mui-selected': {
            backgroundColor: mainTheme.palette.buttonPrimary.main,
            color: mainTheme.palette.buttonPrimary.contrastText,
          },
          '&.Mui-selected:hover': {
            backgroundColor: mainTheme.palette.buttonPrimary.hover,
            color: mainTheme.palette.buttonPrimary.contrastText,
          },
          '&:hover': {
            color: mainTheme.palette.contrast.main,
            backgroundColor: mainTheme.palette.contrast.half,
          },
        }}
      >
        Written Response
      </ToggleButton>
    </ToggleButtonGroup>
  );
}

function StaticTopicBox(properties) {
  const {
    mainTheme,
    topicName,
    indent,
    path,
    togglePath,
    pathIsEnabled,
    useLastSetting,
  } = properties;
  const [toggled, setToggled] = useState(
    useLastSetting ? pathIsEnabled(path) : true
  );

  return (
    <ThemeProvider theme={robotoTheme}>
      <Box
        sx={{
          backgroundColor: mainTheme.palette.primary.main,
          width: `calc(90% - (1em * ${indent}))`,
          height: '6rem',
          display: 'flex',
          justifyContent: 'center',
          borderRadius: '5px',
          borderBottom: '0.2em solid black',
          marginTop: indent == 0 ? '1em' : '',
          marginLeft: `calc(1em * ${indent})`,
        }}
      >
        <Typography
          sx={{
            ...disableTextSelection,
            fontSize: {
              xl: '4.5em',
              lg: '4em',
              md: '4em',
              sm: '3em',
              xs: '3em',
            },
            width: '100%',
            textAlign: 'center',
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
          }}
        >
          {topicName}
        </Typography>
        <PathToggleButton
          mainTheme={mainTheme}
          path={path}
          togglePath={togglePath}
          toggled={toggled}
          setToggled={setToggled}
        ></PathToggleButton>
      </Box>
    </ThemeProvider>
  );
}

function PathToggleButton(properties) {
  const { mainTheme, path, togglePath, toggled, setToggled } = properties;

  return (
    <Button
      onClick={() => {
        togglePath(path);
        setToggled(!toggled);
      }}
      sx={{
        backgroundColor: toggled
          ? mainTheme.palette.buttonSuccess.main
          : mainTheme.palette.buttonSuccess.disabled,
        width: '3em',
        height: '100%',
        '&:hover': {
          backgroundColor: toggled
            ? mainTheme.palette.buttonSuccess.hover
            : mainTheme.palette.buttonSuccess.hoverDisabled,
        },
      }}
    >
      <KeyboardDoubleArrowRightIcon
        sx={{
          color: mainTheme.palette.contrast.main,
          transition: 'all 300ms',
          transform: toggled ? 'scale(2)' : 'scale(2) rotate(-180deg)',
        }}
      />
    </Button>
  );
}

export { StudySetOptions };
