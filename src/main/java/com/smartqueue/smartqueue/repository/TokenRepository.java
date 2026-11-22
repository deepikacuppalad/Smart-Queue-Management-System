
package com.smartqueue.smartqueue.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.smartqueue.smartqueue.entity.Token;

@Repository
public interface TokenRepository extends JpaRepository<Token, Long> {

    Optional<Token> findByTokenNumber(String tokenNumber);

    List<Token> findByStatusOrderByCreatedAtAsc(String status);

    List<Token> findByDepartmentIdAndStatusOrderByCreatedAtAsc(
            Long departmentId, String status);

    long countByDepartmentIdAndStatus(
            Long departmentId, String status);

    // Find the latest generated token
    Optional<Token> findTopByOrderByIdDesc();
}
