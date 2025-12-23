/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Trash2, CheckCircle, GripVertical, Sparkles, RefreshCcw, X, Plus, Undo2, Redo2, ZoomIn, ZoomOut, Maximize2, Type, Edit3, Wand2, Group, Layers, ChevronDown, ChevronUp, Settings, Download, Upload, Book, Palette, MoreVertical, ChevronLeft, ChevronRight, MousePointer, Move, Sun, Moon, LayoutGrid } from 'lucide-react';

import { generateContentWithFallback } from './utils/openRouterClient';

// --- Undo Toast Component ---
const UndoToast = ({ task, onUndo, onDismiss }) => {
  const [timeLeft, setTimeLeft] = useState(5);

  useEffect(() => {
    if (timeLeft <= 0) {
      onDismiss();
      return;
    }
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, onDismiss]);

  return (
    <div className="fixed bottom-8 left-8 bg-gray-900 text-white px-5 py-4 rounded-xl shadow-2xl z-[200] flex items-center gap-4 animate-in slide-in-from-bottom duration-300">
      <div className="flex-1">
        <p className="font-semibold text-sm">Task Completed!</p>
        <p className="text-xs text-gray-400 mt-0.5">"{task.title}" moved to trash</p>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-xs text-gray-500 tabular-nums">{timeLeft}s</span>
        <button 
          onClick={onUndo}
          className="bg-indigo-500 hover:bg-indigo-600 px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1.5 transition-colors"
        >
          <Undo2 size={14} /> Undo
        </button>
        <button onClick={onDismiss} className="text-gray-500 hover:text-white transition-colors">
          <X size={18} />
        </button>
      </div>
    </div>
  );
};

