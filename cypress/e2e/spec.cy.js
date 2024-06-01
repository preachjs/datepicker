describe('basic', () => {
  it('Switch between modes', function () {
    cy.visit('localhost:8000')

    let content = cy.get('.selected-text')
    content.should('have.text', 'Selected: None')

    // Switch to range
    cy.get('[name=mode][value=range]').click()
    content = cy.get('.selected-text')
    content.should('have.text', 'Selected Range: None - None')

    // Switch to single
    cy.get('[name=mode][value=single]').click()
    content = cy.get('.selected-text')
    content.should('not.have.text', 'Selected Range: None - None')
    content.should('have.text', 'Selected: None')
  })

  it('Basic Keyboard movement', function () {
    cy.visit('localhost:8000')
    cy.get('[data-row="1"][data-col="1"] > button').click()

    // Down
    cy.get('[data-row="1"][data-col="1"] > button').type('{downArrow}')
    cy.get('[data-row="2"][data-col="1"] > button')
      .should('have.css', 'background-color')
      .and('match', /(rgb\(0, 0, 0\))/)

    // Up
    cy.get('[data-row="2"][data-col="1"] > button').type('{upArrow}')
    cy.get('[data-row="1"][data-col="1"] > button')
      .should('have.css', 'background-color')
      .and('match', /(rgb\(0, 0, 0\))/)

    // Right
    cy.get('[data-row="1"][data-col="1"] > button').type('{rightArrow}')
    cy.get('[data-row="1"][data-col="2"] > button')
      .should('have.css', 'background-color')
      .and('match', /(rgb\(0, 0, 0\))/)

    // Left
    cy.get('[data-row="1"][data-col="2"] > button').type('{leftArrow}')
    cy.get('[data-row="1"][data-col="1"] > button')
      .should('have.css', 'background-color')
      .and('match', /(rgb\(0, 0, 0\))/)
  })
})
