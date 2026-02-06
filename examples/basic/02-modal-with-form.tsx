/**
 * 02 - Modal with Form
 *
 * Demonstrates modal dialog capabilities provided by the useModal hook:
 *   - Opening a modal that contains a controlled form
 *   - Managing form state inside the modal
 *   - Closing the modal programmatically on successful submit
 *   - Supplying custom footer buttons
 *   - Switching between modal size variants (sm, md, lg, xl, full)
 */

import React, { useState } from 'react';
import { useModal, useToast } from 'omnifeedback';
import type { ModalSize } from 'omnifeedback';

/** Simulates a network call that persists the contact. */
async function saveContact(name: string, email: string): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 800));
}

/** Inner form rendered as the modal body. */
function ContactForm(props: {
  onSubmit: (name: string, email: string) => void;
  onCancel: () => void;
}): React.ReactElement {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (event: React.FormEvent): void => {
    event.preventDefault();
    props.onSubmit(name, email);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <label>
        Name
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Jane Doe"
          required
          style={{ display: 'block', width: '100%', marginTop: 4 }}
        />
      </label>
      <label>
        Email
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="jane@example.com"
          required
          style={{ display: 'block', width: '100%', marginTop: 4 }}
        />
      </label>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <button type="button" onClick={props.onCancel}>Cancel</button>
        <button type="submit">Save Contact</button>
      </div>
    </form>
  );
}

export default function ModalWithForm(): React.ReactElement {
  const modal = useModal();
  const toast = useToast();
  const [selectedSize, setSelectedSize] = useState<ModalSize>('md');

  /** Opens a modal whose body is a contact form. */
  const handleOpenForm = (): void => {
    const modalId = modal.open({
      title: 'New Contact',
      size: selectedSize,
      content: (
        <ContactForm
          onCancel={() => modal.close(modalId)}
          onSubmit={async (name, email) => {
            await saveContact(name, email);
            modal.close(modalId);
            toast.success(`Contact "${name}" created.`);
          }}
        />
      ),
    });
  };

  /** Opens a modal with explicit custom footer buttons. */
  const handleCustomFooter = (): void => {
    const modalId = modal.open({
      title: 'Terms of Service',
      size: 'lg',
      content: (
        <p>
          Please review our terms of service. By clicking &quot;Accept&quot; you agree to
          the terms described in this document.
        </p>
      ),
      footer: (
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button onClick={() => modal.close(modalId)}>Decline</button>
          <button onClick={() => { modal.close(modalId); toast.success('Terms accepted.'); }}>
            Accept
          </button>
        </div>
      ),
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 24 }}>
      <h2>Modal with Form</h2>

      <label>
        Modal Size:&nbsp;
        <select
          value={selectedSize}
          onChange={(e) => setSelectedSize(e.target.value as ModalSize)}
        >
          <option value="sm">Small</option>
          <option value="md">Medium</option>
          <option value="lg">Large</option>
          <option value="xl">Extra Large</option>
          <option value="full">Full Screen</option>
        </select>
      </label>

      <button onClick={handleOpenForm}>Open Contact Form Modal</button>
      <button onClick={handleCustomFooter}>Open Modal with Custom Footer</button>
    </div>
  );
}
