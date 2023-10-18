import DeleteIcon from '@mui/icons-material/Delete';
import {
  Box,
  Button,
  CircularProgress,
  createTheme,
  Dialog,
  DialogActions,
  DialogContentText,
  DialogTitle,
  TextField,
  ThemeProvider,
} from '@mui/material';
import { memo,useEffect, useRef, useState } from 'react';

import { BACKEND_URL } from '../../const/constants';
import disableTextSelection from '../../const/disableTextSelection';
import { sanitize } from '../../lib/sanitizer';
import { factSplitSeparator, pathSplitSeparator } from './createSetPage';

const robotoTheme = createTheme({
  typography: {
    fontFamily: ['RobotoSlab-Light'].join(','),
  },
});

function CreateTopicsPage(properties) {
  const {
    mainTheme,
    setData,
    setSetData,
    updateNextStepButtonEnabled,
    nextId,
    addWarning,
    removeWarning,
    editingSetName,
    changePage,
  } = properties;
  const [deleteSetDialogOpen, setDeleteSetDialogOpen] = useState(false);
  const takenSetNames = useRef([]);

  const updateTakenSetNames = async () => {
    takenSetNames.current = await getAllSetNames();
  };

  useEffect(() => {
    updateTakenSetNames();
  }, []);

  return (
    <Box
      display="flex"
      alignItems="center"
      flexDirection="column"
      height="85%"
      marginTop="5%"
    >
      {(editingSetName ? setData.topics.length == 0 : false) && (
        <CircularProgress />
      )}
      {(editingSetName ? setData.topics.length >= 1 : true) && (
        <Box
          display="flex"
          alignItems="center"
          flexDirection="column"
          height="100%"
          width="100%"
        >
          <DeleteSetDialog
            mainTheme={mainTheme}
            open={deleteSetDialogOpen}
            setOpen={setDeleteSetDialogOpen}
            setName={setData.name}
            changePage={changePage}
          />
          <SetNameBox
            mainTheme={mainTheme}
            startingText={editingSetName ? editingSetName : setData.name}
            setSetName={(newName) => {
              setSetData((currentSetData) => {
                return { ...currentSetData, name: newName };
              });
            }}
            takenSetNames={takenSetNames}
            setDeleteSetDialogOpen={setDeleteSetDialogOpen}
            editingSetName={editingSetName}
            addWarning={addWarning}
            removeWarning={removeWarning}
          />
          <TopicContainer
            mainTheme={mainTheme}
            nextId={nextId}
            updateNextStepButtonEnabled={updateNextStepButtonEnabled}
            setData={setData}
            setSetData={setSetData}
            addWarning={addWarning}
            removeWarning={removeWarning}
          />
        </Box>
      )}
    </Box>
  );
}

