package cl.duoc.citt.citt_backend.services;


import cl.duoc.citt.citt_backend.dto.EspacioRequestDTO;
import cl.duoc.citt.citt_backend.dto.EspacioResponseDTO;
import cl.duoc.citt.citt_backend.dto.EspacioUpdateDTO;

import java.util.List;

public interface EspacioService {

    EspacioResponseDTO crear(EspacioRequestDTO dto);
    List<EspacioResponseDTO> listar(String estado);
    EspacioResponseDTO obtenerPorId(Long id);
    EspacioResponseDTO actualizar(Long id, EspacioUpdateDTO dto);
    void eliminar(Long id);
}


