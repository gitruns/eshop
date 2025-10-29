package com.mayushii.auth_service.security;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtTokenProvider {
    private String jwtSecret = "dGhpcyBpcyB0aGUgand0IHNlY3JldCBrZXkgZm9yIGltcGxlbWVudGluZyBqd3QgdG9rZW5zIHN5c3RlbSBpbiBhdXRoIHNlcnZpY2U=";
    private Long jwtExpirationInMs = java.time.Duration.ofDays(7).toMillis();

    // generate token
    public String generateToken(Authentication authentication) {
        String username = authentication.getName();
        Date curD = new Date();
        Date expiryD = new Date(curD.getTime() + jwtExpirationInMs);
        String token = Jwts.builder()
                .subject(username)
                .issuedAt(curD)
                .expiration(expiryD)
                .signWith(key())
                .compact();
        return token;
    }

    // encode the key
    private SecretKey key() {
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtSecret));
    }

    // get username from the token
    public String getUsername(String token) {
        return Jwts.parser().verifyWith((SecretKey) key())
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }

    // validate the token
    /**
     * token expired
     * invalid
     * unsupported token
     * jwt claim is null or empty
     */
    public boolean validateToken(String token) {
        try {
            Jwts.parser().verifyWith((SecretKey) key())
                    .build()
                    .parse(token);
            return true;
        } catch (MalformedJwtException ex) {
            throw new RuntimeException("Invalid JWT token");
        } catch (ExpiredJwtException ex) {
            throw new RuntimeException("Expired JWT token");
        } catch (IllegalArgumentException ex) {
            throw new RuntimeException("JWT claims string is empty");
        } catch (UnsupportedJwtException ex) {
            throw new RuntimeException("JWT token is unsupported");
        } catch (Exception ex) {
            throw new RuntimeException("JWT token validation failed");
        }
    }
}
