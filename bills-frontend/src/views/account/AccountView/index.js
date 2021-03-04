import React from 'react';
import {
  Container,
  Grid,
  Box,
  makeStyles
} from '@material-ui/core';
import Page from '../../../components/Page';
import Profile from './Profile';
import ProfileDetails from './ProfileDetails';
import Password from './Password';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const Account = (props) => {
  const classes = useStyles();

  return (
    <Page
      className={classes.root}
      title="Account"
    >
      <Container maxWidth="lg">
        <Grid
          container
          spacing={3}
        >
          <Grid
            item
            lg={4}
            md={6}
            xs={12}
          >
          <Profile {...props} />
          </Grid>
          <Grid
            item
            lg={8}
            md={6}
            xs={12}
          >
          <ProfileDetails {...props} />
          </Grid>
        </Grid>
        <Box mt={3}>
            <Password {...props} />
        </Box>
      </Container>
    </Page>
  );
};

export default Account;
