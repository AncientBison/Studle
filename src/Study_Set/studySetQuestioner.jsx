import { Box, Typography, ThemeProvider, createTheme, Button, TextField, useMediaQuery } from '@mui/material';
import { useEffect, useState } from 'react';
import { pathSplitSeparator } from '../Create_Set/createSetPage';
import { LinearProgress } from '@mui/material';

import { sanitize, desanitize } from '../sanitizer';

function StudySetQuestioner(properties) {
  const { mainTheme, studyMode, enabledPaths, setData, setStep, answeredQuestions, setAnsweredQuestions } = properties;
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState();
  const [currentQuestionSplit, setCurrentQuestionSplit] = useState([]);
  const [possibleAnswerButtons, setPossibleAnswerButtons] = useState();
  const [writtenResponseFieldValue, setWrittenResponseFieldValue] = useState("");
  const smallScreenMode = useMediaQuery(mainTheme.breakpoints.down('md'));
  const writtenResponseQuestionInnaccuracy = 0.2;

  useEffect(() => {
    let newQuestions = [];
    for (const factId of Object.keys(setData.facts)) {
      const factData = setData.facts[factId];
      if (enabledPaths.includes(factData.path)) {
        for (const blank of Object.values(factData.blanks)) {
          newQuestions.push({
            question: sanitize(factData.fact.substring(0, blank.startIndex)) + "<BLANK>" + sanitize(factData.fact.substring(blank.endIndex + 1)),
            correctAnswer: factData.fact.substring(blank.startIndex, blank.endIndex + 1),
            answerType: blank.answerType,
            factId: factId,
            factString: factData.fact,
            factPath: factData.path,
          })
        }
      }
    }
    setQuestions(shuffleArray(newQuestions));
    setCurrentQuestionIndex(0);
  }, []);

  useEffect(() => {
    if (questions.length > 0) {
      if (questions[currentQuestionIndex]) {
        const newQuestion = questions[currentQuestionIndex];
        const newQuestionSplit = newQuestion.question.split("<BLANK>").map(questionSegment => desanitize(questionSegment));
        setCurrentQuestionSplit(newQuestionSplit);

        if (studyMode === "multiple") {
          setPossibleAnswerButtons(getPossibleAnswerButtons());
        }
      } else {
        setQuestions(shuffleArray(questions));
        setStep(2);
      }
    }
  }, [currentQuestionIndex]);

  const submitMultipleChoiceAnswer = (answer) => {
    const answerCorrect = (answer.toLowerCase() === questions[currentQuestionIndex].correctAnswer.toLowerCase());
    setAnsweredQuestions(answeredQuestions => [...answeredQuestions, { ...questions[currentQuestionIndex], correct: answerCorrect, answer: answer }]);
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  }

  const submitWrittenAnswer = (answer) => {
    const correctAnswer = questions[currentQuestionIndex].correctAnswer;
    const answerCorrect = (levenshteinDistance(answer, correctAnswer) / correctAnswer.length) < writtenResponseQuestionInnaccuracy;
    setAnsweredQuestions(answeredQuestions => [...answeredQuestions, { ...questions[currentQuestionIndex], correct: answerCorrect, answer: answer }]);
    setCurrentQuestionIndex(currentQuestionIndex + 1);
    setWrittenResponseFieldValue("");
  }

  const getPossibleAnswerButtons = () => {
    let possibleAnswerButtons = [];

    const possibleAnswers = getPossibleAnswers(setData, questions[currentQuestionIndex].answerType, 4);

    if (!possibleAnswers.includes(questions[currentQuestionIndex].correctAnswer)) {
      possibleAnswers.splice(0, 1);
      possibleAnswers.push(questions[currentQuestionIndex].correctAnswer);
    }

    for (const possibleAnswer of possibleAnswers) {
      possibleAnswerButtons.push(
        <Button onClick={() => submitMultipleChoiceAnswer(possibleAnswer)} variant="contained"
          sx={{
            margin: "0.6em",
            width: (possibleAnswers.length != 3 ? "calc(50% - 1.2em)" : "calc(100% - 1.2em)"),
            height: (possibleAnswers.length < 3 ? "calc(100% - 1.2em)" : (possibleAnswers.length == 3 ? "calc(33% - 1.2em)" : "calc(50% - 1.2em)")),
            backgroundColor: mainTheme.palette.buttonPrimary.main,
            '&:hover': {
              backgroundColor: mainTheme.palette.buttonPrimary.hover,
            }
          }}
          key={currentQuestionIndex + pathSplitSeparator + sanitize(possibleAnswer)}
        >
          <Typography sx={{ fontSize: { xl: "3em", lg: "3em", md: "3em", sm: "2.5em", xs: "1.5em" }, textTransform: "none", overflow: "hidden", textOverflow: "ellipsis" }}>
            {possibleAnswer[0].toUpperCase() + possibleAnswer.replace(possibleAnswer[0], "")}
          </Typography>
        </Button>
      );
    }

    return possibleAnswerButtons;
  }

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        borderRadius: "10px",
      }}
    >
      {questions.length > 0 && (
        <LinearProgress variant="determinate" value={currentQuestionIndex / questions.length * 100}
          sx={{
            width: "100%",
            position: "absolute",
            height: "3vh",
            top: "3.75rem",
            '& .MuiLinearProgress-bar': {
              backgroundColor: mainTheme.palette.progressColors.progressColor,
            },
          }}
        />
      )}
      <Box
        width="100%"
        display="flex"
        sx={{
          marginTop: "2.5rem",
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "wrap",
          maxHeight: "25vh",
          overflow: "auto",
        }}
      >
        
        {(currentQuestionSplit[0] ?? "").split(" ").map((word, index) => {
          if (word.length >= 1) {
            return (
              <Box display="flex" key={index * 2}>
                <Typography display="inline-block" sx={{
                  fontSize: { xl: "3rem", lg: "3rem", md: "3rem", sm: "2.5rem", xs: "1.5rem" },
                  textAlign: 'center',
                  display: 'inline-block',
                }}>
                  {word}
                </Typography>
                <Box width="1rem" height="50%" />
              </Box>
            ); 
          }
        })}
    
        {studyMode === "multiple" ? 
          <Typography sx={{ 
            fontSize: { xl: "3em", lg: "3em", md: "3em", sm: "2.5em", xs: "1.5em" },
            textAlign: 'center',
            display: 'inline-block'
          }}>
            _____
          </Typography>
          
          : (questions[currentQuestionIndex] ?
          <WrittenResponseField
            mainTheme={mainTheme}
            answers={getPossibleAnswers(setData, questions[currentQuestionIndex].answerType)}
            value={writtenResponseFieldValue}
            setValue={setWrittenResponseFieldValue}
            submitWrittenAnswer={submitWrittenAnswer}
          /> : ""
        )}

        {(currentQuestionSplit[1] ?? "").startsWith(" ") && (
          <Box width="1rem" height="50%" />
        )}

        {(currentQuestionSplit[1] ?? "").trim().split(" ").map((word, index) => {
          return (
            <Box display="flex" key={index * 2 + 1}>
              <Typography display="inline-block" sx={{
                fontSize: { xl: "3rem", lg: "3rem", md: "3rem", sm: "2.5rem", xs: "1.5rem" },
                textAlign: 'center',
                display: 'inline-block',
              }}>
                {word}
              </Typography>
              <Box width="1rem" height="50%" />
            </Box>
          );
        })}
        
      </Box>
      {studyMode === "written" && !smallScreenMode && (
        <Button
          variant='contained'
          disabled={writtenResponseFieldValue === ""}
          onClick={() => {
            submitWrittenAnswer(writtenResponseFieldValue);
          }}
          sx={{
            textTransform: 'none',
            marginTop: "5rem",
            backgroundColor: mainTheme.palette.buttonPrimary.main,
            borderColor: mainTheme.palette.primary.contrastText,
            borderWidth: '0.15em',
            color: mainTheme.palette.buttonPrimary.contrastText,
            fontWeight: 'bold',
            height: "20%",
            width: "50%",
            fontSize: { xl: "3em", lg: "2.7em", md: "2.7em" },
            '&:hover': {
              backgroundColor: mainTheme.palette.buttonPrimary.hover,
              borderColor: mainTheme.palette.primary.contrastText,
              borderWidth: '0.15em',
            }
          }}>
          Submit
        </Button>
      )}
      {questions.length > 0 && (
        <Box display="flex" width="100%" height="50%" position="fixed" sx={{ flexDirection: "row", bottom: 0, justifyContent: 'center', flexWrap: "wrap", marginTop: "20vh", marginLeft: "1em", marginRight: "1em" }}>
          {studyMode === "multiple" && possibleAnswerButtons}
          {studyMode === "written" && smallScreenMode && (
            <Button
              variant='contained'
              onClick={() => {
                submitWrittenAnswer(writtenResponseFieldValue);
              }}
              sx={{
                textTransform: 'none',
                backgroundColor: mainTheme.palette.buttonPrimary.main,
                borderColor: mainTheme.palette.primary.contrastText,
                borderWidth: '0.15em',
                color: mainTheme.palette.buttonPrimary.contrastText,
                fontWeight: 'bold',
                height: "40%",
                position: "fixed",
                bottom: 0,
                width: "100%",
                fontSize: { sm: "4rem", xs: "4rem" },
                '&:hover': {
                  backgroundColor: mainTheme.palette.buttonPrimary.hover,
                  borderColor: mainTheme.palette.primary.contrastText,
                  borderWidth: '0.15em',
                }
              }}>
              Submit
            </Button>
          )}
        </Box>
      )}
    </Box>
  );
}

