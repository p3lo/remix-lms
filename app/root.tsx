import type { LinksFunction, LoaderFunction, MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, useCatch, useLoaderData } from '@remix-run/react';
import type { ColorScheme } from '@mantine/core';
import { MantineProvider, ColorSchemeProvider } from '@mantine/core';
import styles from './tailwind.css';
import customStyle from './custom.css';
import { supabaseStrategy } from './utils/auth.server';
import { useLocalStorage } from '@mantine/hooks';
import { prisma } from './utils/db.server';
import ErrorUI from './components/layouts/ErrorUI';
import CatchUI from './components/layouts/CatchUI';

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: styles },
  { rel: 'stylesheet', href: customStyle },
];

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'New Remix App',
  viewport: 'width=device-width,initial-scale=1',
});

export const loader: LoaderFunction = async ({ request }) => {
  const session = await supabaseStrategy.checkSession(request);
  let profile;
  if (session) {
    profile = await prisma.user.findUnique({
      where: { email: session.user?.email },
      include: {
        cart: {
          include: {
            course: {
              select: {
                id: true,
                title: true,
                price: true,
                image: true,
                author: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
    include: {
      sub_categories: {
        orderBy: { name: 'asc' },
      },
    },
  });
  return json({
    env: {
      SUPABASE_URL: process.env.SUPABASE_URL,
      PUBLIC_SUPABASE_ANON_KEY: process.env.PUBLIC_SUPABASE_ANON_KEY,
    },
    profile,
    categories,
  });
};

export default function App() {
  //@ts-ignore
  const { env } = useLoaderData<Window>();
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <MantineTheme>
          <Outlet />
        </MantineTheme>
        <ScrollRestoration />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.env = ${JSON.stringify(env)}`,
          }}
        />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

function MantineTheme({ children }: { children: React.ReactNode }) {
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: 'mantine-color-scheme',
    defaultValue: 'dark',
    getInitialValueInEffect: true,
  });
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

  return (
    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <MantineProvider theme={{ colorScheme }} withNormalizeCSS withGlobalStyles>
        {children}
      </MantineProvider>
    </ColorSchemeProvider>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  return <ErrorUI error={error} />;
}

export function CatchBoundary() {
  const caught = useCatch();
  return <CatchUI caught={caught} />;
}
