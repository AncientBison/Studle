// import { Box, Typography, createTheme, ThemeProvider } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Modal from '@mui/material/Modal';
import { ThemeProvider, createTheme, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState, useEffect } from 'react';

import React from 'react';

const robotoTheme = createTheme({
  typography: {
    fontFamily: ['RobotoSlab-Light'].join(','),
  },
});

export function CreateExtraAnswersPage(properties) {
  const { mainTheme, setData, setSetData, addWarning, removeWarning } = properties;
  const [addExtraAnswersModalOpen, setAddExtraAnswersModalOpen] = useState(false);
  const [answerType, setAnswerType] = useState();

  const getAllAnswersForAnswerType = (answerType) => {
    const answers = setData.extraAnswers[answerType] ? setData.extraAnswers[answerType].map(extraAnswer => ({ answer: extraAnswer, editable: true })) : [];

    Object.values(setData.facts).forEach((fact) => {
      const { fact: factString, blanks } = fact;

      blanks.forEach((blank) => {
        const { startIndex, endIndex, answerType: blankAnswerType } = blank;

        if (blankAnswerType === answerType) {
          const answerString = factString.substring(startIndex, endIndex + 1);
          
          if (!answers.find(answer => answer.answer.toLowerCase() === answerString.toLowerCase())) {
            answers.push({ answer: answerString, editable: false });
          }
        }
      });
    });
    
    return answers;
  }

  const getAllAnswerTypes = () => {
    const answerTypes = Object.keys(setData.extraAnswers);

    Object.values(setData.facts).forEach((fact) => {
      const { blanks } = fact;

      blanks.forEach((blank) => {
        const { answerType } = blank;

        if (!answerTypes.includes(answerType)) {
          answerTypes.push(answerType);
        }
      });
    });

    return answerTypes;
  }

  const answerTypeHasAnswer = (answerType, answer) => {
    return getAllAnswersForAnswerType(answerType).find(possibleAnswer => possibleAnswer.answer === answer) ? true : false;
  }

  const addExtraAnswer = (answerType, extraAnswer) => {
    let alreadyInPossibleValues = false;

    setSetData((setData) => {
      let newSetData = { ...setData };
      if (!newSetData.extraAnswers[answerType]) {
        newSetData.extraAnswers[answerType] = [];
      }

      const allAnswersForAnswerType = getAllAnswersForAnswerType(answerType);

      if (!allAnswersForAnswerType.find(answer => answer.answer === extraAnswer)) {
        if (!newSetData.extraAnswers[answerType]) {
          newSetData.extraAnswers[answerType] = [extraAnswer];
        } else {
          setData.extraAnswers[answerType].push(extraAnswer);
        }
      }

      return newSetData;
    });

    setAddExtraAnswersModalOpen(false);

    checkAnswerTypesHaveEnoughAnswers(getAllAnswerTypes());

    return alreadyInPossibleValues;
  }

  const minimumPossibilitiesPerAnswerTypes = 3;
  
  const checkAnswerTypesHaveEnoughAnswers = (answerTypes) => {
    let allAnswerTypesHaveEnoughAnswers = true;
    for (const answerType of answerTypes) {
      const allAnswersForAnswerType = getAllAnswersForAnswerType(answerType);
      if (!(allAnswersForAnswerType.length >= minimumPossibilitiesPerAnswerTypes)) {
        allAnswerTypesHaveEnoughAnswers = false;
      }
    }
    if (allAnswerTypesHaveEnoughAnswers) {
      removeWarning("notEnoughExtraAnswers");
    } else {
      addWarning("notEnoughExtraAnswers");
    }
  }

  useEffect(() => {
    checkAnswerTypesHaveEnoughAnswers(getAllAnswerTypes());
  }, []);

  const removeExtraAnswer = (answerType, value) => {
    let alreadyInPossibleValues = false;

    setSetData((setData) => {
      const index = setData.extraAnswers[answerType].indexOf(value);

      let newSetData = { ...setData };
      newSetData.extraAnswers[answerType].splice(index, 1);

      return newSetData;
    });

    checkAnswerTypesHaveEnoughAnswers(getAllAnswerTypes());

    return alreadyInPossibleValues;
  }

  return (
    <ThemeProvider theme={robotoTheme}>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          borderRadius: '5px',
          borderColor: 'black',
          borderSize: '0.2em',
          marginTop: '1em',
        }}
      >
        <Box sx={{ width: '90%', borderRadius: '5px' }}>
          <Grid container spacing={2} sx={{ justifyContent: 'center' }}>
            {getAllAnswerTypes().map(answerType => {

              return (
                <AnswerType
                  key={answerType}
                  mainTheme={mainTheme}
                  addWarning={addWarning}
                  removeWarning={removeWarning}
                  removeExtraAnswer={removeExtraAnswer}
                  answerTypeName={answerType}
                  possibleAnswers={getAllAnswersForAnswerType(answerType)}
                  addExtraAnswersModalOpen={addExtraAnswersModalOpen}
                  setAddExtraAnswersModalOpen={setAddExtraAnswersModalOpen}
                  setAnswerType={setAnswerType}
                />
              )
            })}
          </Grid>
        </Box>
        <AddExtraAnswersModal
          open={addExtraAnswersModalOpen}
          mainTheme={mainTheme}
          setOpen={setAddExtraAnswersModalOpen}
          addExtraAnswer={addExtraAnswer}
          answerTypeHasAnswer={answerTypeHasAnswer}
          answerType={answerType}
        >

        </AddExtraAnswersModal>
      </Box>
    </ThemeProvider>
  );
}

