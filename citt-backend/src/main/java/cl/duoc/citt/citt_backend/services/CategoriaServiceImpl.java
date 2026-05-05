package cl.duoc.citt.citt_backend.services;

import cl.duoc.citt.citt_backend.dto.CategoriaRequestDTO;
import cl.duoc.citt.citt_backend.dto.CategoriaResponseDTO;
import cl.duoc.citt.citt_backend.dto.CategoriaUpdateDTO;
import cl.duoc.citt.citt_backend.exception.ReglaNegocioException;
import cl.duoc.citt.citt_backend.model.Categoria;
import cl.duoc.citt.citt_backend.repositories.ArticuloRepository;
import cl.duoc.citt.citt_backend.repositories.CategoriaRepository;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class CategoriaServiceImpl implements CategoriaService{
    private final CategoriaRepository categoriaRepository;
    private final ArticuloRepository articuloRepository;

    private Categoria fromCreate(CategoriaRequestDTO d){
        Categoria cat = new Categoria();
        cat.setNombreCategoria(d.getNombreCategoria());
        cat.setEsTecnologico(d.getEsTecnologico());
        return cat;
    }

    private CategoriaResponseDTO toDTO(Categoria c){
        return CategoriaResponseDTO.builder()
                .idCategoria(c.getIdCategoria())
                .nombreCategoria(c.getNombreCategoria())
                .esTecnologico(c.isEsTecnologico())
                .build();
    }

    private void aplicarUpdate(Categoria c, CategoriaUpdateDTO d){
        c.setNombreCategoria(d.getNombreCategoria());
        c.setEsTecnologico(d.getEsTecnologico());
    }

    @Override
    public CategoriaResponseDTO crearCategoria(CategoriaRequestDTO dto) {
        dto.setNombreCategoria(dto.getNombreCategoria().trim());
        if(categoriaRepository.contarPorNombreIgnorandoFiltros(dto.getNombreCategoria()) > 0){
            throw new ReglaNegocioException("No se puede crear: Ya existe una categoria con el nombre " + dto.getNombreCategoria() + " (activa o eliminada).");
        }
        Categoria saved = categoriaRepository.save(fromCreate(dto));
        return toDTO(saved);
    }

    @Override
    public CategoriaResponseDTO obtenerCategoriaPorId(Long id) {
        Categoria c = categoriaRepository.findById(id)
                .orElseThrow(()-> new ReglaNegocioException("Categoria " + id + " no existe"));
        return toDTO(c);
    }

    @Override
    public CategoriaResponseDTO actualizarCategoria(Long id, CategoriaUpdateDTO dto) {
        dto.setNombreCategoria(dto.getNombreCategoria().trim());
        Categoria c = categoriaRepository.findById(id).orElseThrow(()-> new ReglaNegocioException("Categoria " + id + " no existe"));

        // Si el usuario está intentando cambiar el nombre por uno distinto...
        if (!c.getNombreCategoria().equalsIgnoreCase(dto.getNombreCategoria())) {
            // ...revisamos si el nuevo nombre choca con algún fantasma o categoría viva
            if (categoriaRepository.contarPorNombreIgnorandoFiltros(dto.getNombreCategoria()) > 0) {
                throw new ReglaNegocioException("No se puede actualizar: Ya existe otra categoría con el nombre '" + dto.getNombreCategoria() + "' (activa o eliminada).");
            }
        }

        aplicarUpdate(c,dto);
        Categoria saved = categoriaRepository.save(c);
        return toDTO(saved);
    }

    @Override
    public List<CategoriaResponseDTO> listarCategorias() {
        return categoriaRepository.findAll()
                .stream()
                .map(this::toDTO)
                .toList();
    }

    @Override
    public void eliminarCategoria(Long id) {
        if(!categoriaRepository.existsById(id)){
            throw new ReglaNegocioException("La categoria no existe.");
        }

        if(articuloRepository.contarPorCategoriaIdIgnorandoEliminados(id) > 0) {
            throw new ReglaNegocioException("No se puede eliminar la categoría porque aún tiene artículos registrados. Reasígnelos o elimínelos primero.");
        }

        categoriaRepository.deleteById(id);
    }
}
