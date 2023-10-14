import { AppBar, Button, Box, Typography } from '@mui/material';
import { useState, useEffect, useRef, memo } from 'react';

import disableTextSelection from '../disableTextSelection';
import { getCleanSetData } from './getCleanSetData';

import { CreateTopicsPage } from './createTopicsPage';
import { CreateFactsPage } from './createFactsPage';
import { CreateExtraAnswersPage } from './createExtraAnswersPage';

import { BACKEND_URL } from '../constants';

import { testData } from '../testData' // testing data for setData

const pathSplitSeparator = "/S/";
const factSplitSeparator = ":S:";

const CreateSetPage = memo((properties) => {
  const { mainTheme, setCreateSetPageInfoPage, changePage, editingSetName, email } = properties;
  const nextId = useRef(0);
  const [step, setStep] = useState(0);
  const [nextStepButtonEnabled, setNextStepButtonEnabled] = useState(editingSetName ? true : false);
  const [setData, setSetData] = useState({ name: null, topics: [], facts: {}, extraAnswers: {} });
  // const [setData, setSetData] = useState(testData); // For testing data
  const warnings = useRef([]);

  useEffect(() => {
    if (editingSetName) {
      const setId = editingSetName + "<" + email;
      fetch(BACKEND_URL + "/studle/" + setId + "/" + encodeURIComponent(localStorage.getItem("encryptedEmail")), {
        method: "GET",
        credentials: "include",
        mode: 'cors',
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": "true",
        }
      }).then(async res => {
        const json = await res.json();
        const setDataRaw = json.data.data;
        if (setDataRaw) {
          let setDataParsed = JSON.parse(setDataRaw);
          setDataParsed.topics = addIdsToTopics(setDataParsed.topics);
          setSetData(setDataParsed);
          nextId.current = getNextId(setDataParsed);
        }
      });
    }
  }, []);

  const getNextId = (setData) => {
    let lastId = 0;
    for (const topic of setData.topics) {
      if (topic.id > lastId) {
        lastId = topic.id;
      }
    }
    return lastId;
  }

  const addIdsToTopics = (topics) => {
    let newTopics = structuredClone(topics);
    for (const topicName of Object.keys(topics)) {
      const topicData = topics[topicName];
      if (!topicData.id) {
        nextId.current = nextId.current + 1;
        newTopics[topicName].id = nextId.current;
      }
    }
    return newTopics
  };

  const performWarningOperation = (warningOperation) => {
    let newWarnings = [...warnings.current];
    if (warningOperation.startsWith("add:")) {
      const warningId = warningOperation.replace("add:", "", 1);
      if (!warnings.current.includes(warningId)) {
        newWarnings.push(warningId);
      }
    } else if (warningOperation.startsWith("remove:")) {
      const warningId = warningOperation.replace("remove:", "", 1);
      if (warnings.current.includes(warningId)) {
        newWarnings.splice(newWarnings.indexOf(warningId), 1);
      }
    }
    warnings.current = newWarnings;
    updateNextStepButtonEnabled(setData.topics);
  };

  const addWarning = (warningId) => {
    if (!warnings.current.includes(warningId)) {
      performWarningOperation("add:" + warningId);
    }
  }

  const removeWarning = (warningId) => {
    if (warnings.current.includes(warningId)) {
      performWarningOperation("remove:" + warningId);
    }
  }

  const updateNextStepButtonEnabled = (topics) => {
    let buttonEnabled = true;

    if (warnings.current.length != 0) {
      buttonEnabled = false;
    }

    if (setData.name === "") {
      buttonEnabled = false;
    }

    let newTopics = [...topics];

    const extraTopicBoxIndex = newTopics.findIndex((topic) => topic.name == "extraTopicBox" && !topic.path.includes(pathSplitSeparator));
    if (extraTopicBoxIndex != -1) {
      newTopics.splice(extraTopicBoxIndex, 1);
    }

    if (newTopics.length < 1) {
      buttonEnabled = false;
    }

    setNextStepButtonEnabled(buttonEnabled);
  }

  const getSetDataWithoutUnusedAnswserTypes = () => {
    let newExtraAnswers = { ...setData.extraAnswers };
    for (const answerType in setData.extraAnswers) {
      const possibilities = setData.extraAnswers[answerType];
      if (Object.keys(possibilities).length == 0) {
        delete newExtraAnswers[answerType];
      }
    }
    return { ...setData, extraAnswers: newExtraAnswers };
  }

  useEffect(() => {
    if (step == 0) {
      setCreateSetPageInfoPage("createTopics");
      removeWarning("noFacts");
    }
    if (step == 1) {
      setCreateSetPageInfoPage("createFacts");
      removeWarning("notEnoughExtraAnswers");
    }
    if (step == 2) {
      setCreateSetPageInfoPage("createExtraAnswers");
    }
  }, [step]);

  const saveSet = () => {
    if (editingSetName) {
      fetch(BACKEND_URL + "/editStudle", {
        method: "POST",
        credentials: "include",
        mode: 'cors',
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": "true",
        },
        body: JSON.stringify({
          encryptedEmail: localStorage.getItem('encryptedEmail'),
          originalName: editingSetName,
          newName: setData.name,
          data: JSON.stringify(getCleanSetData(getSetDataWithoutUnusedAnswserTypes(setData)))
        })
      }).then(async res => {
        changePage("home");
      });
    } else {
      fetch(BACKEND_URL + "/addStudleToUser", {
        method: "POST",
        credentials: "include",
        mode: 'cors',
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": "true",
        },
        body: JSON.stringify({
          encryptedEmail: localStorage.getItem('encryptedEmail'),
          studleName: setData.name,
          data: JSON.stringify(getCleanSetData(getSetDataWithoutUnusedAnswserTypes(setData)))
        })
      }).then(async res => {
        changePage("home");
      });
    }
  }

  return (
    <Box sx={{ paddingBottom: "5%" }} id={"createSetPage"}>
      <AppBar position='sticky' color="primary" sx={{ height: "3.75rem" }}>
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: "100%",
          height: "100%",
        }}>
          <Typography marginLeft="0.5em" cursor="pointer" sx={{ ...disableTextSelection, cursor: "pointer", fontSize: { xl: "2.2em", lg: "2.2em", md: "2.2em", sm: "1.9em", xs: "1.5em" } }} onClick={() => {
            if (confirm("Leave Page? Your set will not be saved.")) {
              changePage("home");
            }
          }}>
            Studle
          </Typography>
          <Box>
            {step > 0 && (
              <PreviousStepButton mainTheme={mainTheme} step={step} setStep={setStep} />
            )}
            <NextStepButton mainTheme={mainTheme} enabled={nextStepButtonEnabled} step={step} setStep={setStep} saveSet={saveSet} />
          </Box>
        </Box>
      </AppBar>
      {step == 0 && (
        <CreateTopicsPage
          mainTheme={mainTheme}
          setData={setData}
          setSetData={setSetData}
          updateNextStepButtonEnabled={updateNextStepButtonEnabled}
          nextId={nextId}
          addWarning={addWarning}
          removeWarning={removeWarning}
          editingSetName={editingSetName}
          changePage={changePage} />
      )}
      {step == 1 && (
        <CreateFactsPage
          mainTheme={mainTheme}
          setData={getCleanSetData(setData)}
          setSetData={setSetData}
          nextId={nextId}
          addWarning={addWarning}
          removeWarning={removeWarning} />
      )}
      {step == 2 && (
        <CreateExtraAnswersPage
          mainTheme={mainTheme}
          setData={getCleanSetData(setData)}
          setSetData={setSetData}
          nextId={nextId}
          addWarning={addWarning}
          removeWarning={removeWarning} />
      )}
    </Box>
  );
});

