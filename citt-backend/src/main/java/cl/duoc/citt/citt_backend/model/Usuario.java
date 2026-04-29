package cl.duoc.citt.citt_backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "usuarios")
public class Usuario implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    // Un usuario puede tener varios roles y un rol muchos usuarios.
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "usuarios_roles", joinColumns = @JoinColumn(name = "usuario_id"), inverseJoinColumns = @JoinColumn(name = "rol_id"))
    private Set<Rol> roles = new HashSet<>();

    // Lógica de negocio: para forzar al usuario a cambiar su clave en el primer ingreso
    @Column(nullable = false)
    private boolean debeCambiarPassword = true;


    /**
     * Convierte las entidades 'Rol' en objetos que Spring Security entiende ('GrantedAuthority').
     * y se grega el prefijo "ROLE_" que es el estándar de Spring.
     */
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return roles.stream()
                .map(rol -> new SimpleGrantedAuthority("ROLE_" + rol.getNombre()))
                .collect(Collectors.toList());
    }

    // Identificador (email)
    @Override
    public String getUsername() {
        return email;
    }

    // --- Métodos de Control de Cuenta ---
    // Retornan 'true' para indicar que la cuenta está activa y válida.
    @Override
    public boolean isAccountNonExpired() {
        return true; // La cuenta no ha expirado
    }

    @Override
    public boolean isAccountNonLocked() {
        return true; // La cuenta no está bloqueada
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true; // Las credenciales (password) no han expirado
    }

    @Override
    public boolean isEnabled() {
        return true; // El usuario está habilitado
    }
}