// --- Delete Confirmation Modal ---
const DeleteConfirmModal = ({ isOpen, taskTitle, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-[150] flex items-center justify-center backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in duration-200">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trash2 className="text-red-600" size={32} />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Delete Task?</h3>
          <p className="text-gray-600 mb-1">Are you sure you want to delete</p>
          <p className="font-semibold text-gray-800 mb-6">"{taskTitle}"?</p>
          <p className="text-sm text-gray-500 mb-6">This action cannot be undone.</p>
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <Trash2 size={18} />
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Drag Out Confirmation Modal ---
const DragOutConfirmModal = ({ isOpen, sectionTitle, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-[200] flex items-center justify-center backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 animate-in zoom-in duration-200">
        <h3 className="text-lg font-bold text-gray-800 mb-2">Remove from Group?</h3>
        <p className="text-gray-600 mb-6">Do you want to move this task out of <span className="font-semibold text-indigo-600">"{sectionTitle}"</span>?</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold">Cancel</button>
          <button onClick={onConfirm} className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold">Yes, Move It</button>
        </div>
      </div>
    </div>
  );
};

// --- Delete Group Modal ---
const DeleteGroupModal = ({ isOpen, groupTitle, onUngroup, onDeleteAll, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-[200] flex items-center justify-center backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-in zoom-in duration-200">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Trash2 className="text-red-600" size={24} />
          </div>
          <h3 className="text-xl font-bold text-gray-800">Delete "{groupTitle}"</h3>
          <p className="text-sm text-gray-500 mt-1">Choose how you want to delete this group</p>
        </div>
        
        <div className="space-y-3">
          <button 
            onClick={onUngroup}
            className="w-full p-4 border-2 border-gray-100 hover:border-indigo-500 rounded-xl flex items-center gap-3 transition-colors group text-left"
          >
            <div className="bg-indigo-50 p-2 rounded-lg text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <Layers size={20} />
            </div>
            <div>
              <p className="font-bold text-gray-800">Delete Label Only</p>
              <p className="text-xs text-gray-500">Remove the group box but keep all tasks</p>
            </div>
          </button>

          <button 
            onClick={onDeleteAll}
            className="w-full p-4 border-2 border-red-50 hover:border-red-500 hover:bg-red-50 rounded-xl flex items-center gap-3 transition-colors group text-left"
          >
            <div className="bg-red-100 p-2 rounded-lg text-red-600 group-hover:bg-red-600 group-hover:text-white transition-colors">
              <Trash2 size={20} />
            </div>
            <div>
              <p className="font-bold text-red-700">Delete Label & Content</p>
              <p className="text-xs text-red-500/80">Delete the group and all tasks inside it</p>
            </div>
          </button>
        </div>

        <button onClick={onCancel} className="mt-6 w-full py-2.5 text-gray-500 hover:text-gray-800 font-semibold text-sm">
          Cancel
        </button>
      </div>
    </div>
  );
};

// --- Color Picker Component ---
const COLOR_OPTIONS = [
  { bg: 'bg-white', border: 'border-slate-300', name: 'Default' },
  { bg: 'bg-red-50', border: 'border-red-300', name: 'Red' },
  { bg: 'bg-orange-50', border: 'border-orange-300', name: 'Orange' },
  { bg: 'bg-amber-50', border: 'border-amber-300', name: 'Amber' },
  { bg: 'bg-yellow-50', border: 'border-yellow-300', name: 'Yellow' },
  { bg: 'bg-lime-50', border: 'border-lime-300', name: 'Lime' },
  { bg: 'bg-green-50', border: 'border-green-300', name: 'Green' },
  { bg: 'bg-teal-50', border: 'border-teal-300', name: 'Teal' },
  { bg: 'bg-cyan-50', border: 'border-cyan-300', name: 'Cyan' },
  { bg: 'bg-sky-50', border: 'border-sky-300', name: 'Sky' },
  { bg: 'bg-blue-50', border: 'border-blue-300', name: 'Blue' },
  { bg: 'bg-indigo-50', border: 'border-indigo-300', name: 'Indigo' },
  { bg: 'bg-violet-50', border: 'border-violet-300', name: 'Violet' },
  { bg: 'bg-purple-50', border: 'border-purple-300', name: 'Purple' },
  { bg: 'bg-fuchsia-50', border: 'border-fuchsia-300', name: 'Fuchsia' },
  { bg: 'bg-pink-50', border: 'border-pink-300', name: 'Pink' },
  { bg: 'bg-rose-50', border: 'border-rose-300', name: 'Rose' },
];

const ColorPicker = ({ selectedColor, onSelectColor, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className={`relative ${className}`}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center gap-2 transition-colors"
        title="Change Color"
      >
        <div className={`w-5 h-5 rounded ${selectedColor.split(' ')[0]} border ${selectedColor.split(' ')[1]}`} />
        <Palette size={14} className="text-slate-500" />
      </button>
      
      {isOpen && (
        <div className="absolute top-full mt-2 left-0 bg-white rounded-xl shadow-xl border p-3 z-50 grid grid-cols-6 gap-2 w-48">
          {COLOR_OPTIONS.map((color, i) => (
            <button
              key={i}
              onClick={() => {
                onSelectColor(`${color.bg} ${color.border}`);
                setIsOpen(false);
              }}
              className={`w-6 h-6 rounded-lg ${color.bg} border-2 ${color.border} hover:scale-110 transition-transform ${selectedColor === `${color.bg} ${color.border}` ? 'ring-2 ring-indigo-500' : ''}`}
              title={color.name}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// --- Settings Modal ---
const SettingsModal = ({ isOpen, onClose, onExport, onImport, onExportNotebook, onImportNotebook, onExportText, onImportText, currentNotebookName }) => {
  const fileInputRef = useRef(null);
  const notebookFileInputRef = useRef(null);
  
  if (!isOpen) return null;

  const handleFileSelect = (e, isNotebook = false) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target.result);
          if (isNotebook) {
            onImportNotebook(data);
          } else {
            onImport(data);
          }
          onClose();
        } catch {
          alert('Invalid file format. Please select a valid export file.');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[200] flex items-center justify-center backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-in zoom-in duration-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Settings size={24} className="text-indigo-600" />
            Settings
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>
        
        <div className="space-y-4">


          {/* Current Notebook Export/Import */}
          <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl">
            <h3 className="font-bold text-indigo-800 mb-1 flex items-center gap-2">
              <Book size={16} />
              Share This Notebook
            </h3>
            <p className="text-sm text-indigo-600 mb-3">Export or import just "<strong>{currentNotebookName}</strong>"</p>
            
            <div className="flex gap-3">
              <button 
                onClick={onExportNotebook}
                className="flex-1 flex items-center justify-center gap-2 p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold text-sm transition-colors"
              >
                <Download size={16} />
                Export Notebook
              </button>
              
              <button 
                onClick={() => notebookFileInputRef.current?.click()}
                className="flex-1 flex items-center justify-center gap-2 p-2.5 bg-white border-2 border-indigo-300 hover:border-indigo-500 text-indigo-600 rounded-lg font-semibold text-sm transition-colors"
              >
                <Upload size={16} />
                Import Notebook
              </button>
              <input 
                ref={notebookFileInputRef}
                type="file" 
                accept=".json"
                className="hidden"
                onChange={(e) => handleFileSelect(e, true)}
              />
            </div>
          </div>

          {/* All Data Export/Import */}
          <div className="p-4 bg-slate-50 rounded-xl">
            <h3 className="font-bold text-gray-800 mb-2">All Data Backup</h3>
            <p className="text-sm text-gray-500 mb-4">Export/import ALL notebooks and data at once.</p>
            
            <div className="flex gap-3">
              <button 
                onClick={onExport}
                className="flex-1 flex items-center justify-center gap-2 p-3 bg-slate-700 hover:bg-slate-800 text-white rounded-lg font-semibold transition-colors"
              >
                <Download size={18} />
                Export All
              </button>
              
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 flex items-center justify-center gap-2 p-3 bg-white border-2 border-slate-300 hover:border-slate-500 text-slate-600 rounded-lg font-semibold transition-colors"
              >
                <Upload size={18} />
                Import All
              </button>
              <input 
                ref={fileInputRef}
                type="file" 
                accept=".json"
                className="hidden"
                onChange={(e) => handleFileSelect(e, false)}
              />
            </div>
          </div>

          {/* Text-based Export/Import for Mobile */}
          <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
            <h3 className="font-bold text-green-800 mb-2">📱 Mobile-Friendly Export/Import</h3>
            <p className="text-sm text-green-600 mb-4">Copy/paste JSON text (for devices that can't download files)</p>
            
            <div className="flex gap-3">
              <button 
                onClick={() => { onExportText(); onClose(); }}
                className="flex-1 flex items-center justify-center gap-2 p-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
              >
                <Download size={18} />
                Export as Text
              </button>
              
              <button 
                onClick={() => { onImportText(); onClose(); }}
                className="flex-1 flex items-center justify-center gap-2 p-3 bg-white border-2 border-green-300 hover:border-green-500 text-green-600 rounded-lg font-semibold transition-colors"
              >
                <Upload size={18} />
                Import from Text
              </button>
            </div>
          </div>

          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <p className="text-sm text-amber-800">
              <strong>Tip:</strong> Use "Export Notebook" to share a single workspace with friends. Use "Export All" to backup everything.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Export Text Modal ---
const ExportTextModal = ({ isOpen, onClose, text }) => {
  const [copied, setCopied] = useState(false);
  
  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert('Failed to copy to clipboard. Please copy manually.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[200] flex items-center justify-center backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-6 animate-in zoom-in duration-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Download size={24} className="text-green-600" />
            Export as Text
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>
        
        <p className="text-sm text-gray-600 mb-4">
          Copy this JSON text and save it somewhere safe. You can paste it back to import your data.
        </p>
        
        <textarea
          readOnly
          value={text}
          className="w-full h-96 p-4 border-2 border-gray-200 rounded-lg font-mono text-xs bg-gray-50 resize-none focus:outline-none focus:border-green-400"
          onClick={(e) => e.target.select()}
        />
        
        <div className="mt-4 flex gap-3">
          <button
            onClick={handleCopy}
            className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg font-semibold transition-all ${
              copied 
                ? 'bg-green-100 text-green-700 border-2 border-green-400' 
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {copied ? (
              <>
                <CheckCircle size={18} />
                Copied!
              </>
            ) : (
              <>
                <Download size={18} />
                Copy to Clipboard
              </>
            )}
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Import Text Modal ---
const ImportTextModal = ({ isOpen, onClose, text, setText, onImport }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-[200] flex items-center justify-center backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col p-6 animate-in zoom-in duration-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Upload size={24} className="text-green-600" />
            Import from Text
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>
        
        <p className="text-sm text-gray-600 mb-4">
          Paste the JSON text you previously exported below, then click Import Data.
        </p>
        
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste your exported JSON here..."
          className="w-full flex-1 min-h-[60vh] p-4 border-2 border-gray-200 rounded-lg font-mono text-xs resize-y focus:outline-none focus:border-green-400 overflow-auto"
          style={{ whiteSpace: 'pre', wordWrap: 'normal', overflowX: 'auto' }}
        />
        
        <div className="mt-4 flex gap-3">
          <button
            onClick={onImport}
            disabled={!text.trim()}
            className="flex-1 flex items-center justify-center gap-2 p-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors"
          >
            <Upload size={18} />
            Import Data
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Notebook Sidebar ---
const NotebookSidebar = ({ notebooks, activeNotebookId, onSelect, onCreate, onRename, onDelete, isCollapsed, onToggleCollapse }) => {
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [showActions, setShowActions] = useState(null);
  const inputRef = useRef(null);

  // NEW: Allow creating and immediately entering edit mode
  const handleCreate = () => {
    const newNb = onCreate(); // onCreate now returns the new notebook
    if (newNb) {
      setEditName(newNb.name);
      setEditingId(newNb.id);
    }
  };

  useEffect(() => {
    if (editingId && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingId]);

  const handleRename = (id) => {
    if (editName.trim()) {
      onRename(id, editName.trim());
    }
    setEditingId(null);
  };

  return (
    <>
      {/* Collapsed Toggle Button */}
      <div 
        className={`fixed left-0 top-1/2 -translate-y-1/2 z-50 transition-all duration-300 ease-in-out ${
          isCollapsed ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full pointer-events-none'
        }`}
      >
        <button 
          onClick={onToggleCollapse}
          className="bg-white shadow-lg border rounded-r-xl p-3 hover:bg-slate-50 transition-colors"
          title="Show Notebooks"
        >
          <ChevronRight size={20} className="text-slate-600" />
        </button>
      </div>

      {/* Full Sidebar - slides in/out */}
      <div 
        className="fixed left-0 top-0 bottom-0 bg-white/95 backdrop-blur shadow-xl border-r z-40 flex flex-col whitespace-nowrap overflow-hidden"
        style={{
          width: isCollapsed ? '0px' : '16rem',
          borderRightWidth: isCollapsed ? '0px' : '1px',
          opacity: 1, // Ensure opacity stays 1
          transition: 'width 0.3s ease-in-out, border-width 0.3s ease-in-out'
        }}
      >
        <div className="w-64 h-full flex flex-col">
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Book size={20} className="text-indigo-600" />
            <span className="font-bold text-slate-800">Notebooks</span>
          </div>
          <button 
            onClick={onToggleCollapse}
            className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
            title="Hide Sidebar"
          >
            <ChevronLeft size={18} className="text-slate-500" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {notebooks.map(nb => (
            <div 
              key={nb.id}
              className={`group relative p-3 rounded-xl cursor-pointer transition-all ${
                nb.id === activeNotebookId 
                  ? 'bg-indigo-50 border border-indigo-200' 
                  : 'hover:bg-slate-50 border border-transparent'
              }`}
            >
              {editingId === nb.id ? (
                <input
                  ref={inputRef}
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onBlur={() => handleRename(nb.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleRename(nb.id);
                    if (e.key === 'Escape') setEditingId(null);
                  }}
                  className="w-full px-2 py-1 border rounded-lg text-sm outline-none focus:border-indigo-500"
                />
              ) : (
                <div 
                  className="flex items-center justify-between"
                  onClick={() => onSelect(nb.id)}
                >
                  <span className={`text-sm font-medium truncate ${nb.id === activeNotebookId ? 'text-indigo-700' : 'text-slate-700'}`}>
                    {nb.name}
                  </span>
                  
                  <div className="relative">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowActions(showActions === nb.id ? null : nb.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-200 rounded transition-opacity"
                    >
                      <MoreVertical size={14} className="text-slate-500" />
                    </button>
                    
                    {showActions === nb.id && (
                      <div className="absolute right-0 top-full mt-1 pt-1 z-50">
                        <div className="bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden w-40">
                          <div 
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditName(nb.name);
                              setEditingId(nb.id);
                              setShowActions(null);
                            }}
                            className="p-3 hover:bg-indigo-50 flex items-center gap-3 border-b border-slate-50 transition-colors cursor-pointer"
                          >
                            <div className="p-1.5 bg-indigo-100 text-indigo-600 rounded-lg">
                              <Edit3 size={14} />
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-slate-700">Rename</div>
                            </div>
                          </div>
                          {notebooks.length > 1 && (
                            <div 
                              onClick={(e) => {
                                e.stopPropagation();
                                onDelete(nb.id);
                                setShowActions(null);
                              }}
                              className="p-3 hover:bg-red-50 flex items-center gap-3 transition-colors cursor-pointer"
                            >
                              <div className="p-1.5 bg-red-100 text-red-600 rounded-lg">
                                <Trash2 size={14} />
                              </div>
                              <div>
                                <div className="text-sm font-semibold text-red-600">Delete</div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="p-3 border-t">
          <button 
            onClick={handleCreate}
            className="w-full flex items-center justify-center gap-2 p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-colors"
          >
            <Plus size={18} />
            New Notebook
          </button>
        </div>
        </div>
      </div>
    </>
  );
};


// --- AI Creation Modal ---
const AICreateModal = ({ isOpen, onClose, onGenerate, onLogicGenerate, initialMode = 'logic' }) => {
  const [syllabus, setSyllabus] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [mode, setMode] = useState(initialMode);

  // Update mode when modal opens with different initial mode
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!syllabus.trim()) {
      setError('Please paste your syllabus first!');
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      if (mode === 'logic') {
        onLogicGenerate(syllabus);
        setSyllabus('');
        onClose();
      } else {
        await onGenerate(syllabus);
        setSyllabus('');
        onClose();
      }
    } catch (err) {
      setError(err.message || 'Failed to generate tasks. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[150] flex items-center justify-center backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 animate-in zoom-in duration-200">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Wand2 className="text-white" size={20} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">Task Generator</h3>
              <p className="text-xs text-gray-500">{mode === 'ai' ? 'Powered by Gemini' : 'Smart Logic Parser'}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Mode Tabs */}
        <div className="flex gap-2 mb-4 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setMode('logic')}
            className={`flex-1 px-4 py-2 rounded-md font-semibold text-sm transition-all ${
              mode === 'logic' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Logic Create
          </button>
          <button
            onClick={() => setMode('ai')}
            className={`flex-1 px-4 py-2 rounded-md font-semibold text-sm transition-all ${
              mode === 'ai' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            AI Create
          </button>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Paste Your Syllabus or Course Content
          </label>
          <textarea
            value={syllabus}
            onChange={(e) => setSyllabus(e.target.value)}
            placeholder={mode === 'logic' 
              ? `Paste structured syllabus here...\n\nFormat:\nModule 1: Title Here\n● Item 1\n● Item 2\n\nModule 2: Another Title\n- Item 1\n- Item 2`
              : `Paste any syllabus format - AI will structure it...\n\nExample:\nModule 1: Introduction to React\n- Components and Props\n- State and Lifecycle`
            }
            className="w-full h-64 px-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-purple-400 resize-none text-sm"
          />
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition-colors"
            disabled={isGenerating}
          >
            Cancel
          </button>
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !syllabus.trim()}
            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Wand2 size={18} />
                {mode === 'logic' ? 'Parse & Create' : 'Generate Tasks'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Data & Types ---



// --- Components ---

const TaskCard = ({ task, onMouseDown, onTouchStart, onUpdateTitle, onUpdateItem, onAddItem, onDeleteItem, onToggleStrikethrough, onDeleteTask, isSelected, selectionIndex, isTouchDragging }) => {
  const [editingTitle, setEditingTitle] = useState(false);
  const [editingItemId, setEditingItemId] = useState(null);
  const [titleText, setTitleText] = useState(task.title);
  const [itemTexts, setItemTexts] = useState({});
  const titleInputRef = useRef(null);
  const itemInputRef = useRef(null);

  useEffect(() => {
    if (editingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
      titleInputRef.current.select();
    }
  }, [editingTitle]);

  useEffect(() => {
    if (editingItemId && itemInputRef.current) {
      itemInputRef.current.focus();
      itemInputRef.current.select();
    }
  }, [editingItemId]);

  const handleTitleClick = (e) => {
    e.stopPropagation();
    setEditingTitle(true);
    setTitleText(task.title);
  };

  const handleTitleSave = () => {
    if (titleText.trim()) {
      onUpdateTitle(task.id, titleText.trim());
    }
    setEditingTitle(false);
  };

  const handleItemClick = (e, item) => {
    e.stopPropagation();
    setEditingItemId(item.id);
    setItemTexts({ ...itemTexts, [item.id]: item.text });
  };

  const handleItemSave = (itemId) => {
    const newText = itemTexts[itemId];
    if (newText && newText.trim()) {
      onUpdateItem(task.id, itemId, newText.trim());
    }
    setEditingItemId(null);
  };

  const handleItemToggle = (e, itemId) => {
    e.stopPropagation();
    onToggleStrikethrough(task.id, itemId);
  };

  return (
    <div
      onMouseDown={(e) => {
        // Don't start drag if clicking on interactive elements
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON') {
          return;
        }
        onMouseDown(e, task.id);
      }}
      onTouchStart={(e) => {
        // Don't start drag if touching on interactive elements
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON') {
          return;
        }
        onTouchStart(e, task.id);
      }}
      className={`absolute w-72 rounded-xl shadow-lg border-2 ${task.color} cursor-grab active:cursor-grabbing transition-all hover:shadow-2xl flex flex-col ${
        isSelected ? 'ring-4 ring-blue-500 ring-offset-2' : ''
      } ${isTouchDragging ? 'ring-4 ring-green-500 scale-105 z-50' : ''}`}
      id={`task-${task.id}`}
      style={{
        left: task.x,
        top: task.y,
        zIndex: isTouchDragging ? 100 : (isSelected ? 20 : 10),
      }}
    >
      {/* Selection Badge */}
      {isSelected && selectionIndex !== undefined && (
        <div className="absolute -top-3 -right-3 w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-lg z-30">
          {selectionIndex + 1}
        </div>
      )}
      {/* Header / Handle */}
      <div className="p-3 border-b border-black/10 flex items-center gap-2 select-none group">
        {editingTitle ? (
          <input
            ref={titleInputRef}
            type="text"
            value={titleText}
            onChange={(e) => setTitleText(e.target.value)}
            onBlur={handleTitleSave}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleTitleSave();
              if (e.key === 'Escape') setEditingTitle(false);
            }}
            className="font-bold text-gray-800 text-sm bg-white px-2 py-1 rounded border border-indigo-400 outline-none flex-1"
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <h3 
            className="font-bold text-gray-800 text-sm cursor-text hover:text-indigo-600 transition-colors flex-1"
            onClick={handleTitleClick}
          >
            {task.title}
          </h3>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDeleteTask(task.id);
          }}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-100 rounded text-red-600"
          title="Delete Task"
        >
          <Trash2 size={14} />
        </button>
        <GripVertical size={16} className="text-gray-500" />
      </div>
      
      {/* Body */}
      <div className="p-3 bg-white/50 flex-grow rounded-b-xl">
        <ul className="text-xs text-gray-700 space-y-1.5">
          {task.description.map((item) => (
            <li key={item.id} className="flex items-center gap-2 group">
              {editingItemId === item.id ? (
                <input
                  ref={itemInputRef}
                  type="text"
                  value={itemTexts[item.id] || ''}
                  onChange={(e) => setItemTexts({ ...itemTexts, [item.id]: e.target.value })}
                  onBlur={() => handleItemSave(item.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleItemSave(item.id);
                    if (e.key === 'Escape') setEditingItemId(null);
                    e.stopPropagation();
                  }}
                  className="flex-1 bg-white px-2 py-1 rounded border border-indigo-400 outline-none"
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <>
                  <span 
                    className={`flex-1 cursor-pointer hover:text-indigo-600 transition-colors leading-tight ${
                      item.strikethrough ? 'line-through text-gray-400' : ''
                    }`}
                    onClick={(e) => handleItemToggle(e, item.id)}
                  >
                    • {item.text}
                  </span>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleItemClick(e, item);
                      }}
                      className="p-0.5 hover:bg-indigo-100 rounded text-indigo-600"
                      title="Edit"
                    >
                      <Edit3 size={12} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteItem(task.id, item.id);
                      }}
                      className="p-0.5 hover:bg-red-100 rounded text-red-600"
                      title="Delete"
                    >
                      <X size={12} />
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddItem(task.id);
          }}
          className="mt-2 text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 hover:bg-indigo-50 px-2 py-1 rounded transition-colors"
        >
          <Plus size={12} /> Add Item
        </button>
      </div>
    </div>
  );
};



const TrashZone = React.forwardRef(({ isHovered, onClick }, ref) => {
  return (
    <div 
      ref={ref}
      onClick={onClick}
      className={`fixed bottom-4 right-4 md:bottom-6 md:right-6 w-14 h-14 md:w-20 md:h-20 rounded-full border-2 flex flex-col items-center justify-center transition-all duration-300 z-50 cursor-pointer shadow-xl
      ${isHovered 
        ? 'bg-red-500 border-red-600 scale-110 rotate-12' 
        : 'bg-gray-800 border-gray-600 hover:bg-gray-700'}`}
    >
      <Trash2 className="text-white w-5 h-5 md:w-7 md:h-7" />
      <span className="text-white text-[6px] md:text-[9px] font-bold mt-0.5">Done</span>
    </div>
  );
});

const CompletedModal = ({ isOpen, onClose, tasks, onRestore }) => {
  const [expandedTaskId, setExpandedTaskId] = useState(null);

  if (!isOpen) return null;

  const toggleExpand = (taskId) => {
    setExpandedTaskId(expandedTaskId === taskId ? null : taskId);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b flex justify-between items-center bg-gray-50">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <CheckCircle className="text-green-500" />
              Completed Tasks
            </h2>
            <p className="text-sm text-gray-500">Tasks you've thrown into the void (click to expand)</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto space-y-3">
          {tasks.length === 0 ? (
            <div className="text-center py-10 text-gray-400 italic">
              No tasks completed yet. Drag some cards to the trash!
            </div>
          ) : (
            tasks.map(task => (
              <div key={task.id} className={`rounded-lg border ${task.color} bg-opacity-50 overflow-hidden transition-all duration-300`}>
                {/* Header - Clickable to expand */}
                <div 
                  className="p-4 flex justify-between items-center cursor-pointer hover:bg-white/30 transition-colors"
                  onClick={() => toggleExpand(task.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`transition-transform duration-300 ${expandedTaskId === task.id ? 'rotate-180' : ''}`}>
                      <ChevronDown size={18} className="text-gray-500" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800">{task.title}</h4>
                      <p className="text-xs text-gray-600">{task.description.length} sub-items</p>
                    </div>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onRestore(task.id);
                    }}
                    className="px-3 py-1.5 bg-white rounded-md text-xs font-bold shadow-sm hover:shadow hover:bg-gray-50 text-gray-700 flex items-center gap-1"
                  >
                    <RefreshCcw size={12} /> Restore
                  </button>
                </div>
                
                {/* Expandable Content - Sub-items */}
                <div className={`overflow-hidden transition-all duration-300 ${expandedTaskId === task.id ? 'max-h-96' : 'max-h-0'}`}>
                  <div className="px-4 pb-4 pt-1 border-t border-gray-200/50">
                    <ul className="space-y-1.5">
                      {task.description.map((item) => (
                        <li 
                          key={item.id} 
                          className={`text-sm text-gray-700 flex items-start gap-2 ${item.strikethrough ? 'line-through text-gray-400' : ''}`}
                        >
                          <span className="text-green-500 mt-0.5">✓</span>
                          {item.text}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};



// --- Section/Group Component ---
const SECTION_COLORS = [
  { bg: 'bg-indigo-100', border: 'border-indigo-300', name: 'Indigo' },
  { bg: 'bg-rose-100', border: 'border-rose-300', name: 'Rose' },
  { bg: 'bg-orange-100', border: 'border-orange-300', name: 'Orange' },
  { bg: 'bg-amber-100', border: 'border-amber-300', name: 'Amber' },
  { bg: 'bg-lime-100', border: 'border-lime-300', name: 'Lime' },
  { bg: 'bg-emerald-100', border: 'border-emerald-300', name: 'Emerald' },
  { bg: 'bg-cyan-100', border: 'border-cyan-300', name: 'Cyan' },
  { bg: 'bg-violet-100', border: 'border-violet-300', name: 'Violet' },
  { bg: 'bg-pink-100', border: 'border-pink-300', name: 'Pink' },
  { bg: 'bg-gray-100', border: 'border-gray-300', name: 'Gray' },
];

const Section = ({ section, onMouseDown, onUpdateTitle, onUpdateColor, onDelete, onResize, selectionMode, isSelected, onToggleSelect }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [title, setTitle] = useState(section.title);
  const inputRef = useRef(null);
  const colorPickerRef = useRef(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  // Close color picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(e.target)) {
        setShowColorPicker(false);
      }
    };
    if (showColorPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showColorPicker]);

  const handleSave = () => {
      onUpdateTitle(section.id, title);
      setIsEditing(false);
  };

  const handleResizeStart = (e, direction) => {
    e.stopPropagation();
    e.preventDefault();
    onResize(section.id, direction, e, section);
  };

  return (
    <div
      className={`absolute border-2 rounded-xl transition-shadow group flex flex-col overflow-visible ${isSelected ? 'ring-4 ring-blue-500 ring-offset-2' : ''}`}
      style={{
        left: section.x,
        top: section.y,
        width: section.width,
        height: section.height,
        borderColor: (section.color.split(' ')[1] || 'border-indigo-300').replace('border-', 'var(--tw-border-opacity)'), 
        zIndex: showColorPicker ? 100 : (isSelected ? 10 : 0), 
        backgroundColor: 'rgba(255, 255, 255, 0.5)'
      }}
    >
      {/* Selection Checkbox - visible in selection mode */}
      {selectionMode && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleSelect(section.id);
          }}
          className={`absolute -top-3 -left-3 w-7 h-7 rounded-md shadow-lg border-2 flex items-center justify-center transition-all z-20 ${
            isSelected 
              ? 'bg-blue-600 border-blue-600 text-white' 
              : 'bg-white border-gray-300 hover:border-blue-400'
          }`}
        >
          {isSelected && <CheckCircle size={16} />}
        </button>
      )}

      {/* Section Header */}
      <div 
        className={`p-2 flex items-center justify-between cursor-move ${section.color.split(' ')[0]} border-b ${section.color.split(' ')[1]} rounded-t-lg`}
        onMouseDown={(e) => {
          if (selectionMode) {
            e.stopPropagation();
            onToggleSelect(section.id);
            return;
          }
          onMouseDown(e, section.id, 'section');
        }}
        onDoubleClick={(e) => {
             e.stopPropagation();
             if (!selectionMode) setIsEditing(true);
        }}
      >
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleSave}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSave();
              e.stopPropagation();
            }}
            className="bg-white/50 px-1 rounded outline-none text-sm font-bold w-full"
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <span className="font-bold text-sm text-gray-800 select-none truncate px-1">{section.title}</span>
        )}
        
        <div className="flex items-center gap-1">
          {/* Color Picker Button */}
          <div className="relative" ref={colorPickerRef}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowColorPicker(!showColorPicker);
              }}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-black/10 rounded"
              title="Change Color"
            >
              <Palette size={14} className="text-gray-600" />
            </button>
            
            {showColorPicker && (
              <div className="absolute top-full right-0 mt-1 bg-white rounded-lg shadow-xl border p-2 z-50 min-w-[140px]">
                <div className="grid grid-cols-5 gap-1">
                  {SECTION_COLORS.map((c, i) => (
                    <button
                      key={i}
                      onClick={(e) => {
                        e.stopPropagation();
                        onUpdateColor(section.id, `${c.bg} ${c.border}`);
                        setShowColorPicker(false);
                      }}
                      className={`w-6 h-6 rounded ${c.bg} border-2 ${c.border} hover:scale-110 transition-transform ${section.color === `${c.bg} ${c.border}` ? 'ring-2 ring-offset-1 ring-indigo-500' : ''}`}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Delete Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(section.id);
            }}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-black/10 rounded text-gray-600"
            title="Ungroup (Delete Section)"
          >
            <X size={14} />
          </button>
        </div>
      </div>
      
      {/* Section Body - just visual frame */}
      <div className="flex-1 bg-white/30 backdrop-blur-sm pointer-events-none rounded-b-lg" />

      {/* Resize Handles */}
      {/* Right */}
      <div 
        className="absolute top-1/2 -right-1.5 w-3 h-10 -translate-y-1/2 cursor-ew-resize opacity-0 group-hover:opacity-100 transition-opacity bg-indigo-500 rounded-full"
        onMouseDown={(e) => handleResizeStart(e, 'e')}
      />
      {/* Bottom */}
      <div 
        className="absolute -bottom-1.5 left-1/2 w-10 h-3 -translate-x-1/2 cursor-ns-resize opacity-0 group-hover:opacity-100 transition-opacity bg-indigo-500 rounded-full"
        onMouseDown={(e) => handleResizeStart(e, 's')}
      />
      {/* Bottom-Right Corner */}
      <div 
        className="absolute -bottom-2 -right-2 w-4 h-4 cursor-nwse-resize opacity-0 group-hover:opacity-100 transition-opacity bg-indigo-600 rounded-full shadow-lg"
        onMouseDown={(e) => handleResizeStart(e, 'se')}
      />
      {/* Left */}
      <div 
        className="absolute top-1/2 -left-1.5 w-3 h-10 -translate-y-1/2 cursor-ew-resize opacity-0 group-hover:opacity-100 transition-opacity bg-indigo-500 rounded-full"
        onMouseDown={(e) => handleResizeStart(e, 'w')}
      />
      {/* Top */}
      <div 
        className="absolute -top-1.5 left-1/2 w-10 h-3 -translate-x-1/2 cursor-ns-resize opacity-0 group-hover:opacity-100 transition-opacity bg-indigo-500 rounded-full"
        onMouseDown={(e) => handleResizeStart(e, 'n')}
      />
    </div>
  );
};

// Label Component with Color, Size, and Text editing
const LABEL_COLORS = [
  { bg: 'bg-yellow-100', border: 'border-yellow-400', text: 'text-yellow-700', name: 'Yellow' },
  { bg: 'bg-red-100', border: 'border-red-400', text: 'text-red-700', name: 'Red' },
  { bg: 'bg-orange-100', border: 'border-orange-400', text: 'text-orange-700', name: 'Orange' },
  { bg: 'bg-green-100', border: 'border-green-400', text: 'text-green-700', name: 'Green' },
  { bg: 'bg-blue-100', border: 'border-blue-400', text: 'text-blue-700', name: 'Blue' },
  { bg: 'bg-purple-100', border: 'border-purple-400', text: 'text-purple-700', name: 'Purple' },
  { bg: 'bg-pink-100', border: 'border-pink-400', text: 'text-pink-700', name: 'Pink' },
  { bg: 'bg-gray-100', border: 'border-gray-400', text: 'text-gray-700', name: 'Gray' },
];

const LABEL_SIZES = [
  { name: 'Small', fontSize: 'text-xs', padding: 'px-2 py-1', iconSize: 12 },
  { name: 'Medium', fontSize: 'text-sm', padding: 'px-4 py-2', iconSize: 14 },
  { name: 'Large', fontSize: 'text-lg', padding: 'px-5 py-3', iconSize: 18 },
];

const Label = ({ label, onMouseDown, onUpdate, onDelete, onUpdateStyle }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [text, setText] = useState(label.text);
  const inputRef = useRef(null);
  const menuRef = useRef(null);

  // Get current style settings with defaults
  const colorIndex = label.colorIndex ?? 0;
  const sizeIndex = label.sizeIndex ?? 1; // Default medium
  const color = LABEL_COLORS[colorIndex] || LABEL_COLORS[0];
  const size = LABEL_SIZES[sizeIndex] || LABEL_SIZES[1];

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMenu]);

  const handleDoubleClick = (e) => {
    e.stopPropagation();
    setIsEditing(true);
    setShowMenu(false);
  };

  const handleSave = () => {
    if (text.trim()) {
      onUpdate(label.id, text.trim());
    }
    setIsEditing(false);
  };

  const handleRightClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  return (
    <div
      onMouseDown={(e) => {
        if (!isEditing && !showMenu && e.button === 0) {
          onMouseDown(e, label.id);
        }
      }}
      onDoubleClick={handleDoubleClick}
      onContextMenu={handleRightClick}
      className={`absolute ${color.bg} border-2 ${color.border} rounded-lg ${size.padding} shadow-md cursor-move hover:shadow-lg transition-shadow group`}
      style={{
        left: label.x,
        top: label.y,
        zIndex: showMenu ? 50 : 5,
      }}
    >
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={handleSave}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSave();
            if (e.key === 'Escape') setIsEditing(false);
            e.stopPropagation();
          }}
          className={`bg-white px-2 py-1 rounded border ${color.border} outline-none ${size.fontSize} font-medium`}
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <div className="flex items-center gap-2">
          <Type size={size.iconSize} className={color.text} />
          <span className={`${size.fontSize} font-medium text-gray-800 select-none`}>{label.text}</span>
          
          {/* Settings button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 hover:bg-black/10 rounded"
            title="Settings"
          >
            <Settings size={12} className={color.text} />
          </button>
          
          {/* Delete button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(label.id);
            }}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 hover:bg-red-100 rounded text-red-600"
            title="Delete"
          >
            <X size={12} />
          </button>
        </div>
      )}

      {/* Settings Menu */}
      {showMenu && (
        <div 
          ref={menuRef}
          className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-2xl border p-3 z-50 min-w-[180px]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Edit Text */}
          <button
            onClick={() => {
              setIsEditing(true);
              setShowMenu(false);
            }}
            className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-lg text-sm flex items-center gap-2"
          >
            <Edit3 size={14} />
            Edit Text
          </button>
          
          <hr className="my-2" />
          
          {/* Color Picker */}
          <div className="px-2 mb-2">
            <p className="text-xs font-semibold text-gray-500 mb-2">Color</p>
            <div className="flex flex-wrap gap-1.5">
              {LABEL_COLORS.map((c, i) => (
                <button
                  key={i}
                  onClick={() => {
                    onUpdateStyle(label.id, { colorIndex: i });
                  }}
                  className={`w-6 h-6 rounded-full ${c.bg} border-2 ${c.border} hover:scale-110 transition-transform ${colorIndex === i ? 'ring-2 ring-offset-1 ring-indigo-500' : ''}`}
                  title={c.name}
                />
              ))}
            </div>
          </div>
          
          <hr className="my-2" />
          
          {/* Size Options */}
          <div className="px-2">
            <p className="text-xs font-semibold text-gray-500 mb-2">Size</p>
            <div className="flex gap-1">
              {LABEL_SIZES.map((s, i) => (
                <button
                  key={i}
                  onClick={() => {
                    onUpdateStyle(label.id, { sizeIndex: i });
                  }}
                  className={`flex-1 px-2 py-1.5 rounded-lg text-xs font-semibold transition-colors ${sizeIndex === i ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  {s.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Main App ---

export default function App() {
  // --- Notebook System ---
  const createDefaultNotebook = () => ({
    id: `notebook-${Date.now()}`,
    name: 'My Notebook',
    createdAt: Date.now(),
  });

  // Migration: Load notebooks or migrate from legacy storage
  const [notebooks, setNotebooks] = useState(() => {
    const savedNotebooks = localStorage.getItem('notebooks');
    if (savedNotebooks) {
      return JSON.parse(savedNotebooks);
    }
    
    // Check for legacy data and migrate
    const legacyTasks = localStorage.getItem('tasks');
    const legacyLabels = localStorage.getItem('labels');
    const legacySections = localStorage.getItem('sections');
    
    if (legacyTasks || legacyLabels || legacySections) {
      // Create default notebook with legacy data ID reference
      const defaultNb = { ...createDefaultNotebook(), name: 'Migrated Data' };
      return [defaultNb];
    }
    
    // Fresh start
    return [createDefaultNotebook()];
  });

  const [activeNotebookId, setActiveNotebookId] = useState(() => {
    const saved = localStorage.getItem('activeNotebookId');
    if (saved) return saved;
    
    // Get first notebook
    const savedNotebooks = localStorage.getItem('notebooks');
    if (savedNotebooks) {
      const nbs = JSON.parse(savedNotebooks);
      return nbs[0]?.id || null;
    }
    return null;
  });

  // Persist notebooks
  useEffect(() => {
    localStorage.setItem('notebooks', JSON.stringify(notebooks));
  }, [notebooks]);

  useEffect(() => {
    if (activeNotebookId) {
      localStorage.setItem('activeNotebookId', activeNotebookId);
    }
  }, [activeNotebookId]);

  // Set active notebook ID on first load if not set
  useEffect(() => {
    if (!activeNotebookId && notebooks.length > 0) {
      setActiveNotebookId(notebooks[0].id);
    }
  }, [notebooks, activeNotebookId]);

  // --- Per-Notebook Data ---
  const [tasks, setTasks] = useState(() => {
    const nbId = localStorage.getItem('activeNotebookId');
    if (nbId) {
      const saved = localStorage.getItem(`${nbId}-tasks`);
      if (saved) return JSON.parse(saved);
    }
    // Fallback to legacy
    const legacy = localStorage.getItem('tasks');
    return legacy ? JSON.parse(legacy) : [];
  });

  const [labels, setLabels] = useState(() => {
    const nbId = localStorage.getItem('activeNotebookId');
    if (nbId) {
      const saved = localStorage.getItem(`${nbId}-labels`);
      if (saved) return JSON.parse(saved);
    }
    const legacy = localStorage.getItem('labels');
    return legacy ? JSON.parse(legacy) : [];
  });

  const [sections, setSections] = useState(() => {
    const nbId = localStorage.getItem('activeNotebookId');
    if (nbId) {
      const saved = localStorage.getItem(`${nbId}-sections`);
      if (saved) return JSON.parse(saved);
    }
    const legacy = localStorage.getItem('sections');
    return legacy ? JSON.parse(legacy) : [];
  });



  const [canvasTransform, setCanvasTransform] = useState(() => {
    const nbId = localStorage.getItem('activeNotebookId');
    if (nbId) {
      const saved = localStorage.getItem(`${nbId}-transform`);
      if (saved) return JSON.parse(saved);
    }
    return { x: 0, y: 0, scale: 1 };
  });

  // Persist per-notebook data
  useEffect(() => {
    if (activeNotebookId) {
      localStorage.setItem(`${activeNotebookId}-tasks`, JSON.stringify(tasks));
    }
  }, [tasks, activeNotebookId]);

  useEffect(() => {
    if (activeNotebookId) {
      localStorage.setItem(`${activeNotebookId}-labels`, JSON.stringify(labels));
    }
  }, [labels, activeNotebookId]);

  useEffect(() => {
    if (activeNotebookId) {
      localStorage.setItem(`${activeNotebookId}-sections`, JSON.stringify(sections));
    }
  }, [sections, activeNotebookId]);



  useEffect(() => {
    if (activeNotebookId) {
      localStorage.setItem(`${activeNotebookId}-transform`, JSON.stringify(canvasTransform));
    }
  }, [canvasTransform, activeNotebookId]);

  // --- Notebook CRUD ---
  const createNotebook = () => {
    const newNb = {
      id: `notebook-${Date.now()}`,
      name: `Notebook ${notebooks.length + 1}`,
      createdAt: Date.now(),
    };
    setNotebooks(prev => [...prev, newNb]);
    switchNotebook(newNb.id);
    return newNb; // Return the new notebook for immediate editing
  };

  const renameNotebook = (id, newName) => {
    setNotebooks(prev => prev.map(nb => nb.id === id ? { ...nb, name: newName } : nb));
  };

  const deleteNotebook = (id) => {
    if (notebooks.length <= 1) return;
    
    // Remove notebook data from localStorage
    localStorage.removeItem(`${id}-tasks`);
    localStorage.removeItem(`${id}-labels`);
    localStorage.removeItem(`${id}-sections`);
    localStorage.removeItem(`${id}-transform`);
    
    setNotebooks(prev => prev.filter(nb => nb.id !== id));
    
    if (activeNotebookId === id) {
      const remaining = notebooks.filter(nb => nb.id !== id);
      if (remaining.length > 0) {
        switchNotebook(remaining[0].id);
      }
    }
  };

  const switchNotebook = (id) => {
    // Save current notebook data first (already handled by useEffects)
    setActiveNotebookId(id);
    
    // Load new notebook data
    const savedTasks = localStorage.getItem(`${id}-tasks`);
    const savedLabels = localStorage.getItem(`${id}-labels`);
    const savedSections = localStorage.getItem(`${id}-sections`);
    const savedTransform = localStorage.getItem(`${id}-transform`);
    
    setTasks(savedTasks ? JSON.parse(savedTasks) : []);
    setLabels(savedLabels ? JSON.parse(savedLabels) : []);
    setSections(savedSections ? JSON.parse(savedSections) : []);
    setCanvasTransform(savedTransform ? JSON.parse(savedTransform) : { x: 0, y: 0, scale: 1 });
    setSelectedTaskIds([]);
  };

  // --- Export / Import ---
  const exportData = () => {
    const exportObj = {
      version: 1,
      exportedAt: new Date().toISOString(),
      notebooks: notebooks.map(nb => ({
        ...nb,
        data: {
          tasks: JSON.parse(localStorage.getItem(`${nb.id}-tasks`) || '[]'),
          labels: JSON.parse(localStorage.getItem(`${nb.id}-labels`) || '[]'),
          sections: JSON.parse(localStorage.getItem(`${nb.id}-sections`) || '[]'),
          transform: JSON.parse(localStorage.getItem(`${nb.id}-transform`) || '{"x":0,"y":0,"scale":1}'),
        }
      })),
      activeNotebookId,
    };
    
    const blob = new Blob([JSON.stringify(exportObj, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `canvas-crm-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = (data) => {
    if (!data.notebooks || !Array.isArray(data.notebooks)) {
      alert('Invalid import file format');
      return;
    }
    
    // Clear existing data
    notebooks.forEach(nb => {
      localStorage.removeItem(`${nb.id}-tasks`);
      localStorage.removeItem(`${nb.id}-labels`);
      localStorage.removeItem(`${nb.id}-sections`);
      localStorage.removeItem(`${nb.id}-transform`);
    });
    
    // Import new data
    data.notebooks.forEach(nb => {
      if (nb.data) {
        localStorage.setItem(`${nb.id}-tasks`, JSON.stringify(nb.data.tasks || []));
        localStorage.setItem(`${nb.id}-labels`, JSON.stringify(nb.data.labels || []));
        localStorage.setItem(`${nb.id}-sections`, JSON.stringify(nb.data.sections || []));
        localStorage.setItem(`${nb.id}-transform`, JSON.stringify(nb.data.transform || { x: 0, y: 0, scale: 1 }));
      }
    });
    
    const importedNotebooks = data.notebooks.map(({ data, ...nb }) => nb);
    setNotebooks(importedNotebooks);
    
    const newActiveId = data.activeNotebookId || importedNotebooks[0]?.id;
    if (newActiveId) {
      switchNotebook(newActiveId);
    }
  };

  // --- Single Notebook Export/Import ---
  const exportNotebook = () => {
    const currentNb = notebooks.find(nb => nb.id === activeNotebookId);
    if (!currentNb) return;

    const exportObj = {
      version: 1,
      type: 'single-notebook',
      exportedAt: new Date().toISOString(),
      notebook: {
        ...currentNb,
        data: {
          tasks,
          labels,
          sections,
          transform: canvasTransform,
        }
      }
    };
    
    const blob = new Blob([JSON.stringify(exportObj, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `notebook-${currentNb.name.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importNotebook = (data) => {
    if (!data.notebook || data.type !== 'single-notebook') {
      alert('Invalid notebook file. Please select a valid exported notebook.');
      return;
    }
    
    const importedNb = data.notebook;
    
    // Create new notebook with new ID to avoid conflicts
    const newNb = {
      id: `notebook-${Date.now()}`,
      name: importedNb.name + ' (Imported)',
      createdAt: Date.now(),
    };
    
    // Save the notebook data
    if (importedNb.data) {
      localStorage.setItem(`${newNb.id}-tasks`, JSON.stringify(importedNb.data.tasks || []));
      localStorage.setItem(`${newNb.id}-labels`, JSON.stringify(importedNb.data.labels || []));
      localStorage.setItem(`${newNb.id}-sections`, JSON.stringify(importedNb.data.sections || []));
      localStorage.setItem(`${newNb.id}-transform`, JSON.stringify(importedNb.data.transform || { x: 0, y: 0, scale: 1 }));
    }
    
    // Add to notebooks list
    setNotebooks(prev => [...prev, newNb]);
    
    // Switch to the new notebook
    switchNotebook(newNb.id);
  };

  // --- Text-based Export/Import (for mobile) ---
  const exportAsText = () => {
    const exportObj = {
      version: 1,
      exportedAt: new Date().toISOString(),
      notebooks: notebooks.map(nb => ({
        ...nb,
        data: {
          tasks: JSON.parse(localStorage.getItem(`${nb.id}-tasks`) || '[]'),
          labels: JSON.parse(localStorage.getItem(`${nb.id}-labels`) || '[]'),
          sections: JSON.parse(localStorage.getItem(`${nb.id}-sections`) || '[]'),
          transform: JSON.parse(localStorage.getItem(`${nb.id}-transform`) || '{"x":0,"y":0,"scale":1}'),
        }
      })),
      activeNotebookId,
    };
    
    setExportTextContent(JSON.stringify(exportObj, null, 2));
    setShowExportTextModal(true);
  };

  const importFromText = () => {
    try {
      const data = JSON.parse(importTextContent);
      importData(data);
      setShowImportTextModal(false);
      setImportTextContent('');
    } catch (error) {
      alert('Invalid JSON format. Please check your input and try again.');
    }
  };

  // --- UI State ---
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' && window.innerWidth < 768);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [toolbarCollapsed, setToolbarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('darkMode');
      return saved ? JSON.parse(saved) : false;
    }
    return false;
  });

  // Apply dark mode to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  // Handle window resize for mobile detection
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile && !sidebarCollapsed) {
        setSidebarCollapsed(true);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [sidebarCollapsed]);
  
  const [draggingId, setDraggingId] = useState(null);
  const [draggingType, setDraggingType] = useState(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isOverTrash, setIsOverTrash] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);
  const [lastCompleted, setLastCompleted] = useState(null);
  
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [spacebarPressed, setSpacebarPressed] = useState(false);
  
  const [dragStart, setDragStart] = useState(null);
  const [hasMoved, setHasMoved] = useState(false);
  const DRAG_THRESHOLD = 5;
  
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, taskId: null, taskTitle: '' });
  const [dragOutConfirm, setDragOutConfirm] = useState({ isOpen: false, taskId: null, sectionId: null, targetX: null, targetY: null });
  const [deleteGroupConfirm, setDeleteGroupConfirm] = useState({ isOpen: false, sectionId: null, sectionTitle: '' });
  const [dragInitialSection, setDragInitialSection] = useState(null);
  
  const [selectedTaskIds, setSelectedTaskIds] = useState([]);
  const [selectedSectionIds, setSelectedSectionIds] = useState([]);
  const [selectionBox, setSelectionBox] = useState(null);
  const [selectionMode, setSelectionMode] = useState(false);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [groupColor, setGroupColor] = useState('bg-indigo-100 border-indigo-300');
  
  const [showAIModal, setShowAIModal] = useState(false);
  const [aiModalMode, setAiModalMode] = useState('logic');
  const [showCreateDropdown, setShowCreateDropdown] = useState(false); // Click-based dropdown state
  
  // Resize state
  const [resizing, setResizing] = useState(null); // { sectionId, direction, startX, startY, startWidth, startHeight, startSectionX, startSectionY }
  
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false);
  
  // Export/Import Text Modal States
  const [showExportTextModal, setShowExportTextModal] = useState(false);
  const [exportTextContent, setExportTextContent] = useState('');
  const [showImportTextModal, setShowImportTextModal] = useState(false);
  const [importTextContent, setImportTextContent] = useState('');



  // Undo/Redo history
  const historyRef = useRef([]);
  const historyIndexRef = useRef(-1);
  const isUndoRedoRef = useRef(false); // Flag to prevent recording changes during undo/redo


  const trashRef = useRef(null);
  const prevSectionPosRef = useRef({ x: 0, y: 0 }); // Track previous section position for delta calc
  const draggedGroupTaskIdsRef = useRef([]); // Track tasks being dragged with a group
  const tasksRef = useRef(tasks);
  const sectionsRef = useRef(sections);
  const selectedTaskIdsRef = useRef(selectedTaskIds);
  const selectedSectionIdsRef = useRef(selectedSectionIds);

  const canvasRef = useRef(null); // Ref for canvas to attach non-passive wheel listener
  
  // Touch/mobile drag state
  const lastTapRef = useRef({ time: 0, id: null }); // For double-tap detection
  const [touchDragActive, setTouchDragActive] = useState(false); // Is touch drag mode active

  // Keep Refs in sync
  useEffect(() => {
    tasksRef.current = tasks;
    sectionsRef.current = sections;
    selectedTaskIdsRef.current = selectedTaskIds;
    selectedSectionIdsRef.current = selectedSectionIds;
  }, [tasks, sections, selectedTaskIds, selectedSectionIds]);

  // Non-passive wheel event listener to prevent browser zoom on trackpad
  useEffect(() => {
    const canvasElement = canvasRef.current;
    if (!canvasElement) return;

    const handleWheelNonPassive = (e) => {
      e.preventDefault();
      // Increased multiplier for smoother, more responsive zoom
      const delta = e.deltaY * -0.003;
      // Extended range: 0.1x (zoom out far) to 5x (zoom in close)
      const newScale = Math.min(Math.max(0.1, canvasTransform.scale + delta), 5);
      
      // Zoom centered on cursor
      const rect = canvasElement.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      const newX = mouseX - (mouseX - canvasTransform.x) * (newScale / canvasTransform.scale);
      const newY = mouseY - (mouseY - canvasTransform.y) * (newScale / canvasTransform.scale);
      
      setCanvasTransform({ x: newX, y: newY, scale: newScale });
    };

    // Add non-passive event listener to properly prevent browser zoom
    canvasElement.addEventListener('wheel', handleWheelNonPassive, { passive: false });
    
    return () => {
      canvasElement.removeEventListener('wheel', handleWheelNonPassive);
    };
  }, [canvasTransform]);

  // --- Undo/Redo System ---
  
  const saveToHistory = useCallback(() => {
    if (isUndoRedoRef.current) return; // Don't record during undo/redo
    
    const currentState = {
      tasks: JSON.parse(JSON.stringify(tasks)),
      labels: JSON.parse(JSON.stringify(labels)),
      sections: JSON.parse(JSON.stringify(sections)),

    };
    
    // Remove any future states if we're in the middle of history
    historyRef.current = historyRef.current.slice(0, historyIndexRef.current + 1);
    
    // Add new state
    historyRef.current.push(currentState);
    historyIndexRef.current = historyRef.current.length - 1;
    
    // Limit history to 50 states to prevent memory issues
    if (historyRef.current.length > 50) {
      historyRef.current.shift();
      historyIndexRef.current--;
    }
  }, [tasks, labels, sections]);

  const undo = useCallback(() => {
    if (historyIndexRef.current <= 0) return; // Nothing to undo
    
    isUndoRedoRef.current = true;
    historyIndexRef.current--;
    const prevState = historyRef.current[historyIndexRef.current];
    
    if (prevState) {
      setTasks(prevState.tasks);
      setLabels(prevState.labels);
      setSections(prevState.sections);

    }
    
    setTimeout(() => { isUndoRedoRef.current = false; }, 100);
  }, []);

  const redo = useCallback(() => {
    if (historyIndexRef.current >= historyRef.current.length - 1) return; // Nothing to redo
    
    isUndoRedoRef.current = true;
    historyIndexRef.current++;
    const nextState = historyRef.current[historyIndexRef.current];
    
    if (nextState) {
      setTasks(nextState.tasks);
      setLabels(nextState.labels);
      setSections(nextState.sections);

    }
    
    setTimeout(() => { isUndoRedoRef.current = false; }, 100);
  }, []);

  // Save initial state to history
  useEffect(() => {
    if (historyRef.current.length === 0) {
      saveToHistory();
    }
  }, []);

  // Save to history when data changes (debounced)
  useEffect(() => {
    if (isUndoRedoRef.current) return;
    
    const timer = setTimeout(() => {
      saveToHistory();
    }, 500); // Debounce 500ms to avoid too many history entries
    
    return () => clearTimeout(timer);
  }, [tasks, labels, sections, saveToHistory]);

  // Keyboard shortcuts for undo/redo
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl+Z for undo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      // Ctrl+Y or Ctrl+Shift+Z for redo
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        redo();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  // --- Task Update Functions ---

  const updateTaskTitle = (taskId, newTitle) => {
    setTasks(prev => prev.map(t => 
      t.id === taskId ? { ...t, title: newTitle } : t
    ));
  };

  const updateTaskColor = (taskId, newColor) => {
    setTasks(prev => prev.map(t => 
      t.id === taskId ? { ...t, color: newColor } : t
    ));
  };

  const updateSectionColor = (sectionId, newColor) => {
    setSections(prev => prev.map(s => 
      s.id === sectionId ? { ...s, color: newColor } : s
    ));
  };

  const updateTaskItem = (taskId, itemId, newText) => {
    setTasks(prev => prev.map(t => 
      t.id === taskId 
        ? { ...t, description: t.description.map(item => 
            item.id === itemId ? { ...item, text: newText } : item
          )}
        : t
    ));
  };

  const addTaskItem = (taskId) => {
    setTasks(prev => prev.map(t => 
      t.id === taskId 
        ? { 
            ...t, 
            description: [...t.description, { 
              id: `${taskId}-item-${Date.now()}`, 
              text: 'New item', 
              strikethrough: false 
            }]
          }
        : t
    ));
  };

  const deleteTaskItem = (taskId, itemId) => {
    setTasks(prev => prev.map(t => 
      t.id === taskId 
        ? { ...t, description: t.description.filter(item => item.id !== itemId) }
        : t
    ));
  };

  const toggleItemStrikethrough = (taskId, itemId) => {
    setTasks(prev => prev.map(t => 
      t.id === taskId 
        ? { 
            ...t, 
            description: t.description.map(item => 
              item.id === itemId ? { ...item, strikethrough: !item.strikethrough } : item
            )
          }
        : t
    ));
  };

  // --- Label Functions ---

  const addLabel = () => {
    const newLabel = {
      id: `label-${Date.now()}`,
      text: 'New Label',
      x: (window.innerWidth / 2 - canvasTransform.x) / canvasTransform.scale - 50,
      y: (window.innerHeight / 2 - canvasTransform.y) / canvasTransform.scale - 20,
    };
    setLabels(prev => [...prev, newLabel]);
  };

  const updateLabel = (labelId, newText) => {
    setLabels(prev => prev.map(l => 
      l.id === labelId ? { ...l, text: newText } : l
    ));
  };

  const updateLabelPosition = (labelId, x, y) => {
    setLabels(prev => prev.map(l => 
      l.id === labelId ? { ...l, x, y } : l
    ));
  };

  const updateLabelStyle = (labelId, styleUpdates) => {
    setLabels(prev => prev.map(l => 
      l.id === labelId ? { ...l, ...styleUpdates } : l
    ));
  };

  const deleteLabel = (labelId) => {
    setLabels(prev => prev.filter(l => l.id !== labelId));
  };



  // --- Delete Task ---

  const handleDeleteTaskClick = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      setDeleteConfirm({ isOpen: true, taskId, taskTitle: task.title });
    }
  };

  const confirmDeleteTask = () => {
    setTasks(prev => prev.filter(t => t.id !== deleteConfirm.taskId));
    setDeleteConfirm({ isOpen: false, taskId: null, taskTitle: '' });
  };


  const cancelDeleteTask = () => {
    setDeleteConfirm({ isOpen: false, taskId: null, taskTitle: '' });
  };

  // --- Collision Detection Helper ---
  // Finds an empty position on canvas that doesn't overlap with existing tasks/sections
  const findEmptyPosition = (existingTasks, existingSections, numNewTasks) => {
    const TASK_WIDTH = 300;
    const TASK_HEIGHT = 200;
    const GAP = 50;
    const START_X = 100;
    const START_Y = 100;
    const COLS = 3;
    
    // Calculate bounding boxes of all existing items
    const existingBoxes = [
      ...existingTasks.filter(t => t.status === 'active').map(t => ({
        x: t.x,
        y: t.y,
        width: TASK_WIDTH,
        height: TASK_HEIGHT
      })),
      ...existingSections.map(s => ({
        x: s.x,
        y: s.y,
        width: s.width,
        height: s.height
      }))
    ];
    
    // Check if a position collides with any existing box
    const collides = (x, y, width, height) => {
      return existingBoxes.some(box => {
        return !(x + width < box.x || 
                 x > box.x + box.width || 
                 y + height < box.y || 
                 y > box.y + box.height);
      });
    };
    
    // Find max Y of existing items to start below them
    let startY = START_Y;
    if (existingBoxes.length > 0) {
      const maxY = Math.max(...existingBoxes.map(b => b.y + b.height));
      startY = maxY + GAP * 2;
    }
    
    // Generate positions for new tasks in a grid, checking for collisions
    const positions = [];
    let currentY = startY;
    let attempts = 0;
    const maxAttempts = 100;
    
    for (let i = 0; i < numNewTasks && attempts < maxAttempts; i++) {
      const col = i % COLS;
      const row = Math.floor(i / COLS);
      let x = START_X + col * (TASK_WIDTH + GAP);
      let y = currentY + row * (TASK_HEIGHT + GAP);
      
      // Check for collision and adjust if needed
      while (collides(x, y, TASK_WIDTH, TASK_HEIGHT) && attempts < maxAttempts) {
        y += TASK_HEIGHT + GAP;
        attempts++;
      }
      
      positions.push({ x, y });
      
      // Add this position to existing boxes to avoid self-collision
      existingBoxes.push({ x, y, width: TASK_WIDTH, height: TASK_HEIGHT });
    }
    
    return positions;
  };

  // --- Logic-Based Task Generation ---

  const generateTasksFromLogic = (syllabusText) => {
    const lines = syllabusText.split('\n').map(line => line.trim()).filter(line => line);
    const modules = [];
    let currentModule = null;

    const colors = [
      'bg-rose-100 border-rose-300',
      'bg-orange-100 border-orange-300',
      'bg-amber-100 border-amber-300',
      'bg-lime-100 border-lime-300',
      'bg-emerald-100 border-emerald-300',
      'bg-cyan-100 border-cyan-300',
      'bg-violet-100 border-violet-300',
      'bg-pink-100 border-pink-300'
    ];

    for (const line of lines) {
      // Check if line is a module header (starts with "Module" or contains ":")
      const moduleMatch = line.match(/^(?:Module\s*\d+|\w+\s+\d+)[:\s]+(.+)$/i);
      
      if (moduleMatch) {
        // Start new module
        if (currentModule && currentModule.items.length > 0) {
          modules.push(currentModule);
        }
        currentModule = {
          title: line,
          items: []
        };
      } else if (currentModule && line.match(/^[●•\-*]\s+(.+)$/)) {
        // Add item to current module (starts with bullet: ●, •, -, *)
        const itemText = line.replace(/^[●•\-*]\s+/, '');
        currentModule.items.push(itemText);
      } else if (line.length > 0 && !line.match(/^[●•\-*]/)) {
        // If it's text without bullet and no current module, treat as module title
        if (!currentModule) {
          currentModule = {
            title: line,
            items: []
          };
        } else if (currentModule.items.length === 0) {
          // If module has no items yet, this might be a subtitle - skip it or add as item
          currentModule.items.push(line); 
        }
      }
    }

    // Add last module
    if (currentModule && currentModule.items.length > 0) {
      modules.push(currentModule);
    }

    if (modules.length === 0) {
      throw new Error('No modules found! Make sure your text follows the format:\n\nModule 1: Title\n● Item 1\n● Item 2');
    }

    // Get positions that don't overlap with existing items
    const positions = findEmptyPosition(tasks, sections, modules.length);

    // Create tasks from parsed modules with collision-free positions
    const newTasks = modules.map((module, index) => {
      const taskId = `logic-${Date.now()}-${index}`;
      const pos = positions[index] || { x: 100 + (index % 3) * 350, y: 100 + Math.floor(index / 3) * 350 };
      return {
        id: taskId,
        title: module.title,
        description: module.items.map((item, itemIndex) => ({
          id: `${taskId}-item-${itemIndex}`,
          text: item,
          strikethrough: false
        })),
        x: pos.x,
        y: pos.y,
        color: colors[index % colors.length],
        status: 'active'
      };
    });

    setTasks(prev => [...prev, ...newTasks]);

    // Create a label - use first line of input as subject name
    const firstLine = syllabusText.split('\n').find(line => line.trim().length > 0 && !line.trim().match(/^(Module|●|•|-|\*)/i)) || `${modules.length} Tasks Created`;
    const subjectName = firstLine.trim().slice(0, 60); // Limit length for display
    const newLabel = {
      id: `label-logic-${Date.now()}`,
      text: subjectName,
      x: 50,
      y: 50
    };
    setLabels(prev => [...prev, newLabel]);
  };

  // --- AI Task Generation ---

  const generateTasksFromAI = async (syllabusText) => {
    // We no longer strictly check for a single key here because the helper handles the fallback check
    
    // Construct the prompt
    const prompt = `Analyze this syllabus/course content and create a structured task list.

For each module or major section, create a task card with:
- A clear, concise title (module/topic name)
- A list of specific sub-topics or learning objectives as items
- Appropriate color theme suggestion

Return ONLY valid JSON in this exact format (no markdown, no code blocks, just raw JSON):
{
  "tasks": [
    {
      "title": "Module Name",
      "items": ["Topic 1", "Topic 2", "Topic 3"],
      "color": "bg-blue-100 border-blue-300"
    }
  ]
}

Available colors: bg-rose-100 border-rose-300, bg-orange-100 border-orange-300, bg-amber-100 border-amber-300, bg-lime-100 border-lime-300, bg-emerald-100 border-emerald-300, bg-cyan-100 border-cyan-300, bg-violet-100 border-violet-300, bg-pink-100 border-pink-300

Syllabus:
${syllabusText}`;

    try {
      // Use the new OpenRouter helper with fallback support
      const response = await generateContentWithFallback(prompt);
      const text = response.text;
      
      // Clean up response - remove markdown code blocks if present
      let cleanText = text.trim();
      if (cleanText.startsWith('```json')) {
        cleanText = cleanText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      } else if (cleanText.startsWith('```')) {
        cleanText = cleanText.replace(/```\n?/g, '');
      }
      
      const data = JSON.parse(cleanText);
      
      if (!data.tasks || !Array.isArray(data.tasks)) {
        throw new Error('Invalid response format from AI');
      }

      // Get positions that don't overlap with existing items
      const positions = findEmptyPosition(tasks, sections, data.tasks.length);

      // Create tasks from AI response with collision-free positions
      const newTasks = data.tasks.map((taskData, index) => {
        const taskId = `ai-${Date.now()}-${index}`;
        const pos = positions[index] || { x: 100 + (index % 3) * 350, y: 100 + Math.floor(index / 3) * 350 };
        return {
          id: taskId,
          title: taskData.title,
          description: taskData.items.map((item, itemIndex) => ({
            id: `${taskId}-item-${itemIndex}`,
            text: item,
            strikethrough: false
          })),
          x: pos.x,
          y: pos.y,
          color: taskData.color || 'bg-white border-slate-300',
          status: 'active'
        };
      });

      setTasks(prev => [...prev, ...newTasks]);

      // Create a label for the generation - use first line of syllabus as subject name
      const firstLine = syllabusText.split('\n').find(line => line.trim().length > 0) || 'AI Generated Tasks';
      const subjectName = firstLine.trim().slice(0, 60); // Limit length for display
      const newLabel = {
        id: `label-ai-${Date.now()}`,
        text: subjectName,
        x: 50,
        y: 50
      };
      setLabels(prev => [...prev, newLabel]);

    } catch (error) {
      console.error('AI Generation Error:', error);
      throw new Error(`Failed to generate tasks: ${error.message}`);
    }
  };

  // --- Section & Selection Logic ---

  const isTaskInSection = (task, section) => {
    // Check if task center is inside section
    const taskCenter = { x: task.x + 150, y: task.y + 100 }; // Approx center
    return (
      taskCenter.x >= section.x &&
      taskCenter.x <= section.x + section.width &&
      taskCenter.y >= section.y &&
      taskCenter.y <= section.y + section.height
    );
  };

  const handleSelectionStart = (e) => {
    // Box selection disabled per user request
  };

  const updateSelectionBox = (e) => {
    if (!selectionBox) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setSelectionBox(prev => ({ ...prev, currentX: x, currentY: y }));
  };

  const endSelection = (e) => {
    if (!selectionBox) return;
    
    const startX = selectionBox.canvasStartX;
    const startY = selectionBox.canvasStartY;
    const endX = (e.clientX - canvasTransform.x) / canvasTransform.scale;
    const endY = (e.clientY - canvasTransform.y) / canvasTransform.scale;

    const left = Math.min(startX, endX);
    const right = Math.max(startX, endX);
    const top = Math.min(startY, endY);
    const bottom = Math.max(startY, endY);

    const selected = tasks.filter(task => {
        const taskCenterX = task.x + 150;
        const taskCenterY = task.y + 100; 
        return taskCenterX >= left && taskCenterX <= right && taskCenterY >= top && taskCenterY <= bottom;
    }).map(t => t.id);

    setSelectedTaskIds(selected);
    setSelectionBox(null);
  };

  const createGroup = (colorClass) => {
      if (selectedTaskIds.length < 1 && selectedSectionIds.length < 1) return;
      if (!groupName.trim()) {
          alert("Please enter a group name");
          return;
      }

      // If sections are selected, use "Mega Box" wrapping mode (preserves positions)
      if (selectedSectionIds.length > 0) {
          const targetSections = sections.filter(s => selectedSectionIds.includes(s.id));
          const targetTasks = tasks.filter(t => selectedTaskIds.includes(t.id));
          
          if (targetSections.length === 0 && targetTasks.length === 0) return;

          // Calculate bounding box
          let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
          
          targetSections.forEach(s => {
              minX = Math.min(minX, s.x);
              minY = Math.min(minY, s.y);
              maxX = Math.max(maxX, s.x + s.width);
              maxY = Math.max(maxY, s.y + s.height);
          });
          
          targetTasks.forEach(t => {
              minX = Math.min(minX, t.x);
              minY = Math.min(minY, t.y);
              maxX = Math.max(maxX, t.x + 288); // Approx task width
              maxY = Math.max(maxY, t.y + 200); // Approx task height
          });
          
          // Add padding
          const PADDING = 40;
          minX -= PADDING;
          minY -= PADDING; 
          maxX += PADDING;
          maxY += PADDING;
          
          const newSection = {
              id: `section-${Date.now()}`,
              title: groupName,
              color: colorClass,
              x: minX,
              y: minY,
              width: maxX - minX,
              height: maxY - minY
          };
          
          // Add to START of array to ensure it renders behind the contents
          setSections(prev => [newSection, ...prev]);
          
      } else {
          // Standard Task Grouping (Grid Layout)
          const selectedTasks = tasks.filter(t => selectedTaskIds.includes(t.id));

          const COLUMNS = Math.ceil(Math.sqrt(selectedTasks.length));
          const PADDING = 20;
          const HEADER_HEIGHT = 40;
          const TASK_WIDTH = 300;
          const GAP = 20;

          const minX = Math.min(...selectedTasks.map(t => t.x));
          const minY = Math.min(...selectedTasks.map(t => t.y));
          
          const updatedTasks = [...tasks];
          selectedTasks.forEach((task, index) => {
              const col = index % COLUMNS;
              const row = Math.floor(index / COLUMNS);
              
              const newX = minX + PADDING + col * (TASK_WIDTH + GAP);
              const newY = minY + HEADER_HEIGHT + PADDING + row * (350 + GAP);

              const tIndex = updatedTasks.findIndex(t => t.id === task.id);
              if (tIndex !== -1) {
                  updatedTasks[tIndex] = { ...updatedTasks[tIndex], x: newX, y: newY };
              }
          });
          
          const rows = Math.ceil(selectedTasks.length / COLUMNS);
          const sectionWidth = PADDING * 2 + COLUMNS * TASK_WIDTH + (COLUMNS - 1) * GAP;
          const sectionHeight = HEADER_HEIGHT + PADDING * 2 + rows * 350 + (rows - 1) * GAP;

          const newSection = {
              id: `section-${Date.now()}`,
              title: groupName,
              color: colorClass,
              x: minX,
              y: minY,
              width: sectionWidth,
              height: sectionHeight
          };

          setTasks(updatedTasks);
          setSections(prev => [...prev, newSection]);
      }

      setSelectedTaskIds([]);
      setSelectedSectionIds([]);
      setGroupName('');
      setShowGroupModal(false);
      setSelectionMode(false); 
  };

  const handleCreateGroup = () => {
    createGroup(groupColor);
    setGroupColor('bg-indigo-100 border-indigo-300'); // Reset color
  };

  const updateSectionTitle = (id, newTitle) => {
      setSections(prev => prev.map(s => s.id === id ? { ...s, title: newTitle } : s));
  };
  
  
  const initiateDeleteSection = (id) => {
      const section = sections.find(s => s.id === id);
      if (section) {
          setDeleteGroupConfirm({ isOpen: true, sectionId: id, sectionTitle: section.title });
      }
  };

  const handleGroupDelete = (mode) => {
      // mode: 'ungroup' or 'all'
      const { sectionId } = deleteGroupConfirm;
      if (!sectionId) return;

      if (mode === 'all') {
          // Delete section AND tasks inside it
          const section = sections.find(s => s.id === sectionId);
          if (section) {
              // Identify tasks inside logic
              // Since we don't store relation, we check bounds
             const tasksToRemove = tasks.filter(t => isTaskInSection(t, section)).map(t => t.id);
             setTasks(prev => prev.filter(t => !tasksToRemove.includes(t.id)));
          }
      }
      
      setSections(prev => prev.filter(s => s.id !== sectionId));
      setDeleteGroupConfirm({ isOpen: false, sectionId: null, sectionTitle: '' });
  };

  const resolveDragOut = (allow) => {
      if (allow) {
          setDragInitialSection(null); // Allow drag to continue/finish
          setDragOutConfirm({ isOpen: false, taskId: null, sectionId: null });
      } else {
          // Revert to original position
          if (dragOutConfirm.taskId && dragInitialSection) {
               setTasks(prev => prev.map(t => 
                   t.id === dragOutConfirm.taskId 
                   ? { ...t, x: dragInitialSection.originalX, y: dragInitialSection.originalY } 
                   : t
               ));
          }
      setDraggingId(null); // Stop dragging interaction
          setDragOutConfirm({ isOpen: false, taskId: null, sectionId: null });
          setDragInitialSection(null);
      }
  };

  // --- Section Resize ---
  const MIN_SECTION_WIDTH = 340; // Minimum to fit one task card + padding
  const MIN_SECTION_HEIGHT = 200;
  const HEADER_HEIGHT = 40; // Height of section header
  const PADDING = 20; // Padding inside section

  const handleSectionResizeStart = (sectionId, direction, e, sectionFromComponent) => {
    // Falls back to finding in state if not passed, but passed version is preferred to avoid staleness
    const section = sectionFromComponent || sections.find(s => s.id === sectionId);
    if (!section) return;

    // Find tasks currently in this section
    const tasksInSectionIds = tasks.filter(t => isTaskInSection(t, section)).map(t => t.id);
    
    // Calculate strict content boundaries based on actual DOM elements
    let contentBounds = null;
    if (tasksInSectionIds.length > 0) {
        let minX = Infinity;
        let minY = Infinity;
        let maxX = -Infinity;
        let maxY = -Infinity;
        let found = false;

        tasksInSectionIds.forEach(tid => {
            const el = document.getElementById(`task-${tid}`);
            if (el) {
                // Get position relative to canvas (using task state for x/y is safer for position, 
                // but DOM for width/height is better)
                const taskState = tasksRef.current.find(t => t.id === tid);
                if (taskState) {
                    found = true;
                    // Use visual task width (288px) + height from DOM
                    const w = el.offsetWidth;
                    const h = el.offsetHeight;
                    
                    minX = Math.min(minX, taskState.x);
                    minY = Math.min(minY, taskState.y);
                    maxX = Math.max(maxX, taskState.x + w);
                    maxY = Math.max(maxY, taskState.y + h);
                }
            }
        });

        if (found) {
            contentBounds = { minX, minY, maxX, maxY };
        }
    }

    setResizing({
      sectionId,
      direction,
      startX: e.clientX,
      startY: e.clientY,
      startWidth: section.width,
      startHeight: section.height,
      startSectionX: section.x,
      startSectionY: section.y,
      taskIds: tasksInSectionIds, // Store task IDs at start
      contentBounds // Store calculated strict bounds
    });
  };

  const handleResizeMove = (e) => {
    if (!resizing) return;

    const dx = (e.clientX - resizing.startX) / canvasTransform.scale;
    const dy = (e.clientY - resizing.startY) / canvasTransform.scale;

    let newWidth = resizing.startWidth;
    let newHeight = resizing.startHeight;
    let newX = resizing.startSectionX;
    let newY = resizing.startSectionY;

    // Handle different resize directions
    if (resizing.direction.includes('e')) {
      newWidth = Math.max(MIN_SECTION_WIDTH, resizing.startWidth + dx);
    }
    if (resizing.direction.includes('w')) {
      const widthChange = Math.min(dx, resizing.startWidth - MIN_SECTION_WIDTH);
      newX = resizing.startSectionX + widthChange;
      newWidth = resizing.startWidth - widthChange;
    }
    if (resizing.direction.includes('s')) {
      newHeight = Math.max(MIN_SECTION_HEIGHT, resizing.startHeight + dy);
    }
    if (resizing.direction.includes('n')) {
      const heightChange = Math.min(dy, resizing.startHeight - MIN_SECTION_HEIGHT);
      newY = resizing.startSectionY + heightChange;
      newHeight = resizing.startHeight - heightChange;
    }

    // Default min dimensions
    let minWidth = MIN_SECTION_WIDTH;
    let minHeight = MIN_SECTION_HEIGHT;

    // Apply strict DOM-based content constraints
    if (resizing.contentBounds) {
        const { minX, minY, maxX, maxY } = resizing.contentBounds;
        const PADDING = 20;
        const BOTTOM_PADDING = 40; // Extra padding for buttons at bottom of cards
        const HEADER_ROOM = HEADER_HEIGHT + PADDING;

        // When resizing specific edges, ensure we don't cross content
        
        // East (Right)
        if (resizing.direction.includes('e')) {
             // New width must reach at least to maxX
             // newSectionRight (startSectionX + newWidth) >= maxX + PADDING
             minWidth = Math.max(minWidth, maxX - resizing.startSectionX + PADDING);
        }
        
        // South (Bottom)
        if (resizing.direction.includes('s')) {
             minHeight = Math.max(minHeight, maxY - resizing.startSectionY + PADDING);
        }
    }

    // Apply standard resizing logic first to get Proposed Rect
    if (resizing.direction.includes('e')) {
      newWidth = Math.max(minWidth, resizing.startWidth + dx);
    }
    if (resizing.direction.includes('w')) {
      const widthChange = Math.min(dx, resizing.startWidth - minWidth);
      // Extra check for West: Don't move X past minX of content
      if (resizing.contentBounds) {
          const proposedX = resizing.startSectionX + widthChange;
          if (proposedX > resizing.contentBounds.minX - PADDING) {
              // Clamp
              const maxAllowedX = resizing.contentBounds.minX - PADDING;
              // Recalculate width change
              // newX = startSectionX + actualChange
              // actualChange = newX - startSectionX
              const actualChange = maxAllowedX - resizing.startSectionX;
              newX = resizing.startSectionX + actualChange;
              newWidth = resizing.startWidth - actualChange;
          } else {
             newX = resizing.startSectionX + widthChange;
             newWidth = resizing.startWidth - widthChange;
          }
      } else {
        newX = resizing.startSectionX + widthChange;
        newWidth = resizing.startWidth - widthChange;
      }
    }
     if (resizing.direction.includes('s')) {
      newHeight = Math.max(minHeight, resizing.startHeight + dy);
    }
    if (resizing.direction.includes('n')) {
      const heightChange = Math.min(dy, resizing.startHeight - minHeight);
       // Extra check for North: Don't move Y past minY of content
      if (resizing.contentBounds) {
          const proposedY = resizing.startSectionY + heightChange;
           // Must leave room for header
          const maxAllowedY = resizing.contentBounds.minY - (HEADER_HEIGHT + PADDING); 
          
          if (proposedY > maxAllowedY) {
              const actualChange = maxAllowedY - resizing.startSectionY;
              newY = resizing.startSectionY + actualChange;
              newHeight = resizing.startHeight - actualChange;
          } else {
              newY = resizing.startSectionY + heightChange;
              newHeight = resizing.startHeight - heightChange;
          }
      } else {
          newY = resizing.startSectionY + heightChange;
          newHeight = resizing.startHeight - heightChange;
      }
    }

    // Update section size
    setSections(prev => prev.map(s => 
      s.id === resizing.sectionId 
        ? { ...s, width: newWidth, height: newHeight, x: newX, y: newY }
        : s
    ));
    
    // NO AUTO-ARRANGE
  };

  const handleResizeEnd = () => {
    setResizing(null);
    // NO AUTO-ARRANGE ON END
  };

  // Add resize event listeners
  useEffect(() => {
    if (resizing) {
      window.addEventListener('mousemove', handleResizeMove);
      window.addEventListener('mouseup', handleResizeEnd);
    }
    return () => {
      window.removeEventListener('mousemove', handleResizeMove);
      window.removeEventListener('mouseup', handleResizeEnd);
    };
  }, [resizing]);


  // --- Canvas Pan & Zoom ---

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY * -0.001;
    const newScale = Math.min(Math.max(0.5, canvasTransform.scale + delta), 3);
    
    // Zoom centered on cursor
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const newX = mouseX - (mouseX - canvasTransform.x) * (newScale / canvasTransform.scale);
    const newY = mouseY - (mouseY - canvasTransform.y) * (newScale / canvasTransform.scale);
    
    setCanvasTransform({ x: newX, y: newY, scale: newScale });
  };

  const handleCanvasMouseDown = (e) => {

  
  // Default: Pan the canvas (free movement), even in selection mode
  e.preventDefault();
  setIsPanning(true);
  setPanStart({ x: e.clientX - canvasTransform.x, y: e.clientY - canvasTransform.y });
};

  const handleCanvasMouseMove = (e) => {

  
  if (isPanning) {
    setCanvasTransform(prev => ({
      ...prev,
      x: e.clientX - panStart.x,
      y: e.clientY - panStart.y,
    }));
  }
};

  const handleCanvasMouseUp = () => {

  
  setIsPanning(false);
};

  const zoomIn = () => {
    setCanvasTransform(prev => ({
      ...prev,
      scale: Math.min(prev.scale + 0.2, 5)
    }));
  };

  const zoomOut = () => {
    setCanvasTransform(prev => ({
      ...prev,
      scale: Math.max(prev.scale - 0.2, 0.1)
    }));
  };

  const resetZoom = () => {
    setCanvasTransform({ x: 0, y: 0, scale: 1 });
  };

  // --- Drag Logic for Tasks and Labels ---

  const handleMouseDown = (e, id, type = 'task') => {
    const item = type === 'task' 
      ? tasks.find(t => t.id === id)
      : (type === 'label' ? labels.find(l => l.id === id) : sections.find(s => s.id === id));
    
    if (!item) return;

    e.stopPropagation();

    // In selection mode, just toggle selection (no dragging)
    if (selectionMode && type === 'task') {
      const taskSection = sections.find(s => isTaskInSection(item, s));
      
      // Check if we're trying to mix grouped and ungrouped tasks
      if (selectedTaskIds.length > 0) {
        const firstSelectedTask = tasks.find(t => t.id === selectedTaskIds[0]);
        const firstTaskSection = firstSelectedTask ? sections.find(s => isTaskInSection(firstSelectedTask, s)) : null;
        
        // Check if sections match
        if ((taskSection?.id || null) !== (firstTaskSection?.id || null)) {
          // Show warning - can't mix
          alert("Can't select tasks from different groups! You can only group tasks that are all outside groups, or all inside the same group.");
          return;
        }
      }
      
      // Toggle selection
      setSelectedTaskIds(prev => 
        prev.includes(id) ? prev.filter(tid => tid !== id) : [...prev, id]
      );
      return; // Don't start dragging in selection mode
    }

    // Normal drag behavior
    setDragStart({ x: e.clientX, y: e.clientY });
    setHasMoved(false);

    setOffset({
      x: (e.clientX - canvasTransform.x) / canvasTransform.scale - item.x,
      y: (e.clientY - canvasTransform.y) / canvasTransform.scale - item.y
    });
    setDraggingId(id);
    setDraggingType(type);

    if (type === 'task') {
         // Check section containment for Drag Out confirmation
         // Also store original position for ALL tasks (for restoration from trash)
         const section = sections.find(s => isTaskInSection(item, s));
         if (section) {
             setDragInitialSection({ id: section.id, originalX: item.x, originalY: item.y });
         } else {
             // Still store original position for ungrouped tasks (for restoration)
             setDragInitialSection({ id: null, originalX: item.x, originalY: item.y });
         }
    } else if (type === 'section') {
        // Prepare for group dragging - snapshot contained tasks and initial position
        draggedGroupTaskIdsRef.current = tasks.filter(t => isTaskInSection(t, item)).map(t => t.id);
        prevSectionPosRef.current = { x: item.x, y: item.y };
        setDragInitialSection(null);
    } else {
        setDragInitialSection(null);
    }
  };

  const handleLabelMouseDown = (e, id) => {
    handleMouseDown(e, id, 'label');
  };

  const handleMouseMove = (e) => {
    if (!draggingId) return;
    if (dragOutConfirm.isOpen) return; // Pause drag if confirming

    // Check if mouse has moved beyond threshold
    if (dragStart && !hasMoved) {
      const deltaX = Math.abs(e.clientX - dragStart.x);
      const deltaY = Math.abs(e.clientY - dragStart.y);
      if (deltaX > DRAG_THRESHOLD || deltaY > DRAG_THRESHOLD) {
        setHasMoved(true);
      } else {
        return; // Don't update position until threshold is met
      }
    }

    // Calculate new position in canvas space
    const newX = (e.clientX - canvasTransform.x) / canvasTransform.scale - offset.x;
    const newY = (e.clientY - canvasTransform.y) / canvasTransform.scale - offset.y;

    if (draggingType === 'task') {
     // Allow free dragging - confirmation will happen on mouse up
    setTasks(prev => prev.map(t => 
      t.id === draggingId ? { ...t, x: newX, y: newY } : t
    ));
      
      // Trash logic
      const trashRect = trashRef.current?.getBoundingClientRect();
      if (trashRect) {
         setIsOverTrash(
           e.clientX >= trashRect.left && 
           e.clientX <= trashRect.right && 
           e.clientY >= trashRect.top && 
           e.clientY <= trashRect.bottom
         );
      }
    } else if (draggingType === 'label') {
      setLabels(prev => prev.map(l => 
        l.id === draggingId ? { ...l, x: newX, y: newY } : l
      ));
    } else if (draggingType === 'section') {
        // Calculate delta
        const dx = newX - prevSectionPosRef.current.x;
        const dy = newY - prevSectionPosRef.current.y;
        
        // Update section
        setSections(prev => prev.map(s => s.id === draggingId ? { ...s, x: newX, y: newY } : s));
        
        // Update contained tasks
        if (draggedGroupTaskIdsRef.current.length > 0) {
            setTasks(prev => prev.map(t => 
                draggedGroupTaskIdsRef.current.includes(t.id) 
                ? { ...t, x: t.x + dx, y: t.y + dy } 
                : t
            ));
        }

        // Update prev ref
        prevSectionPosRef.current = { x: newX, y: newY };
    }
  };

  const handleMouseUp = () => {
  if (draggingId && isOverTrash && draggingType === 'task' && hasMoved) {
    const completedTask = tasks.find(t => t.id === draggingId);
    if (completedTask) {
      setLastCompleted({ ...completedTask });
    }
    // Store ORIGINAL position from BEFORE dragging started (not current trash position)
    // Use dragInitialSection if task was in a group, otherwise use current position as fallback
    const restoreX = dragInitialSection ? dragInitialSection.originalX : completedTask.x;
    const restoreY = dragInitialSection ? dragInitialSection.originalY : completedTask.y;
    
    setTasks(prev => prev.map(t => 
      t.id === draggingId ? { ...t, status: 'completed', originalX: restoreX, originalY: restoreY } : t
    ));
  } else if (draggingId && draggingType === 'task' && hasMoved && dragInitialSection && dragInitialSection.id) {
    // Check if task was dropped OUTSIDE its original group (not to trash)
    const task = tasks.find(t => t.id === draggingId);
    const section = sections.find(s => s.id === dragInitialSection.id);
    
    if (task && section && !isTaskInSection(task, section)) {
      // Task is outside its original group - show confirmation
      setDragOutConfirm({ 
        isOpen: true, 
        taskId: draggingId, 
        sectionId: section.id, 
        targetX: task.x, 
        targetY: task.y 
      });
      // Don't reset drag state yet - wait for confirmation
      return;
    }
  }

  setDraggingId(null);
  setDraggingType(null);
  setIsOverTrash(false);
  setDragStart(null);
  setHasMoved(false);
  setDragInitialSection(null);
};

  // Undo the last completed task
  const handleUndo = () => {
    if (lastCompleted) {
      setTasks(prev => prev.map(t => 
        t.id === lastCompleted.id ? { ...lastCompleted, status: 'active' } : t
      ));
      setLastCompleted(null);
    }
  };

  // --- Touch Event Handlers for Mobile Drag (Double-tap to activate) ---
  
  const handleTouchStart = (e, id, type = 'task') => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300; // ms
    
    // Check for double-tap on the same item
    if (lastTapRef.current.id === id && (now - lastTapRef.current.time) < DOUBLE_TAP_DELAY) {
      // Double-tap detected - start drag mode
      e.preventDefault();
      
      const touch = e.touches[0];
      const item = type === 'task' 
        ? tasks.find(t => t.id === id)
        : (type === 'label' ? labels.find(l => l.id === id) : sections.find(s => s.id === id));
      
      if (!item) return;

      setTouchDragActive(true);
      setDragStart({ x: touch.clientX, y: touch.clientY });
      setHasMoved(true); // Already committed to drag on double-tap
      
      setOffset({
        x: (touch.clientX - canvasTransform.x) / canvasTransform.scale - item.x,
        y: (touch.clientY - canvasTransform.y) / canvasTransform.scale - item.y
      });
      setDraggingId(id);
      setDraggingType(type);

      if (type === 'task') {
        const section = sections.find(s => isTaskInSection(item, s));
        if (section) {
          setDragInitialSection({ id: section.id, originalX: item.x, originalY: item.y });
        } else {
          setDragInitialSection(null);
        }
      } else if (type === 'section') {
        draggedGroupTaskIdsRef.current = tasks.filter(t => isTaskInSection(t, item)).map(t => t.id);
        prevSectionPosRef.current = { x: item.x, y: item.y };
        setDragInitialSection(null);
      }
      
      lastTapRef.current = { time: 0, id: null }; // Reset
    } else {
      // First tap - record it
      lastTapRef.current = { time: now, id };
    }
  };

  const handleTouchMove = (e) => {
    if (!draggingId || !touchDragActive) return;
    if (dragOutConfirm.isOpen) return;
    
    e.preventDefault();
    const touch = e.touches[0];
    
    const newX = (touch.clientX - canvasTransform.x) / canvasTransform.scale - offset.x;
    const newY = (touch.clientY - canvasTransform.y) / canvasTransform.scale - offset.y;

    if (draggingType === 'task') {
    // Allow free dragging - confirmation will happen on touch end
    setTasks(prev => prev.map(t => 
      t.id === draggingId ? { ...t, x: newX, y: newY } : t
    ));
      
      // Check trash zone
      const trashRect = trashRef.current?.getBoundingClientRect();
      if (trashRect) {
        setIsOverTrash(
          touch.clientX >= trashRect.left && 
          touch.clientX <= trashRect.right && 
          touch.clientY >= trashRect.top && 
          touch.clientY <= trashRect.bottom
        );
      }
    } else if (draggingType === 'label') {
      setLabels(prev => prev.map(l => 
        l.id === draggingId ? { ...l, x: newX, y: newY } : l
      ));
    } else if (draggingType === 'section') {
      const dx = newX - prevSectionPosRef.current.x;
      const dy = newY - prevSectionPosRef.current.y;
      
      setSections(prev => prev.map(s => s.id === draggingId ? { ...s, x: newX, y: newY } : s));
      
      if (draggedGroupTaskIdsRef.current.length > 0) {
        setTasks(prev => prev.map(t => 
          draggedGroupTaskIdsRef.current.includes(t.id) 
          ? { ...t, x: t.x + dx, y: t.y + dy } 
          : t
        ));
      }
      prevSectionPosRef.current = { x: newX, y: newY };
    }
  };

  const handleTouchEnd = () => {
  if (draggingId && isOverTrash && draggingType === 'task' && touchDragActive) {
    const completedTask = tasks.find(t => t.id === draggingId);
    if (completedTask) {
      setLastCompleted({ ...completedTask });
    }
    // Store ORIGINAL position from BEFORE dragging started (not current trash position)
    const restoreX = dragInitialSection ? dragInitialSection.originalX : completedTask.x;
    const restoreY = dragInitialSection ? dragInitialSection.originalY : completedTask.y;
    
    setTasks(prev => prev.map(t => 
      t.id === draggingId ? { ...t, status: 'completed', originalX: restoreX, originalY: restoreY } : t
    ));
  } else if (draggingId && draggingType === 'task' && touchDragActive && dragInitialSection && dragInitialSection.id) {
    // Check if task was dropped OUTSIDE its original group (not to trash)
    const task = tasks.find(t => t.id === draggingId);
    const section = sections.find(s => s.id === dragInitialSection.id);
    
    if (task && section && !isTaskInSection(task, section)) {
      // Task is outside its original group - show confirmation
      setDragOutConfirm({ 
        isOpen: true, 
        taskId: draggingId, 
        sectionId: section.id, 
        targetX: task.x, 
        targetY: task.y 
      });
      // Don't reset drag state yet - wait for confirmation
      return;
    }
  }
  
  setDraggingId(null);
  setDraggingType(null);
  setIsOverTrash(false);
  setDragStart(null);
  setHasMoved(false);
  setDragInitialSection(null);
  setTouchDragActive(false);
};

  // Add global mouse listeners for smooth dragging outside the card div
  useEffect(() => {
    if (draggingId) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggingId, isOverTrash]);

  // Add global touch listeners for mobile drag
  useEffect(() => {
    if (touchDragActive && draggingId) {
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('touchend', handleTouchEnd);
      window.addEventListener('touchcancel', handleTouchEnd);
    }
    return () => {
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [touchDragActive, draggingId]);

  // Add event listeners for canvas panning
  useEffect(() => {
    if (isPanning) {
      window.addEventListener('mousemove', handleCanvasMouseMove);
      window.addEventListener('mouseup', handleCanvasMouseUp);
    } else {
      window.removeEventListener('mousemove', handleCanvasMouseMove);
      window.removeEventListener('mouseup', handleCanvasMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleCanvasMouseMove);
      window.removeEventListener('mouseup', handleCanvasMouseUp);
    };
  }, [isPanning, handleCanvasMouseMove, handleCanvasMouseUp]); // Added dependencies to fix stale closure

  // Add spacebar listener for panning
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Check if user is typing in an input/textarea
      const activeElement = document.activeElement;
      const isTyping = activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA' || activeElement.isContentEditable);
      
      if (e.code === 'Space' && !e.repeat && !isTyping) {
        e.preventDefault();
        setSpacebarPressed(true);
      }
      // ESC to exit selection mode
      // ESC to exit selection mode
      if (e.code === 'Escape') {
        if (selectionMode) {
          setSelectionMode(false);
          setSelectedTaskIds([]);
          setSelectedSectionIds([]);
        }
      }

      // Delete / Backspace to delete selected items
      if (e.key === 'Delete' || e.key === 'Backspace') {
        const activeElement = document.activeElement;
        const isInput = activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA' || activeElement.isContentEditable;
        
        if (!isInput) {
            const hasSelection = selectedTaskIdsRef.current.length > 0 || selectedSectionIdsRef.current.length > 0;
            if (hasSelection) {
                e.preventDefault();
                
                let changed = false;
                if (selectedTaskIdsRef.current.length > 0) {
                     setTasks(prev => prev.filter(t => !selectedTaskIdsRef.current.includes(t.id)));
                     changed = true;
                }
                if (selectedSectionIdsRef.current.length > 0) {
                     setSections(prev => prev.filter(s => !selectedSectionIdsRef.current.includes(s.id)));
                     changed = true;
                }
                
                if (changed) {
                    setSelectedTaskIds([]);
                    setSelectedSectionIds([]);
                }
            }
        }
      }
    };

    const handleKeyUp = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        setSpacebarPressed(false);
        setIsPanning(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [selectionMode]);
  // --- Features ---

  const organizeTasks = () => {
    // Smart organize: Arrange sections (big boxes) and standalone tasks
    // Tasks inside sections stay with their section
    
    const MARGIN = 50;
    const SECTION_GAP = 40;
    const TASK_GAP = 20;
    const START_X = 100;
    const START_Y = 100;
    
    // Find standalone tasks (not in any section)
    const standaloneTasks = tasks.filter(t => {
      if (t.status !== 'active') return false;
      return !sections.some(s => isTaskInSection(t, s));
    });
    
    // Calculate how many columns we can fit
    const maxWidth = window.innerWidth - START_X * 2;
    
    // Track current position
    let currentX = START_X;
    let currentY = START_Y;
    let rowMaxHeight = 0;
    
    // New positions for sections
    const newSections = [];
    const sectionMovements = {}; // Track how much each section moved
    
    // Organize sections first (they are larger)
    sections.forEach((section) => {
      // Check if section fits in current row
      if (currentX + section.width > maxWidth && currentX !== START_X) {
        // Move to next row
        currentX = START_X;
        currentY += rowMaxHeight + SECTION_GAP;
        rowMaxHeight = 0;
      }
      
      // Calculate movement delta
      const dx = currentX - section.x;
      const dy = currentY - section.y;
      sectionMovements[section.id] = { dx, dy };
      
      newSections.push({
        ...section,
        x: currentX,
        y: currentY
      });
      
      // Update position for next item
      currentX += section.width + SECTION_GAP;
      rowMaxHeight = Math.max(rowMaxHeight, section.height);
    });
    
    // Move to next row for standalone tasks
    if (sections.length > 0 && standaloneTasks.length > 0) {
      currentX = START_X;
      currentY += rowMaxHeight + SECTION_GAP;
      rowMaxHeight = 0;
    }
    
    // Organize standalone tasks in a grid
    const TASK_WIDTH = 300;
    const TASK_HEIGHT = 350;
    const taskCols = Math.max(1, Math.floor(maxWidth / (TASK_WIDTH + TASK_GAP)));
    
    const newTasks = tasks.map(t => {
      if (t.status !== 'active') return t;
      
      // Check if task is in a section
      const containingSection = sections.find(s => isTaskInSection(t, s));
      if (containingSection) {
        // Move task with its section
        const movement = sectionMovements[containingSection.id];
        if (movement) {
          return {
            ...t,
            x: t.x + movement.dx,
            y: t.y + movement.dy
          };
        }
        return t;
      }
      
      // Standalone task - arrange in grid
      const standaloneIndex = standaloneTasks.findIndex(st => st.id === t.id);
      if (standaloneIndex >= 0) {
        const col = standaloneIndex % taskCols;
        const row = Math.floor(standaloneIndex / taskCols);
        return {
          ...t,
          x: START_X + col * (TASK_WIDTH + TASK_GAP),
          y: currentY + row * (TASK_HEIGHT + TASK_GAP)
        };
      }
      
      return t;
    });
    
    setSections(newSections);
    setTasks(newTasks);
  };

  const restoreTask = (id) => {
  setTasks(prev => prev.map(t => {
    if (t.id === id) {
      // Restore to original position if available, otherwise center of screen
      const restoreX = t.originalX !== undefined ? t.originalX : window.innerWidth / 2 - 150;
      const restoreY = t.originalY !== undefined ? t.originalY : window.innerHeight / 2 - 100;
      return { ...t, status: 'active', x: restoreX, y: restoreY };
    }
    return t;
  }));
};

  const addTask = () => {
    const newId = `custom-${Date.now()}`;
    const newTask = {
      id: newId,
      title: 'New Task',
      description: [
        { id: `${newId}-1`, text: 'New item 1', strikethrough: false },
        { id: `${newId}-2`, text: 'New item 2', strikethrough: false }
      ],
      x: (window.innerWidth / 2 - canvasTransform.x) / canvasTransform.scale - 144,
      y: (window.innerHeight / 2 - canvasTransform.y) / canvasTransform.scale - 100,
      color: 'bg-white border-slate-300',
      status: 'active'
    };
    setTasks(prev => [...prev, newTask]);
  };

  const activeTasks = tasks.filter(t => t.status === 'active');
  const completedTasks = tasks.filter(t => t.status === 'completed');

  return (
    <div className="min-h-screen bg-slate-50 overflow-hidden relative font-sans selection:bg-blue-200">
      
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
      </div>

      {/* Header / Toolbar - Always Visible */}
      <div 
        className="absolute top-0 left-0 right-0 p-2 md:px-4 md:h-24 flex flex-col md:flex-row justify-between items-center pointer-events-none z-40 gap-2 transition-all duration-300 ease-in-out"
        style={{ left: isMobile ? '0.5rem' : (sidebarCollapsed ? '1rem' : '17rem'), right: '0.5rem' }}
      >
        {/* Title Bar - Hidden on mobile */}
        <div className="hidden md:flex bg-white/90 backdrop-blur shadow-sm border rounded-full px-4 py-2 pointer-events-auto items-center gap-3">
          <div className="flex flex-col">
            <h1 className="font-bold text-slate-800 leading-none text-base">Prats Second Brain</h1>
          </div>
          <div className="h-6 w-px bg-slate-200 mx-1"></div>
          <div className="text-[10px] md:text-xs text-slate-600">
            <span className="font-bold text-slate-900">{activeTasks.length}</span> Active 
            <span className="mx-1">•</span>
            <span className="font-bold text-green-600">{completedTasks.length}</span> Completed
          </div>
        </div>

        {/* Mobile Title - Compact */}
        <div className="md:hidden bg-white/90 backdrop-blur shadow-sm border rounded-full px-4 py-2 pointer-events-auto flex items-center gap-3">
          <h1 className="font-bold text-slate-800 leading-none text-sm">Prats Brain</h1>
          <div className="text-[10px] text-slate-600">
            <span className="font-bold text-slate-900">{activeTasks.length}</span>/<span className="font-bold text-green-600">{completedTasks.length}</span>
          </div>
        </div>

        {/* Selection Mode Indicator */}
        {selectionMode && (
          <div className="bg-blue-600 text-white px-3 md:px-4 py-1.5 md:py-2 rounded-full shadow-lg pointer-events-auto flex items-center gap-2 md:gap-3 animate-pulse text-sm">
            <MousePointer size={14} />
            {(selectedTaskIds.length > 0 || selectedSectionIds.length > 0) ? (
              <span className="bg-white text-blue-600 px-2 py-0.5 rounded-full text-xs font-bold">
                {selectedTaskIds.length + selectedSectionIds.length} selected
              </span>
            ) : (
               <span className="text-xs md:text-sm font-medium">Select items</span>
            )}
          </div>
        )}

        {/* Action Buttons - Single Collapsible Pill */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {(selectedTaskIds.length > 0 || selectedSectionIds.length > 0) && (
             <button 
               onClick={() => setShowGroupModal(true)}
               className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full shadow-lg shadow-indigo-200 flex items-center gap-2 transition-transform hover:scale-105 active:scale-95 text-xs md:text-sm"
             >
               <Group size={16} />
               <span className="font-semibold">Group ({selectedTaskIds.length})</span>
             </button>
          )}

          {/* Main Tools Pill */}
          <div className={`bg-white/95 backdrop-blur shadow-xl border border-slate-200 rounded-full flex items-center p-2.5 transition-all duration-500 ease-in-out ${toolbarCollapsed ? 'gap-0' : 'gap-2'}`}>
            {/* Tools - Collapsible */}
            <div className={`flex items-center gap-2 overflow-visible transition-all duration-500 ease-in-out ${toolbarCollapsed ? 'max-w-0 opacity-0 p-0' : 'max-w-[500px] opacity-100 p-1'}`}>
              {/* Create Split-Button: Main click = AI, Arrow hover = Dropdown */}
              <div className="relative" 
                   onMouseLeave={() => setShowCreateDropdown(false)}>
                {/* Button Container - pill shape */}
                <div className="flex items-center bg-gradient-to-r from-purple-600 via-pink-600 to-pink-700 rounded-full overflow-hidden shadow-lg">
                  {/* Main Button - Click opens AI modal directly */}
                  <button 
                      onClick={() => { setAiModalMode('ai'); setShowAIModal(true); }}
                      className="text-white px-3 py-2 flex items-center gap-1.5 hover:bg-white/10 transition-colors text-xs"
                      title="Create with AI"
                  >
                      <Sparkles size={14} />
                      <span className="font-semibold hidden sm:inline">Create</span>
                  </button>
                  {/* Divider line */}
                  <div className="w-px h-5 bg-white/30" />
                  {/* Arrow Button - Hover triggers dropdown */}
                  <button 
                      className="text-white px-2 py-2 flex items-center hover:bg-white/10 transition-colors"
                      title="More options"
                      onMouseEnter={() => setShowCreateDropdown(true)}
                  >
                      <ChevronDown size={14} className="opacity-90" />
                  </button>
                </div>
                {/* Dropdown - Outside the overflow-hidden container */}
                {showCreateDropdown && (
                  <div className="absolute top-full right-0 pt-1 w-48 z-50">
                    <div className="bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden">
                    <div 
                        onClick={() => { setAiModalMode('logic'); setShowAIModal(true); setShowCreateDropdown(false); }}
                        className="p-3 hover:bg-indigo-50 flex items-center gap-3 border-b border-slate-50 transition-colors cursor-pointer"
                    >
                        <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                            <Sparkles size={16} />
                        </div>
                        <div>
                            <div className="text-sm font-bold text-slate-700">Logic Create</div>
                            <div className="text-[10px] text-slate-500">Auto-breakdown tasks</div>
                        </div>
                    </div>
                    <div 
                        onClick={() => { setAiModalMode('ai'); setShowAIModal(true); setShowCreateDropdown(false); }}
                        className="p-3 hover:bg-pink-50 flex items-center gap-3 transition-colors cursor-pointer"
                    >
                        <div className="p-2 bg-pink-100 text-pink-600 rounded-lg">
                            <Wand2 size={16} />
                        </div>
                        <div>
                            <div className="text-sm font-bold text-slate-700">AI Create</div>
                            <div className="text-[10px] text-slate-500">Generative task list</div>
                        </div>
                    </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="w-px h-6 bg-slate-200" />

              {/* Label Button */}
              <button 
                onClick={addLabel}
                className="p-2 rounded-full bg-yellow-500 hover:bg-yellow-600 text-white transition-transform hover:scale-105 active:scale-95"
                title="Add Text Label"
              >
                <Type size={14} />
              </button>



              {/* Divider */}
              <div className="w-px h-6 bg-slate-200" />

              {/* Undo */}
              <button 
                onClick={undo}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                title="Undo (Ctrl+Z)"
                disabled={historyIndexRef.current <= 0}
              >
                <Undo2 size={14} />
              </button>

              {/* Redo */}
              <button 
                onClick={redo}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                title="Redo (Ctrl+Y)"
                disabled={historyIndexRef.current >= historyRef.current.length - 1}
              >
                <Redo2 size={14} />
              </button>

              {/* Divider */}
              <div className="w-px h-6 bg-slate-200" />

              {/* Add Task */}
              <button 
                onClick={addTask}
                className="p-2 rounded-full bg-green-500 hover:bg-green-600 text-white transition-transform hover:scale-105 active:scale-95"
                title="Add Task"
              >
                <Plus size={14} />
              </button>

              {/* Organize */}
              <button 
                onClick={organizeTasks}
                className="p-2 rounded-full bg-slate-700 hover:bg-slate-800 text-white transition-transform hover:scale-105 active:scale-95"
                title="Auto-Organize Layout"
              >
                <LayoutGrid size={14} />
              </button>

              {/* Selection Mode */}
              <button 
                onClick={() => {
                  if (selectionMode) {
                    setSelectedTaskIds([]);
                    setSelectedSectionIds([]);
                  }
                  setSelectionMode(!selectionMode);
                }}
                className={`p-2 rounded-full transition-all ${
                  selectionMode 
                    ? 'bg-blue-600 text-white' 
                    : 'hover:bg-slate-100 text-slate-600'
                }`}
                title={selectionMode ? 'Exit Selection Mode (ESC)' : 'Select Multiple Tasks'}
              >
                <MousePointer size={14} />
              </button>

              {/* Settings */}
              <button 
                onClick={() => setShowSettings(true)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-600 transition-all"
                title="Settings"
              >
                <Settings size={14} />
              </button>
            </div>

            {/* Collapse/Expand Toggle */}
            <button 
              onClick={() => setToolbarCollapsed(!toolbarCollapsed)}
              className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-all"
              title={toolbarCollapsed ? 'Expand Toolbar' : 'Collapse Toolbar'}
            >
              {toolbarCollapsed ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
            </button>
          </div>
        </div>
      </div>

      {/* Restore Header Button */}
      <div 
        className={`absolute top-4 right-4 z-40 transition-all duration-500 transform ${
          isHeaderCollapsed ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        <button 
          onClick={() => setIsHeaderCollapsed(false)}
          className="bg-white/90 backdrop-blur shadow-md border rounded-full p-2 text-slate-500 hover:text-slate-800 transition-colors hover:shadow-lg"
          title="Show Toolbar"
        >
          <ChevronDown size={20} />
        </button>
      </div>

      {/* Canvas Area with Transform */}
      <div 
        ref={canvasRef}
        className="h-screen transition-all duration-300 ease-in-out"
        onMouseDown={handleCanvasMouseDown}
        onMouseMove={handleCanvasMouseMove}
        onMouseUp={handleCanvasMouseUp}
        style={{ 
          cursor: isPanning ? 'grabbing' : (selectionMode ? 'crosshair' : 'grab'),
          marginLeft: sidebarCollapsed ? 0 : '256px',
          width: sidebarCollapsed ? '100%' : 'calc(100% - 256px)'
        }}
      >
        <div 
          style={{
            transform: `translate(${canvasTransform.x}px, ${canvasTransform.y}px) scale(${canvasTransform.scale})`,
            transformOrigin: '0 0',
            transition: isPanning ? 'none' : 'transform 0.1s ease-out',
          }}
        >
          {/* Sections Rendered First (Behind) */}
          {sections.map(section => (
            <Section 
               key={section.id} 
               section={section} 
               onMouseDown={handleMouseDown}
               onUpdateTitle={(id, title) => setSections(prev => prev.map(s => s.id === id ? { ...s, title } : s))}
               onUpdateColor={updateSectionColor}
               onDelete={(id, title) => setDeleteGroupConfirm({ isOpen: true, sectionId: id, sectionTitle: title })}
               onResize={handleSectionResizeStart}
               selectionMode={selectionMode}
               isSelected={selectedSectionIds.includes(section.id)}
               onToggleSelect={(id) => {
                 setSelectedSectionIds(prev => 
                   prev.includes(id) 
                     ? prev.filter(sid => sid !== id) 
                     : [...prev, id]
                 );
               }}
            />
          ))}

          {activeTasks.map(task => (
            <TaskCard 
              key={task.id} 
              task={task} 
              onMouseDown={handleMouseDown}
              onTouchStart={handleTouchStart}
              onUpdateTitle={updateTaskTitle}
              onUpdateItem={updateTaskItem}
              onAddItem={addTaskItem}
              onDeleteTask={handleDeleteTaskClick}
              onDeleteItem={deleteTaskItem}
              onToggleStrikethrough={toggleItemStrikethrough}
              isSelected={selectedTaskIds.includes(task.id)}
              selectionIndex={selectedTaskIds.indexOf(task.id)}
              isTouchDragging={touchDragActive && draggingId === task.id}
            />
          ))}

          {labels.map(label => (
            <Label
              key={label.id}
              label={label}
              onMouseDown={handleLabelMouseDown}
              onUpdate={updateLabel}
              onDelete={deleteLabel}
              onUpdateStyle={updateLabelStyle}
            />
          ))}



          {/* Selection Box Overlay */}
          {selectionBox && (
              <div 
                className="absolute border border-blue-500 bg-blue-200/20 pointer-events-none z-50"
                style={{
                    left: Math.min(selectionBox.startX, selectionBox.currentX),
                    top: Math.min(selectionBox.startY, selectionBox.currentY),
                    width: Math.abs(selectionBox.currentX - selectionBox.startX),
                    height: Math.abs(selectionBox.currentY - selectionBox.startY)
                }}
              />
          )}

        </div>

        {activeTasks.length === 0 && sections.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center text-slate-400">
              <Sparkles size={48} className="mx-auto mb-4 opacity-50" />
              <h2 className="text-2xl font-bold">All Clean!</h2>
              <p>Check the trash bin to see your completed work.</p>
            </div>
          </div>
        )}
      </div>

      {/* Zoom Controls */}
      <div 
        className="fixed bottom-20 md:bottom-8 bg-white/90 backdrop-blur shadow-lg border rounded-xl p-1.5 md:p-2 flex flex-row md:flex-col gap-1 md:gap-2 z-30 transition-all duration-300"
        style={{ left: isMobile ? '0.5rem' : (sidebarCollapsed ? '1rem' : '17rem') }}
      >
        <button 
          onClick={zoomIn}
          className="p-2 hover:bg-indigo-50 rounded-lg text-indigo-600 transition-colors"
          title="Zoom In"
        >
          <ZoomIn size={18} />
        </button>
        <button 
          onClick={zoomOut}
          className="p-2 hover:bg-indigo-50 rounded-lg text-indigo-600 transition-colors"
          title="Zoom Out"
        >
          <ZoomOut size={18} />
        </button>
        <button 
          onClick={resetZoom}
          className="p-2 hover:bg-indigo-50 rounded-lg text-indigo-600 transition-colors"
          title="Reset Zoom"
        >
          <Maximize2 size={18} />
        </button>
        <div className="text-[10px] text-center text-slate-600 font-mono mt-1">
          {Math.round(canvasTransform.scale * 100)}%
        </div>
      </div>

      {/* Trash / Completed Zone */}
      <TrashZone 
        ref={trashRef}
        isHovered={isOverTrash} 
        onClick={() => setShowCompleted(true)} 
      />

      {/* Completed Modal */}
      <CompletedModal 
        isOpen={showCompleted} 
        onClose={() => setShowCompleted(false)}
        tasks={completedTasks}
        onRestore={restoreTask}
      />

      {/* AI Creation Modal */}
      <AICreateModal
        isOpen={showAIModal}
        onClose={() => setShowAIModal(false)}
        onGenerate={generateTasksFromAI}
        onLogicGenerate={generateTasksFromLogic}
        initialMode={aiModalMode}
      />

      {/* Group Creation Input Modal */}
      {showGroupModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center">
             <div className="bg-white rounded-xl shadow-2xl p-6 w-96 transform transition-all scale-100">
                 <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                     <Group size={20} className="text-indigo-600" />
                     Create Group
                 </h2>
                 <input 
                    autoFocus
                    type="text"
                    placeholder="Group Name (e.g. Phase 1)"
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none mb-4"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') handleCreateGroup();
                        if (e.key === 'Escape') setShowGroupModal(false);
                    }}
                 />
                 
                 {/* Color Picker */}
                 <div className="mb-4">
                   <label className="text-sm font-medium text-slate-600 mb-2 block">Group Color</label>
                   <div className="flex flex-wrap gap-2">
                     {COLOR_OPTIONS.slice(1).map((color, i) => (
                       <button
                         key={i}
                         onClick={() => setGroupColor(`${color.bg} ${color.border}`)}
                         className={`w-8 h-8 rounded-lg ${color.bg} border-2 ${color.border} hover:scale-110 transition-transform ${
                           groupColor === `${color.bg} ${color.border}` ? 'ring-2 ring-offset-2 ring-indigo-500' : ''
                         }`}
                         title={color.name}
                       />
                     ))}
                   </div>
                 </div>
                 
                 <div className="flex justify-end gap-2">
                     <button onClick={() => setShowGroupModal(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                     <button onClick={handleCreateGroup} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Create</button>
                 </div>
             </div>
        </div>
      )}

      {/* Drag Out Confirmation Modal */}
      <DragOutConfirmModal 
        isOpen={dragOutConfirm.isOpen}
        sectionTitle={sections.find(s => s.id === dragOutConfirm.sectionId)?.title || 'Group'}
        onCancel={() => {
            // Cancel Drag out - Snap back
            setDragOutConfirm({ isOpen: false, taskId: null, sectionId: null });
            if (dragInitialSection && draggingId) {
                setTasks(prev => prev.map(t => t.id === draggingId ? { ...t, x: dragInitialSection.originalX, y: dragInitialSection.originalY } : t));
                setDraggingId(null);
                setDraggingType(null);
                setDragInitialSection(null);
            }
        }}
        onConfirm={() => {
            // Allow drag out
            if (dragOutConfirm.taskId && dragOutConfirm.targetX !== null && dragOutConfirm.targetY !== null) {
                setTasks(prev => prev.map(t => 
                    t.id === dragOutConfirm.taskId 
                    ? { ...t, x: dragOutConfirm.targetX, y: dragOutConfirm.targetY } 
                    : t
                ));
            }
            setDragOutConfirm({ isOpen: false, taskId: null, sectionId: null, targetX: null, targetY: null });
            setDragInitialSection(null);
            setDraggingId(null);
            setDraggingType(null);
        }}
      />

       {/* Delete Group Modal */}
       <DeleteGroupModal 
         isOpen={deleteGroupConfirm.isOpen}
         groupTitle={deleteGroupConfirm.sectionTitle}
         onCancel={() => setDeleteGroupConfirm(prev => ({ ...prev, isOpen: false }))}
         onUngroup={() => {
           // Delete section only, keep tasks
           setSections(prev => prev.filter(s => s.id !== deleteGroupConfirm.sectionId));
           setDeleteGroupConfirm({ isOpen: false, sectionId: null, sectionTitle: '' });
         }}
         onDeleteAll={() => {
           // Delete section AND tasks inside it
           const section = sections.find(s => s.id === deleteGroupConfirm.sectionId);
           if (section) {
             const tasksToRemove = tasks.filter(t => {
               const taskCenter = { x: t.x + 150, y: t.y + 100 };
               return (
                 taskCenter.x >= section.x &&
                 taskCenter.x <= section.x + section.width &&
                 taskCenter.y >= section.y &&
                 taskCenter.y <= section.y + section.height
               );
             }).map(t => t.id);
             setTasks(prev => prev.filter(t => !tasksToRemove.includes(t.id)));
           }
           setSections(prev => prev.filter(s => s.id !== deleteGroupConfirm.sectionId));
           setDeleteGroupConfirm({ isOpen: false, sectionId: null, sectionTitle: '' });
         }}
       />

      {/* Delete Confirmation Modal (Task) */}
      <DeleteConfirmModal
        isOpen={deleteConfirm.isOpen}
        taskTitle={deleteConfirm.taskTitle}
        onCancel={() => setDeleteConfirm({ isOpen: false, taskId: null, taskTitle: '' })}
        onConfirm={() => {
          setTasks(prev => prev.filter(t => t.id !== deleteConfirm.taskId));
          setDeleteConfirm({ isOpen: false, taskId: null, taskTitle: '' });
        }}
      />

      {/* Notebook Sidebar */}
      <NotebookSidebar 
        notebooks={notebooks}
        activeNotebookId={activeNotebookId}
        onSelect={switchNotebook}
        onCreate={createNotebook}
        onRename={renameNotebook}
        onDelete={deleteNotebook}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Settings Modal */}
      <SettingsModal 
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        onExport={exportData}
        onImport={importData}
        onExportNotebook={exportNotebook}
        onImportNotebook={importNotebook}
        onExportText={exportAsText}
        onImportText={() => setShowImportTextModal(true)}
        currentNotebookName={notebooks.find(nb => nb.id === activeNotebookId)?.name || 'Notebook'}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
      />

      {/* Export Text Modal */}
      <ExportTextModal
        isOpen={showExportTextModal}
        onClose={() => setShowExportTextModal(false)}
        text={exportTextContent}
      />

      {/* Import Text Modal */}
      <ImportTextModal
        isOpen={showImportTextModal}
        onClose={() => setShowImportTextModal(false)}
        text={importTextContent}
        setText={setImportTextContent}
        onImport={importFromText}
      />
    </div>
  );
}
