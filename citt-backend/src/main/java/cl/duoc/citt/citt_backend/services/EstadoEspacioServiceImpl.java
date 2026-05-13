package cl.duoc.citt.citt_backend.services;


import cl.duoc.citt.citt_backend.model.EstadoEspacio;
import cl.duoc.citt.citt_backend.repositories.EstadoEspacioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EstadoEspacioServiceImpl implements EstadoEspacioService {

    private final EstadoEspacioRepository repository;

    @Override
    public EstadoEspacio crear(EstadoEspacio estado) {
        return repository.save(estado);
    }

    @Override
    public List<EstadoEspacio> listar() {
        return repository.findAll();
    }

    @Override
    public EstadoEspacio obtenerPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("EstadoEspacio no encontrado"));
    }

    @Override
    public EstadoEspacio actualizar(Long id, EstadoEspacio estado) {

        EstadoEspacio existente = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("EstadoEspacio no encontrado"));

        existente.setNombre(estado.getNombre());

        return repository.save(existente);
    }

    @Override
    public void eliminar(Long id) {

        EstadoEspacio existente = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("EstadoEspacio no encontrado"));

        repository.delete(existente);
    }
}





