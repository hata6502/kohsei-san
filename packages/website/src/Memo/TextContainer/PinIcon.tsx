import React from "react";
import { styled } from "@mui/material/styles";
import FeedbackIcon from "@mui/icons-material/Feedback";
import MuiInfoIcon from "@mui/icons-material/Info";

const ErrorIcon = styled(FeedbackIcon)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  opacity: 0.5,
  verticalAlign: "middle",
}));

const InfoIcon = styled(MuiInfoIcon)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  opacity: 0.5,
  verticalAlign: "middle",
}));

export const PinIcon: React.FunctionComponent<{
  severity: number;
}> = ({ severity }) => {
  switch (severity) {
    case 0: {
      return <InfoIcon color="primary" />;
    }

    case 1: {
      throw new Error("severity is 1");
    }

    case 2: {
      return <ErrorIcon color="secondary" />;
    }

    case 3: {
      throw new Error("severity is 3");
    }

    default: {
      throw new Error(`Unknown severity: ${severity}`);
    }
  }
};
