/* ============================================
   LinkProvider — which component renders an internal link
   --------------------------------------------
   Every kit component that takes `to` (Button, TextLink, IconButton,
   ProjectTile) renders it through the component this context supplies.
   Today that is plain react-router-dom `Link`. Prompt 04 swaps in the
   transition-aware link in ONE place:

     <LinkProvider component={TLink}>…</LinkProvider>

   The supplied component must accept `to`, `className`, `children`, a ref
   and any other anchor props, like `Link` does.
   ============================================ */

import React, { createContext, useContext } from 'react';
import { Link } from 'react-router-dom';

const LinkContext = createContext(Link);

export const LinkProvider = ({ component = Link, children }) => (
  <LinkContext.Provider value={component}>{children}</LinkContext.Provider>
);

/** The link component in effect (react-router-dom `Link` by default). */
export const useLinkComponent = () => useContext(LinkContext);

export default LinkProvider;
