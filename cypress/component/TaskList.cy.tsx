import { mount } from '@cypress/react'

// Example component test with state management
describe('Component with State Examples', () => {
  it('demonstrates mounting a component', () => {
    const TestComponent = () => (
      <div data-testid="test-component">
        <h1>Task List</h1>
        <ul>
          <li>Task 1</li>
          <li>Task 2</li>
        </ul>
      </div>
    )

    mount(<TestComponent />)
    cy.get('[data-testid="test-component"]').should('be.visible')
    cy.contains('Task 1').should('be.visible')
    cy.contains('Task 2').should('be.visible')
  })

  it('demonstrates conditional rendering', () => {
    const TestComponent = ({ showTasks }: { showTasks: boolean }) => (
      <div>
        {showTasks && (
          <ul>
            <li>Task 1</li>
            <li>Task 2</li>
          </ul>
        )}
      </div>
    )

    mount(<TestComponent showTasks={true} />)
    cy.contains('Task 1').should('be.visible')
  })

  it('demonstrates user interactions', () => {
    const TestComponent = () => {
      const [tasks, setTasks] = React.useState(['Task 1'])

      return (
        <div>
          <button
            onClick={() => setTasks([...tasks, `Task ${tasks.length + 1}`])}
            data-testid="add-button"
          >
            Add Task
          </button>
          <ul>
            {tasks.map((task, idx) => (
              <li key={idx}>{task}</li>
            ))}
          </ul>
        </div>
      )
    }

    mount(<TestComponent />)
    cy.get('li').should('have.length', 1)
    cy.get('[data-testid="add-button"]').click()
    cy.get('li').should('have.length', 2)
  })
})

import React from 'react'
