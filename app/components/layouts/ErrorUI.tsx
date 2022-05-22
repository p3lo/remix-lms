import { createStyles, Title, Text, Button, Container, Group } from '@mantine/core';
import { Link } from '@remix-run/react';

const useStyles = createStyles((theme) => ({
  root: {
    paddingTop: 80,
    paddingBottom: 80,
  },

  label: {
    textAlign: 'center',
    fontWeight: 900,
    fontSize: 220,
    lineHeight: 1,
    marginBottom: theme.spacing.xl * 1.5,
    color: theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2],

    [theme.fn.smallerThan('sm')]: {
      fontSize: 120,
    },
  },

  title: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    textAlign: 'center',
    fontWeight: 900,
    fontSize: 38,

    [theme.fn.smallerThan('sm')]: {
      fontSize: 32,
    },
  },

  description: {
    maxWidth: 500,
    margin: 'auto',
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.xl * 1.5,
  },
}));

function ErrorUI({ error }: { error: Error }) {
  const { classes } = useStyles();
  return (
    <Container className={classes.root}>
      <div className={classes.label}>404</div>
      <Title order={2} className={classes.title}>
        You have found a secret place.
      </Title>
      <Text color="dimmed" size="md" align="center" className={classes.description}>
        {error.message}
      </Text>
      <Title order={3} className={classes.title}>
        Stack trace.
      </Title>
      <Text color="dimmed" size="xs" align="center" className={classes.description}>
        {error.stack}
      </Text>
      <Group position="center">
        <Button component={Link} to="/" variant="subtle" size="md">
          Take me back to home page
        </Button>
      </Group>
    </Container>
  );
}

export default ErrorUI;