function NextStepButton(properties) {
  const { mainTheme, enabled, step, setStep, saveSet } = properties;

  return (
    <Button
      disabled={!enabled}
      onClick={() => {
        if (step + 1 < 3) {
          setStep(step + 1);
        } else {
          saveSet();
        }
      }}
      variant='outlined'
      sx={{
        textTransform: 'none',
        height: "50%",
        backgroundColor: mainTheme.palette.buttonPrimary.main,
        borderColor: mainTheme.palette.primary.contrastText,
        borderWidth: '0.15em',
        marginRight: '1.5vh',
        color: mainTheme.palette.buttonPrimary.contrastText,
        fontWeight: 'bold',
        '&:hover': {
          backgroundColor: mainTheme.palette.buttonPrimary.hover,
          borderColor: mainTheme.palette.primary.contrastText,
          borderWidth: '0.15em',
        },
        '&:disabled': {
          backgroundColor: mainTheme.palette.buttonPrimary.disabled,
        },
      }}>
      {step == 2 ? "Save Set" : "Next Step"}
    </Button>
  )
}

function PreviousStepButton(properties) {
  const { mainTheme, step, setStep } = properties;

  return (
    <Button
      onClick={() => {
        setStep(step - 1);
      }}
      variant='outlined'
      sx={{
        textTransform: 'none',
        height: "50%",
        backgroundColor: mainTheme.palette.buttonPrimary.main,
        borderColor: mainTheme.palette.primary.contrastText,
        borderWidth: '0.15em',
        marginRight: '1.5vh',
        color: mainTheme.palette.buttonPrimary.contrastText,
        fontWeight: 'bold',
        '&:hover': {
          backgroundColor: mainTheme.palette.buttonPrimary.main,
          borderColor: mainTheme.palette.primary.contrastText,
          borderWidth: '0.15em',
        },
      }}>
      Back
    </Button>
  )
}

export { CreateSetPage, pathSplitSeparator, factSplitSeparator };