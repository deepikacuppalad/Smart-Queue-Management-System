
package com.smartqueue.smartqueue.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.smartqueue.smartqueue.entity.Customer;
import com.smartqueue.smartqueue.entity.QueueDepartment;
import com.smartqueue.smartqueue.entity.Token;
import com.smartqueue.smartqueue.repository.CustomerRepository;
import com.smartqueue.smartqueue.repository.QueueDepartmentRepository;
import com.smartqueue.smartqueue.repository.TokenRepository;

@Service
public class TokenService {

    private final CustomerRepository customerRepository;
    private final QueueDepartmentRepository queueDepartmentRepository;
    private final TokenRepository tokenRepository;

    public TokenService(
            CustomerRepository customerRepository,
            QueueDepartmentRepository queueDepartmentRepository,
            TokenRepository tokenRepository) {

        this.customerRepository = customerRepository;
        this.queueDepartmentRepository = queueDepartmentRepository;
        this.tokenRepository = tokenRepository;
    }

    // Generate a new unique token
    @Transactional
    public Token generateToken(Long customerId, Long departmentId) {

        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() ->
                        new RuntimeException("Customer not found"));

        QueueDepartment department =
                queueDepartmentRepository.findById(departmentId)
                        .orElseThrow(() ->
                                new RuntimeException("Department not found"));

        if (!department.isActive()) {
            throw new RuntimeException("Department is not active");
        }

        // Find the latest generated token
        Token latestToken = tokenRepository
                .findTopByOrderByIdDesc()
                .orElse(null);

        int nextNumber = 1;

        if (latestToken != null) {

            String lastTokenNumber = latestToken.getTokenNumber();

            int lastNumber = Integer.parseInt(
                    lastTokenNumber.substring(1));

            nextNumber = lastNumber + 1;
        }

        String tokenNumber = "D" + nextNumber;

        // Create token
        Token token = new Token();

        token.setTokenNumber(tokenNumber);
        token.setCustomer(customer);
        token.setDepartment(department);
        token.setStatus("WAITING");

        return tokenRepository.save(token);
    }

    // Get all tokens
    public List<Token> getAllTokens() {
        return tokenRepository.findAll();
    }

    // Get waiting tokens
    public List<Token> getWaitingTokens() {
        return tokenRepository
                .findByStatusOrderByCreatedAtAsc("WAITING");
    }

    // Get tokens by department
    public List<Token> getDepartmentTokens(Long departmentId) {

        return tokenRepository
                .findByDepartmentIdAndStatusOrderByCreatedAtAsc(
                        departmentId, "WAITING");
    }

    // Get token by ID
    public Token getTokenById(Long id) {

        return tokenRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Token not found"));
    }

    // Update token status
    public Token updateTokenStatus(Long id, String status) {

        Token token = getTokenById(id);

        if (!status.equals("WAITING")
                && !status.equals("SERVING")
                && !status.equals("COMPLETED")
                && !status.equals("CANCELLED")) {

            throw new RuntimeException("Invalid token status");
        }

        token.setStatus(status);

        return tokenRepository.save(token);
    }

    // Call the next waiting customer
    public Token callNextToken(Long departmentId) {

        List<Token> waitingTokens =
                tokenRepository
                        .findByDepartmentIdAndStatusOrderByCreatedAtAsc(
                                departmentId, "WAITING");

        if (waitingTokens.isEmpty()) {
            throw new RuntimeException(
                    "No waiting customers in this department");
        }

        Token nextToken = waitingTokens.get(0);

        nextToken.setStatus("SERVING");

        return tokenRepository.save(nextToken);
    }
}
