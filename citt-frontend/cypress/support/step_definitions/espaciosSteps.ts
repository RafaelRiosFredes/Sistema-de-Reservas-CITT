import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

Given("que soy un administrador en la pantalla de Gestión de Espacios", () => {
  // ruta principal donde se encuentra el Login
  cy.visit("/");
  
  // Ingresamos credenciales
  cy.get('input[type="email"]').type("admin@duoc.cl");
  cy.get('input[type="password"]').type("admin123");
  cy.contains("button", "Iniciar Sesión").click();

  cy.contains("COORDINADOR").click();
  cy.contains("button", "Ingresar como COORDINADOR").click();

  //  Ir a la ruta de espacios
  cy.visit("/espacios"); // Esta es la ruta
  
  //  Esperamos que cargue la tabla inicial
  cy.wait(1000);
});

When("abro el modal de {string}", (modalName: string) => {
  cy.contains("button", "Agregar Espacio").click();
});

When("lleno el formulario con el nombre {string} y capacidad {string}", (nombre: string, capacidad: string) => {
  // Generaremos un número random para el nombre para evitar duplicidad de base de datos real
  const nombreAleatorio = `${nombre}-${Math.floor(Math.random() * 10000)}`;
  cy.wrap(nombreAleatorio).as('nombreGenerado');

  // Input del nombre
  cy.get('input[placeholder="Ej: Laboratorio Mac"]').type(nombreAleatorio);
  

  // Usamos {selectAll} para sobreescribir el valor de forma segura.
  cy.get('input[type="number"]').type('{selectall}' + capacidad);
});

When("presiono el botón de guardar {string}", (textoDelBoton: string) => {
  // Interceptamos el POST antes de hacer clic
  cy.intercept("POST", "**/api/espacios").as("postEspacio");
  // Interceptamos el GET para cuando se actualiza la tabla
  cy.intercept("GET", "**/api/espacios").as("getEspacios");

  cy.contains("button", textoDelBoton).click();
});

Then("el frontend hace la petición POST a {string}, se cierra el modal, y el nuevo espacio aparece en la tabla", (urlPost: string) => {
  // 1. Verificamos que el POST dio 200 OK
  cy.wait("@postEspacio").its("response.statusCode").should("be.oneOf", [200, 201]);

  // 2. Verificamos que el GET de actualización funcionó
  cy.wait("@getEspacios").its("response.statusCode").should("eq", 200);

  // 3. Verificamos que el modal ya no esté
  cy.contains("Registrar Nuevo Espacio").should("not.exist");

  // 4. Verificamos que el nuevo espacio esté en la tabla
  cy.get('@nombreGenerado').then((nombreGenerado) => {
    cy.get("table").contains("td", String(nombreGenerado)).should("be.visible");
  });
});
