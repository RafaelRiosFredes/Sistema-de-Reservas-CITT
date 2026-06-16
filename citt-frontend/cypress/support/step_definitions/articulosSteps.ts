import { When, Then } from "@badeball/cypress-cucumber-preprocessor";

When("navego a la página de Artículos", () => {
  cy.visit("/articulos");
  cy.wait(1000); // Dar tiempo a que cargue la tabla
});

When("dejo el campo {string} vacío", (label: string) => {
  // Encontramos el label y limpiamos el input para asegurar que está vacío
  cy.contains("label", label).parent().find("input").clear();
});

When("presiono el botón {string} verificando no envio", (textoDelBoton: string) => {
  // Interceptamos la petición POST a /articulos
  cy.intercept("POST", "**/articulos").as("postArticulo");
  
  // Hacemos clic en el botón
  cy.contains("button", textoDelBoton).click();
});

Then("aparece un mensaje {string}", (mensaje: string) => {
  // Verificamos que el mensaje de error de validación sea visible
  cy.contains(mensaje).should("be.visible");
});

Then("no se envía ninguna solicitud de creación", () => {
  // Verificamos que no se realizó ninguna llamada a la ruta interceptada
  cy.get("@postArticulo.all").should("have.length", 0);
});
