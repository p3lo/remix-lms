import { Group, Text, ThemeIcon, UnstyledButton } from '@mantine/core';
import { Link } from '@remix-run/react';
interface MainLinkProps {
  icon: React.ReactNode;
  color: string;
  label: string;
  link: string;
}
export default function MainLink({ icon, color, label, link }: MainLinkProps) {
  return (
    <UnstyledButton<typeof Link>
      component={Link}
      to={link}
      sx={(theme) => ({
        display: 'block',
        width: '100%',
        padding: theme.spacing.xs,
        borderRadius: theme.radius.sm,
        color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,

        '&:hover': {
          backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
        },
      })}
    >
      <Group>
        <ThemeIcon color={color} variant="light">
          {icon}
        </ThemeIcon>
        <Text size="sm">{label}</Text>
      </Group>
    </UnstyledButton>
  );
}
