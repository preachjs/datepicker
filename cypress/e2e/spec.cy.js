describe("basic", () => {
  it("Basic Keyboard movement", function () {
    cy.visit("localhost:8000");
    cy.get('[data-row="1"][data-col="1"] > button').click();

    // Down
    cy.get('[data-row="1"][data-col="1"] > button').type("{downArrow}");
    cy.get('[data-row="2"][data-col="1"] > button')
      .should("have.css", "background-color")
      .and("match", /(rgb\(0, 0, 0\))/);

    // Up
    cy.get('[data-row="2"][data-col="1"] > button').type("{upArrow}");
    cy.get('[data-row="1"][data-col="1"] > button')
      .should("have.css", "background-color")
      .and("match", /(rgb\(0, 0, 0\))/);

    // Right
    cy.get('[data-row="1"][data-col="1"] > button').type("{rightArrow}");
    cy.get('[data-row="1"][data-col="2"] > button')
      .should("have.css", "background-color")
      .and("match", /(rgb\(0, 0, 0\))/);

    // Left
    cy.get('[data-row="1"][data-col="2"] > button').type("{leftArrow}");
    cy.get('[data-row="1"][data-col="1"] > button')
      .should("have.css", "background-color")
      .and("match", /(rgb\(0, 0, 0\))/);
  });
});
