// // 公共样式
export const commonStyle = {
  rotate: 0,
  opacity: 1
};

export const COMPONENT_LIST = (() => {
  const baseConfig = [
    {
      name: 'r-input',
      label: '文字',
      props: {
        placeholder: '请输入'
      },
      style: {
        width: 200,
        height: 32
      }
    },
    {
      name: 'r-button',
      label: '按钮',
      props: {},
      style: {
        width: 100,
        height: 32
      }
    }
  ];

  return baseConfig.map(config => ({
    ...config,
    style: { ...config.style, ...commonStyle }
  }));
})();
