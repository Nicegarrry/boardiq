'use client';

import { useState, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { useAgendaItems, useDataOperations } from '@/hooks/useData';
import { StatusLabel } from '@/components/shared/StatusLabel';
import { Badge } from '@/components/shared/Badge';
import type { ActionType, AgendaItem } from '@/lib/types';

const MEETING_ID = 'mtg_apr_2026';

interface NewItemForm {
  title: string;
  actionType: ActionType;
  durationMinutes: number;
}

const emptyForm: NewItemForm = {
  title: '',
  actionType: 'noting',
  durationMinutes: 10,
};

export function AgendaEditor() {
  const items = useAgendaItems(MEETING_ID);
  const { addAgendaItem, updateAgendaItem } = useDataOperations();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState<NewItemForm>(emptyForm);

  // Drag state
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dropIndex, setDropIndex] = useState<number | null>(null);
  const dragCounter = useRef(0);

  function startEdit(id: string, currentTitle: string) {
    setEditingId(id);
    setEditTitle(currentTitle);
  }

  function saveEdit(id: string) {
    if (editTitle.trim()) {
      updateAgendaItem(id, { title: editTitle.trim() });
    }
    setEditingId(null);
    setEditTitle('');
  }

  function cancelEdit() {
    setEditingId(null);
    setEditTitle('');
  }

  function reorderItems(fromIndex: number, toIndex: number) {
    if (fromIndex === toIndex) return;

    // Build new order and reassign sortOrders
    const ordered = [...items];
    const [moved] = ordered.splice(fromIndex, 1);
    ordered.splice(toIndex, 0, moved);

    // Update sortOrder for all affected items
    ordered.forEach((item, i) => {
      const newSort = (i + 1) * 10;
      if (item.sortOrder !== newSort) {
        updateAgendaItem(item.id, { sortOrder: newSort });
      }
    });
  }

  const handleDragStart = useCallback((e: React.DragEvent, index: number) => {
    setDragIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(index));
    // Make the drag image slightly transparent
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '0.5';
    }
  }, []);

  const handleDragEnd = useCallback((e: React.DragEvent) => {
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '1';
    }
    setDragIndex(null);
    setDropIndex(null);
    dragCounter.current = 0;
  }, []);

  const handleDragEnter = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault();
    dragCounter.current++;
    setDropIndex(index);
  }, []);

  const handleDragLeave = useCallback(() => {
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setDropIndex(null);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, toIndex: number) => {
    e.preventDefault();
    const fromIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);
    if (!isNaN(fromIndex)) {
      reorderItems(fromIndex, toIndex);
    }
    setDragIndex(null);
    setDropIndex(null);
    dragCounter.current = 0;
  }, [items]);

  function handleAddItem() {
    if (!newItem.title.trim()) return;
    addAgendaItem(MEETING_ID, {
      title: newItem.title.trim(),
      actionType: newItem.actionType,
      durationMinutes: newItem.durationMinutes,
      phase: 'Other',
    });
    setNewItem(emptyForm);
    setShowAddForm(false);
  }

  return (
    <div>
      <div className="space-y-0">
        {items.map((item, index) => (
          <div
            key={item.id}
            draggable={editingId !== item.id}
            onDragStart={(e) => handleDragStart(e, index)}
            onDragEnd={handleDragEnd}
            onDragEnter={(e) => handleDragEnter(e, index)}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
            className={cn(
              'flex items-center gap-3 py-2.5 border-b border-border-light transition-colors duration-150',
              dragIndex === index && 'opacity-50',
              dropIndex === index && dragIndex !== index && 'border-t-2 border-t-ember',
            )}
          >
            {/* Drag handle */}
            <button
              className="shrink-0 cursor-grab active:cursor-grabbing text-ink-faint hover:text-ink-muted p-0.5 touch-none"
              aria-label="Drag to reorder"
              onMouseDown={(e) => e.stopPropagation()}
            >
              <svg width="12" height="16" viewBox="0 0 12 16" fill="currentColor">
                <circle cx="3" cy="3" r="1.5" />
                <circle cx="9" cy="3" r="1.5" />
                <circle cx="3" cy="8" r="1.5" />
                <circle cx="9" cy="8" r="1.5" />
                <circle cx="3" cy="13" r="1.5" />
                <circle cx="9" cy="13" r="1.5" />
              </svg>
            </button>

            <span className="font-mono text-[11px] text-ink-muted w-8 shrink-0">
              {item.itemNumber}
            </span>

            <div className="flex-1 min-w-0">
              {editingId === item.id ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveEdit(item.id);
                      if (e.key === 'Escape') cancelEdit();
                    }}
                    className="flex-1 text-[13px] border border-border-main rounded px-2 py-1 bg-surface text-ink focus:outline-none focus:border-ink-muted"
                    autoFocus
                  />
                  <button
                    onClick={() => saveEdit(item.id)}
                    className="text-[11px] font-medium text-ember hover:underline"
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="text-[11px] font-medium text-ink-muted hover:underline"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => startEdit(item.id, item.title)}
                  className="text-[13px] text-ink text-left hover:underline transition-colors duration-150 truncate block w-full"
                >
                  {item.title}
                </button>
              )}
            </div>

            <Badge type={item.actionType} className="shrink-0" />

            <span className="text-[12px] text-ink-muted shrink-0 w-12 text-right">
              {item.durationMinutes}m
            </span>

            <div className="shrink-0 w-20">
              <StatusLabel status={item.paperStatus} />
            </div>
          </div>
        ))}
      </div>

      {showAddForm ? (
        <div className="mt-4 p-4 border border-border-main rounded-lg bg-surface">
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Item title"
              value={newItem.title}
              onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
              className="w-full text-[13px] border border-border-main rounded px-3 py-2 bg-surface text-ink focus:outline-none focus:border-ink-muted"
              autoFocus
            />
            <div className="flex gap-3">
              <select
                value={newItem.actionType}
                onChange={(e) =>
                  setNewItem({ ...newItem, actionType: e.target.value as ActionType })
                }
                className="text-[13px] border border-border-main rounded px-3 py-1.5 bg-surface text-ink focus:outline-none focus:border-ink-muted"
              >
                <option value="decision">Decision</option>
                <option value="discussion">Discussion</option>
                <option value="approval">Approval</option>
                <option value="noting">Noting</option>
                <option value="information">Information</option>
              </select>
              <input
                type="number"
                min={5}
                max={120}
                value={newItem.durationMinutes}
                onChange={(e) =>
                  setNewItem({ ...newItem, durationMinutes: parseInt(e.target.value, 10) || 10 })
                }
                className="w-20 text-[13px] border border-border-main rounded px-3 py-1.5 bg-surface text-ink focus:outline-none focus:border-ink-muted"
              />
              <span className="text-[12px] text-ink-muted self-center">min</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleAddItem}
                className="text-[13px] font-medium bg-ember text-surface px-4 py-1.5 rounded hover:bg-ember-muted transition-colors duration-150"
              >
                Add Item
              </button>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setNewItem(emptyForm);
                }}
                className="text-[13px] font-medium text-ink-muted hover:text-ink px-4 py-1.5 transition-colors duration-150"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowAddForm(true)}
          className="mt-4 text-[13px] font-medium text-ember hover:underline transition-colors duration-150"
        >
          + Add Item
        </button>
      )}
    </div>
  );
}
