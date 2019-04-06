import React from 'react';

import "./Icon.css";

export default function Icon(props) {

  return (
    <span className="icon">
      {props.children}
    </span>
  );
}
