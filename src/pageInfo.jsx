import { Box, Typography, Link } from '@mui/material';

import { images } from './images';
import SwappingText from './swappingText';

const getPageInfo = (mainTheme, bigEnoughForSwappingNames) => {
  return {
    landing: (
      <Box width="100%" display="flex" sx={{ flexDirection: "column", justifyContent: "space-between", height: "fit-content" }}>
        <Typography sx={{ fontWeight: "bold", display: "inline-block" }}>
          {"Welcome to Studle! To get started, sign in with a Google account."}
        </Typography>
      </Box>
    ),
    home: (
      <Box width="100%" display="flex" sx={{ flexDirection: "column", justifyContent: "space-between", height: "fit-content" }}>
        <Typography sx={{ fontWeight: "bold", display: "inline-block" }}>
          {"Welcome to Studle!"}
          <br /><br />
          {"On your home page, you can make your own study set using the “Create Set” button, or import someone else's study set with the “Import Set” button."}
          <br /><br />
          {"Want to contribute to Studle? You can! Studle is open-source, meaning anyone can help improve it! The code can be found "}
          <Link sx={{ display: "inline-block" }} target="_blank" href={"https://github.com/AncientBison/Studle"}>here.</Link>
          <br /><br />
          {"Have a suggestion? Click the suggestion button in the hamburger menu to share your ideas with developers!"}
        </Typography><br />
        <Box width="100%" display="flex" sx={{ justifyContent: "center", alignItems: "center" }}>
          <img src={images.homePage_info_hamburger} style={{ width: "15%", display: "inline", border: "3px solid " + mainTheme.palette.contrast.main, borderRadius: "10px" }} />
        </Box>
        <br /><br /><br />
        {bigEnoughForSwappingNames && (
          <Box>
            <Typography display="inline-block" sx={{ width: "fit-content", marginRight: "1em", fontWeight: "bold" }}>
              {"Studle was created by"}
            </Typography>
            <SwappingText topText={"Ilan Bernstein"} bottomText={"Liam Bridgers"} />
            <Typography display="inline-block" sx={{ width: "fit-content", fontWeight: "bold", marginLeft: "0.8em" }}>
              {"."}
            </Typography>
          </Box>
        )}
        {!bigEnoughForSwappingNames && (
          <Typography display="inline-block" sx={{ width: "fit-content", marginRight: "1em", fontWeight: "bold" }}>
            {"Studle was created by Liam Bridgers and Ilan Bernstein."}
          </Typography>
        )}
      </Box>
    ),
    settings: (
      <Box width="100%" display="flex" sx={{ flexDirection: "column", justifyContent: "space-between", height: "fit-content" }}>
        <Typography sx={{ fontWeight: "bold", display: "inline-block" }}>
          {"This page shows all of your settings. Hover or click on a setting to view its description. To save settings, just click \"Done\"!"}
        </Typography>
      </Box>
    ),
    market: (
      <Box width="100%" display="flex" sx={{ flexDirection: "column", justifyContent: "space-between", height: "fit-content" }}>
        <Typography sx={{ fontWeight: "bold", display: "inline-block" }}>
          {"In the market, you can buy all kinds of stickers using the tickets you earned from correctly answering questions. Sticker prices are based upon their rarity, which is shown by their color."}
        </Typography>
      </Box>
    ),
    createSet: {
      createTopics: (
        <Box width="100%" display="flex" sx={{ flexDirection: "column", justifyContent: "space-between", height: "fit-content" }}>
          <Typography sx={{ fontWeight: "bold", display: "inline-block" }}>
            {"On this page, you can create the topics that will help organize your study set, and it is also where you can name the set. Just type into an empty topic box to create a topic, or in the naming box to name the set! You can also create subtopics within your topics for more organization."}
          </Typography>
        </Box>
      ),
      createFacts: (
        <Box width="100%" display="flex" sx={{ flexDirection: "column", justifyContent: "space-between", height: "fit-content" }}>
          <Typography sx={{ fontWeight: "bold", display: "inline-block" }}>
            {"Now, you can input information into your set. Unlike some other ways of studying, with Studle, all you need to do is write down facts about each topic. Studle will turn each fact into multiple questions for studying later on, making study set creation very efficient! Start by clicking the Add Fact button on a topic."}
          </Typography>
        </Box>
      ),
      createExtraAnswers: (
        <Box width="100%" display="flex" sx={{ flexDirection: "column", justifyContent: "space-between", height: "fit-content" }}>
          <Typography sx={{ fontWeight: "bold", display: "inline-block" }}>
            {"This page allows you to add more possible answers to the answer types you created. To add answers, click the green + button under an answer type. After each answer type has at least 3 possible answers, you're ready to save your new set!"}
          </Typography>
        </Box>
      ),
    },
    studySet: {
      studyOptions: (
        <Box width="100%" display="flex" sx={{ flexDirection: "column", justifyContent: "space-between", height: "fit-content" }}>
          <Typography sx={{ fontWeight: "bold", display: "inline-block" }}>
            {"Before studying the set, you can choose which study mode you would like."}
            <br /><br />
            {"Multiple choice mode offers you up to four possible answers for each question, and you just need to click the right one."}
            <br /><br />
            {"Written response mode is like a fill-in-the-blank to answer questions. Just type the correct answer to answer a question."}
            <br /><br />
            {"Before studying, you can also select which topics to study. If you don’t want to study a topic, just click the green button next to it! Only the topics with arrows pointing to the right will be in your next studying session. This allows you to save time by not studying what you already know!"}
          </Typography>
        </Box>
      ),
      study: (
        <Box width="100%" display="flex" sx={{ flexDirection: "column", justifyContent: "space-between", height: "fit-content" }}>
          <Typography sx={{ fontWeight: "bold", display: "inline-block" }}>
            {"To answer questions, either type in the answer text box for written response mode, or click the correct answer button in multiple choice mode."}
            <br /><br />
            {"You can also click the \"Finish Studying\" button to end early and get your results."}
          </Typography>
        </Box>
      ),
      studySummary: (
        <Box width="100%" display="flex" sx={{ flexDirection: "column", justifyContent: "space-between", height: "fit-content" }}>
          <Typography sx={{ fontWeight: "bold", display: "inline-block" }}>
            {"Now that you have finished a round of studying a set, you can see your results! Each topic shows how you did with it, and you can also see how you did overall!"}
            <br /><br />
            {"To start another round of studying with the same settings, click \"Study Again\"."}
          </Typography>
        </Box>
      ),
    }
  }
}

export default getPageInfo;