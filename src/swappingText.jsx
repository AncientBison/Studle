import { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';

const SwappingText = (properties) => {
  const { topText, bottomText } = properties;
  const [swapped, setSwapped] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setSwapped(!swapped);
    }, 5000);
  }, [swapped]);

  return (
    <Box sx={{width: "fit-content", display: "inline-block"}}>
      <Typography sx={{
        fontWeight: "bold",
        transform: swapped ? "translateX(133%)" : "translateX(-8%)",
        transition: "all 1s",
        display: "inline-block",
      }}>
        {topText}
      </Typography>
      <Typography sx={{
        fontWeight: "bold",
        display: "inline-block",
      }}>
        {"and"}
      </Typography>
      <Typography sx={{
        fontWeight: "bold",
        transform: swapped ? "translateX(-133%)" : "translateX(8%)",
        transition: "all 1s",
        display: "inline-block"
      }}>
        {bottomText}
      </Typography>
    </Box>
  );
};

export default SwappingText;