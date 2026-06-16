import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

Given("que soy un administrador en la pantalla de Gestión de Usuarios", () => {
  // Primero  iniciar sesión como administrador
  cy.visit("/");
  
  // Ingresamos credenciales
  cy.get('input[type="email"]').type("admin@duoc.cl");
  cy.get('input[type="password"]').type("admin123");
  cy.contains("button", "Iniciar Sesión").click();
  
  // Seleccionamos el rol de COORDINADOR (Administrador)
  cy.contains("COORDINADOR").click();
  cy.contains("button", "Ingresar como COORDINADOR").click();

  // Vamos a la ruta de usuarios
  cy.visit("/usuarios");
  // pequeño tiempo para que cargue la tabla inicial
  cy.wait(1000);
});

// Variable global para guardar el correo generado en este test
let correoGenerado = "";

When("escribo el correo {string} en el formulario de registro", (email: string) => {
  //  Generamos un correo con un número al azar
  // para burlar al backend y que nunca nos tire Error 400 de "ya existe".
  if (email === "nuevo@duocuc.cl") {
    correoGenerado = `nuevo${Math.floor(Math.random() * 10000)}@duocuc.cl`;
  } else {
    correoGenerado = email;
  }
  
  cy.get('input[type="email"]').type(correoGenerado);
});

When("selecciono el rol {string} para el nuevo usuario", (rol: string) => {
  cy.contains("span", rol).click();
});

When("presiono el botón de registro {string}", (textoDelBoton: string) => {
  cy.intercept("POST", "/api/auth/registro").as("postRegistro");
  cy.intercept("GET", "**/usuarios**").as("getUsuarios");

  cy.contains("button", textoDelBoton).click();
});

Then("el frontend envía un POST a {string} y la tabla se actualiza mostrando al nuevo alumno", (urlPost: string) => {
  // 1. Esperamos el 200 OK del POST
  cy.wait("@postRegistro").its("response.statusCode").should("eq", 200);

  // 2. Esperamos el 200 OK del GET automático
  cy.wait("@getUsuarios").its("response.statusCode").should("eq", 200);

  // 3. Le diremos a Cypress que escriba el correo en el "Buscador" para filtrarlo.
  cy.get('input[placeholder="Buscar por correo..."]').type(correoGenerado);

  // 4. verificamos que la tabla muestre nuestro correo dinámico filtrado
  cy.get("table").contains("td", correoGenerado).should("be.visible");
});
