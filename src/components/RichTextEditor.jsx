import { useEffect, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

function normalizeRichTextHtml(html = '') {
  if (!html) return '';

  const fallback = html
    .replace(/&shy;/gi, '')
    .replace(/[\u00AD\u200B-\u200D\uFEFF]/g, '')
    .replace(/([A-Za-z])\s*\r?\n\s*([A-Za-z])/g, '$1$2')
    .trim();

  if (typeof DOMParser === 'undefined' || typeof NodeFilter === 'undefined') {
    return fallback;
  }

  const doc = new DOMParser().parseFromString(fallback, 'text/html');
  const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT);
  let currentNode = walker.nextNode();

  while (currentNode) {
    currentNode.textContent = (currentNode.textContent || '')
      .replace(/[\u00AD\u200B-\u200D\uFEFF]/g, '')
      .replace(/([A-Za-z])\s*\r?\n\s*([A-Za-z])/g, '$1$2');
    currentNode = walker.nextNode();
  }

  return doc.body.innerHTML.trim();
}

// Register custom font sizes
const Size = Quill.import('formats/size');
Size.whitelist = ['10px', '12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px', '36px'];
Quill.register(Size, true);

export default function RichTextEditor({ value, onChange, placeholder, onImageUpload }) {
  const containerRef = useRef(null);
  const quillRef = useRef(null);
  const onChangeRef = useRef(onChange);
  const onImageUploadRef = useRef(onImageUpload);
  const isInternalChange = useRef(false);
  const fileInputRef = useRef(null);

  // Keep onChangeRef current without re-running effect
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    onImageUploadRef.current = onImageUpload;
  }, [onImageUpload]);

  // Mount Quill once
  useEffect(() => {
    if (quillRef.current) return;

    const quill = new Quill(containerRef.current, {
      theme: 'snow',
      placeholder: placeholder || 'Enter description...',
      modules: {
        toolbar: [
          [{ header: [1, 2, 3, false] }],
          [{ size: ['10px', '12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px', '36px'] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ color: [
            '#000000','#1a1a1a','#333333','#555555','#777777','#999999','#bbbbbb','#dddddd','#ffffff',
            '#e74c3c','#c0392b','#e67e22','#d35400','#f1c40f','#f39c12',
            '#2ecc71','#27ae60','#1abc9c','#16a085',
            '#3498db','#2980b9','#9b59b6','#8e44ad',
            '#ff69b4','#ff1493','#ff6347','#ffa500',
            'custom'
          ] }, { background: [
            '#000000','#1a1a1a','#333333','#555555','#777777','#999999','#bbbbbb','#dddddd','#ffffff',
            '#e74c3c','#c0392b','#e67e22','#d35400','#f1c40f','#f39c12',
            '#2ecc71','#27ae60','#1abc9c','#16a085',
            '#3498db','#2980b9','#9b59b6','#8e44ad',
            '#ff69b4','#ff1493','#ff6347','#ffa500',
            'custom'
          ] }],
          [{ list: 'ordered' }, { list: 'bullet' }],
          [{ align: [] }],
          ['link', 'image'],
          ['clean'],
        ],
      },
    });

    const toolbar = quill.getModule('toolbar');
    toolbar.addHandler('image', () => {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
        fileInputRef.current.click();
      }
    });

    // Set initial value
    if (value) {
      quill.clipboard.dangerouslyPasteHTML(normalizeRichTextHtml(value));
    }

    quill.on('text-change', () => {
      isInternalChange.current = true;
      const html = normalizeRichTextHtml(quill.root.innerHTML);
      onChangeRef.current(html === '<p><br></p>' ? '' : html);
    });

    quillRef.current = quill;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInlineImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!onImageUploadRef.current) return;

    try {
      const imageUrl = await onImageUploadRef.current(file);
      if (!imageUrl) return;

      const quill = quillRef.current;
      if (!quill) return;

      const range = quill.getSelection(true);
      const insertAt = range ? range.index : quill.getLength();

      quill.insertEmbed(insertAt, 'image', imageUrl, 'user');
      quill.insertText(insertAt + 1, '\n', 'user');
      quill.setSelection(insertAt + 2, 0, 'silent');
    } catch {
      // Parent handles toast/message for upload failure.
    }
  };

  // Sync external value changes (e.g. when form resets or product loads)
  useEffect(() => {
    const quill = quillRef.current;
    if (!quill) return;
    if (isInternalChange.current) {
      isInternalChange.current = false;
      return;
    }
    const current = normalizeRichTextHtml(quill.root.innerHTML);
    const incoming = normalizeRichTextHtml(value || '');
    if (current !== incoming) {
      quill.clipboard.dangerouslyPasteHTML(incoming);
    }
  }, [value]);

  return (
    <div className="rich-text-editor">
      <div ref={containerRef} />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleInlineImageChange}
        className="hidden"
      />
      <style>{`
        .rich-text-editor .ql-toolbar {
          border-top-left-radius: 0.5rem;
          border-top-right-radius: 0.5rem;
          background: #1e1e32;
          border-color: #2d2d4a;
          flex-wrap: wrap;
        }
        .rich-text-editor .ql-container {
          min-height: 140px;
          font-family: 'Poppins', sans-serif;
          font-size: 0.875rem;
          border-bottom-left-radius: 0.5rem;
          border-bottom-right-radius: 0.5rem;
          background: #1a1a2e;
          border-color: #2d2d4a;
        }
        /* toolbar icons */
        .rich-text-editor .ql-toolbar .ql-stroke {
          stroke: #c0b8d8;
        }
        .rich-text-editor .ql-toolbar .ql-fill {
          fill: #c0b8d8;
        }
        .rich-text-editor .ql-toolbar button:hover .ql-stroke,
        .rich-text-editor .ql-toolbar button.ql-active .ql-stroke {
          stroke: #9b59b6;
        }
        .rich-text-editor .ql-toolbar button:hover .ql-fill,
        .rich-text-editor .ql-toolbar button.ql-active .ql-fill {
          fill: #9b59b6;
        }
        /* picker labels (header, size, color, background) */
        .rich-text-editor .ql-picker {
          color: #c0b8d8;
        }
        .rich-text-editor .ql-picker-label {
          color: #c0b8d8;
          border-color: #3a3a5a !important;
          background: #2a2a42;
          border-radius: 4px;
        }
        .rich-text-editor .ql-picker-label:hover {
          color: #9b59b6;
        }
        .rich-text-editor .ql-picker-label .ql-stroke {
          stroke: #c0b8d8;
        }
        /* dropdown panel */
        .rich-text-editor .ql-picker-options {
          background: #1e1e32 !important;
          border-color: #3a3a5a !important;
          border-radius: 6px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.5);
          z-index: 9999;
        }
        .rich-text-editor .ql-picker-item {
          color: #c0b8d8;
        }
        .rich-text-editor .ql-picker-item:hover,
        .rich-text-editor .ql-picker-item.ql-selected {
          color: #9b59b6 !important;
        }
        /* size picker: show the px value as label */
        .rich-text-editor .ql-size .ql-picker-label[data-value]::before {
          content: attr(data-value);
        }
        .rich-text-editor .ql-size .ql-picker-label:not([data-value])::before {
          content: 'Size';
        }
        .rich-text-editor .ql-size .ql-picker-item[data-value]::before {
          content: attr(data-value);
        }
        /* color picker button — show the "A" text with colour underline */
        .rich-text-editor .ql-color-picker .ql-picker-label svg,
        .rich-text-editor .ql-background .ql-picker-label svg {
          width: 18px;
          height: 18px;
        }
        .rich-text-editor .ql-color .ql-picker-label::before {
          content: 'A';
          font-weight: 700;
          font-size: 14px;
          line-height: 1;
        }
        .rich-text-editor .ql-background .ql-picker-label::before {
          content: 'BG';
          font-weight: 700;
          font-size: 11px;
          line-height: 1;
        }
        /* colour swatch grid */
        .rich-text-editor .ql-color-picker .ql-picker-options,
        .rich-text-editor .ql-background .ql-picker-options {
          padding: 6px;
          width: 192px;
        }
        .rich-text-editor .ql-color-picker .ql-picker-item,
        .rich-text-editor .ql-background .ql-picker-item {
          width: 20px;
          height: 20px;
          border-radius: 3px;
          border: 2px solid transparent;
          margin: 2px;
        }
        .rich-text-editor .ql-color-picker .ql-picker-item:hover,
        .rich-text-editor .ql-background .ql-picker-item:hover {
          border-color: #fff !important;
        }
        /* editor text area */
        .rich-text-editor .ql-editor {
          color: #e8e8ef;
          min-height: 120px;
        }
        .rich-text-editor .ql-editor.ql-blank::before {
          color: #6b6b82;
          font-style: normal;
        }
      `}</style>
    </div>
  );
}
