import { Box, Grid } from "@mui/material";
import React from "react";

const LayoutContainer = ({ left, right }) => {
  return (
    <Box sx={{ flexGrow: 1, marginLeft: "0.2px", marginRight: "0.2px" }}>
      <Grid container spacing={0.1}>
        <Grid item xs={4} md={4} lg={4}>
          {left}
        </Grid>
        <Grid item xs={8} md={8} lg={8}>
          {right}
        </Grid>
      </Grid>
    </Box>
  );
};

export default LayoutContainer;
