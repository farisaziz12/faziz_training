describe("Homepage", () => {
  it("Main Home Content", () => {
    cy.visit("http://localhost:3000/");
    cy.contains("Train with me");
    cy.contains("Faris Aziz").scrollIntoView({ offset: { top: 100, left: 0 } });
    cy.contains("More About Me");
    cy.contains("Class Attendances");
    cy.contains("Health & Fitness Certificates");
    cy.contains("Hours of Training Experience");
    cy.contains("Powered by WOD-WITH-FARIS");
  });
  it("Navigation Bar", () => {
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
