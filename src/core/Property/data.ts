const textAlignOptions = [
  {
    label: '相左对齐',
    value: 'left'
  },
  {
    label: '居中对齐',
    value: 'center'
  },
  {
    label: '相右对齐',
    value: 'right'
  }
];

export const propertyConfigs = [
  {
    name: 'opacity',
    label: '透明度',
    componentName: 'input',
    props: {}
  },
  {
    name: 'width',
    label: '宽度',
    componentName: 'input',
    props: {}
  },
  {
    name: 'height',
    label: '高度',
    componentName: 'input',
    props: {}
  },
  {
    name: 'fontSize',
    label: '字体大小',
    componentName: 'input',
    props: {}
  },
  {
    name: 'fontWeight',
    label: '字体粗细',
    componentName: 'input',
    props: {}
  },
  {
    name: 'lineHeight',
    label: '行间距',
    componentName: 'input',
    props: {}
  },
  {
    name: 'letterSpace',
    label: '字间距',
    componentName: 'input',
    props: {}
  },
  {
    name: 'textAlign',
    label: '对齐方式',
    componentName: 'select',
    props: {
      options: textAlignOptions
    }
  }
];
