
package com.smartqueue.smartqueue.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.smartqueue.smartqueue.entity.Token;
import com.smartqueue.smartqueue.service.TokenService;

@RestController
@RequestMapping("/api/tokens")
@CrossOrigin(origins = "*")
public class TokenController {

    private final TokenService tokenService;

    public TokenController(TokenService tokenService) {
        this.tokenService = tokenService;
    }

    // Generate token
    @PostMapping("/generate")
    public Token generateToken(
            @RequestParam Long customerId,
            @RequestParam Long departmentId) {

        return tokenService.generateToken(
                customerId, departmentId);
    }

    // Get all tokens
    @GetMapping
    public List<Token> getAllTokens() {
        return tokenService.getAllTokens();
    }

    // Get waiting tokens
    @GetMapping("/waiting")
    public List<Token> getWaitingTokens() {
        return tokenService.getWaitingTokens();
    }

    // Get department waiting tokens
    @GetMapping("/department/{departmentId}")
    public List<Token> getDepartmentTokens(
            @PathVariable Long departmentId) {

        return tokenService.getDepartmentTokens(departmentId);
    }

    // Get token by ID
    @GetMapping("/{id}")
    public Token getTokenById(@PathVariable Long id) {
        return tokenService.getTokenById(id);
    }

    // Update token status
    @PutMapping("/{id}/status")
    public Token updateTokenStatus(
            @PathVariable Long id,
            @RequestParam String status) {

        return tokenService.updateTokenStatus(id, status);
    }


    // Admin calls the next waiting customer
    @PutMapping("/call-next/{departmentId}")
    public Token callNextToken(
            @PathVariable Long departmentId) {

        return tokenService.callNextToken(departmentId);
    }

}
