import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

Given("que estoy en la página de inicio de sesión", () => {
  //  ruta principal donde se encuentra el Login
  cy.visit("/");
  
  //tiempo para inyectar los estilos (CSS)
  cy.wait(500);
});

When("ingreso el correo {string} y la contraseña {string}", (email: string, password: string) => {
  // 3.  busca el campo de correo y escribe los datos ingresados
  cy.get('input[type="email"]').type(email);
  
  // 4.  busca el campo de clave y escribe la contraseña
  cy.get('input[type="password"]').type(password);
});

When("presiono el botón {string}", (textoDelBoton: string) => {
  // 5. busca botón y le hace clic
  cy.contains("button", textoDelBoton).click();
});

Then("el sistema me redirige al Dashboard según mi rol", () => {
  // 6. Como somos usuarios multi-rol, nos aparecerá un modal intermedio.
  // Seleccionamos la opción "COORDINADOR".
  cy.contains("COORDINADOR").click();
  
  // 7. Confirmamos la selección haciendo clic en el botón del modal
  cy.contains("button", "Ingresar como COORDINADOR").click();

  // 8. Finalmente verificamos que la URL haya cambiado y ya no estemos en el Login
  cy.url().should("not.eq", Cypress.config().baseUrl + "/");
});