import React, { createContext, useCallback, useContext, useRef } from 'react';

const FocusContext = createContext();

export function FocusProvider({ children }) {
  const commentInfoRef = useRef(null);

  const registerCommentRef = useCallback((info) => {
    commentInfoRef.current = info;
  }, []);

  const focusComment = useCallback((value) => {
    if (commentInfoRef.current) {
      const { ref, setValue } = commentInfoRef.current;
      ref.current?.focus();
      setValue(value);
    }
  }, []);

  return (
    <FocusContext.Provider value={{ registerCommentRef, focusComment }}>
      {children}
    </FocusContext.Provider>
  );
}

export function useFocusContext() {
  return useContext(FocusContext);
}