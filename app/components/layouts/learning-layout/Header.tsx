import { ActionIcon, Popover, RingProgress, Text, useMantineColorScheme } from '@mantine/core';
import { useMatches } from '@remix-run/react';
import { Link } from '@remix-run/react';
import { useState } from 'react';
import { BsSun, BsMoon } from 'react-icons/bs';
import { VscChevronDown } from 'react-icons/vsc';
import type { Course } from '~/utils/types';

function Header() {
  const course = useMatches()[2].data.course as Course;
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'dark';
  const [opened, setOpened] = useState(false);
  return (
    <div className="flex items-center h-[70px] justify-between">
      <div className=" flex items-center space-x-4">
        <Text
          className="px-3"
          weight={800}
          component={Link}
          to="/"
          size="xl"
          variant="gradient"
          gradient={{ from: 'indigo', to: 'cyan', deg: 45 }}
          style={{ fontFamily: 'cursive, sans-serif' }}
        >
          Remix LMS
        </Text>
        <div className="border-l opacity-50 h-[30px]" />
        <Text size="lg" weight={500} lineClamp={1}>
          {course.title}
        </Text>
      </div>
      <div></div>
      <div className="flex items-center pr-3 space-x-5">
        <Popover
          opened={opened}
          onClose={() => setOpened(false)}
          position="bottom"
          placement="center"
          withArrow
          trapFocus={false}
          closeOnEscape={false}
          transition="pop-top-left"
          width={260}
          styles={{ body: { pointerEvents: 'none' } }}
          target={
            <div
              className="flex items-center space-x-1 cursor-pointer"
              onMouseEnter={() => setOpened(true)}
              onMouseLeave={() => setOpened(false)}
            >
              <RingProgress
                size={50}
                thickness={3}
                roundCaps
                sections={[{ value: 40, color: 'blue' }]}
                label={
                  <Text color="blue" weight={500} align="center" size="xs">
                    40%
                  </Text>
                }
              />
              <Text size="sm">Your progress</Text>
              <VscChevronDown size={15} />
            </div>
          }
        >
          <div style={{ display: 'flex' }}>
            <Text size="sm">Thanks for stopping by and checking Mantine, you are awesome!</Text>
          </div>
        </Popover>
        <ActionIcon
          variant="outline"
          color={dark ? 'yellow' : 'blue'}
          onClick={() => toggleColorScheme()}
          title="Toggle color scheme"
        >
          {dark ? <BsSun size={18} className="text-yellow-400" /> : <BsMoon size={18} className="text-blue-500" />}
        </ActionIcon>
      </div>
    </div>
  );
}

export default Header;
