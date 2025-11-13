import { mount } from '@cypress/react'

// Example button component test
describe('Button Component Examples', () => {
  it('demonstrates basic button interaction', () => {
    const handleClick = cy.stub()
    mount(
      <button onClick={handleClick} data-testid="test-button">
        Click me
      </button>
    )
    cy.get('[data-testid="test-button"]').click()
    cy.get('[data-testid="test-button"]').should('be.visible')
  })

  it('demonstrates button text verification', () => {
    mount(<button>Hello Button</button>)
    cy.contains('Hello Button').should('be.visible')
  })

  it('demonstrates disabled button state', () => {
    mount(<button disabled>Disabled Button</button>)
    cy.get('button').should('be.disabled')
  })
})
