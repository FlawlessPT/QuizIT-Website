import { memo } from "react";

// UTILITY FROM https://github.com/DJanoskova/React-withMemo-
// Got it from an amazing article he made about improving React performance
const withMemo = (Component, checkedProps) => {
  function areEqual(prevProps, nextProps) {
    let isEqual = true;
    for (let i = 0; i < checkedProps.length; i++) {
      const checkedProp = checkedProps[i];
      if (
        JSON.stringify(prevProps[checkedProp]) !==
        JSON.stringify(nextProps[checkedProp])
      ) {
        isEqual = false;
        break;
      }
    }
    return isEqual;
  }

  return memo(Component, areEqual);
};

export default withMemo;
