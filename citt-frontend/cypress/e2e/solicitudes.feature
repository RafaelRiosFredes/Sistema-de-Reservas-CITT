Feature: Módulo de solicitudes Unitaria (Frontend)

  Scenario: PRU-07 Validación de campos vacíos en reserva de espacios
    Given que estoy en la página de creación de solicitud
    When hago clic en el botón "Confirmar Solicitud" sin rellenar ningún campo
    Then aparecen textos en rojo debajo de cada campo obligatorio indicando "Este campo es requerido"
