package com.fatima.backend.service;

import com.fatima.backend.model.Contact;
import com.fatima.backend.model.User;
import com.fatima.backend.repository.ContactRepository;
import com.fatima.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@SuppressWarnings("java:S1172")
public class ContactService {

    private final ContactRepository contactRepository;
    private final UserRepository userRepository;

    public Contact createContact(String email, Contact contact) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found!"));
        contact.setUser(user);
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
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found!"));
        return contactRepository.findByUserId(user.getId(), pageable); // ✅ fixed
    }

    public Page<Contact> searchContacts(String email, String keyword, Pageable pageable) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found!"));
        return contactRepository
                .findByUserIdAndFirstNameContainingIgnoreCaseOrUserIdAndLastNameContainingIgnoreCase(
                        user.getId(), keyword, user.getId(), keyword, pageable // ✅ fixed
                );
    }
}