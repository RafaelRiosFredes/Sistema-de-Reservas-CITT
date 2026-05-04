package cl.duoc.citt.citt_backend.services;

import cl.duoc.citt.citt_backend.dto.ArticuloRequestDTO;
import cl.duoc.citt.citt_backend.dto.ArticuloResponseDTO;
import cl.duoc.citt.citt_backend.dto.ArticuloUpdateDTO;

import java.util.List;

public interface ArticuloService {
    ArticuloResponseDTO registrarArticulo(ArticuloRequestDTO dto);

    ArticuloResponseDTO obtenerArticuloPorId(Long id);

    ArticuloResponseDTO actualizarArticulo(Long id, ArticuloUpdateDTO dto);

    List<ArticuloResponseDTO> listarArticulos();

    void eliminarArticulo(Long id);
}
