import styled, { keyframes } from 'styled-components'
import { useTheme } from '../context/ThemeContext'

const shimmer = keyframes`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`

const ThemePageContainer = styled.div`
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 80%;
  max-width: 800px;
  height: 100%;

  overflow: scroll;

  h1 {
    color: #333;
    margin-bottom: 2rem;
    text-align: center;
    font-size: 2.5rem;
  }
`

const ThemeSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1rem;
`

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  label {
    font-size: 1.1rem;
    color: #444;
    font-weight: 500;
  }

  input {
    padding: 0.5rem;
    border: 2px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
    transition: all 0.3s ease;

    &:focus {
      outline: none;
      border-color: #0064fa;
      box-shadow: 0 0 0 2px rgba(0, 100, 250, 0.1);
    }
  }

  &:hover {
    label {
      color: #0064fa;
    }
  }
`

const MarkdownPreview = styled.div<{ $color: string; $type: string }>`
  margin-top: 1rem;
  padding: 1rem;
  border: 1px solid #eee;
  border-radius: 4px;
  color: ${({ $color }) => $color};
  font-size: ${({ $type }) =>
    $type === 'h1' ? '2em' : $type === 'h2' ? '1.5em' : $type === 'h3' ? '1.25em' : '1.1em'};
  font-weight: bold;
  text-align: center;
  background: #f9f9f9;
  transition: color 0.3s ease;
`

const ColorPreview = styled.div<{ $color: string }>`
  width: 100%;
  height: 40px;
  background: ${({ $color }) => $color};
  border-radius: 4px;
  margin-top: 0.5rem;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 200%;
    height: 100%;
    background: linear-gradient(
      to right,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.3) 50%,
      rgba(255, 255, 255, 0) 100%
    );
    animation: ${shimmer} 3s infinite linear;
  }
`

export const ThemePage = () => {
  const { theme, updateTheme } = useTheme()

  return (
    <ThemePageContainer>
      <h1>Theme</h1>
      <ThemeSection>
        <InputGroup>
          <label htmlFor="header-background">Header Background</label>
          <input
            id="header-background"
            type="color"
            value={theme.headerBackground}
            onChange={(e) => updateTheme({ headerBackground: e.target.value })}
            className="header-background"
          />
          <ColorPreview $color={theme.headerBackground} />
        </InputGroup>
        <InputGroup>
          <label htmlFor="footer-background">Footer Background</label>
          <input
            id="footer-background"
            type="color"
            value={theme.footerBackground}
            onChange={(e) => updateTheme({ footerBackground: e.target.value })}
            className="footer-background"
          />
          <ColorPreview $color={theme.footerBackground} />
        </InputGroup>

        <InputGroup>
          <label htmlFor="markdown-h1">Markdown H1</label>
          <input
            id="markdown-h1"
            type="color"
            value={theme.markdownH1}
            onChange={(e) => updateTheme({ markdownH1: e.target.value })}
            className="markdown-h1"
          />
          <MarkdownPreview $color={theme.markdownH1} $type="h1">
            Heading 1 Preview
          </MarkdownPreview>
        </InputGroup>

        <InputGroup>
          <label htmlFor="markdown-h2">Markdown H2</label>
          <input
            id="markdown-h2"
            type="color"
            value={theme.markdownH2}
            onChange={(e) => updateTheme({ markdownH2: e.target.value })}
            className="markdown-h2"
          />
          <MarkdownPreview $color={theme.markdownH2} $type="h2">
            Heading 2 Preview
          </MarkdownPreview>
        </InputGroup>

        <InputGroup>
          <label htmlFor="markdown-h3">Markdown H3</label>
          <input
            id="markdown-h3"
            type="color"
            value={theme.markdownH3}
            onChange={(e) => updateTheme({ markdownH3: e.target.value })}
            className="markdown-h3"
          />
          <MarkdownPreview $color={theme.markdownH3} $type="h3">
            Heading 3 Preview
          </MarkdownPreview>
        </InputGroup>

        <InputGroup>
          <label htmlFor="markdown-h4">Markdown H4</label>
          <input
            id="markdown-h4"
            type="color"
            value={theme.markdownH4}
            onChange={(e) => updateTheme({ markdownH4: e.target.value })}
            className="markdown-h4"
          />
          <MarkdownPreview $color={theme.markdownH4} $type="h4">
            Heading 4 Preview
          </MarkdownPreview>
        </InputGroup>

        <InputGroup>
          <label htmlFor="button-primary">Button Primary</label>
          <input
            id="button-primary"
            type="color"
            value={theme.buttonPrimary}
            onChange={(e) => updateTheme({ buttonPrimary: e.target.value })}
            className="button-primary"
          />
          <ColorPreview $color={theme.buttonPrimary} />
        </InputGroup>

        <InputGroup>
          <label htmlFor="button-secondary">Button Secondary</label>
          <input
            id="button-secondary"
            type="color"
            value={theme.buttonSecondary}
            onChange={(e) => updateTheme({ buttonSecondary: e.target.value })}
            className="button-secondary"
          />
          <ColorPreview $color={theme.buttonSecondary} />
        </InputGroup>

        <InputGroup>
          <label htmlFor="button-danger">Button Danger</label>
          <input
            id="button-danger"
            type="color"
            value={theme.buttonDanger}
            onChange={(e) => updateTheme({ buttonDanger: e.target.value })}
            className="button-danger"
          />
          <ColorPreview $color={theme.buttonDanger} />
        </InputGroup>

        <InputGroup>
          <label htmlFor="toast-background">Toast Background</label>
          <input
            id="toast-background"
            type="color"
            value={theme.toastBackground}
            onChange={(e) => updateTheme({ toastBackground: e.target.value })}
            className="toast-background"
          />
          <ColorPreview $color={theme.toastBackground} />
        </InputGroup>
      </ThemeSection>
    </ThemePageContainer>
  )
}
