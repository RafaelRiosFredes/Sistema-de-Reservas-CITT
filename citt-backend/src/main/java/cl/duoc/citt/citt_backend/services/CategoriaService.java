package cl.duoc.citt.citt_backend.services;

import cl.duoc.citt.citt_backend.dto.CategoriaRequestDTO;
import cl.duoc.citt.citt_backend.dto.CategoriaResponseDTO;
import cl.duoc.citt.citt_backend.dto.CategoriaUpdateDTO;

import java.util.List;

public interface CategoriaService {
    CategoriaResponseDTO crearCategoria(CategoriaRequestDTO dto);

    CategoriaResponseDTO obtenerCategoriaPorId(Long id);

    CategoriaResponseDTO actualizarCategoria(Long id, CategoriaUpdateDTO dto);

    List<CategoriaResponseDTO> listarCategorias();

    void eliminarCategoria(Long id);
}
