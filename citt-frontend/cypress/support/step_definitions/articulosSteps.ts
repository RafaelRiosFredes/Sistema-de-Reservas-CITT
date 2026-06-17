import { When, Then } from "@badeball/cypress-cucumber-preprocessor";

When("navego a la página de Artículos", () => {
  
  cy.intercept("GET", "**/api/categorias/todas", {
    statusCode: 200,
    body: [{ idCategoria: 1, nombreCategoria: "Electrónica Mock" }]
  }).as("getCategorias");

  cy.intercept("GET", "**/api/estados*", {
    statusCode: 200,
    body: [{ idEstadoArticulo: 1, nombreEstado: "DISPONIBLE" }]
  }).as("getEstados");

  cy.visit("/articulos");
  cy.wait(1000); 
});


When("dejo el campo {string} vacío", (label: string) => {
  // 2. Antes de buscar el input, esperamos pacientemente a que tu modal cargue y sea visible
  cy.contains("Añadir Nuevo Artículo", { timeout: 10000 }).should("be.visible");

  // 3. Limpiamos el input
  if (label.includes("Nombre del Artículo")) {
    cy.get('input[name="nombreArticulo"]')
      .should("be.visible")
      .clear();
  } else {
    throw new Error(`El campo "${label}" no está configurado en las pruebas.`);
  }
});

When("presiono el botón {string} verificando no envio", (textoDelBoton: string) => {
  cy.intercept("POST", "**/articulos").as("postArticulo");
  cy.contains("button", textoDelBoton).click();
});

Then("aparece un mensaje {string}", (mensaje: string) => {
  cy.contains(mensaje).should("be.visible");
});

Then("no se envía ninguna solicitud de creación", () => {
  cy.get("@postArticulo.all").should("have.length", 0);
});