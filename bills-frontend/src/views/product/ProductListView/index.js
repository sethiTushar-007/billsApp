import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import {
  Box,
  Container,
  makeStyles
} from '@material-ui/core';
import Page from '../../../components/Page';
import ItemsTable from './table.js';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const ProductListView = (props) => {
    const classes = useStyles();
  return (
    <Page
      className={classes.root}
      title="Products"
    >
          <Container maxWidth={false}>
              <Box mt={3}>
                  <ItemsTable {...props} />
        </Box>
      </Container>
    </Page>
  );
};

const mapStateToProps = (state) => {
    return {
        token: state.token,
        loading: state.loading,
        error: state.error,
        user: state.user,
    }
}

export default connect(mapStateToProps, null)(ProductListView);
