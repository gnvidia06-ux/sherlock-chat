import "@testing-library/jest-dom/vitest";

// jsdom no implementa scrollIntoView; lo mockeamos para que los componentes
// que hacen scroll automático (como la página de Chat) no rompan los tests.
if (!window.HTMLElement.prototype.scrollIntoView) {
  window.HTMLElement.prototype.scrollIntoView = () => {};
}
