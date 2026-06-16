Feature: Modulo de usuarios Integración

  Scenario: PRU-06 Crear cuenta de alumno
    Given que soy un administrador en la pantalla de Gestión de Usuarios
    When escribo el correo "nuevo@duocuc.cl" en el formulario de registro
    And selecciono el rol "ALUMNO" para el nuevo usuario
    And presiono el botón de registro "Crear Cuenta"
    Then el frontend envía un POST a "/api/auth/registro" y la tabla se actualiza mostrando al nuevo alumno
