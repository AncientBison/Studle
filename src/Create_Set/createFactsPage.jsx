import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { Box, Modal, Typography, TextField, ThemeProvider, createTheme, Button, MenuItem, Select } from '@mui/material';
import { useState, useEffect } from 'react';

import disableTextSelection from '../disableTextSelection';
import { pathSplitSeparator, factSplitSeparator } from './createSetPage';
import { sanitize } from '../sanitizer';

import { InfoButton } from '../infoButton';
import { InfoDialog } from '../infoDialog';

const robotoTheme = createTheme({
  typography: {
    fontFamily: [
      'RobotoSlab-Light'
    ].join(','),
  },
});

function getAllAnswerTypes(setData) {
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

function CreateFactsPage(properties) {
  const { mainTheme, setData, setSetData, addWarning, removeWarning } = properties;
  const [addFactModalOpen, setAddFactModalOpen] = useState(false);
  const [addFactModalPath, setAddFactModalPath] = useState();
  const [answerTypeItems, setAnswerTypeItems] = useState([]);

  useEffect(() => {
    if (Object.keys(setData.facts).length == 0) {
      addWarning("noFacts");
    }
  }, []);

  useEffect(() => {
    const answerTypes = getAllAnswerTypes(setData);
    if (answerTypeItems.length == 0 && answerTypes.length >= 1) {
      setAnswerTypeItems(answerTypes);
    }
  }, [setData])

  const addFactToTopicPath = (factData) => {
    const path = addFactModalPath;
    setSetData((setData) => {
      let newSetData = {...setData};
      const factId = path + factSplitSeparator + sanitize(factData.fact);
      if (!Object.keys(setData.facts).includes(factId)) {
        newSetData.facts[factId] = { fact: factData.fact, blanks: factData.blanks, path: path };
        removeWarning("noFacts");
        return newSetData;
      }
      removeWarning("noFacts");
    });
  }

  const removeFactFromTopicPath = (factData, path) => {
    setSetData((setData) => {

      let newSetData = {...setData};

      const factId = path + factSplitSeparator + sanitize(factData.fact);
      delete newSetData.facts[factId];

      if (newSetData.facts.length == 0) {
        addWarning("noFacts");
      }

      return newSetData;
    });
  }

  const getFactsByPath = (path) => {
    let factsFound = [];
    const facts = setData.facts;
    for (const factId of Object.keys(facts)) {
      if (facts[factId].path === path) {
        factsFound.push(facts[factId]);
      }
    }
    return factsFound;
  }

  const addAnswerType = (newAnswerType) => {
    setAnswerTypeItems((answerTypeItems) => {
      let newAnswerTypeItems = [...answerTypeItems];
      if (!answerTypeItems.includes(newAnswerType)) {
        newAnswerTypeItems.push(newAnswerType);
      }
      return newAnswerTypeItems;
    });
  }

  const factIdExists = (id) => {
    return Object.keys(setData.facts).includes(id);
  }

  return (
    <Box display='flex' alignItems='center' flexDirection='column' height="85%" marginTop="5%">
      <AddFactModal
        mainTheme={mainTheme}
        open={addFactModalOpen}
        setOpen={setAddFactModalOpen}
        path={addFactModalPath}
        addFactToTopicPath={addFactToTopicPath}
        setAddFactModalPath={setAddFactModalPath}
        answerTypeItems={answerTypeItems}
        addAnswerType={addAnswerType}
        factIdExists={factIdExists}
      />
      <SetNameBox mainTheme={mainTheme} setName={setData.name} />
      {setData.topics.map(topic => {
        return (
          <StaticTopicBox
            mainTheme={mainTheme}
            topicName={topic.name}
            path={topic.path}
            facts={getFactsByPath(topic.path)}
            indent={topic.path.split(pathSplitSeparator).length - 1}
            removeFactFromTopicPath={removeFactFromTopicPath}
            setAddFactModalOpen={setAddFactModalOpen}
            setAddFactModalPath={setAddFactModalPath}
            key={topic.id}
          />
        )
      })}
    </Box>
  );
}

function SetNameBox(properties) {
  const { mainTheme, setName } = properties;
  return (
    <ThemeProvider theme={robotoTheme}>
      <Box sx={{
        backgroundColor: mainTheme.palette.primary.main,
        width: '90%',
        height: '14vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '0.5em',
        borderRadius: "5px",
      }}>
        <Typography style={{ color: mainTheme.palette.contrastPrimary.main, fontSize: "10vh", textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }} sx={disableTextSelection}>
          {setName}
        </Typography>
      </Box>
    </ThemeProvider>
  );
}

function StaticTopicBox(properties) {
  const { mainTheme, topicName, path, facts, indent, removeFactFromTopicPath, setAddFactModalOpen, setAddFactModalPath } = properties;

  return (
    <ThemeProvider theme={robotoTheme}>
      <Box sx={{
        backgroundColor: mainTheme.palette.primary.main,
        width: `calc(90% - (1em * ${indent}))`,
        height: '6rem',
        display: 'flex',
        justifyContent: 'center',
        borderRadius: "5px",
        borderBottom: "0.2em solid black",
        marginTop: indent == 0 ? "1em" : "",
        marginLeft: `calc(1em * ${indent})`,
      }}>
        <Typography style={{ color: mainTheme.palette.contrastPrimary.main, width: "100%", textAlign: "center", textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }} sx={{...disableTextSelection, fontSize: {xl: "3.5rem", lg: "3.5rem", md: "3rem", sm: "2.5rem", xs: "2rem"} }} >
          {topicName}
        </Typography>
        <Button
          display="flex"
          posititon="relative"
          onClick={() => {
            setAddFactModalOpen(true);
            setAddFactModalPath(path);
          }}
          sx={{
            backgroundColor: mainTheme.palette.buttonSuccess.main,
            height: "100%",
            flexDirection: "column",
            width: "3em",
            '&:hover': {
              backgroundColor: mainTheme.palette.buttonSuccess.hover,
            },
          }} >
          <Typography position="absolute" sx={{
            color: mainTheme.palette.buttonSuccess.contrastText,
            fontSize: {xl: "1.5em", lg: "1.5em", md: "1.5em", sm: "1.5em", xs: "1em"},
            fontWeight: "bold",
            lineHeight: "2.5" 
          }} >
            Add<br />Fact
          </Typography>
          <AddIcon sx={{ color: mainTheme.palette.buttonSuccess.contrastText, transform: "scale(1.5)" }} />
        </Button>
      </Box>
      {facts.map(fact => (
        <FactBox
          factData={fact}
          mainTheme={mainTheme}
          path={path}
          indent={indent + 1}
          removeFactFromTopicPath={removeFactFromTopicPath}
          key={fact.fact}
        />
      ))}
    </ThemeProvider >
  );
}

function FactBox(properties) {
  const { mainTheme, factData, path, indent, removeFactFromTopicPath } = properties;
  const [blankBoxes, setBlankBoxes] = useState();

  const charIsBlank = (charIndex) => {
    for (const blank of factData.blanks) {
      if (charIndex >= blank.startIndex && charIndex <= blank.endIndex) {
        return true;
      }
    }
    return false;
  }

  const updateBlanks = () => {
    let newBlankBoxes = [];
    let key = 0;
    let lastCharWasBlank = charIsBlank(0);
    let currentString = "";
    for (let i = 0; i < factData.fact.length; i++) {
      const isBlank = charIsBlank(i);
      if (lastCharWasBlank != isBlank || factData.fact[i - 1] === " ") {
        currentString = currentString.replace(/ /g, '\u00A0');
        const color = lastCharWasBlank ? mainTheme.palette.primary.main : mainTheme.palette.contrast.main;
        newBlankBoxes.push(
          <Typography
            style={{
              fontSize: "2vh",
              fontWeight: "bold",
              textDecoration: (lastCharWasBlank ? `underline solid ${color}` : "none")
            }}
            key={key} >
            {currentString}
          </Typography>
        );
        key++;
        currentString = ""
        lastCharWasBlank = isBlank;
      }
      currentString += factData.fact[i];
    }

    if (currentString !== "") {
      currentString = currentString.replace(/ /g, '\u00A0');
      const color = lastCharWasBlank ? mainTheme.palette.primary.main : mainTheme.palette.contrast.main;
      newBlankBoxes.push(
        <Typography
          style={{
            fontSize: "2vh",
            fontWeight: "bold",
            textDecoration: (lastCharWasBlank ? `underline solid ${color}` : "none")
          }}
          key={key}>
          {currentString}
        </Typography>
      );
    }
    setBlankBoxes(newBlankBoxes);
  }

  useEffect(() => {
    updateBlanks();
  }, []);

  return (
    <ThemeProvider theme={robotoTheme}>
      <Box sx={{
        backgroundColor: mainTheme.palette.fact.main,
        width: `calc(90% - (1em * ${indent}))`,
        minHeight: "3rem",
        display: 'flex',
        alignItems: 'stretch',
        justifyContent: 'space-around',
        borderRadius: "5px",
        borderColor: "black",
        borderSize: "0.2em",
        marginLeft: `calc(1em * ${indent})`,
        borderBottom: `0.15em solid ${mainTheme.palette.contrast.main}`,
      }}>
        <Box sx={{ display: "flex", flex: "1", fontSize: "3vh", width: "100%", textAlign: "center", overflow: 'hidden', flexWrap: 'wrap', whiteSpace: 'nowrap', marginLeft: "0.7em" }} >
          {blankBoxes}
        </Box>
        <Button
          display="flex"
          flex="1"
          onClick={() => {
            removeFactFromTopicPath(factData, path);
          }}
          sx={{
            backgroundColor: mainTheme.palette.buttonDelete.main,
            width: "3em",
            '&:hover': {
              backgroundColor: mainTheme.palette.buttonDelete.hover,
            },
          }}
        >
          <DeleteIcon sx={{ color: mainTheme.palette.contrastPrimary.main }} />
        </Button>
      </Box>
    </ThemeProvider >
  );
}

function AddFactModal(properties) {
  const { mainTheme, open, setOpen, path, addFactToTopicPath, setAddFactModalPath, answerTypeItems, addAnswerType, factIdExists } = properties;
  const [fact, setFact] = useState("");
  const [blanks, setBlanks] = useState({});
  const [selection, setSelection] = useState();
  const [step, setStep] = useState(0);
  const [enableAddBlankButton, setEnableAddBlankButton] = useState(false);
  const [nextStepButtonEnabled, setNextStepButtonEnabled] = useState(false);
  const [warningText, setWarningText] = useState(null);
  const [infoDialogOpen, setInfoDialogOpen] = useState(false);
  
  const removeBlankFactWord = (factWord) => {
    setBlanks((blanks) => {
      let newBlanks = {...blanks};
      delete newBlanks[factWord.startIndex];
      return newBlanks;
    });
  };

  const selectionOverlapsOtherBlanks = (selection) => {
    for (const blank of Object.values(blanks)) {
      if (selection.startIndex <= blank.endIndex && selection.endIndex >= blank.startIndex) {
        return true;
      }
    }
    return false;
  }

  const updateEnableAddBlankButton = () => {
    if (!selection) {
      setEnableAddBlankButton(false);
      return;
    }
    if (selectionOverlapsOtherBlanks(selection)) {
      setEnableAddBlankButton(false);
      return;
    }

    setEnableAddBlankButton(true);
  }

  useEffect(() => {
    updateEnableAddBlankButton();
  }, [selection]);

  useEffect(() => {
    updateEnableNextStepButton();
  }, [blanks])

  const setBlankAnswerType = (startIndex, answerType) => {
    setBlanks((blanks) => {
      let newBlanks = { ...blanks };
      newBlanks[startIndex].answerType = answerType;
      return newBlanks;
    });
  }

  const updateEnableNextStepButton = () => {
    let enable = true;
    
    for (const blank of Object.values(blanks)) {
      if (blank.answerType == null) {
        enable = false;
      } else if (blank.answerType === "createNew") {
        enable = false;
      }
    }
    
    setNextStepButtonEnabled(enable);
  };

  const handleSelect = (e) => {
    if (e.target.id === "addAsKeyInformationButton") {
      return;
    }
    
    const newSelection = window.getSelection();
    const selectedText = newSelection.toString();
    if (selectedText) {
      const range = newSelection.getRangeAt(0);
      const startIndex = range.startOffset;
      const endIndex = range.endOffset - 1;

      const blankSelection = {
        startIndex: startIndex,
        endIndex: endIndex
      };

      while (fact[blankSelection.endIndex] === " ") {
        blankSelection.endIndex -= 1;
      }

      while (fact[blankSelection.startIndex] === " ") {
        blankSelection.startIndex += 1;
      }

      if (blankSelection.startIndex < blankSelection.endIndex) {
        setSelection(blankSelection);
      } else {
        setSelection();
      }
    } else {
      setSelection();
    }
  }

  return (
    <ThemeProvider theme={robotoTheme} >
      <Modal
        open={open}
        onMouseUp={handleSelect}
        onTouchCancel={handleSelect}
        onTouchEnd={handleSelect}
        disableAutoFocus={true}
        disableRestoreFocus={true}
        onClose={() => {
          setOpen(false);
          setAddFactModalPath();
          setFact("");
          setBlanks({});
          setStep(0);
          setSelection();
        }}
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: "70%",
          backgroundColor: mainTheme.palette.popup.main,
          border: `2px solid ${mainTheme.palette.popup.border}`,
          padding: "1em",
          overflow: 'auto',
          maxHeight: "90vh",
        }}>
          <Typography style={{ color: mainTheme.palette.popup.contrastText, fontSize: "4vh", display: "inline-block" }} sx={disableTextSelection}>
            {step === 0 ? "Enter the Fact" : "Select Key Information"}
          </Typography>
          <Box sx={{ position: "absolute", top: 0, right: 0, margin: "0.5em"}}>
            <InfoButton mainTheme={mainTheme} setDialogOpen={setInfoDialogOpen} />
          </Box>
          <InfoDialog open={infoDialogOpen} setOpen={setInfoDialogOpen} mainTheme={mainTheme} title={step === 0 ? "Create Fact" : "Select Key Information"} 
            content={
              <Box width="100%" display="flex" sx={{flexDirection: "column", justifyContent: "space-between", height: "fit-content"}}>
                <Typography sx={{ color: mainTheme.palette.popup.contrastText, fontWeight: "bold", display: "inline-block" }}>
                  {
                    step === 0 ? "Add facts to each topic. The key words in each fact are the most important part! Aim to have 2-4 important pieces of information in each fact, such as nouns, adjectives, or verbs that are important to the topic. An example of a great fact is “The United States declared independence on July 4th, 1776.” The key pieces of information here are, “United States,” “independence,” and “July 4th, 1776."
                    : "Now that you have inputted a fact, just select each key piece of information, and click the Add as Key Information button. Now, all you need to do is assign that information an answer type, which will tell Studle what kind of information it is, such as \"President\" or \"Date\". Once you click Done, you have made your first fact!"
                  }
                </Typography>
              </Box>
            } 
          />
          <Typography style={{ color: mainTheme.palette.popup.contrastText, fontSize: "1em", marginBottom: "2%" }} sx={disableTextSelection} >
            {step === 0 ? "Facts need to have three to four significant words, such as names, dates, places, or verbs" : "Select three to four significant words, such as names, dates, places, or verbs"}
          </Typography>
          {step == 0 && (
            <TextField
              helperText={warningText}
              error={warningText != null}
              autoFocus
              sx={{
                width: "100%",
                "& .MuiFormHelperText-root": {
                  fontSize: "2vh",
                  marginLeft: "1em",
                },
                color: mainTheme.palette.popup.contrastText,
                backgroundColor: mainTheme.palette.popup.contrastText,
              }}
              onChange={(event) => {
                setFact(event.target.value);
                if (factIdExists(path + factSplitSeparator + sanitize(event.target.value))) {
                  setWarningText("You already have this fact");
                } else {
                  setWarningText(null);
                }
              }}
              inputProps={{
                maxLength: 200,
                style: { padding: "0.3em", textAlign: 'center', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', fontSize: "2em" }
              }} >
            </TextField>
          )}
          {step == 1 && (
            <Box sx={{ width: "100%" }} >
              <Typography style={{ fontSize: "3.5vh", overflowWrap: 'break-word', whiteSpace: 'normal',}} >
                {fact}
              </Typography>
              <Button
                variant='contained'
                disabled={!enableAddBlankButton}
                id="addAsKeyInformationButton"
                onClick={(e) => {
                  const saveSelection = {...selection};
                  setBlanks({ ...blanks, [saveSelection.startIndex]: { ...saveSelection, answerType: null } });
                  setSelection();
                }}
                sx={{
                  textTransform: 'none',
                  backgroundColor: mainTheme.palette.buttonPrimary.main,
                  borderColor: mainTheme.palette.contrastPrimary.main,
                  borderWidth: '0.15em',
                  color: mainTheme.palette.buttonPrimary.contrastText,
                  fontWeight: 'bold',
                  marginTop: '3.5%',
                  userSelect: "none",
                  '&:disabled': {
                    backgroundColor: mainTheme.palette.buttonPrimary.disabled,
                  },
                  '&:hover': {
                    backgroundColor: mainTheme.palette.buttonPrimary.hover,
                  },
                }}>
                Add as Key Information
              </Button>
              {Object.keys(blanks).length > 0 && (
                <Box sx={{height: "100%"}}>
                  <Typography style={{ fontSize: "1.5vh", height: "1.5vh", paddingTop: "0.5em" }} >
                    Key Information
                  </Typography>
                  <Box style={{ fontSize: "1rem" }} >
                    {Object.values(blanks).map(blank => {
                      const blankString = fact.substring(blank.startIndex, blank.endIndex + 1)
                      return (
                        <Box
                          marginTop="0.5em"
                          display="flex"
                          border={`0.15em solid ${mainTheme.palette.fact.main}`}
                          borderRadius="0.3em"
                          flexDirection="row"
                          key={blankString} >
                          <Box width="100%" display="flex">
                            <Typography
                              padding="0.5em"
                              style={{
                                fontSize: "1.5em",
                                overflow: "hidden",
                                textOverflow: "ellipsis"
                              }}
                              width="100%"
                            >
                              {blankString}
                            </Typography>
                            <AnswerTypeSelector mainTheme={mainTheme} setBlankAnswerType={setBlankAnswerType} blankStartIndex={blank.startIndex} answerTypeItems={answerTypeItems} addAnswerType={addAnswerType} />
                            <Button
                              onClick={() => {
                                removeBlankFactWord(blank);
                              }}
                              variant="contained"
                              sx={{
                                backgroundColor: mainTheme.palette.buttonDelete.main,
                                width: "3em",
                                '&:hover': {
                                  backgroundColor: mainTheme.palette.buttonDelete.hover,
                                },
                              }} >
                              <DeleteIcon sx={{ color: mainTheme.palette.contrastPrimary.main }} />
                            </Button>
                          </Box>
                        </Box>
                      );
                    })}
                  </Box>
                </Box>
              )}
            </Box>
          )}
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
          }}>
            <Button
              variant='contained'
              onClick={() => {
                setOpen(false);
                setAddFactModalPath();
                setFact("");
                setBlanks({});
                setStep(0);
                setSelection();
              }}
              sx={{
                textTransform: 'none',
                backgroundColor: mainTheme.palette.buttonPrimary.main,
                borderColor: mainTheme.palette.contrastPrimary.main,
                borderWidth: '0.15em',
                color: mainTheme.palette.buttonPrimary.contrastText,
                fontWeight: 'bold',
                marginTop: '3.5%',
                '&:hover': {
                  backgroundColor: mainTheme.palette.buttonPrimary.hover,
                },
                '&:disabled': {
                  backgroundColor: mainTheme.palette.buttonPrimary.disabled,
                },
              }}>
              Cancel
            </Button>
            <Button
              variant='contained'
              disabled={fact === "" || !!warningText || (step == 1 && Object.keys(blanks).length == 0) || !nextStepButtonEnabled}
              onClick={() => {
                if (step == 0) {
                  setStep(step + 1);
                }
                if (step == 1) {
                  addFactToTopicPath({ fact: fact, blanks: Object.values(blanks) });
                  setOpen(false);
                  setAddFactModalPath();
                  setFact("");
                  setBlanks({});
                  setStep(0);
                }
              }}
              sx={{
                textTransform: 'none',
                backgroundColor: mainTheme.palette.buttonPrimary.main,
                borderColor: mainTheme.palette.contrastPrimary.main,
                borderWidth: '0.15em',
                color: mainTheme.palette.buttonPrimary.contrastText,
                fontWeight: 'bold',
                marginTop: '3.5%',
                '&:hover': {
                  backgroundColor: mainTheme.palette.buttonPrimary.hover,
                },
                '&:disabled': {
                  backgroundColor: mainTheme.palette.buttonPrimary.disabled,
                },
              }}>
              {step === 0 ? "Next" : "Done"}
            </Button>
          </Box>
        </Box>
      </Modal>
    </ThemeProvider >
  );
}

