package cl.duoc.citt.citt_backend.services;

import cl.duoc.citt.citt_backend.dto.ArticuloRequestDTO;
import cl.duoc.citt.citt_backend.dto.ArticuloResponseDTO;
import cl.duoc.citt.citt_backend.dto.ArticuloUpdateDTO;
import cl.duoc.citt.citt_backend.exception.ReglaNegocioException;
import cl.duoc.citt.citt_backend.model.Articulo;
import cl.duoc.citt.citt_backend.model.Categoria;
import cl.duoc.citt.citt_backend.model.EstadoArticulo;
import cl.duoc.citt.citt_backend.repositories.ArticuloRepository;
import cl.duoc.citt.citt_backend.repositories.CategoriaRepository;
import cl.duoc.citt.citt_backend.repositories.EstadoArticuloRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ArticuloServiceImpl implements ArticuloService{
    private final ArticuloRepository articuloRepository;

    private final CategoriaRepository categoriaRepository;
    private final EstadoArticuloRepository estadoArticuloRepository;

    private Articulo fromCreate(ArticuloRequestDTO d){
        Articulo art = new Articulo();
        art.setNombreArticulo(d.getNombreArticulo());
        art.setMarca(d.getMarca());
        art.setComentarios(d.getComentarios());
        art.setSfai(d.getSfai());
        art.setColliers(d.getColliers());
        art.setNumeroSerie(d.getNumeroSerie());
        art.setValor(d.getValor());
        art.setEtiqueta(d.getEtiqueta());
        art.setFechaCompra(d.getFechaCompra());
        art.setCodigoDuoc(d.getCodigoDuoc());


        Categoria cat = categoriaRepository.findById(d.getIdCategoria())
                .orElseThrow(() -> new ReglaNegocioException("La categoría con ID " + d.getIdCategoria() + " no existe."));


        EstadoArticulo est = estadoArticuloRepository.findById(d.getIdEstadoArticulo())
                .orElseThrow(() -> new ReglaNegocioException("El estado con ID " + d.getIdEstadoArticulo() + " no existe."));


        art.setCategoria(cat);
        art.setEstadoArticulo(est);

        return art;
    }

    private ArticuloResponseDTO toDTO(Articulo a){
        return ArticuloResponseDTO.builder()
                .idArticulo(a.getIdArticulo())
                .nombreArticulo(a.getNombreArticulo())
                .comentarios(a.getComentarios())
                .sfai(a.getSfai())
                .colliers(a.getColliers())
                .numeroSerie(a.getNumeroSerie())
                .valor(a.getValor())
                .etiqueta(a.getEtiqueta())
                .fechaCompra(a.getFechaCompra())
                .codigoDuoc(a.getCodigoDuoc())
                .idCategoria(a.getCategoria().getIdCategoria())
                .nombreCategoria(a.getCategoria().getNombreCategoria())
                .idEstadoArticulo(a.getEstadoArticulo().getIdEstadoArticulo())
                .nombreEstado(a.getEstadoArticulo().getNombreEstado())
                .build();
    }

    private void aplicarUpdate(Articulo a, ArticuloUpdateDTO d){
        a.setNombreArticulo(d.getNombreArticulo());
        a.setMarca(d.getMarca());
        a.setComentarios(d.getComentarios());
        a.setSfai(d.getSfai());
        a.setColliers(d.getColliers());
        a.setNumeroSerie(d.getNumeroSerie());
        a.setValor(d.getValor());
        a.setEtiqueta(d.getEtiqueta());
        a.setFechaCompra(d.getFechaCompra());

        // Actualizamos las relaciones si el usuario mandó IDs diferentes
        Categoria cat = categoriaRepository.findById(d.getIdCategoria())
                .orElseThrow(() -> new ReglaNegocioException("La categoría con ID " + d.getIdCategoria() + " no existe."));

        EstadoArticulo est = estadoArticuloRepository.findById(d.getIdEstadoArticulo())
                .orElseThrow(() -> new ReglaNegocioException("El estado con ID " + d.getIdEstadoArticulo() + " no existe."));

        a.setCategoria(cat);
        a.setEstadoArticulo(est);
    }


    @Override
    public ArticuloResponseDTO registrarArticulo(ArticuloRequestDTO dto) {
        dto.setNombreArticulo(dto.getNombreArticulo().trim());
        dto.setMarca(dto.getMarca().trim().toUpperCase());
        if (dto.getCodigoDuoc() != null && !dto.getCodigoDuoc().isBlank()) {
            dto.setCodigoDuoc(dto.getCodigoDuoc().trim().toUpperCase());

            if(articuloRepository.contarPorCodigoDuocIgnorandoFiltros(dto.getCodigoDuoc()) > 0){
                throw new ReglaNegocioException("No se puede registrar: El código DUOC '" + dto.getCodigoDuoc() + "' ya fue utilizado por un artículo (activo o dado de baja).");
            }
        } else {
            dto.setCodigoDuoc(null);
        }

        Articulo saved = articuloRepository.save(fromCreate(dto));
        return toDTO(saved);
    }

    @Override
    public ArticuloResponseDTO obtenerArticuloPorId(Long id) {
        Articulo a = articuloRepository.findById(id)
                .orElseThrow(()-> new ReglaNegocioException("Artículo " + id + " no existe"));
        return toDTO(a);
    }

    @Override
    public ArticuloResponseDTO actualizarArticulo(Long id, ArticuloUpdateDTO dto) {
        dto.setNombreArticulo(dto.getNombreArticulo().trim());
        dto.setMarca(dto.getMarca().trim().toUpperCase());

        Articulo a = articuloRepository.findById(id).orElseThrow(() -> new ReglaNegocioException("Articulo " + id + " no existe"));
        aplicarUpdate(a,dto);
        Articulo saved = articuloRepository.save(a);
        return toDTO(saved);
    }

    @Override
    public List<ArticuloResponseDTO> listarArticulos() {
        return articuloRepository.findAll()
                .stream()
                .map(this::toDTO)
                .toList();
    }

    @Override
    public void eliminarArticulo(Long id) {
        if(!articuloRepository.existsById(id)){
            throw new ReglaNegocioException("El articulo no existe");
        }

        // Spring intentará hacer un DELETE, pero @SQLDelete lo convertirá en un UPDATE.
        articuloRepository.deleteById(id);
    }
}
