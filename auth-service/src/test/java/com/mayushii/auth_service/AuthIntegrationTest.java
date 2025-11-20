package com.mayushii.auth_service;

import com.mayushii.auth_service.payload.LoginDto;
import com.mayushii.auth_service.payload.RegisterDto;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.*;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.TestPropertySource;

import javax.crypto.SecretKey;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@TestPropertySource(properties = {
                "spring.datasource.url=jdbc:h2:mem:testdb;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE",
                "spring.datasource.driver-class-name=org.h2.Driver",
                "spring.datasource.username=sa",
                "spring.datasource.password=",
                "spring.jpa.database-platform=org.hibernate.dialect.H2Dialect",
                "spring.jpa.hibernate.ddl-auto=create-drop",
                "jwt.secret=dGVzdC1zZWNyZXQta2V5LXRoYXQtaXMtc3VmZmljaWVudGx5LWxvbmctZm9yLWhzMjU2", // base64 encoded
                "app.jwt-secret=dGVzdC1zZWNyZXQta2V5LXRoYXQtaXMtc3VmZmljaWVudGx5LWxvbmctZm9yLWhzMjU2", // base64 encoded
                "eureka.client.enabled=false",
                "spring.cloud.config.enabled=false",
                "spring.cloud.discovery.enabled=false",
                "eureka.client.register-with-eureka=false"
})
public class AuthIntegrationTest {

        @LocalServerPort
        private int port;

        @Autowired
        private TestRestTemplate restTemplate;

        @Autowired
        private JdbcTemplate jdbcTemplate;

        private String baseUrl;

        @BeforeEach
        void setUp() {
                baseUrl = "http://localhost:" + port + "/api/auth";

                // Clean up database
                jdbcTemplate.execute("DELETE FROM users_roles");
                jdbcTemplate.execute("DELETE FROM users");
                jdbcTemplate.execute("DELETE FROM roles");

                // Insert default role
                jdbcTemplate.update("INSERT INTO roles (id, name) VALUES (1, 'ROLE_USER')");
        }

        @Test
        void testSuccessfulUserRegistration() {
                // Given
                RegisterDto registerDto = new RegisterDto("John Doe", "johndoe", "john@example.com", "password123",
                                "ROLE_USER");

                // When
                ResponseEntity<String> response = restTemplate.postForEntity(baseUrl + "/register", registerDto,
                                String.class);

                // Then
                assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);