const levenshteinDistance = (first, second) => {
  const str1 = first.toLowerCase();
  const str2 = second.toLowerCase();
  const track = Array(str2.length + 1).fill(null).map(() =>
  Array(str1.length + 1).fill(null));
  for (let i = 0; i <= str1.length; i += 1) {
    track[0][i] = i;
  }
  for (let j = 0; j <= str2.length; j += 1) {
    track[j][0] = j;
  }
  for (let j = 1; j <= str2.length; j += 1) {
    for (let i = 1; i <= str1.length; i += 1) {
       const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
       track[j][i] = Math.min(
          track[j][i - 1] + 1,
          track[j - 1][i] + 1,
          track[j - 1][i - 1] + indicator,
       );
    }
  }
  return track[str2.length][str1.length];
};

function WrittenResponseField(props) {
  const { mainTheme, answers, value, setValue, submitWrittenAnswer } = props;
  const [fontSize, setFontSize] = useState("1em");
  const big = useMediaQuery(mainTheme.breakpoints.up('md'));
  const med = useMediaQuery(mainTheme.breakpoints.up('sm'));

  useEffect(() => {
    setFontSize(big ? "3rem" : (med ? "2.5rem" : "1.5rem"));
  });

  return (
    <TextField autoFocus value={value} onChange={(event) => setValue(event.target.value)} autoComplete="one-time-code" autoCapitalize='off' spellCheck="false"
      onKeyPress={(event) => {
        if (event.key === "Enter") {
          submitWrittenAnswer(event.target.value);  
        }
      }} variant="standard" sx={{
        width: displayTextWidth(answers, `${fontSize} ` + mainTheme.typography.fontFamily),
      }}
      inputProps={{ autoCapitalize: 'off', autoComplete: "one-time-code", autoCorrect: "false", spellCheck: "false", sx: { fontSize: fontSize, padding: 0, margin: 0 } }}
    >

    </TextField>
  );
}

