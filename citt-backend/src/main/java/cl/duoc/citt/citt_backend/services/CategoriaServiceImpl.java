package cl.duoc.citt.citt_backend.services;

import cl.duoc.citt.citt_backend.dto.CategoriaRequestDTO;
import cl.duoc.citt.citt_backend.dto.CategoriaResponseDTO;
import cl.duoc.citt.citt_backend.dto.CategoriaUpdateDTO;
import cl.duoc.citt.citt_backend.exception.ReglaNegocioException;
import cl.duoc.citt.citt_backend.model.Categoria;
import cl.duoc.citt.citt_backend.repositories.CategoriaRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class CategoriaServiceImpl implements CategoriaService{
    private final CategoriaRepository categoriaRepository;

    private Categoria fromCreate(CategoriaRequestDTO d){
        Categoria cat = new Categoria();
        cat.setNombreCategoria(d.getNombreCategoria());
        cat.setCantidadTotal(d.getCantidadTotal());
        return cat;
    }

    private CategoriaResponseDTO toDTO(Categoria c){
        return CategoriaResponseDTO.builder()
                .idCategoria(c.getIdCategoria())
                .nombreCategoria(c.getNombreCategoria())
                .cantidadTotal(c.getCantidadTotal())
                .build();
    }

    private void aplicarUpdate(Categoria c, CategoriaUpdateDTO d){
        c.setNombreCategoria(d.getNombreCategoria());
        c.setCantidadTotal(d.getCantidadTotal());
    }

    @Override
    public CategoriaResponseDTO crearCategoria(CategoriaRequestDTO dto) {
        if(categoriaRepository.existsByNombreCategoriaIgnoreCase(dto.getNombreCategoria())){
            throw new ReglaNegocioException("No se puede crear: Ya existe una categoria con el nombre " + dto.getNombreCategoria() + ".");
        }
        Categoria saved = categoriaRepository.save(fromCreate(dto));
        return toDTO(saved);
    }

    @Override
    public CategoriaResponseDTO actualizarCategoria(Long id, CategoriaUpdateDTO dto) {
        Categoria c = categoriaRepository.findById(id).orElseThrow(()-> new ReglaNegocioException("Categoria " + id + " no existe"));
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
        categoriaRepository.deleteById(id);
    }
}
