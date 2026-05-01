package cl.duoc.citt.citt_backend.services;

import cl.duoc.citt.citt_backend.dto.UsuarioResponseDTO;
import cl.duoc.citt.citt_backend.dto.UsuarioUpdateDTO;
import cl.duoc.citt.citt_backend.model.Rol;
import cl.duoc.citt.citt_backend.model.Usuario;
import cl.duoc.citt.citt_backend.repositories.RolRepository;
import cl.duoc.citt.citt_backend.repositories.UsuarioRepository;
import cl.duoc.citt.citt_backend.exception.ReglaNegocioException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;


     // Obtiene la lista completa de usuarios de la base de datos y los transforma a DTO.
    public List<UsuarioResponseDTO> obtenerTodos() {
        return usuarioRepository.findAll().stream()
                .map(this::mapearADTO) // Convierte cada entidad Usuario en un objeto
                .collect(Collectors.toList());
    }

    /**
     * Busca un usuario por su ID numérico.
     * @throws ReglaNegocioException si el ID no existe en la BD.
     */
    public UsuarioResponseDTO buscarPorId(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ReglaNegocioException("Usuario no encontrado con ID: " + id));
        return mapearADTO(usuario);
    }

    /**
     * Busca un usuario por su email.
     * Usado por el endpoint /mi-perfil para que cada usuario vea su propia info.
     */
    public UsuarioResponseDTO buscarPorEmail(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new ReglaNegocioException("Usuario no encontrado"));
        return mapearADTO(usuario);
    }


     // Actualiza los datos de un usuario existente. Permite cambiar el email y la lista de roles asignados.
    public UsuarioResponseDTO actualizar(Long id, UsuarioUpdateDTO usuarioActualizado) {
        //  verificamos que el usuario realmente existe
        Usuario usuarioExistente = usuarioRepository.findById(id)
                .orElseThrow(() -> new ReglaNegocioException("Usuario no encontrado con ID: " + id));

        // Actualizamos el campo email
        usuarioExistente.setEmail(usuarioActualizado.getEmail());

        // Si la petición trae roles, buscamos los nuevos objetos Rol en la BD y los reemplazamos
        if (usuarioActualizado.getRolesNombres() != null && !usuarioActualizado.getRolesNombres().isEmpty()) {
            Set<Rol> roles = usuarioActualizado.getRolesNombres().stream()
                    .map(nombre -> rolRepository.findByNombre(nombre.toUpperCase())
                            .orElseThrow(() -> new ReglaNegocioException("Error: El rol " + nombre + " no existe")))
                    .collect(Collectors.toSet());
            usuarioExistente.setRoles(roles);
        }

        // Guardamos los cambios y devolvemos el usuario actualizado convertido a DTO
        Usuario usuarioGuardado = usuarioRepository.save(usuarioExistente);
        return mapearADTO(usuarioGuardado);
    }


     // Elimina un usuario de la base de datos permanentemente.
    public void eliminar(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ReglaNegocioException("Usuario no encontrado con ID: " + id));
        usuarioRepository.delete(usuario);
    }

    /**
     * MÉTODO DE APOYO (Mapper):
     * Convierte un objeto 'Usuario' (que tiene la contraseña y datos sensibles)
     * en un 'UsuarioResponseDTO' (que solo tiene datos públicos y seguros).
     */

    private UsuarioResponseDTO mapearADTO(Usuario usuario) {
        return UsuarioResponseDTO.builder()
                .id(usuario.getId())
                .email(usuario.getEmail())
                .roles(usuario.getRoles().stream().map(Rol::getNombre).collect(Collectors.toSet()))
                .debeCambiarPassword(usuario.isDebeCambiarPassword())
                .build();
    }
}