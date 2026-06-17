package cl.duoc.citt.citt_backend.services;

import cl.duoc.citt.citt_backend.dto.*;
import cl.duoc.citt.citt_backend.exception.ReglaNegocioException;
import cl.duoc.citt.citt_backend.model.Categoria;
import cl.duoc.citt.citt_backend.repositories.ArticuloRepository;
import cl.duoc.citt.citt_backend.repositories.CategoriaRepository;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CategoriaServiceImpl implements CategoriaService{
    private final CategoriaRepository categoriaRepository;
    private final ArticuloRepository articuloRepository;

    private void estandarizarTextos(CategoriaRequestDTO dto){
        if(dto.getNombreCategoria() != null) dto.setNombreCategoria(dto.getNombreCategoria().trim().toUpperCase());
    }

    private void estandarizarTextos(CategoriaUpdateDTO dto){
        if(dto.getNombreCategoria() != null) dto.setNombreCategoria(dto.getNombreCategoria().trim().toUpperCase());
    }

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
                .eliminado(c.isEliminado())
                .build();
    }

    private void aplicarUpdate(Categoria c, CategoriaUpdateDTO d){
        c.setNombreCategoria(d.getNombreCategoria());
        c.setEsTecnologico(d.getEsTecnologico());
    }

    @Override
    @Transactional
    public CategoriaResponseDTO crearCategoria(CategoriaRequestDTO dto) {
        estandarizarTextos(dto);
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
    @Transactional
    public CategoriaResponseDTO actualizarCategoria(Long id, CategoriaUpdateDTO dto) {
        estandarizarTextos(dto);
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
    public List<CategoriaResponseDTO> listarCategoriasTecnologicas() {
        return categoriaRepository.findByEsTecnologicoTrue()
                .stream()
                .map(this::toDTO)
                .toList();
    }

    @Override
    public List<CategoriaAgrupadaDTO> listarVistaAlumnos() {
        List<Object[]> resultados = articuloRepository.contarDisponiblesAgrupadosNativo();
        List<CategoriaAgrupadaDTO> response = new ArrayList<>();
        Map<Long, CategoriaAgrupadaDTO> mapaCategorias = new HashMap<>();

        for (Object[] row : resultados) {
            Long catId = ((Number) row[0]).longValue();
            String catNombre = (String) row[1];
            String marca = (String) row[2];
            Integer cantidad = ((Number) row[3]).intValue();

            CategoriaAgrupadaDTO categoria = mapaCategorias.computeIfAbsent(catId,
                    id -> new CategoriaAgrupadaDTO(id, catNombre, 0, new ArrayList<>()));

            categoria.getDesgloseMarcas().add(new MarcaDesgloseDTO(marca, cantidad));
            categoria.setTotalCategoria(categoria.getTotalCategoria() + cantidad);
        }
        response.addAll(mapaCategorias.values());
        response.sort(Comparator.comparing(CategoriaAgrupadaDTO::getNombreCategoria));
        return response;
    }

    @Override
    @Transactional
    public void eliminarCategoria(Long id) {
        if(!categoriaRepository.existsById(id)){
            throw new ReglaNegocioException("La categoria no existe.");
        }

        if(articuloRepository.contarHistoricoPorCategoriaId(id) > 0) {
            throw new ReglaNegocioException("No se puede eliminar la categoría porque aún tiene artículos registrados. Reasígnelos o elimínelos primero.");
        }

        categoriaRepository.deleteById(id);
    }

    @Override
    public CategoriaResponseDTO restaurarCategoria(Long id) {
        int actualizados = categoriaRepository.restaurarCategoriaNativo(id);
        if (actualizados == 0) {
            throw new ReglaNegocioException("La categoría no existe.");
        }
        // Como ya revivió, podemos buscarla y devolverla con el método normal
        return obtenerCategoriaPorId(id);
    }

    @Override
    public List<CategoriaResponseDTO> listarTodasAdmin() {
        return categoriaRepository.findAllIgnorandoFiltros()
                .stream()
                .map(this::toDTO)
                .toList();
    }
}
