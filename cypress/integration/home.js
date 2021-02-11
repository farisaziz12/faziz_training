describe("Homepage", () => {
  it("Main Home Content", () => {
    cy.visit("/");
    cy.contains("Train with me");
    cy.contains("Faris Aziz").scrollIntoView({ offset: { top: 100, left: 0 } });
    cy.contains("More About Me");
    cy.contains("Class Attendances");
    cy.contains("Health & Fitness Certificates");
    cy.contains("Hours of Training Experience");
    cy.contains("Powered by WOD-WITH-FARIS");
  });
});
