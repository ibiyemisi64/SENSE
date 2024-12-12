describe("Home Page Navigation", () => {
  beforeEach(() => {
    const serverUrl = "https://sherpa.cs.brown.edu:3336";
    const mockSignData = {
      data: [
        {
          imageurl: "https://sherpa.cs.brown.edu:3336/signimage/imageWjD99utE.png",
          signurl: "https://sherpa.cs.brown.edu:3336/signimage/imageWjD99utE.png"
        }
      ]
    };

    cy.visit("/home");

    // Intercept the network request and return the mock data
    cy.intercept("GET", `${serverUrl}/rest/signs?session=undefined`, {
      statusCode: 200,       
      body: mockSignData     
    });
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
