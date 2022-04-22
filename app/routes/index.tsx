import { Switch, useMantineColorScheme } from '@mantine/core';
import MainLayout from '~/components/layouts/main-layout/MainLayout';

export default function Index() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'dark';
  return (
    <div>
      <MainLayout>
        <Switch color={dark ? 'yellow' : 'blue'} label="Dark theme" onClick={() => toggleColorScheme()} />
      </MainLayout>
    </div>
  );
}
