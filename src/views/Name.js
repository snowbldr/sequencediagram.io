import React from "react";
import * as ac from "./../reducers";
import nameBackground from "./pngs/name-background.png";

export default function(props) {
  const { pending, dispatch, component, showBackground } = props;

  // pending.componentRenamed && pending.componentRenamed.key === message.key

  function handleKeyDown(e) {
    const Ret = 13;
    if (e.keyCode === Ret) {
      commit();
    }
  }

  function onRef(el) {
    if (
      el &&
      props.pending.componentRenamed &&
      props.pending.componentRenamed.preselect
    ) {
      el.focus();
      el.select();
    }
  }

  function commit() {
    if (pending.componentRenamed) {
      dispatch(
        ac.renameComponent(component.key, pending.componentRenamed.newName)
      );
      dispatch(ac.escapePendingOperation());
    }
  }

  function onChange(e) {
    dispatch(ac.editComponentName(component.key, e.target.value, false));
  }

  if (
    pending &&
    pending.componentRenamed &&
    pending.componentRenamed.key === component.key
  ) {
    const value = pending.componentRenamed.newName;
    return (
      <input
        style={showBackground ? { padding: 10 } : null}
        ref={onRef}
        size={value ? value.length : 1}
        type="text"
        value={value}
        onKeyDown={handleKeyDown}
        onChange={onChange}
        onBlur={commit}
      />
    );
  } else {
    return (
      <div
        className="message-end"
        style={
          showBackground ? (
            {
              display: "inline-block",
              borderImage: `url(${nameBackground}) 10 fill repeat`,
              borderWidth: 10,
              borderStyle: "solid",
            }
          ) : null
        }
      >
        {component.name}
      </div>
    );
  }
}