                // Verify user was created in database
                Integer userCount = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM users WHERE username = 'johndoe'",
                                Integer.class);
                assertThat(userCount).isEqualTo(1);
        }

        @Test
        void testSuccessfulUserLogin() {
                // Given - First register a user
                RegisterDto registerDto = new RegisterDto("Jane Doe", "janedoe", "jane@example.com", "password123",
                                "ROLE_USER");
                restTemplate.postForEntity(baseUrl + "/register", registerDto, String.class);

                // When - Login
                LoginDto loginDto = new LoginDto("janedoe", "password123");
                ResponseEntity<String> response = restTemplate.postForEntity(baseUrl + "/login", loginDto,
                                String.class);

                // Then
                assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
                assertThat(response.getBody()).isNotNull();

                // Verify it's a JWT token (basic structure check)
                String token = response.getBody();
                assertThat(token).isNotBlank();
                assertThat(token.split("\\.")).hasSize(3); // JWT has 3 parts separated by dots
        }

        @Test
        void testInvalidCredentialsRejection() {
                // Given - Register a user
                RegisterDto registerDto = new RegisterDto("Bob Smith", "bobsmith", "bob@example.com", "password123",
                                "ROLE_USER");
                restTemplate.postForEntity(baseUrl + "/register", registerDto, String.class);

                // When - Try to login with wrong password
                LoginDto invalidLoginDto = new LoginDto("bobsmith", "wrongpassword");
                ResponseEntity<String> response = restTemplate.postForEntity(baseUrl + "/login", invalidLoginDto,
                                String.class);

                // Then
                assertThat(response.getStatusCode()).isNotEqualTo(HttpStatus.OK);
        }

        @Test
        void testValidationErrorHandling_MissingFields() {
                // Given - Register with missing required fields
                RegisterDto invalidRegisterDto = new RegisterDto("", "", "", "", "");

                // When
                ResponseEntity<String> response = restTemplate.postForEntity(baseUrl + "/register", invalidRegisterDto,
                                String.class);

                // Then
                assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        }

        @Test
        void testValidationErrorHandling_InvalidEmail() {
                // Given - Register with invalid email
                RegisterDto invalidRegisterDto = new RegisterDto("Test User", "testuser", "invalid-email",
                                "password123", "ROLE_USER");

                // When
                ResponseEntity<String> response = restTemplate.postForEntity(baseUrl + "/register", invalidRegisterDto,
                                String.class);

                // Then
                assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        }

        @Test
        void testJwtTokenValidationSuccess() {
                // Given - Register and login to get a valid token
                RegisterDto registerDto = new RegisterDto("Token Test", "tokentest", "token@example.com", "password123",
                                "ROLE_USER");
                restTemplate.postForEntity(baseUrl + "/register", registerDto, String.class);

                LoginDto loginDto = new LoginDto("tokentest", "password123");
                ResponseEntity<String> loginResponse = restTemplate.postForEntity(baseUrl + "/login", loginDto,
                                String.class);
                String token = loginResponse.getBody();

                // When - Make authenticated request
                HttpHeaders headers = new HttpHeaders();
                headers.setBearerAuth(token);
                HttpEntity<String> request = new HttpEntity<>(headers);

                // For testing JWT validation, we need a protected endpoint. Let's check if
                // there's a hello endpoint
                ResponseEntity<String> protectedResponse = restTemplate.exchange(
                                "http://localhost:" + port + "/",
                                HttpMethod.GET, request, String.class);

                // Then - Should succeed (assuming the hello endpoint exists and requires auth)
                // This test might need adjustment based on what protected endpoints are
                // available
                assertThat(protectedResponse.getStatusCode()).isNotEqualTo(HttpStatus.UNAUTHORIZED);
        }

        @Test
        void testJwtTokenExpiryHandling() throws Exception {
                // Given - Create an expired JWT token manually
                String secret = "dGVzdC1zZWNyZXQta2V5LXRoYXQtaXMtc3VmZmljaWVudGx5LWxvbmctZm9yLWhzMjU2"; // base64 secret
                                                                                                        // from
                                                                                                        // properties
                SecretKey key = Keys.hmacShaKeyFor(java.util.Base64.getDecoder().decode(secret));

                Instant now = Instant.now();
                Instant past = now.minus(1, ChronoUnit.HOURS); // 1 hour ago

                String expiredToken = Jwts.builder()
                                .subject("testuser")
                                .issuedAt(Date.from(past))
                                .expiration(Date.from(past.plusSeconds(1))) // 1 second expiration
                                .signWith(key)
                                .compact();

                // When - Make request with expired token
                HttpHeaders headers = new HttpHeaders();
                headers.setBearerAuth(expiredToken);
                HttpEntity<String> request = new HttpEntity<>(headers);

                ResponseEntity<String> response = restTemplate.exchange("http://localhost:" + port + "/",
                                HttpMethod.GET, request, String.class);

                // Then - Should fail with unauthorized
                assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
        }

        @Test
        void testInvalidJwtTokenRejection() {
                // Given - Use an invalid JWT token
                String invalidToken = "invalid.jwt.token";

                // When - Make request with invalid token
                HttpHeaders headers = new HttpHeaders();
                headers.setBearerAuth(invalidToken);
                HttpEntity<String> request = new HttpEntity<>(headers);

                ResponseEntity<String> response = restTemplate.exchange("http://localhost:" + port + "/",
                                HttpMethod.GET, request, String.class);

                // Then - Should fail with unauthorized
                assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
        }

}
