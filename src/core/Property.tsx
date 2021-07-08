import React, { FC, useContext } from 'react';

import ComponentDataContext from './context/component-data';

interface PropertyProps {
  prefixCls?: string;
}

const Property: FC<PropertyProps> = ({ prefixCls }) => {
  const { curComponent } = useContext(ComponentDataContext);

  return <div className={prefixCls}>{JSON.stringify(curComponent?.style)}</div>;
};

Property.defaultProps = {
  prefixCls: 'visual-drag-property'
};

export default Property;
