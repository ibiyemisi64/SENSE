describe("LoginPage Tests", () => {
  const serverUrl = "https://sherpa.cs.brown.edu:3336";

  beforeEach(() => {
    cy.visit("/login");
  });

  it("renders the login form", () => {
    cy.contains("IQSign").should("be.visible");
    cy.get('[data-testid="username-input"]').should("be.visible");
    cy.get('[data-testid="access-token"]').should("be.visible");
    cy.get("button").contains("Log in").should("be.visible");
  });

  it("allows the user to input username and access token", () => {
    cy.get('[data-testid="username-input"]')
      .type("testuser")
      .should("have.value", "testuser");

    cy.get('[data-testid="access-token"]')
      .type("testtoken123")
      .should("have.value", "testtoken123");
  });

  it("displays an error when login fails", () => {
    cy.intercept("POST", `${serverUrl}/login`, {
      statusCode: 401,
      body: { error: "Invalid login credentials." },
    });

    cy.get('[data-testid="username-input"]').type("wronguser");
    cy.get('[data-testid="access-token"]').type("wrongtoken");
    cy.get("button").contains("Log in").click();

    cy.contains("Invalid login credentials.").should("be.visible");
  });

  it("logs in successfully and redirects to /home", () => {
    cy.intercept("POST", `${serverUrl}/rest/login`, {
      statusCode: 200,
      body: { status: "OK", session: "testsession123" },
    });

    cy.get('[data-testid="username-input"]').type("correctuser");
    cy.get('[data-testid="access-token"]').type("correcttoken");
    cy.get("button").contains("Log in").click();
    cy.getCookie("session").should("have.property", "value", "testsession123");
    cy.url().should("include", "/home");
  });

  it("redirects to /home if session cookie exists", () => {
    cy.setCookie("session", "existing-session-id");

    cy.visit("/login");
    cy.url().should("include", "/home");
  });

  it("shows a link for forgot password", () => {
    cy.get("div")
      .find('a[href="/forgotpw"]')
      .contains("Forgot password?")
      .should("be.visible");
  });
});