function AnswerTypeSelector(properties) {
  const { mainTheme, setBlankAnswerType, blankStartIndex, answerTypeItems, addAnswerType } = properties;
  const [answerType, setAnswerType] = useState("");
  const [newAnswerType, setNewAnswerType] = useState("");
  const [openModal, setOpenModal] = useState(false);

  const handleAnswerTypeChange = (newAnswerTypeName) => {
    setAnswerType(newAnswerTypeName);
    setBlankAnswerType(blankStartIndex, newAnswerTypeName);
  };

  const handleNewAnswerTypeChange = (event) => {
    setNewAnswerType(event.target.value);
  };

  const handleAddAnswerType = () => {
    if (newAnswerType.trim() !== "") {
      addAnswerType(newAnswerType);
      setNewAnswerType("");
      setOpenModal(false);
      setAnswerType(newAnswerType);
      handleAnswerTypeChange(newAnswerType);
    }
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <Box sx={{ width: "45%", padding: "0.5em", textAlign: "center" }}>
      <Typography style={{ fontSize: "0.75em" }}>Select or Add Answer Type</Typography>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Select value={answerType} onChange={(event) => handleAnswerTypeChange(event.target.value)} 
          sx={{ 
            width: "100%",
          }}
          SelectDisplayProps={{
            style: {
              backgroundColor: mainTheme.palette.popup.main,
              border: "2px solid " + mainTheme.palette.popup.border,
              color: mainTheme.palette.popup.contrastText,
            }
          }}>
          {answerTypeItems.map(answerType => (
            <MenuItem value={answerType} key={answerType}>
              {answerType}
            </MenuItem>
          ))}
          <MenuItem value="createNew" onClick={handleOpenModal}>
            Create New
          </MenuItem>
        </Select>
        <Modal
          open={openModal}
          onClose={handleCloseModal}
          disableAutoFocus={true}
          disableRestoreFocus={true}>
          <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: "100%" }}>
            <Box display="flex" flexDirection="column" sx={{ backgroundColor: mainTheme.palette.popup.main, width: "max(25rem, fit-content)", alignItems: "center", height: "max(8rem, fit-content)"}}>
              <TextField
                value={newAnswerType}
                sx={{ 
                  width: "90%",
                  color: mainTheme.palette.popup.contrastText,
                  marginTop: "1rem",
                  backgroundColor: mainTheme.palette.popup.contrastText,
                }}
                onChange={handleNewAnswerTypeChange}
                placeholder="Enter New Answer Type"
                inputProps={{
                  maxLength: 20,
                  style: { color: mainTheme.palette.popup.contraText, padding: "0.3em", textAlign: 'center', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', fontSize: "2em" }
                }}
                autoFocus
              />
              <Button
                variant="outlined"
                onClick={handleAddAnswerType}
                sx={{
                  textTransform: 'none',
                  backgroundColor: mainTheme.palette.buttonPrimary.main,
                  color: mainTheme.palette.buttonPrimary.contrastText,
                  fontWeight: 'bold',
                  marginLeft: "1rem",
                  marginRight: "1rem",
                  marginTop: "1rem",
                  marginBottom: "1rem",
                  height: "3rem",
                  '&:hover': {
                    backgroundColor: mainTheme.palette.buttonPrimary.hover,
                  },
                  '&:disabled': {
                    backgroundColor: mainTheme.palette.buttonPrimary.disabled,
                  },
                }}
                disabled={newAnswerType.trim() === ""}>
                Add Answer Type
              </Button>
            </Box>
          </Box>
        </Modal>
      </Box>
    </Box>
  );
}

export { CreateFactsPage };