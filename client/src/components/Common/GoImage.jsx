import React from 'react';

export default function GoImage({ src, className, style, goImg }) {
  return (
    <img
      className={className}
      style={style}
      src={goImg ? `http://127.0.0.1:2222/api/image/${src.split('.')[0]}` : src}
      alt="C00l"
    />
  );
}
