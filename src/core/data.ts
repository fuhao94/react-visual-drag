import { map } from 'lodash-es';

// 公共样式
export const commonStyle = {
  rotate: 0,
  opacity: 1,
  top: 0,
  left: 0
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
        height: 32,
        borderWidth: 1,
        borderColor: '',
        borderRadius: '',
        fontSize: 14,
        fontWeight: 500,
        lineHeight: '',
        letterSpacing: 0,
        textAlign: '',
        color: '',
        backgroundColor: ''
      }
    },
    {
      name: 'r-img',
      label: '图片',
      props: {
        src: require('@/assets/cat.jpeg').default
      },
      style: {
        width: 192,
        height: 120
      }
    }
  ];

  return map(baseConfig, config => ({
    // 未创建的ID
    id: -1,
    ...config,
    style: { ...config.style, ...commonStyle }
  }));
})();
