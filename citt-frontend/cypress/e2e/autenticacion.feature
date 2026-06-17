Feature: Módulo de Autenticación Integración

  Scenario: PRU-03 Ingreso de credenciales correctas
    Given que estoy en la página de inicio de sesión
    When ingreso el correo "admin@duoc.cl" y la contraseña "admin123"
    And presiono el botón "Iniciar Sesión"
    Then el sistema me redirige al Dashboard según mi rol
