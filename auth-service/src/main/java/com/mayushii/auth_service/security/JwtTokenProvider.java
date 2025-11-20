package com.mayushii.auth_service.security;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Slf4j
@Component
public class JwtTokenProvider {
    @Value("${jwt.secret:dGhpcyBpcyB0aGUgand0IHNlY3JldCBrZXkgZm9yIGltcGxlbWVudGluZyBqd3QgdG9rZW5zIHN5c3RlbSBpbiBhdXRoIHNlcnZpY2U=}")
    private String jwtSecret;

    @Value("${jwt.expiration:#{7*24*60*60*1000}}")
    private Long jwtExpirationInMs;

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
        } catch (MalformedJwtException | ExpiredJwtException | IllegalArgumentException | UnsupportedJwtException ex) {
            return false;
        } catch (Exception ex) {
            log.error("Unexpected JWT validation error", ex);
            return false;
        }
    }
}
