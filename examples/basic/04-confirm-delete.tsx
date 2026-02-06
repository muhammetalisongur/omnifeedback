/**
 * 04 - Confirm Delete
 *
 * Demonstrates confirmation dialog capabilities provided by the useConfirm hook:
 *   - Basic confirm.show() usage with a simple message
 *   - confirm.danger() shortcut for destructive / irreversible actions
 *   - Custom confirmText and cancelText labels
 *   - Conditional logic that branches on the user's response
 *   - Supplying a custom icon to the confirmation dialog
 */

import React, { useState } from 'react';
import { useConfirm, useToast } from 'omnifeedback';

/** Represents a project entity that the user can manage. */
interface Project {
  id: number;
  name: string;
}

/** Simulates a server-side delete operation. */
async function deleteProjectById(projectId: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 600));
}

export default function ConfirmDelete(): React.ReactElement {
  const confirm = useConfirm();
  const toast = useToast();

  const [projects, setProjects] = useState<Project[]>([
    { id: 1, name: 'Marketing Website' },
    { id: 2, name: 'Mobile App Redesign' },
    { id: 3, name: 'API Gateway v2' },
  ]);

  /** Basic confirm: ask the user before archiving a project. */
  const handleArchive = async (project: Project): Promise<void> => {
    const confirmed = await confirm.show({
      title: 'Archive Project',
      message: `Are you sure you want to archive "${project.name}"? You can restore it later from the archive.`,
      confirmText: 'Archive',
      cancelText: 'Keep Active',
    });

    if (confirmed) {
      toast.info(`"${project.name}" has been archived.`);
    }
  };

  /** Danger confirm: use the pre-styled danger variant for permanent deletion. */
  const handleDelete = async (project: Project): Promise<void> => {
    const confirmed = await confirm.danger(
      `This will permanently delete "${project.name}" and all associated data. This action cannot be undone.`,
      {
        title: 'Delete Project',
        confirmText: 'Delete Permanently',
        cancelText: 'Cancel',
      }
    );

    if (confirmed) {
      await deleteProjectById(project.id);
      setProjects((prev) => prev.filter((p) => p.id !== project.id));
      toast.success(`"${project.name}" has been deleted.`);
    }
  };

  /** Confirm with a custom icon element. */
  const handleResetData = async (): Promise<void> => {
    const confirmed = await confirm.show({
      title: 'Reset All Data',
      message: 'This will clear every project and restore defaults. Continue?',
      confirmText: 'Reset Everything',
      cancelText: 'Nevermind',
      confirmVariant: 'danger',
      icon: <span style={{ fontSize: 28 }}>&#9888;</span>, // Warning sign
    });

    if (confirmed) {
      setProjects([]);
      toast.success('All data has been reset to defaults.');
    } else {
      toast.info('Reset cancelled. Your data is safe.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 24 }}>
      <h2>Confirm Delete</h2>

      {projects.length === 0 && (
        <p style={{ color: '#888' }}>No projects remaining.</p>
      )}

      {projects.map((project) => (
        <div
          key={project.id}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 12,
            border: '1px solid #ddd',
            borderRadius: 6,
          }}
        >
          <span>{project.name}</span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => handleArchive(project)}>Archive</button>
            <button onClick={() => handleDelete(project)} style={{ color: 'red' }}>
              Delete
            </button>
          </div>
        </div>
      ))}

      <hr />
      <button onClick={handleResetData} style={{ color: 'red' }}>
        Reset All Data
      </button>
    </div>
  );
}
