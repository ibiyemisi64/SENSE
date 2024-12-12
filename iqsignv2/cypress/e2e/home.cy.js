describe("Home Page Navigation", () => {
  beforeEach(() => {
    cy.visit("/home");
  });

  it("navigates to Edit page when Edit button is clicked", () => {
    cy.contains("Edit").click();

    cy.url().should("include", "/edit");
  });

  it("navigates to Gallery page when Template Gallery button is clicked", () => {
    cy.contains("Template Gallery").click();

    cy.url().should("include", "/gallery");
  });
  it("navigates to profile page", () => {
    cy.contains("Profile").click();

    cy.url().should("include", "/profile");
  });
});
