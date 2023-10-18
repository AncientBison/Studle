import { AppBar, Box, Button, Typography } from '@mui/material';
import { CircularProgress } from '@mui/material';
import { useEffect,useState } from 'react';

import { BACKEND_URL } from '../../const/constants';
import disableTextSelection from '../../const/disableTextSelection';
import { StudySetOptions } from './studySetOptions';
import { StudySetQuestioner } from './studySetQuestioner';
import { StudySetSummary } from './studySetSummary';

function StudySetPage(properties) {
  const {
    mainTheme,
    changePage,
    studyingSetName,
    setStudySetPageInfoPage,
    setStudyingSetName,
    email,
    settingEnabled,
    studyingShared,
    sharedSetData,
  } = properties;
  const [setData, setSetData] = useState();
  const [enabledPaths, setEnabledPaths] = useState([]);
  const [studyMode, setStudyMode] = useState('multiple');
  const [step, setStep] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const [canStartStudying, setCanStartStudying] = useState(true);

  const updateCanStartStudying = (currentEnabledPaths) => {
    if (currentEnabledPaths.length == 0) {
      setCanStartStudying(false);
      return;
    }

    let hasQuestion = false;
    for (const fact of Object.values(setData.facts)) {
      if (enabledPaths.includes(fact.path)) {
        hasQuestion = true;
      }
    }

    if (!hasQuestion) {
      setCanStartStudying(false);
      return;
    }

    setCanStartStudying(true);
  };

  useEffect(() => {
    if (step === 0) {
      setStudySetPageInfoPage('studyOptions');
    } else if (step === 1) {
      setStudySetPageInfoPage('study');
    } else if (step === 2) {
      setStudySetPageInfoPage('studySummary');
    }
  }, [step]);

  useEffect(() => {
    if (!setData) {
      if (!studyingSetName) {
        let studyingSetNameStorage = localStorage.getItem('studyingSetName');
        if (studyingSetNameStorage != 'undefined') {
          setStudyingSetName(studyingSetNameStorage);
        } else {
          changePage('home');
        }
      } else {
        localStorage.setItem('studyingSetName', studyingSetName);

        if (!studyingShared.current) {
          const setId = studyingSetName + '<' + email;
          fetch(
            BACKEND_URL +
              '/studle/' +
              setId +
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
          ).then(async (res) => {
            const json = await res.json();
            const setDataRaw = json.data.data;
            if (setDataRaw) {
              const setDataParsed = JSON.parse(setDataRaw);
              setSetData(setDataParsed);
              setEnabledPaths(setDataParsed.topics.map((topic) => topic.path));
            }
          });
        } else {
          setSetData(sharedSetData.current);
          setEnabledPaths(
            sharedSetData.current.topics.map((topic) => topic.path)
          );
        }
      }
    }
  }, []);

  useEffect(() => {
    if (!setData) {
      if (!studyingShared.current) {
        const setId = studyingSetName + '<' + email;
        fetch(
          BACKEND_URL +
            '/studle/' +
            setId +
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
        ).then(async (res) => {
          const json = await res.json();
          const setDataRaw = json.data.data;
          if (setDataRaw) {
            const setDataParsed = JSON.parse(setDataRaw);
            setSetData(setDataParsed);
            setEnabledPaths(setDataParsed.topics.map((topic) => topic.path));
          }
        });
      } else {
        setSetData(sharedSetData.current);
        setEnabledPaths(
          sharedSetData.current.topics.map((topic) => topic.path)
        );
      }
    }
  }, [studyingSetName]);

  const togglePath = (path) => {
    const currentlyEnabled = pathIsEnabled(path);
    setEnabledPaths((enabledPaths) => {
      if (currentlyEnabled) {
        enabledPaths.splice(enabledPaths.indexOf(path), 1);
      } else {
        enabledPaths.push(path);
      }
      updateCanStartStudying(enabledPaths);
      return enabledPaths;
    });
  };

  const pathIsEnabled = (path) => {
    return enabledPaths.includes(path);
  };

  return (
    <Box sx={{ paddingBottom: '5%' }}>
      <AppBar position="sticky" color="primary" sx={{ height: '3.75em' }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: '100%',
          }}
        >
          <Typography
            marginLeft="0.5em"
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
            onClick={() => changePage('home')}
          >
            Studle
          </Typography>
          <Typography
            style={{ marginRight: '1.5vh' }}
            align="center"
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
          >
            {studyingSetName}
          </Typography>
        </Box>
      </AppBar>
      <Box
        sx={{
          width: '100%',
          marginTop: step !== 1 ? '1.5rem' : '2.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {step == 2 && (
          <Button
            variant="outlined"
            onClick={() => {
              setAnsweredQuestions([]);
              setStep(0);
            }}
            sx={{
              textTransform: 'none',
              marginRight: '1em',
              backgroundColor: mainTheme.palette.buttonPrimary.main,
              borderColor: mainTheme.palette.primary.contrastText,
              borderWidth: '0.15em',
              borderRadius: '10px',
              color: mainTheme.palette.buttonPrimary.contrastText,
              fontWeight: 'bold',
              height: 'calc(100% - 1em)',
              fontSize: {
                xl: '2.5em',
                lg: '2em',
                md: '2em',
                sm: '1.7em',
                xs: '1.5em',
              },
              '&:hover': {
                backgroundColor: mainTheme.palette.buttonPrimary.hover,
                borderColor: mainTheme.palette.primary.contrastText,
                borderWidth: '0.15em',
              },
            }}
          >
            Study Again
          </Button>
        )}
        <Button
          variant="outlined"
          disabled={!canStartStudying}
          onClick={() => {
            if (step + 1 == 3) {
              changePage('home');
            } else {
              setStep(step + 1);
            }
          }}
          sx={{
            textTransform: 'none',
            backgroundColor: mainTheme.palette.buttonPrimary.main,
            borderColor: mainTheme.palette.primary.contrastText,
            borderWidth: '0.15em',
            borderRadius: '10px',
            color: mainTheme.palette.buttonPrimary.contrastText,
            fontWeight: 'bold',
            height: 'calc(100% - 1em)',
            fontSize: {
              xl: '2.5em',
              lg: '2em',
              md: '2em',
              sm: '1.7em',
              xs: '1.5em',
            },
            '&:hover': {
              backgroundColor: mainTheme.palette.buttonPrimary.hover,
              borderColor: mainTheme.palette.primary.contrastText,
              borderWidth: '0.15em',
            },
          }}
        >
          {step == 0 ? 'Start' : step == 1 ? 'Finish Studying' : 'Done'}
        </Button>
      </Box>
      {!setData && (
        <Box display="flex" sx={{ justifyContent: 'center', width: '100%' }}>
          <CircularProgress />
        </Box>
      )}
      {setData && step == 0 && (
        <StudySetOptions
          mainTheme={mainTheme}
          studyMode={studyMode}
          setStudyMode={setStudyMode}
          useLastSetting={enabledPaths.length >= 1}
          topics={setData.topics}
          togglePath={togglePath}
          pathIsEnabled={pathIsEnabled}
        />
      )}
      {setData && step == 1 && (
        <StudySetQuestioner
          mainTheme={mainTheme}
          studyMode={studyMode}
          enabledPaths={enabledPaths}
          setData={setData}
          setStep={setStep}
          answeredQuestions={answeredQuestions}
          setAnsweredQuestions={setAnsweredQuestions}
        />
      )}
      {setData && step == 2 && (
        <StudySetSummary
          mainTheme={mainTheme}
          studyingShared={studyingShared}
          topics={setData.topics}
          setName={studyingSetName}
          pathIsEnabled={pathIsEnabled}
          answeredQuestions={answeredQuestions}
          enabledPaths={enabledPaths}
          settingEnabled={settingEnabled}
        />
      )}
    </Box>
  );
}

export { StudySetPage };
