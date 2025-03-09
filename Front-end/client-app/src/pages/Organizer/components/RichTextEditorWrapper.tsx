import React, { useEffect, useRef } from 'react';

interface RichTextEditorProps {
  initialValue: string;
  onChange: (content: string) => void;
  maxHTMLLength?: number;
}

declare global {
  interface Window {
    RichTextEditor: any;
  }
}

const RichTextEditorWrapper: React.FC<RichTextEditorProps> = ({ initialValue, onChange, maxHTMLLength = -1 }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const rteInstanceRef = useRef<any>(null);

  useEffect(() => {
    // Load CSS
    if (!document.getElementById('rte-css')) {
      const link = document.createElement('link');
      link.id = 'rte-css';
      link.rel = 'stylesheet';
      link.href = '/richtexteditor/rte_theme_default.css';
      document.head.appendChild(link);
    }

    // Load JS
    const loadScript = (src: string, id: string): Promise<void> => {
      return new Promise((resolve) => {
        if (document.getElementById(id)) {
          resolve();
          return;
        }

        const script = document.createElement('script');
        script.id = id;
        script.src = src;
        script.onload = () => resolve();
        document.body.appendChild(script);
      });
    };

    // Load scripts in sequence
    const initEditor = async () => {
      try {
        await loadScript('/richtexteditor/rte.js', 'rte-js');
        await loadScript('/richtexteditor/plugins/all_plugins.js', 'rte-plugins');

        // Initialize editor after scripts are loaded
        if (editorRef.current && window.RichTextEditor) {
          // Enhanced configuration with colors and bullet points
          rteInstanceRef.current = new window.RichTextEditor(editorRef.current, { 
            maxHTMLLength,
            toolbar: "full", // Using full toolbar which includes all features
            toolbar_guide: true,
            skin: "gray", // Dark theme to match your UI
            
            // Custom toolbar configuration - ensure colors and bullet points are included
            toolbar_items: [
              ["undo", "redo", "fullscreenenter"],
              ["fontname", "fontsize", "lineheight"], 
              ["bold", "italic", "underline", "strikethrough"], 
              ["forecolor", "backcolor"], // Text and background colors
              ["alignleft", "aligncenter", "alignright", "alignjustify"], 
              ["indent", "outdent"],
              ["bulleting", "numbering"], // Bullet points and numbered lists
              ["createlink", "insertimage", "insertblockquote", "insertemoji"],
              ["paragraphformat", "formatblock"],
              ["showblocks", "removeformat", "cleanformatting"]
            ],
            
            // Custom colors in the color picker
            colors: [
              "#000000", "#333333", "#555555", "#999999", "#CCCCCC", "#FFFFFF",
              "#FF5733", "#E91E63", "#9C27B0", "#673AB7", "#3F51B5", "#2196F3",
              "#03A9F4", "#00BCD4", "#009688", "#4CAF50", "#8BC34A", "#CDDC39",
              "#FFEB3B", "#FFC107", "#FF9800", "#FF5722", "#795548", "#607D8B"
            ],
            
            change: function () {
              // Update form value when content changes
              if (rteInstanceRef.current) {
                onChange(rteInstanceRef.current.getHTMLCode());
              }
            }
          });
          
          // Set initial content
          if (initialValue) {
            rteInstanceRef.current.setHTMLCode(initialValue);
          }
        }
      } catch (error) {
        console.error('Error loading RichTextEditor:', error);
      }
    };

    initEditor();

    // Cleanup
    return () => {
      if (rteInstanceRef.current) {
        try {
          rteInstanceRef.current.destroy();
        } catch (e) {
          console.error('Error destroying editor:', e);
        }
      }
    };
  }, []);

  return (
    <div className="rich-text-editor-container">
      <div ref={editorRef} className="editor-container" style={{ minHeight: "300px" }}></div>
      <style>{`
        .rich-text-editor-container {
          border-radius: 10px;
          overflow: hidden;
        }
        .editor-container {
          min-height: 300px;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditorWrapper;