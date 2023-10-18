import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Button,
  createTheme,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  ThemeProvider,
  Typography,
} from '@mui/material';
import { CircularProgress, LinearProgress } from '@mui/material';
import moment from 'moment';
import { useEffect, useRef,useState } from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { BACKEND_URL } from '../../const/constants';
import disableTextSelection from '../../const/disableTextSelection';
import { desanitize } from '../../lib/sanitizer';
import { pathSplitSeparator } from '../CreateSet/createSetPage';
import Confetti from './confetti';
import { getSummaryText } from './studySummaryText';

const robotoTheme = createTheme({
  typography: {
    fontFamily: ['RobotoSlab-Light'].join(','),
  },
});

function StudySetSummary(properties) {
  const {
    mainTheme,
    studyingShared,
    topics,
    setName,
    pathIsEnabled,
    answeredQuestions,
    enabledPaths,
    settingEnabled,
  } = properties;
  const [summaryText, setSummaryText] = useState('');
  const [overallScore, setOverallScore] = useState(-1);
  const [ticketDialogOpen, setTicketDialogOpen] = useState(false);
  const [ticketDialogText, setTicketDialogText] = useState('');
  const [overallSetAnalytics, setOverallSetAnalytics] = useState(null);
  const alreadySavedAccuracies = useRef(false);
  const setAccuracies = useRef({});

  const getAccuracyByPath = (path) => {
    let questionCount = 0;
    let questionsCorrect = 0;

    for (const question of answeredQuestions) {
      if (
        question.factPath === path ||
        question.factPath.startsWith(path + pathSplitSeparator)
      ) {
        questionCount += 1;
        if (question.correct) {
          questionsCorrect += 1;
        }
      }
    }

    if (questionCount == 0) {
      return null;
    }

    return Math.round((questionsCorrect / questionCount) * 100);
  };

  const addAccuracyToSetAccuracies = async (path, accuracy) => {
    if (!Object.keys(setAccuracies.current).includes(path)) {
      setAccuracies.current = {
        ...setAccuracies.current,
        [path]: accuracy,
      };
    }
  };

  const getIndentByPath = (path) => {
    let indent = 0;

    const pathParts = path.split(pathSplitSeparator);

    let section = '';
    for (let i = 0; i < pathParts.length; i++) {
      if (section !== '') {
        section += pathSplitSeparator;
      }
      section += pathParts[i];
      if (section === path) {
        continue;
      }
      if (enabledPaths.includes(section)) {
        indent++;
      }
    }

    return indent;
  };

  const getIncorrectQuestionsByPath = (path) => {
    const questionsInPath = [];

    for (const question of answeredQuestions) {
      if (question.factPath === path) {
        questionsInPath.push(question);
      }
    }

    const incorrectQuestions = questionsInPath.filter(
      (question) => !question.correct
    );
    const incorrectQuestionsFormatted = incorrectQuestions.map((question) => ({
      question: question.question,
      correctAnswer: question.correctAnswer,
      answer: question.answer,
    }));

    return incorrectQuestionsFormatted ?? [];
  };

  const addEarnedTickets = async (questionsCorrect) => {
    if (questionsCorrect > 0) {
      let data;

      try {
        data = await fetch(
          BACKEND_URL +
            '/addTickets/' +
            questionsCorrect +
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
        );
      } catch (e) {
        // ignore
      }

      const json = await data.json();

      if (json.type == 'error') {
        setTicketDialogText(
          "There was an error while trying to set your tickets. We're sorry for the inconvenience. If the issue persists, please use the feedback form in the hamburger menu."
        );
      } else {
        let text = '';
        if (json.data.overflow < questionsCorrect) {
          text =
            'You earned ' +
            questionsCorrect +
            (questionsCorrect !== 1 ? ' tickets.' : ' ticket.');
          setTicketDialogOpen(true);
        }
        if (json.data.overflow > 0) {
          if (text.length > 0) {
            text += ' ';
          }
          text +=
            'You have reached the maximum number of tickets you can earn today. You can earn more tomorrow!';
        }
        setTicketDialogText(text);
      }
    }
  };

  useEffect(() => {
    let newOverallScore = null;

    let questionCount = 0;
    let questionsCorrect = 0;

    for (const question of answeredQuestions) {
      questionCount += 1;
      if (question.correct) {
        questionsCorrect += 1;
      }
    }

    if (questionCount != 0) {
      newOverallScore = Math.round((questionsCorrect / questionCount) * 100);
    }

    if (summaryText === '' && newOverallScore != null) {
      setSummaryText(getSummaryText(newOverallScore));
      addEarnedTickets(questionsCorrect);
    }

    setOverallScore(newOverallScore);

    addAccuracyToSetAccuracies('overallScore', newOverallScore);

    for (const topic of topics) {
      if (topic.path.split(pathSplitSeparator).length === 1) {
        addAccuracyToSetAccuracies(topic.path, getAccuracyByPath(topic.path));
      }
    }

    const saveAnalytics = async () => {
      setOverallSetAnalytics(
        await saveSetAccuraciesAndGetChartData(setName, setAccuracies.current)
      );
    };

    if (!alreadySavedAccuracies.current) {
      alreadySavedAccuracies.current = true;
      if (!studyingShared.current) {
        saveAnalytics();
      }
    }
  }, []);

  return (
    <ThemeProvider theme={robotoTheme}>
      <TicketDialog
        mainTheme={mainTheme}
        open={ticketDialogOpen}
        setOpen={setTicketDialogOpen}
        text={ticketDialogText}
      />
      {overallScore == 100 && settingEnabled('show_confetti') && <Confetti />}
      <Typography
        marginBottom="0.7em"
        marginTop="1em"
        sx={{
          ...disableTextSelection,
          fontSize: { xl: '3em', lg: '3em', md: '3em', sm: '2em', xs: '1.5em' },
          textAlign: 'center',
        }}
      >
        {summaryText}
      </Typography>
      <Box
        display="flex"
        sx={{ flexDirection: 'column', justifyContent: 'center' }}
      >
        <Typography
          sx={{ ...disableTextSelection, fontSize: '3em', textAlign: 'center' }}
        >
          {overallScore != null ? `${overallScore}%` : 'No Questions Answered'}
        </Typography>
        <Box display="flex" sx={{ justifyContent: 'center' }}>
          {overallScore != null && overallScore !== -1 && (
            <LinearProgress
              variant="determinate"
              value={overallScore > 0 ? overallScore : 100}
              sx={{
                width: '80%',
                height: '3vh',
                borderRadius: '5px',
                '& .MuiLinearProgress-bar': {
                  backgroundColor:
                    overallScore < 60
                      ? mainTheme.palette.progressColors.lowest
                      : overallScore < 70
                      ? mainTheme.palette.progressColors.low
                      : overallScore < 80
                      ? mainTheme.palette.progressColors.middle
                      : overallScore < 90
                      ? mainTheme.palette.progressColors.high
                      : overallScore < 93
                      ? mainTheme.palette.progressColors.highest
                      : mainTheme.palette.progressColors.perfect,
                },
              }}
            />
          )}
        </Box>
      </Box>
      <Box
        display="flex"
        alignItems="center"
        flexDirection="column"
        height="85%"
        marginTop="2%"
      >
        {topics
          .filter((topic) => pathIsEnabled(topic.path))
          .map((topic) => {
            const accuracy = getAccuracyByPath(topic.path);

            return (
              <StaticTopicBox
                mainTheme={mainTheme}
                topicName={topic.name}
                path={topic.path}
                indent={getIndentByPath(topic.path)}
                accuracy={accuracy}
                incorrectQuestions={getIncorrectQuestionsByPath(topic.path)}
                addAccuracyToSetAccuracies={addAccuracyToSetAccuracies}
                key={topic.id}
              />
            );
          })}
        {!studyingShared.current &&
          ((overallSetAnalytics ?? []).length >= 2 ? (
            <Box
              sx={{ marginTop: '2rem', width: '100%', height: 'max-content' }}
            >
              <SetAnalyticsGraph data={overallSetAnalytics} topics={topics} />
            </Box>
          ) : (
            <Typography
              sx={{
                ...disableTextSelection,
                marginTop: '2rem',
                fontSize: '1.5rem',
                textAlign: 'center',
              }}
            >
              Study this set again to view analytics
            </Typography>
          ))}
      </Box>
    </ThemeProvider>
  );
}

const SetAnalyticsTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <Box
        sx={{
          width: '10rem',
          minHeight: '6rem',
          backgroundColor: '#fff',
          borderRadius: '4px',
          border: '1px solid #cdcdcd',
        }}
      >
        <Typography sx={{ textAlign: 'left', marginLeft: '0.5rem' }}>
          {formatDate(payload[0].payload[pathSplitSeparator + 'date'])}
        </Typography>
        {Object.entries(payload[0].payload).map(([key, value]) => {
          if (key === pathSplitSeparator + 'date') return;
          if (key === 'overallScore') {
            return (
              <Typography
                sx={{
                  textAlign: 'left',
                  marginLeft: '0.5rem',
                  fontSize: '0.8rem',
                  fontWeight: 'bold',
                  color: getDistinctHashedColor('overallScore'),
                }}
                key={key}
              >
                Overall Score: {value}%
              </Typography>
            );
          }
          return (
            <Typography
              sx={{
                textAlign: 'left',
                marginLeft: '0.5rem',
                fontSize: '0.8rem',
                fontWeight: 'bold',
                color: getDistinctHashedColor(key),
              }}
              key={key}
            >
              {desanitize(key)}: {value}%
            </Typography>
          );
        })}
      </Box>
    );
  }

  return null;
};

function SetAnalyticsGraph(properties) {
  const { data, topics } = properties;

  return (
    <ResponsiveContainer width="100%" aspect={3}>
      <LineChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey={pathSplitSeparator + 'date'}
          tickFormatter={formatDate}
        />
        <YAxis tickFormatter={formatAccuracy} />
        <Tooltip content={<SetAnalyticsTooltip />} />
        <Legend
          payload={[
            ...topics
              .filter((topic) => {
                if (topic.path.split(pathSplitSeparator).length !== 1) {
                  return false;
                }
                if (data[data.length - 1][topic.path] === undefined) {
                  return false;
                }

                return true;
              })
              .map((topic) => ({
                id: desanitize(topic.path),
                type: 'square',
                value: desanitize(topic.path),
                color: getDistinctHashedColor(topic.path),
              })),
            {
              id: 'overallScore',
              type: 'square',
              value: 'Overall Score',
              color: getDistinctHashedColor('overallScore'),
            },
          ]}
        />
        <Line
          type="monotone"
          name={'Overall Score'}
          dataKey={'overallScore'}
          stroke={getDistinctHashedColor('overallScore')}
          activeDot={{ r: 8 }}
        />
        {topics.map((topic, index) => {
          if (topic.path.split(pathSplitSeparator).length > 1) {
            return;
          }

          return (
            <Line
              type="monotone"
              name={desanitize(topic.path)}
              stroke={getDistinctHashedColor(topic.path)}
              dataKey={topic.path}
              activeDot={{ r: 8 }}
              key={index}
            />
          );
        })}
      </LineChart>
    </ResponsiveContainer>
  );
}

