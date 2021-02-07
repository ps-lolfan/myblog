import React from "react";
import { Popup } from "semantic-ui-react";

function MyPopup({ content, children }) {
  return (
    <Popup
      content={content}
      inverted
      trigger={children}
      position="bottom center"
    />
  );
}

export default MyPopup;
