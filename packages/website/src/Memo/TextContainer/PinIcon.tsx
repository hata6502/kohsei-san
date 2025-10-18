import React from 'react';
import styled from 'styled-components';
import FeedbackIcon from '@mui/icons-material/Feedback';
import MuiInfoIcon from '@mui/icons-material/Info';
import type { TextlintRuleSeverityLevel } from '@textlint/kernel';

const ErrorIcon = styled(FeedbackIcon)`
  ${({ theme }) => `
    background-color: ${theme.palette.background.paper};
  `}
  opacity: 0.5;
  vertical-align: middle;
`;

const InfoIcon = styled(MuiInfoIcon)`
  ${({ theme }) => `
    background-color: ${theme.palette.background.paper};
  `}
  opacity: 0.5;
  vertical-align: middle;
`;

const PinIcon: React.FunctionComponent<{
  severity: TextlintRuleSeverityLevel;
}> = React.memo(({ severity }) => {
  switch (severity) {
    case 0: {
      return <InfoIcon color="primary" />;
    }

    case 1: {
      throw new Error('severity is 1');
    }

    case 2: {
      return <ErrorIcon color="secondary" />;
    }

    case 3: {
      throw new Error('severity is 3');
    }

    default: {
      const exhaustiveCheck: never = severity;

      throw new Error(`Unknown severity: ${exhaustiveCheck}`);
    }
  }
});

export { PinIcon };
