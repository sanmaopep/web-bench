import { atom } from 'jotai';
import { renderMarkdown } from '../utils/markdown';

export const markdownAtom = atom((get, md: string) => {
  return renderMarkdown(md);
});