describe("SignGallery Tests", () => {
  const baseUrl = "http://localhost:3333"; // Adjust if running on a different port

  beforeEach(() => {
    cy.visit("/gallery"); // Adjust the route to match your app
  });

  it("renders the gallery grid and add sign button", () => {
    cy.get("button[aria-label='add new sign']").should("be.visible");
    cy.get("img").should("have.length.at.least", 1); // Check that at least one image exists
  });

  it("opens the modal when the add sign button is clicked", () => {
    cy.get("button[aria-label='add new sign']").click();
    cy.get(".MuiModal-root").should("be.visible");
    cy.get("button").contains("Upload Image").should("be.visible");
    cy.get("button").contains("Image List").should("be.visible");
  });

  it("switches tabs inside the modal", () => {
    cy.get("button[aria-label='add new sign']").click();
    cy.get(".MuiModal-root").should("be.visible");

    // Click the "Image List" tab
    cy.get("button").contains("Image List").click();
    cy.get("img").should("be.visible");
  });

  it("navigates to the edit page when an image is clicked", () => {
    cy.get("img").eq(1).click();
    cy.url().should("include", "/edit");
  });
});
