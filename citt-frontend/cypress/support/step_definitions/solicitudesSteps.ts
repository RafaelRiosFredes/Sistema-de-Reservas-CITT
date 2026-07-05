import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

Given("que estoy en la página de creación de solicitud", () => {
  // Asumimos que para acceder debemos estar autenticados,
  // Podemos inyectar el token/rol si la aplicación lo requiere, o visitar directo
  localStorage.setItem("activeRole", "ALUMNO");
  localStorage.setItem("userEmail", "alumno@duocuc.cl");
  
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
  // Espera añadida para demostración visual
  cy.wait(3000);
});

// Nuevos tests de permisos y roles

Given("que inicio sesión en las solicitudes como {string} con el correo {string}", (rol: string, correo: string) => {
  localStorage.setItem("activeRole", rol);
  localStorage.setItem("userEmail", correo);
});

When("visualizo una solicitud con espacio de otro usuario", () => {
  cy.intercept("GET", "**/api/solicitudes/mis-solicitudes", { statusCode: 200, body: [] });
  cy.intercept("GET", "**/api/solicitudes", {
    statusCode: 200,
    body: [
      {
        idSolicitud: 1,
        emailUsuario: "otro_usuario@duocuc.cl",
        nombreEspacio: "Sala 1",
        estado: "PENDIENTE",
        proposito: "Clase",
        cantidadIntegrantes: 1,
        exclusividad: false
      }
    ]
  }).as("getSolicitudes");
  
  cy.visit("/solicitudes");
  cy.wait("@getSolicitudes");
});

Then("debe aparecer el texto {string} en lugar de los botones de acción", (texto: string) => {
  cy.get('td').last().should('contain.text', texto);
  cy.get('td').last().find('button').should('not.exist');
  // Espera añadida para demostración visual
  cy.wait(3000);
});

When("visualizo una solicitud propia", () => {
  cy.intercept("GET", "**/api/solicitudes/mis-solicitudes", { statusCode: 200, body: [] });
  cy.intercept("GET", "**/api/solicitudes", {
    statusCode: 200,
    body: [
      {
        idSolicitud: 2,
        emailUsuario: "ayudante@duocuc.cl",
        nombreEspacio: null, // Solo artículo
        estado: "PENDIENTE",
        proposito: "Prueba",
        cantidadIntegrantes: 1,
        exclusividad: false
      }
    ]
  }).as("getSolicitudesPropia");
  
  cy.visit("/solicitudes");
  cy.wait("@getSolicitudesPropia");
});

When("visualizo una solicitud propia en estado {string}", (estado: string) => {
  cy.intercept("GET", "**/api/solicitudes/mis-solicitudes", { statusCode: 200, body: [] });
  cy.intercept("GET", "**/api/solicitudes", {
    statusCode: 200,
    body: [
      {
        idSolicitud: 3,
        emailUsuario: "coordinador@duocuc.cl",
        nombreEspacio: "Laboratorio",
        estado: estado,
        proposito: "Reunión",
        cantidadIntegrantes: 2,
        exclusividad: true
      }
    ]
  }).as("getSolicitudesCoord");
  
  cy.visit("/solicitudes");
  cy.wait("@getSolicitudesCoord");
});

Then("deben ser visibles los botones para aprobar y rechazar", () => {
  cy.get('td').last().find('button').should('have.length.at.least', 2);
  cy.get('td').last().should('not.contain.text', 'Requiere gestión de terceros');
  // Espera añadida para demostración visual
  cy.wait(3000);
});

When("hago clic en el botón {string} para autogestionarla", (btnText: string) => {
  cy.intercept("PATCH", "**/api/solicitudes/3/estado", { statusCode: 200 }).as("patchEstado");

  cy.intercept("GET", "**/api/solicitudes", {
    statusCode: 200,
    body: [
      {
        idSolicitud: 3,
        emailUsuario: "coordinador@duocuc.cl",
        nombreEspacio: "Laboratorio",
        estado: "APROBADA",
        proposito: "Reunión",
        cantidadIntegrantes: 2,
        exclusividad: true,
        registroAutogestion: "Auto-aprobada por (coordinador@duocuc.cl)"
      }
    ]
  }).as("getSolicitudesAprobada");

  cy.contains("button", "Aceptar").click();
  cy.wait(500); // pequeña espera por si la UI tiene alguna animación o retraso
  cy.contains("button", "¿Confirmar?").click();
  cy.wait("@patchEstado");
  cy.wait("@getSolicitudesAprobada");
});

Then("la solicitud cambia a estado {string} y muestra el badge de autogestión", (estado: string) => {
  cy.get('td').contains(new RegExp(estado, "i")).should("be.visible");
  cy.contains("Auto-gestionado").should("be.visible");
  cy.wait(2000);
});

When("hago clic en el badge de autogestión", () => {
  cy.contains("Auto-gestionado").click();
});

Then("aparece el modal con el registro de auditoría", () => {
  cy.contains("Registro de Auditoría").should("be.visible");
  cy.contains("coordinador@duocuc.cl").should("be.visible");
  cy.wait(3000);
});
