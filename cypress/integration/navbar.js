describe("Navigation Bar", () => {
  it("Navigation Bar Functionality", () => {
    cy.contains("FAZIZ TRAINING");
    cy.contains("Home").click();
    cy.contains("Train with me");
    cy.contains("Services").click();
    cy.contains("Loading...");
    cy.contains("Personal Training");
    cy.contains("Programming");
    cy.contains("Powered by WOD-WITH-FARIS");
    cy.contains("Home").click();
    cy.contains("Login").click();
    cy.contains("Email address");
    cy.contains("Password");
    cy.contains("Don't have an account? Create one here");
  });
});
