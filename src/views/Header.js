import React from "react";
import { isChrome } from "./utils";

const gitMasterBuild = document.location.host.indexOf("git-master") !== -1;

function Kbd(props) {
  return (
    <kbd
      style={{
        display: "inline-block",
        padding: "0.2em",
        color: "black",
        backgroundColor: "#ccc",
        borderRadius: "4px",
      }}
    >
      {props.children}
    </kbd>
  );
}

function Info(props) {
  return (
    <div style={{ color: "#002456", padding: "10px 20px", paddingTop: 0 }}>
      {props.children}
    </div>
  );
}

export default function(props) {
  const { showShareInfo, touchWarn, showNewContentAvailable } = props.pending;

  return (
    <div
      style={{
        backgroundColor: "#64b9ef",
      }}
    >
      {gitMasterBuild && (
        <Info>
          <b>Risk of dataloss:</b>
          <br />This is a build deployed by continous integration directly from
          the git master branch
        </Info>
      )}

      {touchWarn && (
        <Info>
          <b>Touch input is not supported:</b> Touch input is not supported yet,
          please use a mouse or contribute touch input support via GitHub
        </Info>
      )}

      {!isChrome() && (
        <Info>
          <b>Unsupported browser:</b> Your browser is not supported yet, please
          use Google Chrome or contribute more browser support via GitHub
        </Info>
      )}

      {showShareInfo && (
        <Info>
          <b>Share by URL:</b> The current diagram is tersely encoded in the
          current URL and can simply be shared as-is by copy-paste from the
          browser address bar.
        </Info>
      )}

      {showShareInfo && (
        <Info>
          <b>Share by PNG:</b> <Kbd>F12</Kbd> (for <i>Developer Tools</i>) then{" "}
          <Kbd>Ctrl/Cmd + Shift + P</Kbd> (for <i>Command Menu</i>) then{" "}
          <Kbd>Capture full size screenshot</Kbd>.
        </Info>
      )}

      {showNewContentAvailable && (
        <Info>
          <b>New version available:</b> A new version of the this web app has
          been published. Press F5 to load it.
        </Info>
      )}
    </div>
  );
}
