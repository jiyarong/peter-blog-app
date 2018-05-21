import React from 'react';
import { Button, Icon } from 'antd';

import './Control.less';

export default ({ onFullScreen, onPreview, onPasteModeChange, pasteMode }) => (
  <div className="milk-buttons">
    <div className="milk-buttons-container">
      <div className="milk-buttons-slide">
        <div>
          <Button onClick={onFullScreen} >
            <Icon type="arrows-alt" />
          </Button>
        </div>
        <div>
          <Button onClick={onPreview} >
            <Icon type="eye" />
          </Button>
        </div>
      </div>
      <div className="milk-buttons-drag">
        <div className="fa fa-arrow-down" >
          <Icon type="arrow-down" style={{fontSize: 25}} />
        </div>
      </div>
    </div>
  </div>
);