function TopicContainer(properties) {
  const {
    mainTheme,
    nextId,
    updateNextStepButtonEnabled,
    addWarning,
    removeWarning,
    setData,
    setSetData,
  } = properties;
  const [pathsInterfering, setPathsInterfering] = useState([]);

  const topicExists = (name, path) => {
    return setData.topics.some(
      (topic) => topic.path === path && topic.name === name
    );
  };

  const topicWithDifferentNameExists = (name, path) => {
    const targetPath = getPathWithDifferentName(name, path);
    return setData.topics.some(
      (topic) => topic.path === targetPath && topic.name === name
    );
  };

  const updateTopicsAndFacts = (topics, facts = setData.facts) => {
    let newTopics = [...topics];

    newTopics.sort((a, b) => topicSort(newTopics, a, b));

    setSetData((currentSetData) => {
      return { ...currentSetData, topics: newTopics, facts: facts };
    });

    updateNextStepButtonEnabled(newTopics);
  };

  const addTopic = (name, path) => {
    if (!topicExists(name, path)) {
      nextId.current += 1;

      const newTopic = { name: name, path: path, id: nextId.current };

      updateTopicsAndFacts([...setData.topics, newTopic]);
    }
  };

  useEffect(() => {
    checkForExtraTopicBox();
  }, [setData]);

  const renameTopic = (currentName, path, newName) => {
    if (!topicWithDifferentNameExists(newName, path)) {
      let newTopics = setData.topics.map((topic) => {
        if (topic.path === path && topic.name === currentName) {
          return {
            ...topic,
            name: newName,
            path: getPathWithDifferentName(newName, path),
          };
        } else {
          return topic;
        }
      });
      changePathName(newName, path, newTopics);
    }
  };

  const changePathName = (newName, path, topicsPassthrough) => {
    let newTopics = topicsPassthrough;

    if (!newTopics) {
      newTopics = [...setData.topics];
    }

    const newPath = getPathWithDifferentName(newName, path);

    newTopics = newTopics.map((topic) => {
      if (topic.path.startsWith(path + pathSplitSeparator)) {
        return { ...topic, path: topic.path.replace(path, newPath, 1) };
      } else {
        return topic;
      }
    });

    let newFacts = { ...setData.facts };
    for (const factId of Object.keys(newFacts)) {
      if (factId.startsWith(path + factSplitSeparator)) {
        let factData = newFacts[factId];

        delete newFacts[factId];
        newFacts[factId.replace(path, newPath, 1)] = {
          ...factData,
          path: factData.path.replace(path, newPath, 1),
        };
      }
    }

    updateTopicsAndFacts(newTopics, newFacts);
  };

  const getPathWithDifferentName = (newName, path) => {
    const lastSplitIndex = path.lastIndexOf(pathSplitSeparator);

    let newPath = '';

    if (lastSplitIndex !== -1) {
      const partBeforeLastSplit = path.slice(0, lastSplitIndex);
      newPath = partBeforeLastSplit + pathSplitSeparator + sanitize(newName);
    } else {
      newPath = sanitize(newName);
    }

    return newPath;
  };

  const checkForExtraTopicBox = () => {
    if (!topicExists('extraTopicBox', sanitize('extraTopicBox'))) {
      addTopic('extraTopicBox', sanitize('extraTopicBox'));
    }
  };

  const deleteTopic = (name, path) => {
    if (topicExists(name, path)) {
      let newTopics = [...setData.topics];
      for (const topic of setData.topics) {
        if (
          topic.path !== path &&
          !topic.path.startsWith(path + pathSplitSeparator)
        ) {
          continue;
        }
        newTopics.splice(
          newTopics.findIndex(
            (deletingTopic) => deletingTopic.path === topic.path
          ),
          1
        );
      }

      let newFacts = { ...setData.facts };
      for (const factId of Object.keys(setData.facts)) {
        if (setData.facts[factId].path.startsWith(path)) {
          delete newFacts[factId];
        }
      }

      updateTopicsAndFacts(newTopics, newFacts);

      if (pathsInterfering.includes(path)) {
        setPathsInterfering([]);
      }
    }
  };

  const getId = (topic) => {
    if (topic.id) {
      return topic.id;
    }
  };

  const topicSort = (topics, a, b) => {
    const aParts = a.path.split(pathSplitSeparator);
    const bParts = b.path.split(pathSplitSeparator);

    for (let i = 0; i < Math.min(aParts.length, bParts.length); i++) {
      const aPart = aParts[i];
      const bPart = bParts[i];

      if (aPart !== bPart) {
        // If the current parts are different, find the topic objects in the 'setData.current.topics' array
        // corresponding to the current path components (aPart and bPart)
        const aTopic = topics.find(
          (obj) => obj.path === aParts.slice(0, i + 1).join(pathSplitSeparator)
        );
        const bTopic = topics.find(
          (obj) => obj.path === bParts.slice(0, i + 1).join(pathSplitSeparator)
        );

        // Compare the topic IDs of the current path components and sort accordingly
        return aTopic.id - bTopic.id;
      }
    }

    // If all components of the paths are the same, sort based on the length of the paths
    return aParts.length - bParts.length;
  };

  return (
    <Box width="100%" display="flex" alignItems="center" flexDirection="column">
      {setData.topics.map((topic) => {
        const topicPath = topic.path;
        const topicName = topic.name;
        const topicId = getId(topic);

        return (
          <TopicBox
            mainTheme={mainTheme}
            startingText={topicName}
            path={topicPath}
            addTopic={addTopic}
            renameTopic={renameTopic}
            deleteTopic={deleteTopic}
            getPathWithDifferentName={getPathWithDifferentName}
            topicWithDifferentNameExists={topicWithDifferentNameExists}
            addWarning={addWarning}
            removeWarning={removeWarning}
            indent={topicPath.split(pathSplitSeparator).length - 1}
            setPathsInterfering={setPathsInterfering}
            actionsDisabled={
              pathsInterfering.length >= 1
                ? !pathsInterfering.includes(topic.path)
                : false
            }
            addSubtopicDisabled={pathsInterfering.includes(topicPath)}
            key={topicId}
          />
        );
      })}
    </Box>
  );
}

