import React from 'react';

const Logo = (props) => {
    return (
      <div>
    <img
                alt="Logo"
                style={{width: 40}}
      src="/static/logo.svg"
      {...props}
            />
    </div>
  );
};

export default Logo;