function formatAccuracy(accuracy) {
  return `${accuracy}%`;
}

function formatDate(dateMs) {
  return moment(dateMs).local().format('MMM Do [at] h:mm a');
}

function djb2Hash(str) {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 33) ^ str.charCodeAt(i);
  }
  return hash >>> 0;
}

function getBrightness(hexColor) {
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);

  const brightness = 0.299 * r + 0.587 * g + 0.114 * b;

  return brightness;
}

function getDistinctHashedColor(input) {
  if (typeof input !== 'string') {
    input = String(input);
  }

  let color;
  let attempts = 0;

  do {
    const hash = djb2Hash(input + attempts);
    const hexColor = (hash & 0x00ffffff).toString(16).toUpperCase();
    color = `#${'00000'.substring(0, 6 - hexColor.length) + hexColor}`;
    attempts++;
  } while (getBrightness(color) > 200);

  return color;
}

function TicketDialog(properties) {
  const { mainTheme, open, setOpen, text } = properties;
  return (
    <Dialog open={open}>
      <DialogTitle sx={{ fontWeight: 'bold' }}>
        Adding your tickets...
      </DialogTitle>
      <DialogContent>
        <DialogContentText
          sx={{ color: mainTheme.palette.contrast.main, fontWeight: 'bold' }}
        >
          {text}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          sx={{
            textTransform: 'none',
            backgroundColor: mainTheme.palette.buttonPrimary.main,
            '&:hover': {
              backgroundColor: mainTheme.palette.buttonPrimary.hover,
            },
          }}
          onClick={() => setOpen(false)}
        >
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function StaticTopicBox(properties) {
  const {
    mainTheme,
    topicName,
    indent,
    accuracy,
    incorrectQuestions,
  } = properties;

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
          borderBottom: `0.2em solid ${mainTheme.palette.contrast.main}`,
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
              md: '3em',
              sm: '2em',
              xs: '2em',
            },
            width: '100%',
            textAlign: 'center',
            overflow: 'hidden',
            whiteSpace: 'pre-wrap',
          }}
        >
          {topicName}
        </Typography>
        <Box
          margin="0.5em"
          position="relative"
          sx={{ alignItems: 'center', justifyContent: 'center' }}
        >
          {accuracy !== null && accuracy !== undefined ? (
            <Box
              display="flex"
              sx={{ alignItems: 'center', justifyContent: 'center' }}
            >
              <CircularProgress
                size="calc(6rem - 1em)"
                variant="determinate"
                value={accuracy > 0 ? accuracy : 100}
                sx={{
                  color:
                    accuracy < 60
                      ? mainTheme.palette.progressColors.lowest
                      : accuracy < 70
                      ? mainTheme.palette.progressColors.low
                      : accuracy < 80
                      ? mainTheme.palette.progressColors.middle
                      : accuracy < 90
                      ? mainTheme.palette.progressColors.high
                      : accuracy < 93
                      ? mainTheme.palette.progressColors.highest
                      : mainTheme.palette.progressColors.perfect,
                  height: '6rem',
                }}
              />
              <Typography
                position="absolute"
                sx={{
                  ...disableTextSelection,
                  textAlign: 'center',
                  fontSize: {
                    xl: '1.7em',
                    lg: '1.7em',
                    md: '1.7em',
                    sm: '1.5em',
                    xs: '1.25em',
                  },
                  fontWeight: 'bold',
                }}
              >
                {accuracy}%
              </Typography>
            </Box>
          ) : (
            <Typography
              sx={{
                ...disableTextSelection,
                fontSize: {
                  xl: '2em',
                  lg: '2em',
                  md: '1.7em',
                  sm: '1.5em',
                  xs: '1.25em',
                },
                width: '100%',
                textAlign: 'center',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                whiteSpace: 'pre-wrap',
              }}
            >
              No Questions Answered
            </Typography>
          )}
        </Box>
      </Box>
      {incorrectQuestions.map((question) => (
        <IncorrectQuestionBox
          mainTheme={mainTheme}
          question={question}
          indent={indent + 1}
          key={question.question}
        />
      ))}
    </ThemeProvider>
  );
}

