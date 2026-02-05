# Security Policy

## Supported Versions

The following versions of OmniFeedback are currently supported with security updates:

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |
| < 0.1   | :x:                |

## Reporting a Vulnerability

We take the security of OmniFeedback seriously. If you discover a security vulnerability, please report it responsibly.

### How to Report

**Please do NOT report security vulnerabilities through public GitHub issues.**

Instead, use one of the following methods:

1. **GitHub Security Advisories (Preferred):**
   Report via [GitHub Security Advisories](https://github.com/muhammetalisongur/omnifeedback/security/advisories/new). This allows for private discussion and coordinated disclosure.

2. **Email:**
   Send an email to the project maintainer, Muhammet Ali Songur, with the subject line: `[SECURITY] OmniFeedback Vulnerability Report`.

### What to Include

Please include the following information in your report:

- **Description** of the vulnerability
- **Steps to reproduce** the issue
- **Impact assessment** (what an attacker could achieve)
- **Affected versions** of OmniFeedback
- **Suggested fix** (if you have one)
- Any **proof of concept** code or screenshots

### Response Timeline

| Action                      | Timeframe          |
| --------------------------- | ------------------ |
| Acknowledgment of report    | Within 48 hours    |
| Initial assessment          | Within 5 business days |
| Status update               | Within 10 business days |
| Fix release (if applicable) | Within 30 days of confirmation |

We will keep you informed of the progress toward resolving the issue and may ask for additional information or guidance.

## Scope

### In Scope

The following are considered security issues:

- **Cross-Site Scripting (XSS)** through unsanitized content rendering in feedback components (toast messages, modal content, alerts, etc.)
- **Prototype pollution** or other injection vulnerabilities in the core library
- **Denial of Service (DoS)** through resource exhaustion (e.g., unbounded queue growth, memory leaks)
- **Dependency vulnerabilities** in direct dependencies that affect OmniFeedback users
- **Unsafe defaults** that could expose users to security risks
- **Information disclosure** through error messages or logging

### Out of Scope

The following are generally NOT considered security issues:

- Vulnerabilities in user application code that uses OmniFeedback
- Issues in UI library adapters that originate from the underlying UI library (e.g., Chakra UI, MUI)
- Issues that require physical access to the user's device
- Social engineering attacks
- Issues in development dependencies that do not affect the published package
- Cosmetic or UI-only issues with no security impact

## Disclosure Policy

- We follow a **coordinated disclosure** model.
- We will work with you to understand and resolve the issue before any public disclosure.
- We will credit reporters in the release notes (unless you prefer to remain anonymous).
- We ask that you give us a reasonable amount of time to address the issue before making it public.

## Security Best Practices for Users

When using OmniFeedback in your application:

1. **Keep dependencies updated:** Regularly run `pnpm update` to get the latest patches.
2. **Sanitize user input:** Always sanitize any user-provided content before passing it to feedback components.
3. **Review adapter configurations:** Ensure your adapter setup does not expose sensitive information.
4. **Use Content Security Policy (CSP):** Configure appropriate CSP headers in your application.

## Acknowledgments

We would like to thank everyone who has responsibly disclosed vulnerabilities and helped improve the security of OmniFeedback.
