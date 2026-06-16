import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

Given("que estoy en la página de creación de solicitud", () => {
  // Asumimos que para acceder debemos estar autenticados,
  // Podemos inyectar el token/rol si la aplicación lo requiere, o visitar directo
  localStorage.setItem("activeRole", "ALUMNO");
  
  // Interceptamos la llamada al backend para evitar el error 403 y la redirección al login
  cy.intercept("GET", "**/api/espacios", { statusCode: 200, body: [] }).as("getEspacios");
  
  cy.visit("/crear-solicitud");

  // Tiempo para inyectar los estilos o esperar carga de la api
  cy.wait("@getEspacios");
  cy.wait(500);
});

When("hago clic en el botón {string} sin rellenar ningún campo", (textoDelBoton: string) => {
  cy.contains("button", textoDelBoton).click();
});

Then("aparecen textos en rojo debajo de cada campo obligatorio indicando {string}", (mensajeError: string) => {
  // Validamos que aparezcan los mensajes en rojo de la validación custom
  cy.get('.text-red-500')
    .should('exist')
    .and('have.length.at.least', 4)
    .each(($el) => {
      cy.wrap($el).should('contain.text', mensajeError);
    });
});
