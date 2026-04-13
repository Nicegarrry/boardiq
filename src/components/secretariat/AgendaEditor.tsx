'use client';

import { useState } from 'react';
import { useAgendaItems, useDataOperations } from '@/hooks/useData';
import { StatusLabel } from '@/components/shared/StatusLabel';
import { Badge } from '@/components/shared/Badge';
import type { ActionType } from '@/lib/types';

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

  function handleMoveUp(index: number) {
    if (index <= 0) return;
    const current = items[index];
    const above = items[index - 1];
    updateAgendaItem(current.id, { sortOrder: above.sortOrder });
    updateAgendaItem(above.id, { sortOrder: current.sortOrder });
  }

  function handleMoveDown(index: number) {
    if (index >= items.length - 1) return;
    const current = items[index];
    const below = items[index + 1];
    updateAgendaItem(current.id, { sortOrder: below.sortOrder });
    updateAgendaItem(below.id, { sortOrder: current.sortOrder });
  }

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
            className="flex items-center gap-3 py-2.5 border-b border-border-light"
          >
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

            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => handleMoveUp(index)}
                disabled={index === 0}
                className="text-[11px] text-ink-muted hover:text-ink disabled:text-ink-faint disabled:cursor-not-allowed px-1"
                aria-label="Move up"
              >
                &#9650;
              </button>
              <button
                onClick={() => handleMoveDown(index)}
                disabled={index === items.length - 1}
                className="text-[11px] text-ink-muted hover:text-ink disabled:text-ink-faint disabled:cursor-not-allowed px-1"
                aria-label="Move down"
              >
                &#9660;
              </button>
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
