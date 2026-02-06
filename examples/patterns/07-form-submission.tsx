/**
 * 07 - Form Submission
 *
 * Demonstrates: Full form validation -> loading -> success/error toast workflow
 * Hooks used: useToast, useLoading
 *
 * Scenarios covered:
 *   1. Client-side validation before submission
 *   2. loading.wrap() around a simulated API call
 *   3. Success toast on completion, error toast on failure
 *   4. Form reset after successful submit
 *   5. Submit button disabled while isLoading is true
 */

import React, { useState, useCallback } from 'react';
import { useToast, useLoading } from 'omnifeedback';

// ------------------------------------------------------------------ types

interface IContactForm {
  name: string;
  email: string;
  message: string;
}

interface IValidationErrors {
  name?: string;
  email?: string;
  message?: string;
}

// ------------------------------------------------------------------ helpers

const INITIAL_FORM: IContactForm = { name: '', email: '', message: '' };

/** Simple email regex for demonstration purposes. */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Validates the form and returns an object with error messages (empty = valid). */
function validateForm(form: IContactForm): IValidationErrors {
  const errors: IValidationErrors = {};

  if (!form.name.trim()) {
    errors.name = 'Name is required.';
  } else if (form.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters.';
  }

  if (!form.email.trim()) {
    errors.email = 'Email is required.';
  } else if (!EMAIL_REGEX.test(form.email)) {
    errors.email = 'Please enter a valid email address.';
  }

  if (!form.message.trim()) {
    errors.message = 'Message is required.';
  } else if (form.message.trim().length < 10) {
    errors.message = 'Message must be at least 10 characters.';
  }

  return errors;
}

/** Simulates a form submission API call. Randomly fails ~20% of the time. */
function submitContactForm(form: IContactForm): Promise<{ ticketId: string }> {
  return new Promise((resolve, reject) =>
    setTimeout(() => {
      if (Math.random() < 0.2) {
        reject(new Error('Server returned 500 — please try again later.'));
      } else {
        resolve({ ticketId: `TKT-${Date.now().toString(36).toUpperCase()}` });
      }
    }, 2000)
  );
}

// ------------------------------------------------------------------ component

export default function FormSubmission(): React.ReactElement {
  const toast = useToast();
  const loading = useLoading();

  const [form, setForm] = useState<IContactForm>(INITIAL_FORM);
  const [errors, setErrors] = useState<IValidationErrors>({});

  /** Generic field change handler. */
  const handleChange = useCallback(
    (field: keyof IContactForm) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        setForm((prev) => ({ ...prev, [field]: e.target.value }));
        // Clear the field error on change.
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      },
    []
  );

  /** Submit handler — validate, show loading, call API, toast result. */
  const handleSubmit = useCallback(
    async (e: React.FormEvent): Promise<void> => {
      e.preventDefault();

      // Step 1: Client-side validation.
      const validationErrors = validateForm(form);
      setErrors(validationErrors);

      if (Object.keys(validationErrors).length > 0) {
        toast.warning('Please fix the highlighted fields before submitting.');
        return;
      }

      // Step 2: Wrap the API call with a loading indicator.
      try {
        const result = await loading.wrap(
          () => submitContactForm(form),
          { message: 'Submitting your message...', overlay: true }
        );

        // Step 3: Success — show toast and reset form.
        toast.success(`Message sent! Your ticket ID is ${result.ticketId}.`);
        setForm(INITIAL_FORM);
        setErrors({});
      } catch (err: unknown) {
        // Step 4: Error — show error toast.
        const message = err instanceof Error ? err.message : 'An unexpected error occurred.';
        toast.error(`Submission failed: ${message}`);
      }
    },
    [form, toast, loading]
  );

  const fieldStyle: React.CSSProperties = {
    display: 'block',
    width: '100%',
    padding: '8px 12px',
    marginTop: 4,
    border: '1px solid #ccc',
    borderRadius: 4,
    fontSize: 14,
  };

  const errorStyle: React.CSSProperties = {
    color: '#dc2626',
    fontSize: 12,
    marginTop: 2,
  };

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: 24 }}>
      <h2>Contact Form</h2>
      <p style={{ color: '#666', marginBottom: 16 }}>
        Fill out the form below. Validation runs on submit; loading overlay appears during the API call.
      </p>

      <form onSubmit={handleSubmit} noValidate>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Name */}
          <label>
            <span>Name</span>
            <input
              type="text"
              value={form.name}
              onChange={handleChange('name')}
              placeholder="John Doe"
              style={{ ...fieldStyle, borderColor: errors.name ? '#dc2626' : '#ccc' }}
            />
            {errors.name && <div style={errorStyle}>{errors.name}</div>}
          </label>

          {/* Email */}
          <label>
            <span>Email</span>
            <input
              type="email"
              value={form.email}
              onChange={handleChange('email')}
              placeholder="john@example.com"
              style={{ ...fieldStyle, borderColor: errors.email ? '#dc2626' : '#ccc' }}
            />
            {errors.email && <div style={errorStyle}>{errors.email}</div>}
          </label>

          {/* Message */}
          <label>
            <span>Message</span>
            <textarea
              value={form.message}
              onChange={handleChange('message')}
              placeholder="How can we help?"
              rows={4}
              style={{ ...fieldStyle, borderColor: errors.message ? '#dc2626' : '#ccc', resize: 'vertical' }}
            />
            {errors.message && <div style={errorStyle}>{errors.message}</div>}
          </label>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading.isLoading}
            style={{
              padding: '10px 20px',
              fontSize: 14,
              cursor: loading.isLoading ? 'not-allowed' : 'pointer',
              opacity: loading.isLoading ? 0.6 : 1,
            }}
          >
            {loading.isLoading ? 'Submitting...' : 'Send Message'}
          </button>
        </div>
      </form>
    </div>
  );
}
