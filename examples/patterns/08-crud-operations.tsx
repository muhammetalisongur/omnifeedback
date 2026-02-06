/**
 * 08 - CRUD Operations
 *
 * Demonstrates: Full Create / Read / Update / Delete pattern with multiple feedback types
 * Hooks used: useToast, useModal, useDrawer, useConfirm, useLoading
 *
 * Scenarios covered:
 *   1. Display a list of items (Read)
 *   2. Modal for creating a new item (Create)
 *   3. Drawer for editing an existing item (Update)
 *   4. Confirm dialog for deleting an item (Delete)
 *   5. Toast feedback after every operation
 *   6. Loading indicator during simulated API calls
 */

import React, { useState, useCallback, createElement } from 'react';
import { useToast, useModal, useDrawer, useConfirm, useLoading } from 'omnifeedback';

// ------------------------------------------------------------------ types

interface ITask {
  id: number;
  title: string;
  description: string;
}

// ------------------------------------------------------------------ helpers

let nextId = 4;

const SEED_TASKS: ITask[] = [
  { id: 1, title: 'Set up CI/CD pipeline', description: 'Configure GitHub Actions for build and deploy.' },
  { id: 2, title: 'Write unit tests', description: 'Cover the FeedbackManager with at least 80% coverage.' },
  { id: 3, title: 'Design landing page', description: 'Create mockups in Figma for the marketing site.' },
];

/** Simulates a short API delay. */
function apiDelay(ms = 1200): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ------------------------------------------------------------------ sub-components

/** Inline form rendered inside a Modal (Create) or Drawer (Edit). */
function TaskForm({
  initial,
  onSubmit,
  submitLabel,
}: {
  initial: { title: string; description: string };
  onSubmit: (data: { title: string; description: string }) => void;
  submitLabel: string;
}): React.ReactElement {
  const [title, setTitle] = useState(initial.title);
  const [description, setDescription] = useState(initial.description);

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({ title: title.trim(), description: description.trim() });
  };

  const inputStyle: React.CSSProperties = {
    display: 'block',
    width: '100%',
    padding: '8px 10px',
    marginTop: 4,
    border: '1px solid #ccc',
    borderRadius: 4,
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <label>
        Title
        <input value={title} onChange={(e) => setTitle(e.target.value)} style={inputStyle} />
      </label>
      <label>
        Description
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} style={inputStyle} />
      </label>
      <button type="submit" style={{ alignSelf: 'flex-end', padding: '8px 20px' }}>
        {submitLabel}
      </button>
    </form>
  );
}

// ------------------------------------------------------------------ main component

export default function CrudOperations(): React.ReactElement {
  const toast = useToast();
  const modal = useModal();
  const drawer = useDrawer();
  const confirm = useConfirm();
  const loading = useLoading();

  const [tasks, setTasks] = useState<ITask[]>(SEED_TASKS);

  // -------- Create --------

  const handleCreate = useCallback((): void => {
    const modalId = modal.open({
      title: 'Create New Task',
      size: 'md',
      content: createElement(TaskForm, {
        initial: { title: '', description: '' },
        submitLabel: 'Create',
        onSubmit: async (data) => {
          modal.close(modalId);

          await loading.wrap(() => apiDelay(1000), {
            message: 'Creating task...',
          });

          const newTask: ITask = { id: nextId++, title: data.title, description: data.description };
          setTasks((prev) => [...prev, newTask]);
          toast.success(`Task "${newTask.title}" created.`);
        },
      }),
    });
  }, [modal, loading, toast]);

  // -------- Update (Edit) --------

  const handleEdit = useCallback(
    (task: ITask): void => {
      const drawerId = drawer.open({
        title: `Edit: ${task.title}`,
        position: 'right',
        size: 'md',
        content: createElement(TaskForm, {
          initial: { title: task.title, description: task.description },
          submitLabel: 'Save Changes',
          onSubmit: async (data) => {
            drawer.close(drawerId);

            await loading.wrap(() => apiDelay(800), {
              message: 'Saving changes...',
            });

            setTasks((prev) =>
              prev.map((t) => (t.id === task.id ? { ...t, ...data } : t))
            );
            toast.success(`Task "${data.title}" updated.`);
          },
        }),
      });
    },
    [drawer, loading, toast]
  );

  // -------- Delete --------

  const handleDelete = useCallback(
    async (task: ITask): Promise<void> => {
      const confirmed = await confirm.danger(
        `This will permanently delete "${task.title}". This action cannot be undone.`,
        { title: 'Delete Task', confirmText: 'Delete', cancelText: 'Keep' }
      );

      if (!confirmed) {
        toast.info('Deletion cancelled.');
        return;
      }

      await loading.wrap(() => apiDelay(600), {
        message: 'Deleting task...',
      });

      setTasks((prev) => prev.filter((t) => t.id !== task.id));
      toast.success(`Task "${task.title}" deleted.`);
    },
    [confirm, loading, toast]
  );

  // -------- Render --------

  const rowStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 0',
    borderBottom: '1px solid #eee',
  };

  return (
    <div style={{ maxWidth: 560, margin: '0 auto', padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>Task Board</h2>
        <button onClick={handleCreate} style={{ padding: '8px 16px' }}>
          + Add Task
        </button>
      </div>

      {tasks.length === 0 && (
        <p style={{ textAlign: 'center', color: '#999', padding: 32 }}>
          No tasks yet. Click &quot;Add Task&quot; to create one.
        </p>
      )}

      {tasks.map((task) => (
        <div key={task.id} style={rowStyle}>
          <div>
            <strong>{task.title}</strong>
            <div style={{ fontSize: 13, color: '#666' }}>{task.description}</div>
          </div>
          <div style={{ display: 'flex', gap: 6, flexShrink: 0, marginLeft: 12 }}>
            <button onClick={() => handleEdit(task)} style={{ padding: '4px 12px' }}>
              Edit
            </button>
            <button
              onClick={() => void handleDelete(task)}
              style={{ padding: '4px 12px', color: '#dc2626' }}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
