import React, { useMemo, useState, useEffect } from 'react';
import SimpleMDE from 'react-simplemde-editor';
import 'easymde/dist/easymde.min.css';

const ReadingMetrics = ({ metrics, setMetrics }) => {
  const genres = ['fiction', 'non-fiction', 'biography', 'philosophy', 'technical'];
  
  const [pagesInput, setPagesInput] = useState(metrics.pages_goal || '');
  
  useEffect(() => {
    setPagesInput(metrics.pages_goal || '');
  }, [metrics.pages_goal]);

  const handleChange = (field, value) => {
    setMetrics({
      ...metrics,
      [field]: value
    });
  };

  const handlePagesChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^\d+$/.test(value)) {
      setPagesInput(value);
      handleChange('pages_goal', value === '' ? '' : Number(value));
    }
  };

  const editorOptions = useMemo(() => ({
    spellChecker: false,
    toolbar: [
      'bold',
      'italic',
      '|',
      'unordered-list',
      'ordered-list',
      '|',
      'preview'
    ],
    status: false,
    minHeight: '100px',
    autofocus: false,
    autoRefresh: true
  }), []);

  return (
    <div className="space-y-6">
      {/* Genre */}
      <div>
        <label className="block text-sm mb-2">Genre</label>
        <select
          value={metrics.genre || ''}
          onChange={(e) => handleChange('genre', e.target.value)}
          className="w-full bg-transparent border-2 border-gold-500/20 rounded-lg p-3 appearance-none"
          style={{ WebkitAppearance: 'none', MozAppearance: 'none' }}
        >
          <option value="">Select genre...</option>
          {genres.map(g => (
            <option key={g} value={g}>{g.charAt(0).toUpperCase() + g.slice(1)}</option>
          ))}
        </select>
      </div>
      
      {/* Pages Goal */}
      <div>
        <label className="block text-sm mb-2">Pages Goal</label>
        <input
          type="number"
          min="0"
          className="w-full bg-transparent border-2 border-gold-500/20 rounded-lg p-3"
          value={pagesInput}
          onChange={handlePagesChange}
          placeholder="Enter number of pages"
        />
      </div>

      {/* Notes with SimpleMDE Editor */}
      <div>
        <label className="block text-sm mb-2">Notes</label>
        <div className="border-2 border-gold-500/20 rounded-lg overflow-hidden">
          <SimpleMDE
            value={metrics.notes || ''}
            onChange={(value) => handleChange('notes', value)}
            options={editorOptions}
            className="prose max-w-none"
          />
        </div>
      </div>

      <style jsx global>{`
        .EasyMDEContainer {
          background: transparent;
        }
        .EasyMDEContainer .CodeMirror {
          background: transparent;
          border: none;
          color: inherit;
        }
        .editor-toolbar {
          border: none;
          border-bottom: 1px solid rgba(234, 179, 8, 0.2);
          background: transparent;
        }
        .editor-toolbar button {
          color: inherit !important;
        }
        .editor-toolbar button:hover {
          background: rgba(234, 179, 8, 0.1);
        }
        .editor-toolbar.disabled-for-preview button:not(.no-disable) {
          background: transparent;
        }
        .editor-preview {
          background: transparent;
        }
        select {
          appearance: none;
          -webkit-appearance: none;
          -moz-appearance: none;
        }
      `}</style>
    </div>
  );
};

export default ReadingMetrics;