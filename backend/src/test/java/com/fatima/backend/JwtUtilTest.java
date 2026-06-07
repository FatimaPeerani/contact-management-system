package com.fatima.backend;

import com.fatima.backend.security.JwtUtil;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
class JwtUtilTest {

    @Autowired
    private JwtUtil jwtUtil;

    @Test
    void testGenerateToken() {
        String token = jwtUtil.generateToken("test@mail.com");
        assertNotNull(token);
    }

    @Test
    void testExtractEmail() {
        String token = jwtUtil.generateToken("test@mail.com");
        String email = jwtUtil.extractEmail(token);
        assertEquals("test@mail.com", email);
    }

    @Test
    void testValidateToken_valid() {
        String token = jwtUtil.generateToken("test@mail.com");
        assertTrue(jwtUtil.validateToken(token));
    }

    @Test
    void testValidateToken_invalid() {
        assertFalse(jwtUtil.validateToken("invalid.token.here"));
    }
}