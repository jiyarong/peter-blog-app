import React from 'react';

import './Medium.less';

export default ({ top, left, options }) => (
  <div className="milk-medium" style={{top, left}}>
    {
      options.map((b, i) =>
        <button
          key={i}
          className={`fa fa-${b.type}`}
          onClick={b.fn}
        >
          {b.text && <span>{b.text}</span>}
        </button>)
    }
  </div>
)