async function getAllSetNames() {
  let data;
  try {
    data = await fetch(
      BACKEND_URL +
        '/studleNames/' +
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
    return false;
  }

  return json.data;
}

function DeleteSetDialog(properties) {
  const { mainTheme, changePage, open, setOpen, setName } = properties;
  const [typedText, setTypedText] = useState('');

  return (
    <Dialog open={open}>
      <Box
        display="flex"
        sx={{
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: '100%',
        }}
      >
        <Box
          display="flex"
          flexDirection="column"
          sx={{
            width: '100%',
            backgroundColor: mainTheme.palette.offsetPrimary.main,
            borderRadius: '0.5em',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <DialogTitle
            cursor="pointer"
            fontSize="3em"
            sx={{ ...disableTextSelection, textAlign: 'center' }}
          >
            Delete Set
          </DialogTitle>
          <DialogContentText
            marginTop="1.5em"
            cursor="pointer"
            fontSize="2em"
            sx={{ ...disableTextSelection, textAlign: 'center', width: '85%' }}
          >
            {`Deleting this set is permanent. Type the name of the set (${setName}) to confirm.`}
          </DialogContentText>
          <TextField
            value={typedText}
            error={typedText !== setName}
            autoFocus
            onChange={(event) => {
              const newText = event.target.value;
              setTypedText(newText);
            }}
            onPaste={(event) => {
              event.preventDefault();
            }}
            inputProps={{
              sx: { fontSize: '2em' },
              autoCapitalize: 'off',
              autoComplete: 'one-time-code',
              autoCorrect: 'false',
              spellCheck: 'false',
            }}
            sx={{
              width: 'calc(100% - 2em)',
              margin: '1em',
              marginTop: '2em',
            }}
          ></TextField>
          <DialogActions
            display="flex"
            sx={{ width: '100%', paddingLeft: 0, paddingRight: 0 }}
          >
            <Box
              display="flex"
              sx={{ justifyContent: 'space-around', width: '100%' }}
            >
              <Button
                variant="contained"
                sx={{
                  textTransform: 'none',
                  width: 'max(50%, min-content)',
                  height: 'max(15%, max-conetnt)',
                  fontSize: '2em',
                  backgroundColor: mainTheme.palette.buttonSuccess.main,
                  '&:hover': {
                    backgroundColor: mainTheme.palette.buttonSuccess.hover,
                  },
                }}
                onClick={() => {
                  setOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                disabled={typedText !== setName}
                sx={{
                  textTransform: 'none',
                  width: 'max(50%, min-content)',
                  height: '15%',
                  fontSize: '2em',
                  backgroundColor: mainTheme.palette.buttonDelete.main,
                  '&:hover': {
                    backgroundColor: mainTheme.palette.buttonDelete.hover,
                  },
                }}
                onClick={() => {
                  if (typedText === setName) {
                    fetch(BACKEND_URL + '/removeStudle', {
                      method: 'POST',
                      credentials: 'include',
                      mode: 'cors',
                      headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Credentials': 'true',
                      },
                      body: JSON.stringify({
                        encryptedEmail: localStorage.getItem('encryptedEmail'),
                        name: setName,
                      }),
                    }).then(async () => {
                      changePage('home');
                    });
                  }
                }}
              >
                Delete Set
              </Button>
            </Box>
          </DialogActions>
        </Box>
      </Box>
    </Dialog>
  );
}

function SetNameBox(properties) {
  const {
    mainTheme,
    setSetName,
    addWarning,
    removeWarning,
    takenSetNames,
    startingText,
    editingSetName,
    setDeleteSetDialogOpen,
  } = properties;
  const [warningText, setWarningText] = useState('');
  const [text, setText] = useState(startingText ?? '');

  useEffect(() => {
    if (!startingText) {
      addWarning('setName');
    }
  }, []);

  const handleSetNameChange = async (event) => {
    const newName = event.target.value;
    setText(newName);
    if (newName === '') {
      setWarningText('The set must be named');
      addWarning('setName');
      return;
    }
    if (newName !== startingText) {
      if (takenSetNames.current.includes(newName)) {
        setWarningText('You already have a set with this name');
        addWarning('setName');
        return;
      }
    }

    setWarningText('');
    removeWarning('setName');
    setSetName(newName);
  };

  return (
    <ThemeProvider theme={robotoTheme}>
      <Box
        sx={{
          backgroundColor: mainTheme.palette.primary.main,
          width: '90%',
          height: '17%',
          display: 'flex',
          justifyContent: 'center',
          marginTop: '2em',
          borderRadius: '5px',
        }}
      >
        <TextField
          label="Set Name"
          placeholder="Set Name"
          value={text}
          error={warningText != ''}
          helperText={warningText}
          autoComplete="off"
          autoFocus
          onChange={(event) => {
            handleSetNameChange(event);
          }}
          sx={{
            width: '100%',
            '& .MuiInputBase-root': {
              height: '100%',
            },
            '& .MuiFormHelperText-root': {
              fontSize: '2vh',
              marginLeft: '1em',
            },
          }}
          InputLabelProps={{
            style: { fontSize: '5vh', marginLeft: '1.5%' },
          }}
          inputProps={{
            maxLength: 50,
            style: {
              fontSize: '7vh',
              textAlign: 'center',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
            },
          }}
          variant="standard"
        ></TextField>
        {editingSetName && (
          <Button
            variant="outlined"
            size="large"
            sx={{
              textTransform: 'none',
              backgroundColor: mainTheme.palette.buttonDelete.main,
              color: mainTheme.palette.buttonDelete.contrastText,
              fontWeight: 'bold',
              width: '7em',
              fontSize: '200%',
              border: 'none',
              '&:hover': {
                backgroundColor: mainTheme.palette.buttonDelete.hover,
                border: 'none',
              },
            }}
            onClick={() => {
              setDeleteSetDialogOpen(true);
            }}
          >
            Delete Set
          </Button>
        )}
      </Box>
    </ThemeProvider>
  );
}

function TopicBox(properties) {
  const {
    mainTheme,
    startingText,
    addTopic,
    path,
    renameTopic,
    deleteTopic,
    getPathWithDifferentName,
    topicWithDifferentNameExists,
    addWarning,
    removeWarning,
    indent,
    setPathsInterfering,
    actionsDisabled,
    addSubtopicDisabled,
  } = properties;
  const [warningText, setWarningText] = useState('');
  const [topicName, setTopicName] = useState(startingText);
  const [text, setText] = useState(
    startingText === 'extraTopicBox' ? '' : startingText ?? ''
  );
  const attemptingToSetNameTo = useRef();

  const handleTopicNameChange = (event) => {
    const newTopicName = event.target.value;

    setText(newTopicName);

    attemptingToSetNameTo.current = newTopicName;

    attemptChangeToNewName();
  };

  const attemptChangeToNewName = () => {
    const newName = attemptingToSetNameTo.current;

    if (newName == null) {
      return;
    }

    if (newName === 'extraTopicBox') {
      setWarningText('You can not name a topic "extraTopicBox"');
      addWarning(topicName + `:path:${path}`);
      return;
    }

    if (
      topicWithDifferentNameExists(newName, path) &&
      getPathWithDifferentName(newName, path) !== path
    ) {
      setPathsInterfering([path, getPathWithDifferentName(newName, path)]);
      setWarningText('You can not have two topics with the same name');
      addWarning(topicName + `:path:${path}`);
      return;
    }

    if (newName === '') {
      if (newName !== 'extraTopicBox') {
        setWarningText('You can not have a topic without a name');
        addWarning(topicName + `:path:${path}`);
        return;
      }
    }

    if (warningText !== '') {
      setWarningText('');
      removeWarning(topicName + `:path:${path}`);
      setPathsInterfering([]);
    }

    renameTopic(topicName, path, newName);
    setTopicName(newName);
    attemptingToSetNameTo.current = null;
  };

  const handleDeleteTopic = () => {
    if (topicName != 'extraTopicBox' || indent > 0) {
      deleteTopic(topicName, path);
    }
  };

  useEffect(() => {
    attemptChangeToNewName();
  });

  useEffect(() => {
    setText(startingText === 'extraTopicBox' ? '' : startingText);
    setTopicName(startingText);
  }, [startingText]);

  return (
    <ThemeProvider theme={robotoTheme}>
      <Box
        sx={{
          backgroundColor: mainTheme.palette.primary.main,
          width: `calc(90% - (1em * ${indent}))`,
          height: '12%',
          display: 'flex',
          justifyContent: 'center',
          borderBottom: '2px solid ' + mainTheme.palette.contrast.main,
          borderRadius: '5px',
          borderColor: 'black',
          borderSize: '0.2em',
          marginTop: indent == 0 ? '1em' : '',
          marginLeft: `calc(1em * ${indent})`,
        }}
      >
        <TextField
          value={text}
          disabled={actionsDisabled}
          error={warningText != ''}
          helperText={warningText}
          label="Set Topic Name"
          autoComplete="off"
          onChange={(event) => {
            handleTopicNameChange(event);
          }}
          sx={{
            width: '100%',
            '& .MuiInputBase-root': {
              height: '100%',
              fontSize: {
                xl: '3.5rem',
                lg: '3.5rem',
                md: '3rem',
                sm: '2.5rem',
                xs: '2rem',
              },
            },
            '& .MuiFormHelperText-root': {
              fontSize: '2vh',
              marginLeft: '1em',
            },
          }}
          InputLabelProps={{
            style: { fontSize: '4vh', marginLeft: '1.5%' },
          }}
          inputProps={{
            maxLength: 50,
            style: {
              textAlign: 'center',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
            },
          }}
          variant="standard"
        ></TextField>
        {topicName != 'extraTopicBox' && (
          <Button
            variant="outlined"
            size="large"
            disabled={actionsDisabled || addSubtopicDisabled}
            sx={{
              textTransform: 'none',
              backgroundColor: mainTheme.palette.buttonPrimary.main,
              color: mainTheme.palette.contrastPrimary.main,
              borderRadius: '5px 0 0 5px',
              fontWeight: 'bold',
              width: '7em',
              fontSize: {
                xl: '2em',
                lg: '2em',
                md: '2em',
                sm: '1.5',
                xs: '1em',
              },
              '&:hover': {
                backgroundColor: mainTheme.palette.buttonPrimary.hover,
              },
              '&:disabled': {
                backgroundColor: mainTheme.palette.buttonPrimary.disabled,
              },
            }}
            onClick={() =>
              addTopic(
                'extraTopicBox',
                path + pathSplitSeparator + sanitize('extraTopicBox')
              )
            }
          >
            Add Subtopic
          </Button>
        )}
        {(topicName != 'extraTopicBox' || indent > 0) && (
          <Button
            disabled={actionsDisabled}
            sx={{
              backgroundColor: mainTheme.palette.buttonDelete.main,
              borderRadius: '0 5px 5px 0',
              width: '3em',
              '&:hover': {
                backgroundColor: mainTheme.palette.buttonDelete.hover,
              },
              '&:disabled': {
                backgroundColor: mainTheme.palette.buttonDelete.disabled,
              },
            }}
            onClick={() => {
              handleDeleteTopic();
              removeWarning(topicName + `:path:${path}`);
            }}
          >
            <DeleteIcon
              sx={{ color: mainTheme.palette.contrastPrimary.main }}
            />
          </Button>
        )}
      </Box>
    </ThemeProvider>
  );
}

const memoizedCreateTopicsPage = memo(CreateTopicsPage);

export { memoizedCreateTopicsPage as CreateTopicsPage };
