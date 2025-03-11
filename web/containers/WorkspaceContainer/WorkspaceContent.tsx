'use client'

import React, { ReactNode, useRef, useEffect } from 'react'
import { twMerge } from 'tailwind-merge'
import Markdown from 'react-markdown'
import WorkspaceGraphicsContainer from './WorkspaceGraphicsContainer'

type WorkspaceMode = 'text' | 'graphics'

interface WorkspaceContentProps {
  activeMode: WorkspaceMode
  textContent?: string
  graphicsContent?: string
}

interface GraphicsRendererProps {
  content: string
}

const GraphicsRenderer: React.FC<GraphicsRendererProps> = ({ content }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Insert HTML content
    containerRef.current.innerHTML = content;

    // Execute scripts in the content
    // const scripts = containerRef.current.getElementsByTagName('script');
    // Array.from(scripts).forEach(oldScript => {
    //   const newScript = document.createElement('script');
    //   Array.from(oldScript.attributes).forEach(attr => {
    //     newScript.setAttribute(attr.name, attr.value);
    //   });
    //   newScript.text = oldScript.text;
    //   oldScript.parentNode?.replaceChild(newScript, oldScript);
    // });

    // // Cleanup function
    // return () => {
    //   if (containerRef.current) {
    //     // Find and dispose Three.js renderers if they exist
    //     const renderers = containerRef.current.querySelectorAll('canvas');
    //     renderers.forEach(canvas => {
    //       const renderer = (window as any).__THREE_RENDERERS__?.get(canvas);
    //       if (renderer) {
    //         renderer.dispose();
    //         (window as any).__THREE_RENDERERS__?.delete(canvas);
    //       }
    //     });
    //     containerRef.current.innerHTML = '';
    //   }
    // };
  }, [content]);

  return <div ref={containerRef} className="w-full h-full" />;
};

const WorkspaceContent: React.FC<WorkspaceContentProps> = ({
  activeMode,
  textContent,
  graphicsContent
}) => {
  return (
    <div
      className="flex-1 overflow-auto p-6"
      data-testid="workspace-content"
    >
      <div
        className={twMerge(
          "h-full transition-opacity duration-200",
          activeMode === 'text' ? "block opacity-100" : "hidden opacity-0"
        )}
      >
        <Markdown className="markdown-content message">
          {textContent || "No text content available"}
        </Markdown>
      </div>

      <div
        className={twMerge(
          "h-full transition-opacity duration-200",
          activeMode === 'graphics' ? "block opacity-100" : "hidden opacity-0"
        )}
      >
        {graphicsContent ? (
          <WorkspaceGraphicsContainer>
            <GraphicsRenderer content={graphicsContent} />
          </WorkspaceGraphicsContainer>
        ) : (
          <WorkspaceGraphicsContainer>
            <p>No graphics content available</p>
          </WorkspaceGraphicsContainer>
        )}
      </div>
    </div>
  )
}

export default WorkspaceContent