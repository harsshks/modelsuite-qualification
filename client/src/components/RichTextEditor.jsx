import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

/**
 * RichTextEditor — a dark-themed Quill wrapper.
 *
 * Props
 * ─────
 * @param {string}   value       – HTML string
 * @param {function} onChange    – (html: string) => void
 * @param {string}   [placeholder]
 */

const MODULES = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link'],
    ['clean'],
  ],
};

const FORMATS = [
  'header',
  'bold', 'italic', 'underline', 'strike',
  'list',
  'link',
];

const RichTextEditor = ({ value, onChange, placeholder = 'Write something…' }) => {
  return (
    <div className="rich-text-editor">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={MODULES}
        formats={FORMATS}
        placeholder={placeholder}
      />
    </div>
  );
};

export default RichTextEditor;
