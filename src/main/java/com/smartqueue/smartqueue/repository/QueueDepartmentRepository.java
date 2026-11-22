
package com.smartqueue.smartqueue.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.smartqueue.smartqueue.entity.QueueDepartment;

@Repository
public interface QueueDepartmentRepository
        extends JpaRepository<QueueDepartment, Long> {

    List<QueueDepartment> findByActiveTrue();

    List<QueueDepartment> findByDepartmentNameContainingIgnoreCase(
            String departmentName
    );
}
