import React, { ReactNode } from "react";

interface FormattedTextProps {
  children: ReactNode;
}

// Split a string by **bold** segments into a list of React nodes
function splitByBold(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const regex = /\*\*([^*]+)\*\*/g; // matches **...**
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    const start = match.index;
    const end = regex.lastIndex;

    if (start > lastIndex) {
      nodes.push(text.slice(lastIndex, start)); // plain text before **
    }

    nodes.push(
      <span key={nodes.length} className="font-bold">
        {match[1]}
      </span>
    );

    lastIndex = end;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex)); // trailing plain text
  }

  return nodes;
}

const FormattedText: React.FC<FormattedTextProps> = ({ children }) => {
  if (typeof children !== "string") {
    // Already JSX; just render as-is.
    return <>{children}</>;
  }
  return <>{splitByBold(children)}</>;
};

export default FormattedText;