function AnswerType(properties) {
  const { mainTheme, answerTypeName, possibleAnswers, setAddExtraAnswersModalOpen, setAnswerType, removeExtraAnswer } = properties;

  const answersNeeded = possibleAnswers.filter(answer => !answer.editable);
  const answersEditable = possibleAnswers.filter(answer => answer.editable);

  return (
    <Grid lg={4} md={6} sm={12} xs={12} sx={{
      alignItems: "stretch"
    }}>
      <Box
        sx={{
          border: '3px solid ' + mainTheme.palette.primary.main,
          borderRadius: '5px',
          padding: '0.5em',
          display: 'flex',
          flexDirection: 'column',
          height: "calc(100% - 1em)",
          overflowY: "auto"
        }}
      >
        <Typography sx={{ fontSize: '1.5em', color: mainTheme.palette.background.contrastText }}>{answerTypeName}</Typography>
        {answersNeeded.map(answer => (
          <PossibilityBox
            key={answer.answer}
            mainTheme={mainTheme}
            editable={false}
            answer={answer.answer}
            answerTypeName={answerTypeName}
            removeExtraAnswer={removeExtraAnswer} />
        ))}
        {answersEditable.map(answer => (
          <PossibilityBox
            key={answer.answer}
            mainTheme={mainTheme}
            editable={true}
            answer={answer.answer}
            answerTypeName={answerTypeName}
            removeExtraAnswer={removeExtraAnswer} />
        ))}
        <Button variant="contained" onClick={() => {
          setAddExtraAnswersModalOpen(true);
          setAnswerType(answerTypeName);
        }} sx={{
          backgroundColor: mainTheme.palette.buttonSuccess.main,
          '&:hover': {
            backgroundColor: mainTheme.palette.buttonSuccess.hover,
          }
        }}>
          <AddIcon fontSize="large" />
        </Button>
      </Box>
    </Grid>
  );
}

function PossibilityBox(properties) {
  const { mainTheme, editable, answerTypeName, answer, removeExtraAnswer } = properties;

  return (
    <Box display="flex" sx={{ justifyContent: 'space-between', alignItems: "center", border: '2px solid ' + mainTheme.palette.background.contrastText, marginBottom: '0.3em', padding: '0.15em', height: '3rem' }}>
      <Typography sx={{ lineHeight: 0, color: mainTheme.palette.background.contrastText }}>{answer}</Typography>
      {editable && (
        <IconButton
          onClick={() => {
            removeExtraAnswer(answerTypeName, answer);
          }}
          sx={{  
            height: "1.5em",
            width: "1.5em",
            transform: "translate(0.4em, 0)",
            padding: "0",
            '&:hover': {
              backgroundColor: '#cccccc77',
            },
          }}
        >
          <DeleteIcon sx={{ color: mainTheme.palette.buttonDelete.main }} />
        </IconButton>
      )}
    </Box>
  );
}

function AddExtraAnswersModal(properties) {
  const { mainTheme, open, setOpen, addExtraAnswer, answerTypeHasAnswer, answerType } = properties;

  const [value, setValue] = useState();
  const [warningText, setWarningText] = useState(null);

  return (
    <ThemeProvider theme={robotoTheme} >
      <Modal
        open={open}
        disableAutoFocus={true}
        disableRestoreFocus={true}
        onClose={() => {
          setOpen(false);
        }}>

        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: "70%",
          backgroundColor: mainTheme.palette.popup.main,
          border: `2px solid ${mainTheme.palette.popup.border}`,
          padding: "1em",
        }}>
          <Typography sx={{ fontSize: "4vh", color: mainTheme.palette.popup.contrastText }}>
            Enter Another Answer
          </Typography>
          <TextField
            error={warningText}
            helperText={warningText}
            sx={{
              width: "100%",
              backgroundColor: mainTheme.palette.popup.border,
              "& .MuiInputBase-root": {
                border: "1px solid " + mainTheme.palette.popup.border,
                borderRadius: "0.1em",
              },
              "& .MuiFormHelperText-root": {
                fontSize: "2vh",
                marginLeft: "1em",
              },
            }}
            onChange={(event) => {
              setValue(event.target.value);
              if (answerTypeHasAnswer(answerType, event.target.value)) {
                setWarningText("That answer already exists");
              } else {
                setWarningText(null);
              }
            }}
            inputProps={{
              maxLength: 20,
              style: { padding: "0.3em", textAlign: 'center', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', fontSize: "2em" }
            }}
            autoFocus
          >
          </TextField>
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
          }}>
            <Button
              variant='contained'
              onClick={() => {
                setOpen(false);
              }}
              sx={{
                textTransform: 'none',
                backgroundColor: mainTheme.palette.buttonPrimary.main,
                borderColor: mainTheme.palette.contrastPrimary.main,
                borderWidth: '0.15em',
                color: mainTheme.palette.contrastPrimary.main,
                fontWeight: 'bold',
                marginTop: '3.5%',
              }}>
              Cancel
            </Button>
            <Button
              variant='contained'
              disabled={warningText}
              onClick={() => {
                addExtraAnswer(answerType, value);
              }}
              sx={{
                textTransform: 'none',
                backgroundColor: mainTheme.palette.buttonPrimary.main,
                borderColor: mainTheme.palette.contrastPrimary.main,
                borderWidth: '0.15em',
                color: mainTheme.palette.contrastPrimary.main,
                fontWeight: 'bold',
                marginTop: '3.5%',
              }}>
              Add
            </Button>
          </Box>
        </Box>
      </Modal>
    </ThemeProvider>
  );
}