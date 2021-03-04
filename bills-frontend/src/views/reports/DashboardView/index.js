import React, { useState } from 'react';
import {
  Box,
  Container,
  makeStyles
} from '@material-ui/core';
import Page from '../../../components/Page';
import BillsTable from './table';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const DashboardView = (props) => {
  const classes = useStyles();

  return (
    <Page
      className={classes.root}
      title="Bills"
    >
      <Container maxWidth={false}>
        <Box mt={3}>
            <BillsTable {...props} />
        </Box>
      </Container>
    </Page>
  );
};

export default DashboardView;
