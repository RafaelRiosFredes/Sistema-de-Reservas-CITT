package cl.duoc.citt.citt_backend.services;

import cl.duoc.citt.citt_backend.dto.ArticuloRequestDTO;
import cl.duoc.citt.citt_backend.dto.ArticuloResponseDTO;
import cl.duoc.citt.citt_backend.dto.ArticuloUpdateDTO;
import cl.duoc.citt.citt_backend.exception.ReglaNegocioException;
import cl.duoc.citt.citt_backend.model.Articulo;
import cl.duoc.citt.citt_backend.repositories.ArticuloRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ArticuloServiceImpl implements ArticuloService{
    private final ArticuloRepository articuloRepository;

    private Articulo fromCreate(ArticuloRequestDTO d){
        Articulo art = new Articulo();
        art.setNombreArticulo(d.getNombreArticulo());
        art.setComentarios(d.getComentarios());
        art.setSfai(d.getSfai());
        art.setColliers(d.getColliers());
        art.setNumeroSerie(d.getNumeroSerie());
        art.setValor(d.getValor());
        art.setEtiqueta(d.getEtiqueta());
        art.setTipoArticulo(d.getTipoArticulo());
        art.setFechaCompra(d.getFechaCompra());
        art.setCodigoDuoc(d.getCodigoDuoc());
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
                .tipoArticulo(a.getTipoArticulo())
                .fechaCompra(a.getFechaCompra())
                .codigoDuoc(a.getCodigoDuoc())
                .build();
    }

    private void aplicarUpdate(Articulo a, ArticuloUpdateDTO d){
        a.setNombreArticulo(d.getNombreArticulo());
        a.setComentarios(d.getComentarios());
        a.setSfai(d.getSfai());
        a.setColliers(d.getColliers());
        a.setNumeroSerie(d.getNumeroSerie());
        a.setValor(d.getValor());
        a.setEtiqueta(d.getEtiqueta());
        a.setTipoArticulo(d.getTipoArticulo());
        a.setFechaCompra(d.getFechaCompra());
    }


    @Override
    public ArticuloResponseDTO registrarArticulo(ArticuloRequestDTO dto) {
        dto.setNombreArticulo(dto.getNombreArticulo().trim());
        dto.setCodigoDuoc(dto.getCodigoDuoc().trim().toUpperCase());

        if(articuloRepository.contarPorCodigoDuocIgnorandoFiltros(dto.getCodigoDuoc()) > 0){
            throw new ReglaNegocioException("No se puede registrar: El código DUOC '" + dto.getCodigoDuoc() + "' ya fue utilizado por un artículo (activo o dado de baja).");
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
