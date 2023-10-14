import { createTheme } from '@mui/material';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: "#243a62",
      contrastText: "#ededed",
    },
    popup:{
      main: "#121212",
      border: "#666",
      contrastText: "#ccc",
    },
    buttonPrimary: {
      main: "#465b85",
      hover: "#2e4977",
      disabled: "#757575",
      contrastText: "#ededed"
    },
    helpButton: {
      main: "#4D96FF",
      light: "#BDBDBD",
      dark: "#2E69BF",
      contrastText: "#FFF",
    },
    buttonDarker: {
      main: "#243a62",
      hover: "#1b2a45",
      disabled: "#CDCDCD",
      contrastText: "#FFF",
    },
    buttonSuccess: {
      main: "#296b2f",
      hover: "#245b28",
      disabled: "#757575",
      hoverDisabled: "#595959",
      contrastText: "#000",
      contrastText2: "#ededed",
    },
    buttonEdit: {
      main: "#eda228",
    },
    buttonShare: {
      main: "#533991",
    },
    buttonDelete: {
      main: "#803632",
      hover: "#713532",
      contrastText: "#ededed"
    },
    contrast: {
      main: "#ededed",
    },
    contrastPrimary: {
      main: "#000",
    },
    progressColors: {
      lowest: "#b81616",
      low: "#ff2b2b",
      middle: "#ff8000",
      high: "#ffd700",
      highest: "#8ae35b",
      perfect: "#32A852",
      progressColor: "#03C04A",
    },
    mistake: {
      main: "#6d6d6d",
      error: "#803632",
      correct: "#307235",
    },
    fact: {
      main: "#26642c",
    },
    offsetPrimary: {
      main: "#858585"
    },
    background: {
      default: "#121212",
      contrastText: "#ededed",
    },
    stickerTiers: {
      common: "#B0B0B0",
      uncommon: "#33CC33",
      rare: "#3366FF",
      epic: "#9900CC",
      legendary: "#FFD700",
      mythical: "#E06AF7",
      special: "#FF0000",
    }
  },
  typography: {
    fontFamily: [
      'Montserrat-Light'
    ].join(','),
  },
});

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: "#3475CF", 
      contrastText: "#FFF",
      desaturated: "#8FA8C9",
    },
    buttonPrimary: {
      main: "#4D96FF",
      hover: "#2E69BF",
      disabled: "#BDBDBD",
      contrastText: "#FFF",
    },
    helpButton: {
      main: "#4D96FF",
      light: "#BDBDBD",
      dark: "#2E69BF",
      contrastText: "#FFF",
    },
    buttonDarker: {
      main: "#3475CF",
      hover: "#3375D4",
      disabled: "#CDCDCD",
      contrastText: "#FFF",
    },
    buttonSuccess: {
      main: "#3BE357",
      hover: "#32BF49",
      disabled: "#CDCDCD",
      hoverDisabled: "#BBBBBB",
      contrastText: "#FFF",
      contrastText2: "#000",
    },
    buttonEdit: {
      main: "#FFBB00",
    },
    buttonDelete: {
      main: "#FF5555",
      hover: "#DD5555",
      contrastText: "#FFF",
      disabled: "#CDCDCD",
    },
    buttonShare: {
      main: "#7a62a9",
    },
    popup:{
      main: "#fff",
      border: "#000",
      contrastText: "#000"
    },
    contrast: {
      main: "#000",
      half: "#9a9a9a9a",
      halfSolid: "#9a9a9a",
      darkHalf: "#6d6d6d"
    },
    contrastPrimary: {
      main: "#FFF",
    },
    progressColors: {
      lowest: "#b81616",
      low: "#ff2b2b",
      middle: "#ff8000",
      high: "#ffd700",
      highest: "#8ae35b",
      perfect: "#32A852",
      progressColor: "#03C04A",
    },
    mistake: {
      main: "#d9d9d9",
      error: "#ff5555",
      correct: "#3be357",
    },
    fact: {
      main: "#19c243",

    },
    offsetPrimary: {
      main: "#EEEEEE"
    },
    background: {
      default: "#FFF",
      contrastText: "#000"
    },
    stickerTiers: {
      common: "#B0B0B0",
      uncommon: "#33CC33",
      rare: "#3366FF",
      epic: "#9900CC",
      legendary: "#FFD700",
      mythical: "#E06AF7",
      special: "#FF0000",
    }
  },
  typography: {
    fontFamily: [
      'Montserrat-Light'
    ].join(','),
  },
});

export { lightTheme, darkTheme }