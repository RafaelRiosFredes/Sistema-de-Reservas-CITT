package cl.duoc.citt.citt_backend.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Component
public class JwtUtilidades {

    // Lee la clave secreta definida en el archivo application.properties
    @Value("${jwt.secret}")
    private String secretKey;

    // Lee el tiempo de duración del token desde la configuración
    @Value("${jwt.expiration}")
    private long jwtExpiration;

    // Extrae el nombre de usuario guardado dentro del token.
    public String extraerUsername(String token) {
        return extraerClaim(token, Claims::getSubject);
    }

    // Método genérico para extraer cualquier dato específico (Claim) del token.
    public <T> T extraerClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extraerTodosLosClaims(token);
        return claimsResolver.apply(claims);
    }

    /**
     * Punto de entrada para crear un nuevo token cuando un usuario se loguea.
     * Agrega información extra como los roles y si debe cambiar la clave.
     */
    public String generarToken(UserDetails detallesUsuario) {
        Map<String, Object> extraClaims = new HashMap<>();

        // Guarda los roles del usuario dentro del token para que el frontend los pueda leer
        var roles = detallesUsuario.getAuthorities().stream()
                .map(auth -> auth.getAuthority())
                .toList();
        extraClaims.put("roles", roles);

        // Si es un usuario del sistema, añade el estado de su contraseña
        if (detallesUsuario instanceof cl.duoc.citt.citt_backend.model.Usuario) {
            extraClaims.put("debeCambiarPassword", ((cl.duoc.citt.citt_backend.model.Usuario) detallesUsuario).isDebeCambiarPassword());
        }

        return generarToken(extraClaims, detallesUsuario);
    }


       // Construye el JWT con la fecha de emisión, expiración y la firma digital.
    public String generarToken(Map<String, Object> extraClaims, UserDetails detallesUsuario) {
        return Jwts.builder()
                .setClaims(extraClaims)
                .setSubject(detallesUsuario.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpiration))
                .signWith(obtenerLlaveFirma(), SignatureAlgorithm.HS256)
                .compact();
    }

    // Verifica que el token pertenezca al usuario y que no haya caducado.
    public boolean esTokenValido(String token, UserDetails detallesUsuario) {
        final String nombreUsuario = extraerUsername(token);
        return (nombreUsuario.equals(detallesUsuario.getUsername())) && !esTokenExpirado(token);
    }

    // omprueba si la fecha de expiración del token es anterior a la hora actual.
    private boolean esTokenExpirado(String token) {
        return extraerExpiracion(token).before(new Date());
    }

    private Date extraerExpiracion(String token) {
        return extraerClaim(token, Claims::getExpiration);
    }

    // Abre el token usando la llave secreta para leer todo su contenido (Claims).
    private Claims extraerTodosLosClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(obtenerLlaveFirma())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    //  Transforma la clave secreta de String (Base64) a un objeto Key que Java entiende.
    private Key obtenerLlaveFirma() {
        byte[] llaveBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(llaveBytes);
    }
}
