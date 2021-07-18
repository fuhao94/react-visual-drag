import React, { FC, useContext } from 'react';

import ComponentDataContext from './context/component-data';

interface PropertyProps {
  prefixCls?: string;
}

const Property: FC<PropertyProps> = ({ prefixCls }) => {
  const { componentState } = useContext(ComponentDataContext);

  return (
    <div className={prefixCls}>
      {JSON.stringify(componentState.curComponent?.style)}
      <br />
      <br />
      {JSON.stringify(componentState?.snapshots)}
    </div>
  );
};

Property.defaultProps = {
  prefixCls: 'visual-drag-property'
};

export default Property;
