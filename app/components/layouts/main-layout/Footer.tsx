import { Button, Divider, Paper, Text } from '@mantine/core';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <Paper p="xl" px={80} withBorder>
      <div className="flex items-center justify-between ">
        <div>
          <p className="text-2xl font-extrabold">Teach the world online</p>
          <p className="text-md">Create an online video course, reach students across the globe, and earn money</p>
        </div>
        <div>
          <Button>Teach on Remix LMS</Button>
        </div>
      </div>
      <Divider />
      <div className="grid grid-cols-2 py-5 ">
        <div className="grid grid-cols-3 text-xs">
          <div className="flex flex-col space-y-2 cursor-pointer">
            <Text size="xs" component={Link} to="#">
              Coursemy Business
            </Text>
            <Text size="xs" component={Link} to="#">
              Teach on Coursemy
            </Text>
            <Text size="xs" component={Link} to="#">
              Get the app
            </Text>
            <Text size="xs" component={Link} to="#">
              About us
            </Text>
            <Text size="xs" component={Link} to="#">
              Contact us
            </Text>
          </div>
          <div className="flex flex-col space-y-2 cursor-pointer">
            <Text size="xs" component={Link} to="#">
              Careers
            </Text>
            <Text size="xs" component={Link} to="#">
              Blog
            </Text>
            <Text size="xs" component={Link} to="#">
              Help and Support
            </Text>
            <Text size="xs" component={Link} to="#">
              Affiliate
            </Text>
            <Text size="xs" component={Link} to="#">
              Investors
            </Text>
          </div>
          <div className="flex flex-col space-y-2 cursor-pointer">
            <Text size="xs" component={Link} to="#">
              Terms
            </Text>
            <Text size="xs" component={Link} to="#">
              Privacy policy
            </Text>
            <Text size="xs" component={Link} to="#">
              Cookie settings
            </Text>
            <Text size="xs" component={Link} to="#">
              Sitemap
            </Text>
            <Text size="xs" component={Link} to="#">
              Accessibility statement
            </Text>
          </div>
        </div>
      </div>
    </Paper>
  );
}

export default Footer;
