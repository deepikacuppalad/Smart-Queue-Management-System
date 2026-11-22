
package com.smartqueue.smartqueue.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.smartqueue.smartqueue.entity.QueueDepartment;
import com.smartqueue.smartqueue.repository.QueueDepartmentRepository;

@Service
public class QueueDepartmentService {

    private final QueueDepartmentRepository departmentRepository;

    public QueueDepartmentService(
            QueueDepartmentRepository departmentRepository) {
        this.departmentRepository = departmentRepository;
    }

    // Add a new department
    public QueueDepartment addDepartment(QueueDepartment department) {
        return departmentRepository.save(department);
    }

    // Get all departments
    public List<QueueDepartment> getAllDepartments() {
        return departmentRepository.findAll();
    }

    // Get active departments
    public List<QueueDepartment> getActiveDepartments() {
        return departmentRepository.findByActiveTrue();
    }

    // Get department by ID
    public QueueDepartment getDepartmentById(Long id) {
        return departmentRepository.findById(id)
                .orElseThrow(() ->
                    new RuntimeException("Department not found")
                );
    }

    // Update department
    public QueueDepartment updateDepartment(
            Long id, QueueDepartment updatedDepartment) {

        QueueDepartment department = getDepartmentById(id);

        department.setDepartmentName(
                updatedDepartment.getDepartmentName());

        department.setDescription(
                updatedDepartment.getDescription());

        department.setActive(
                updatedDepartment.isActive());

        return departmentRepository.save(department);
    }

    // Delete department
    public void deleteDepartment(Long id) {
        QueueDepartment department = getDepartmentById(id);
        departmentRepository.delete(department);
    }
}