function IncorrectQuestionBox(properties) {
  const { mainTheme, question, indent } = properties;

  const questionWords = question.question
    .split(/(<BLANK>|\s+)/)
    .filter(Boolean)
    .filter((word) => word !== '  ');
  const questionButtons = [
    ...questionWords.map((word, index) => (
      <Typography
        key={index * 3}
        sx={{
          ...disableTextSelection,
          fontSize: {
            xl: '1.6em',
            lg: '1.3em',
            md: '1em',
            sm: '0.8em',
            xs: '0.8em',
          },
          marginLeft: '0.2em',
          fontWeight: 'bold',
          borderBottom: word.includes('<BLANK>')
            ? `0.2em solid ${mainTheme.palette.mistake.error}`
            : `0.2em solid ${mainTheme.palette.mistake.main}`,
        }}
      >
        {word === '<BLANK>' ? question.answer : desanitize(word)}
      </Typography>
    )),
    <Typography
      key={-3}
      sx={{
        ...disableTextSelection,
        fontSize: {
          xl: '1.6em',
          lg: '1.3em',
          md: '1em',
          sm: '0.8em',
          xs: '0.8em',
        },
        marginLeft: '0.2em',
        fontWeight: 'bold',
      }}
    >
      (Correct Answer:
    </Typography>,
    <Typography
      key={-2}
      sx={{
        ...disableTextSelection,
        fontSize: {
          xl: '1.6em',
          lg: '1.3em',
          md: '1em',
          sm: '0.8em',
          xs: '0.8em',
        },
        marginLeft: '0.2em',
        fontWeight: 'bold',
        borderBottom: `0.2em solid ${mainTheme.palette.mistake.correct}`,
      }}
    >
      {question.correctAnswer}
    </Typography>,
    <Typography
      key={-1}
      sx={{
        ...disableTextSelection,
        fontSize: {
          xl: '1.6em',
          lg: '1.3em',
          md: '1em',
          sm: '0.8em',
          xs: '0.8em',
        },
        fontWeight: 'bold',
      }}
    >
      )
    </Typography>,
  ];

  return (
    <ThemeProvider theme={robotoTheme}>
      <Box
        sx={{
          backgroundColor: mainTheme.palette.mistake.main,
          width: `calc(90% - (3em * ${indent}))`,
          minHeight: '5vh',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'left',
          borderRadius: '5px',
          borderColor: 'black',
          borderSize: '0.2em',
          marginLeft: `calc(3em * ${indent})`,
          borderBottom: `0.15em solid ${mainTheme.palette.contrast.main}`,
        }}
      >
        <CloseIcon
          sx={{
            color: mainTheme.palette.mistake.error,
            width: '2em',
            height: '2em',
          }}
        />
        {questionButtons}
      </Box>
    </ThemeProvider>
  );
}

