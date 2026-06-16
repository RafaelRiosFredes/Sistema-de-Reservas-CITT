Feature: Módulo de artículos Unitaria (Front)

  Scenario: PRU-10 Validación de nombre obligatorio al crear un artículo
    Given que estoy en la página de inicio de sesión
    When ingreso el correo "admin@duoc.cl" y la contraseña "admin123"
    And presiono el botón "Iniciar Sesión"
    Then el sistema me redirige al Dashboard según mi rol
    When navego a la página de Artículos
    And presiono el botón "Agregar Artículo"
    And dejo el campo "Nombre del Artículo *" vacío
    And presiono el botón "Registrar Artículo" verificando no envio
    Then aparece un mensaje "El nombre es obligatorio"
    And no se envía ninguna solicitud de creación
