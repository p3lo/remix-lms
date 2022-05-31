import { ActionIcon, Popover, RingProgress, Text, useMantineColorScheme } from '@mantine/core';
import { useMatches } from '@remix-run/react';
import { Link } from '@remix-run/react';
import { useState } from 'react';
import { BsSun, BsMoon } from 'react-icons/bs';
import { RiArrowGoBackLine } from 'react-icons/ri';
import { VscChevronDown } from 'react-icons/vsc';
import type { Course } from '~/utils/types';

function Header() {
  const course = useMatches()[2].data.course as Course;
  const statistics = useMatches()[1].data.statistics as {
    totalLessons: number;
    completedLessons: number;
    percent: number;
  };
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'dark';
  const [opened, setOpened] = useState(false);
  return (
    <div className="flex items-center h-[70px] justify-between">
      <div className="flex items-center space-x-4 ">
        <ActionIcon variant="transparent" ml={10} component={Link} to="/user/enrolled-courses">
          <RiArrowGoBackLine className="hover:text-blue-500" size={20} />
        </ActionIcon>
        <div className="border-l opacity-50 h-[30px]" />
        <Text
          className="px-3"
          weight={800}
          component={Link}
          prefetch="intent"
          to="/"
          size="xl"
          variant="gradient"
          gradient={{ from: 'indigo', to: 'cyan', deg: 45 }}
          style={{ fontFamily: 'sans-serif' }}
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
                sections={[{ value: statistics.percent, color: 'blue' }]}
                label={
                  <Text color="blue" weight={500} align="center" size="xs">
                    {statistics.percent}%
                  </Text>
                }
              />
              <Text size="sm">Your progress</Text>
              <VscChevronDown size={15} />
            </div>
          }
        >
          <div className="flex flex-col space-y-2">
            <Text weight={600} size="md">
              {statistics.completedLessons} of {statistics.totalLessons} completed.
            </Text>
            <Text size="sm">Finish course to get your certificate</Text>
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
