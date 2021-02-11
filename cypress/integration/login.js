const testUser = require("../fixtures/test_user.json");

describe("Login Page", () => {
  it("Login Content", () => {
    cy.visit("/login");
    cy.contains("FAZIZ TRAINING");
    cy.contains("Powered by WOD-WITH-FARIS");
    cy.contains("Login");
    cy.contains("Email address");
    cy.contains("Password");
  });

  it("Login Functionality", () => {
    const { email, password } = testUser;

    cy.get("input[id=formBasicEmail").type(email);
    cy.get("input[id=formBasicPassword").type(`${password}{enter}`);
    cy.url().should("include", "/");
    cy.visit("/");
    cy.contains("Train with me");
    cy.contains("Logout");
    cy.contains("Account").click();
    cy.contains("Active Services").click();
    cy.url().should("include", "/active-services");
  });

  it("Logout Functionality", () => {
    cy.contains("Logout").click();
    cy.contains("Login");
  });

  it("Create Account Option", () => {
    cy.visit("/login");
    cy.contains("Don't have an account? Create one here").click();
    cy.url().should("include", "/create-account");
  });
});
