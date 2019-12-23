export default {
  reactssr: {
    package: 'egg-view-react-ssr',
  },
  aop: {
    // 需要同时开启，controller插件依赖
    enable: true,
    package: 'egg-aop',
  },
  controller: {
    enable: true,
    package: 'egg-controller',
  },
};
