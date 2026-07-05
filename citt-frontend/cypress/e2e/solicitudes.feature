Feature: Módulo de solicitudes Unitaria (Frontend)

  Scenario: PRU-07 Validación de campos vacíos en reserva de espacios
    Given que estoy en la página de creación de solicitud
    When hago clic en el botón "Confirmar Solicitud" sin rellenar ningún campo
    Then aparecen textos en rojo debajo de cada campo obligatorio indicando "Este campo es requerido"

  Scenario: PRU-08 Ayudante y Docente no pueden gestionar solicitudes con espacio
    Given que inicio sesión en las solicitudes como "DOCENTE" con el correo "profesor@duocuc.cl"
    When visualizo una solicitud con espacio de otro usuario
    Then debe aparecer el texto "Solo gestión de artículos" en lugar de los botones de acción

  Scenario: PRU-09 Ayudante y Docente no pueden gestionar sus propias solicitudes
    Given que inicio sesión en las solicitudes como "AYUDANTE" con el correo "ayudante@duocuc.cl"
    When visualizo una solicitud propia
    Then debe aparecer el texto "Requiere gestión de terceros" en lugar de los botones de acción

  Scenario: PRU-10 Alta Dirección puede autogestionar sus propias solicitudes
    Given que inicio sesión en las solicitudes como "COORDINADOR" con el correo "coordinador@duocuc.cl"
    When visualizo una solicitud propia en estado "PENDIENTE"
    Then deben ser visibles los botones para aprobar y rechazar
    When hago clic en el botón "Aceptar" para autogestionarla
    Then la solicitud cambia a estado "APROBADA" y muestra el badge de autogestión
    When hago clic en el badge de autogestión
    Then aparece el modal con el registro de auditoría
