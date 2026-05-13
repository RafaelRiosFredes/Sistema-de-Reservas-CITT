package cl.duoc.citt.citt_backend.services;

import cl.duoc.citt.citt_backend.dto.ArticuloRequestDTO;
import cl.duoc.citt.citt_backend.dto.ArticuloResponseDTO;
import cl.duoc.citt.citt_backend.dto.ArticuloUpdateDTO;
import cl.duoc.citt.citt_backend.dto.EstadisticasInventarioDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ArticuloService {
    ArticuloResponseDTO registrarArticulo(ArticuloRequestDTO dto);

    ArticuloResponseDTO obtenerArticuloPorId(Long id);

    ArticuloResponseDTO actualizarArticulo(Long id, ArticuloUpdateDTO dto);

    Page<ArticuloResponseDTO> listarArticulosAdmin(Long idCategoria, String nombre, Pageable pageable);

    Page<ArticuloResponseDTO> listarTecnologicosPorEstado(String estado, Pageable pageable);

    void eliminarArticulo(Long id);

    EstadisticasInventarioDTO obtenerEstadisticasDashboard();

    ArticuloResponseDTO restaurarArticulo(Long id);
}
