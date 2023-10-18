function getCleanSetData(setData) {
  let newSetData = { ...setData };
  newSetData.topics = removeExtraTopicBoxes(setData.topics);
  return newSetData;
}

function removeExtraTopicBoxes(topics) {
  let newTopics = [...topics];

  while (newTopics.find((topic) => topic.name === 'extraTopicBox')) {
    newTopics.splice(
      newTopics.findIndex((topic) => topic.name === 'extraTopicBox')
    );
  }

  return newTopics;
}

export { getCleanSetData };
