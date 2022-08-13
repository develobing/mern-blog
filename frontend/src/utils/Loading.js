import React from 'react';
import RiseLoader from 'react-spinners/CircleLoader';

const parentStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: 'rgba(255, 255, 255, 0.5)',
};

const override = {
  display: 'block',
  margin: '0 auto',
  borderColor: 'red',
};

const Loading = () => {
  return (
    <div style={parentStyle}>
      <RiseLoader color="red" loading={true} css={override}></RiseLoader>;
    </div>
  );
};

export default Loading;
