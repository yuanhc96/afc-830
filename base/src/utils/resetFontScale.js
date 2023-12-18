// let scale = 1;
export const resetFontScale = (scale) => {
  const docEle = document.documentElement;
  function setHtmlFontSize(scale) {
    let fontSize = 16 * scale
    docEle.style.fontSize = `${fontSize.toFixed(5)}px`;
  }

  setHtmlFontSize(scale);
}