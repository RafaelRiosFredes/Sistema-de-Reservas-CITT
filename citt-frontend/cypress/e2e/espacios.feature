Feature: Módulo de espacio Integración

  Scenario: PRU-15 Crear nuevo espacio
    Given que soy un administrador en la pantalla de Gestión de Espacios
    When abro el modal de "Nuevo espacio"
    And lleno el formulario con el nombre "Lab 3" y capacidad "20"
    And presiono el botón de guardar "Guardar Espacio"
    Then el frontend hace la petición POST a "/api/espacios", se cierra el modal, y el nuevo espacio aparece en la tabla
