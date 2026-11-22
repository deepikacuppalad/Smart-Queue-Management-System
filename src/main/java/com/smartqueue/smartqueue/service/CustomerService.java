
package com.smartqueue.smartqueue.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.smartqueue.smartqueue.entity.Customer;
import com.smartqueue.smartqueue.repository.CustomerRepository;

@Service
public class CustomerService {

    private final CustomerRepository customerRepository;

    public CustomerService(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    // Register a new customer
    public Customer registerCustomer(Customer customer) {

        if (customerRepository.existsByPhone(customer.getPhone())) {
            throw new RuntimeException(
                "Customer with this phone number already exists"
            );
        }

        return customerRepository.save(customer);
    }

    // Get all customers
    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    // Get customer by ID
    public Customer getCustomerById(Long id) {
        return customerRepository.findById(id)
                .orElseThrow(() ->
                    new RuntimeException("Customer not found")
                );
    }

    // Find customer by phone
    public Customer getCustomerByPhone(String phone) {
        return customerRepository.findByPhone(phone);
    }
}
