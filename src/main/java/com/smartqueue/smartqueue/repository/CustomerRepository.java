
package com.smartqueue.smartqueue.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.smartqueue.smartqueue.entity.Customer;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {

    Customer findByPhone(String phone);

    boolean existsByPhone(String phone);
}