function displayTextWidth(answers, font) {
  const lengths = [];
  for (const answer of answers) {
    let canvas = displayTextWidth.canvas || (displayTextWidth.canvas = document.createElement("canvas"));
    let context = canvas.getContext("2d");
    context.font = font;
    let metrics = context.measureText(answer);
    lengths.push(metrics.width);
  }

  return Math.max(...lengths);
}

function getAnswerTypes(setData) {
  const answerTypes = {};

  Object.values(setData.facts).forEach(fact => {
    const { fact: factValue, blanks } = fact;

    blanks.forEach(blank => {
      const { startIndex, endIndex, answerType } = blank;

      const value = factValue.substring(startIndex, endIndex + 1);

      if (!answerTypes[answerType]) {
        answerTypes[answerType] = [value];
      } else {
        if (!answerTypes[answerType].find(answer => answer.toLowerCase() === value.toLowerCase())) {
          answerTypes[answerType].push(value);
        }
      }
    });
  });

  return answerTypes;
}

function getPossibleAnswers(setData, answerType, limit = 2147483647) {
  let possibleAnswers = [];
  if (setData.extraAnswers[answerType]) {
    possibleAnswers = [...getAnswerTypes(setData)[answerType], ...setData.extraAnswers[answerType]];
  } else {
    possibleAnswers = getAnswerTypes(setData)[answerType];
  }
  return shuffleArray(removeDuplicates(limitArrayLength(possibleAnswers, limit)));
}

function removeDuplicates(array) {
  return array.filter((value, index, self) => self.findIndex((t) => t.toLowerCase() === value.toLowerCase()) === index);
}

function limitArrayLength(array, length) {
  if (array.length <= length) {
    return array;
  } else {
    const shuffledArray = shuffleArray(array);
    return shuffledArray.slice(0, length);
  }
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export { StudySetQuestioner }