
package com.smartqueue.smartqueue.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.smartqueue.smartqueue.entity.QueueDepartment;
import com.smartqueue.smartqueue.service.QueueDepartmentService;

@RestController
@RequestMapping("/api/departments")
@CrossOrigin(origins = "*")
public class QueueDepartmentController {

    private final QueueDepartmentService departmentService;

    public QueueDepartmentController(
            QueueDepartmentService departmentService) {
        this.departmentService = departmentService;
    }

    // Add department
    @PostMapping
    public QueueDepartment addDepartment(
            @RequestBody QueueDepartment department) {
        return departmentService.addDepartment(department);
    }

    // Get all departments
    @GetMapping
    public List<QueueDepartment> getAllDepartments() {
        return departmentService.getAllDepartments();
    }

    // Get active departments
    @GetMapping("/active")
    public List<QueueDepartment> getActiveDepartments() {
        return departmentService.getActiveDepartments();
    }

    // Get department by ID
    @GetMapping("/{id}")
    public QueueDepartment getDepartmentById(
            @PathVariable Long id) {
        return departmentService.getDepartmentById(id);
    }

    // Update department
    @PutMapping("/{id}")
    public QueueDepartment updateDepartment(
            @PathVariable Long id,
            @RequestBody QueueDepartment department) {
        return departmentService.updateDepartment(id, department);
    }

    // Delete department
    @DeleteMapping("/{id}")
    public String deleteDepartment(@PathVariable Long id) {
        departmentService.deleteDepartment(id);
        return "Department deleted successfully";
    }
}
