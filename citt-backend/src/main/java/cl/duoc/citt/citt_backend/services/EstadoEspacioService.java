package cl.duoc.citt.citt_backend.services;

import cl.duoc.citt.citt_backend.model.EstadoEspacio;
import cl.duoc.citt.citt_backend.repositories.EstadoEspacioRepository;

import java.util.List;

public interface EstadoEspacioService {

    EstadoEspacio crear(EstadoEspacio espacio);
    List<EstadoEspacio> listar();
    EstadoEspacio obtenerPorId(Long id);
    EstadoEspacio actualizar(Long id, EstadoEspacio estado);

    void eliminar(Long id);

}
