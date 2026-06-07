package com.fatima.backend.service;

import com.fatima.backend.model.Contact;
import com.fatima.backend.repository.ContactRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@SuppressWarnings("java:S1172")
public class ContactService {

    private final ContactRepository contactRepository;

    public Contact createContact(String email, Contact contact) {
        return contactRepository.save(contact);
    }

    public Contact updateContact(String email, Long id, Contact contact) {
        contact.setId(id);
        return contactRepository.save(contact);
    }

    public void deleteContact(String email, Long id) {
        contactRepository.deleteById(id);
    }

    public Page<Contact> getAllContacts(String email, Pageable pageable) {
        return contactRepository.findAll(pageable);
    }

    public Page<Contact> searchContacts(String email, String keyword, Pageable pageable) {
        return contactRepository.findAll(pageable);
    }
}