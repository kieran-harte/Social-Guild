import { css } from 'lit-element'
export default css`
  * {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-family: 'Roboto', sans-serif;
    letter-spacing: 0.02em;
    letter-spacing: 0.00625em;
    word-spacing: 0.1em;
    font-weight: 400;
    font-size: 15px;
    color: #484848;
    box-sizing: border-box;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
    overflow-wrap: break-word;
    margin: 0;
    padding: 0;
  }
  html,
  body {
    overflow-x: hidden;
  }
  ::-webkit-scrollbar {
    width: 12px;
  }
  ::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
  ::-webkit-scrollbar-thumb {
    background: #888;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`
