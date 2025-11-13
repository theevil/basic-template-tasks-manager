# Cypress Testing Guide

This project uses Cypress for both **component testing** and **end-to-end (E2E) testing**.

## Installation

Cypress has already been installed as a dev dependency. All required packages include:
- `cypress` - The testing framework
- `@cypress/react` - React component testing support
- `@testing-library/react` - React testing utilities
- `@testing-library/jest-dom` - DOM matchers
- `cypress-vite` - Vite preprocessor for Cypress

## Running Tests

### Component Tests (Unit Testing)

Component tests are used to test individual React components in isolation.

**Interactive Mode:**
```bash
pnpm test:component
```

**Headless Mode (CI/CD):**
```bash
pnpm test:component:run
```

### E2E Tests

E2E tests verify the entire application workflow.

**Interactive Mode:**
```bash
pnpm test:e2e
```

**Headless Mode (CI/CD):**
```bash
pnpm test:e2e:run
```

### All Tests

Run all tests (component + E2E):
```bash
pnpm test
```

## Test Structure

- **Component Tests**: `cypress/component/**/*.cy.{ts,tsx}`
  - Located in: `cypress/component/`
  - Example files: `Button.cy.tsx`, `TaskList.cy.tsx`

- **E2E Tests**: `cypress/e2e/**/*.cy.{ts,tsx}`
  - Located in: `cypress/e2e/`
  - Example files: `app.cy.ts`

## Writing Component Tests

Component tests use the `@cypress/react` mount API to test components in isolation.

### Basic Example:

```typescript
import { mount } from '@cypress/react'

describe('MyComponent', () => {
  it('renders correctly', () => {
    mount(<MyComponent prop="value" />)
    cy.contains('Expected Text').should('be.visible')
  })

  it('handles clicks', () => {
    const handleClick = cy.stub()
    mount(<MyComponent onClick={handleClick} />)
    cy.get('button').click()
    cy.wrap(handleClick).should('have.been.called')
  })
})
```

## Writing E2E Tests

E2E tests test the full application flow in a real browser.

### Basic Example:

```typescript
describe('App Navigation', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('navigates to dashboard', () => {
    cy.get('a[href="/dashboard"]').click()
    cy.url().should('include', '/dashboard')
  })
})
```

## Best Practices

1. **Use Data Test IDs**: Add `data-testid` attributes to elements for reliable selectors
   ```jsx
   <button data-testid="submit-button">Submit</button>
   ```

2. **Test User Behavior**: Write tests that simulate real user interactions
   ```typescript
   cy.get('input').type('user input')
   cy.get('button').click()
   ```

3. **Keep Tests Independent**: Each test should be able to run independently
   ```typescript
   beforeEach(() => {
     cy.visit('/') // Reset state before each test
   })
   ```

4. **Use Descriptive Names**: Write clear test descriptions
   ```typescript
   it('should display error message when form is submitted without required fields', () => {
     // test code
   })
   ```

5. **Avoid Hard Waits**: Use Cypress's built-in waits
   ```typescript
   cy.get('button').should('be.visible') // waits automatically
   // Instead of:
   cy.wait(1000)
   ```

## Configuration Files

- **cypress.config.ts** - Main Cypress configuration
- **cypress.env.json** - Environment variables for tests
- **cypress/support/component.ts** - Component test setup
- **cypress/support/e2e.ts** - E2E test setup

## Troubleshooting

### Tests Won't Run
- Make sure the dev server is running: `pnpm dev`
- Check that baseUrl is correct in `cypress.env.json`

### Component Tests Failing
- Ensure components have `data-testid` attributes where needed
- Check that all component dependencies are properly imported

### Port Already in Use
- Kill any existing processes on port 5173
- Or change the baseUrl in `cypress.env.json`

## Additional Resources

- [Cypress Documentation](https://docs.cypress.io)
- [Testing Library Documentation](https://testing-library.com)
- [Cypress React Documentation](https://github.com/cypress-io/cypress-react)
