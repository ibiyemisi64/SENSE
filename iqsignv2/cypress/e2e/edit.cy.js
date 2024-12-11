describe("Sign Editor Component", () => {
  beforeEach(() => {
    // Visit the sign editor page before each test
    cy.visit("/edit");
  });

  // Component Rendering Tests
  describe("Component Rendering", () => {
    it("renders the TopBar", () => {
      cy.get('[data-testid="topbar"]').should("be.visible");
    });

    it("renders the Sign image", () => {
      cy.get('img[alt="User\'s current sign."]').should("be.visible");
    });

    it("renders the Sign Text Formatter", () => {
      cy.get("#outlined-multiline").should("be.visible");
    });

    it("renders all text formatting options", () => {
      // Font Dropdown
      cy.get("#demo-select-small").should("be.visible");

      // Size Input
      cy.get("#outlined-uncontrolled").should("be.visible");

      // Formatting Icons
      cy.get('[aria-label="Bold"]').should("be.visible");
      cy.get('[aria-label="Italic"]').should("be.visible");
      cy.get('[aria-label="Underlined"]').should("be.visible");
      cy.get('[aria-label="Text Color"]').should("be.visible");
    });
  });

  // Interaction Tests
  describe("Component Interactions", () => {
    it("allows changing font selection", () => {
      // Open font dropdown
      cy.get("#demo-select-small").click();

      // Select Times New Roman
      cy.contains("Times New Roman").click();

      // Verify selection
      cy.get("#demo-select-small").should("contain", "Times New Roman");
    });

    it("allows modifying text in multiline input", () => {
      const testText = "This is a test sign text";

      cy.get("#outlined-multiline")
        .clear()
        .type(testText)
        .should("have.value", testText);
    });

    it("allows changing text size", () => {
      cy.get("#outlined-uncontrolled")
        .clear()
        .type("18")
        .should("have.value", "18");
    });

    it("can click formatting buttons", () => {
      // Bold
      cy.get('[aria-label="Bold"]').click();

      // Italic
      cy.get('[aria-label="Italic"]').click();

      // Underline
      cy.get('[aria-label="Underlined"]').click();

      // Text Color
      cy.get('[aria-label="Text Color"]').click();
    });
  });

  // Button Functionality Tests
  describe("Button Functionality", () => {
    it("has a Save button that can be clicked", () => {
      cy.contains("SAVE")
        .should("be.visible")
        .and("have.css", "background-color", "rgb(0, 0, 0)") // Black background
        .and("have.css", "color", "rgb(255, 255, 255)") // White text
        .click();

      // Add any post-save assertions or mock expectations here
    });
  });

  // Responsiveness and Layout Tests
  describe("Responsive Layout", () => {
    it("displays components in a grid layout", () => {
      cy.get(".MuiGrid2-container")
        .should("be.visible")
        .and("have.css", "display", "flex")
        .and("have.css", "flex-direction", "row");
    });
  });
});
