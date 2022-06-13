import type { LinksFunction, LoaderFunction, MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
  useLoaderData,
  useLocation,
} from '@remix-run/react';
import type { ColorScheme } from '@mantine/core';
import { MantineProvider, ColorSchemeProvider } from '@mantine/core';
import styles from './tailwind.css';
import customStyle from './custom.css';
import { supabaseStrategy } from './utils/auth.server';
import { useLocalStorage } from '@mantine/hooks';
import { prisma } from './utils/db.server';
import CatchUI from './components/layouts/CatchUI';
import { HiOutlineExclamation } from 'react-icons/hi';

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

export function ErrorBoundary() {
  // TODO: report error
  const location = useLocation();

  return (
    <html className="h-full bg-gray-100">
      <head>
        <title>Oh no!</title>
        <Meta />
        <Links />
      </head>
      <body className="h-full">
        <main className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end sm:items-center justify-center min-h-full p-4 text-center sm:p-0">
            <div className="relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <HiOutlineExclamation className="h-6 w-6 text-red-600" aria-hidden="true" />
                  </div>

                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h1 className="text-lg leading-6 font-medium text-gray-900">Ooops! 😱</h1>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        An unknown error occurred. We've automatically reported the error and we will investigate it{' '}
                        <i>
                          <b>asap</b>
                        </i>
                        ! 🤓
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        We're very sorry about this! 🙏 Please reload the page. 👇
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <Link
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  to={location.pathname + location.search}
                >
                  Reload Page
                </Link>
              </div>
            </div>
          </div>
        </main>

        <Scripts />
      </body>
    </html>
  );
}

export function CatchBoundary() {
  const caught = useCatch();
  return (
    <MantineTheme>
      <CatchUI caught={caught} />
    </MantineTheme>
  );
}
