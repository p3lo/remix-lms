/**
 * @type {import('@remix-run/dev').AppConfig}
 */
module.exports = {
  ignoredRouteFiles: ['**/.*'],
  serverDependenciesToBundle: [
    'react-dnd',
    'react-dnd-html5-backend',
    '@react-dnd/invariant',
    'dnd-core',
    '@react-dnd/shallowequal',
    '@react-dnd/asap',
  ],
  // appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  // serverBuildPath: "build/index.js",
  // publicPath: "/build/",
};
