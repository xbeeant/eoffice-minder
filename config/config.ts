// https://umijs.org/config/
import { defineConfig } from 'umi';
import routes from './routes';
import proxy from './proxy';
import defaultSettings from './defaultSettings';

const { REACT_APP_ENV } = process.env;

export default defineConfig({
  hash: true,
  antd: {},
  dva: {
    hmr: true,
  },
  routes,
  // https://umijs.org/zh-CN/plugins/plugin-locale
  locale: {
    // default zh-CN
    default: 'zh-CN',
    antd: true,
    // default true, when it is true, will use `navigator.language` overwrite default
    baseNavigator: true,
  },
  targets: {
    ie: 11,
  },
  // esbuild is father build tools
  // https://umijs.org/plugins/plugin-esbuild
  esbuild: {},
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: defaultSettings.basepath + '/',
  },
  title: defaultSettings.title,
  publicPath: defaultSettings.basepath + '/',
  base: defaultSettings.basepath,
  // Fast Refresh 热更新
  fastRefresh: {},
  nodeModulesTransform: { type: 'none' },
  webpack5: {},
  exportStatic: {},
  qiankun: {
    slave: {},
  },
});
