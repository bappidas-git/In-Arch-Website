// Jest setup (Create React App runs this before every test file).
// Adds the jest-dom matchers: toBeInTheDocument, toHaveAttribute, …
import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';
import { configure } from '@testing-library/dom';
import { act } from '@testing-library/react';

// react-router 7 builds a TextEncoder at module scope; Jest 27's jsdom has none.
if (typeof global.TextEncoder === 'undefined') global.TextEncoder = TextEncoder;
if (typeof global.TextDecoder === 'undefined') global.TextDecoder = TextDecoder;

// jsdom has no matchMedia; GSAP's ScrollTrigger calls it when registered.
// Every query answers "no match" (so reduced motion is off in tests).
if (typeof window !== 'undefined' && typeof window.matchMedia !== 'function') {
  window.matchMedia = (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  });
}

// user-event resolves the top-level @testing-library/dom (v10), while
// @testing-library/react patches its own nested copy (v9). Give the top-level
// copy the same act() wrappers (RTL's act, which also manages the
// IS_REACT_ACT_ENVIRONMENT flag), so user-event interactions are wrapped in act.
configure({
  eventWrapper: (cb) => {
    let result;
    act(() => {
      result = cb();
    });
    return result;
  },
  asyncWrapper: async (cb) => {
    const previous = global.IS_REACT_ACT_ENVIRONMENT;
    global.IS_REACT_ACT_ENVIRONMENT = false;
    try {
      return await cb();
    } finally {
      global.IS_REACT_ACT_ENVIRONMENT = previous;
    }
  },
});
