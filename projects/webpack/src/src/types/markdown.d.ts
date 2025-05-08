declare module '*.md' {
  const content: string;
  export const frontmatter: {
    [key: string]: any;
  };
  export default content;
} 