async function saveSetAccuraciesAndGetChartData(setName, setAccuracies) {
  let notNullAccuracies = {};

  for (const topicPath of Object.keys(setAccuracies)) {
    if (setAccuracies[topicPath] !== null) {
      notNullAccuracies[topicPath] = setAccuracies[topicPath];
    } else {
      notNullAccuracies[topicPath] = -1;
    }
  }

  const accuraciesWithDate = {
    ...notNullAccuracies,
    [pathSplitSeparator + 'date']: Date.now(),
  };

  let data;
  try {
    data = await fetch(BACKEND_URL + '/appendStudleAnalytics', {
      method: 'POST',
      credentials: 'include',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Credentials': 'true',
      },
      body: JSON.stringify({
        encryptedEmail: localStorage.getItem('encryptedEmail'),
        setName: setName,
        newAccuracies: accuraciesWithDate,
      }),
    });
  } catch (e) {
    // ignore
  }
  if (!data) {
    return;
  }

  const json = await data.json();

  if (json.type === 'success') {
    return json.data.map((accuraciesObj) => {
      return Object.fromEntries(
        Object.entries(accuraciesObj).map(([key, value]) => {
          if (key === 'date') {
            return [key, Date.parse(value)];
          } else {
            return [key, JSON.parse(value)];
          }
        })
      );
    });
  } else {
    return;
  }
}

export { StudySetSummary };
