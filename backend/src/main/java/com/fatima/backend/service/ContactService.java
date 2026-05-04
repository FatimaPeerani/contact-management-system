package com.fatima.backend.service;

import com.fatima.backend.exception.ResourceNotFoundException;
import com.fatima.backend.model.Contact;
import com.fatima.backend.model.User;
import com.fatima.backend.repository.ContactRepository;
import com.fatima.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class ContactService {

    private final ContactRepository contactRepository;
    private final UserRepository userRepository;

    public Page<Contact> getAllContacts(String email, Pageable pageable) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found!"));
        log.info("Fetching all contacts for user: {}", email);
        return contactRepository.findByUserId(user.getId(), pageable);
    }

    public Page<Contact> searchContacts(String email, String keyword, Pageable pageable) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found!"));
        log.info("Searching contacts for user: {} with keyword: {}", email, keyword);
        return contactRepository
                .findByUserIdAndFirstNameContainingIgnoreCaseOrUserIdAndLastNameContainingIgnoreCase(
                        user.getId(), keyword, user.getId(), keyword, pageable);
    }

    public Contact createContact(String email, Contact contact) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found!"));
        contact.setUser(user);
        if (contact.getEmails() != null) {
            contact.getEmails().forEach(e -> e.setContact(contact));
        }
        if (contact.getPhones() != null) {
            contact.getPhones().forEach(p -> p.setContact(contact));
        }
        log.info("Creating contact for user: {}", email);
        return contactRepository.save(contact);
    }

    public Contact updateContact(String email, Long contactId, Contact updatedContact) {
        Contact contact = contactRepository.findById(contactId)
                .orElseThrow(() -> new ResourceNotFoundException("Contact not found!"));
        if (!contact.getUser().getEmail().equals(email)) {
            throw new RuntimeException("Unauthorized!");
        }
        contact.setFirstName(updatedContact.getFirstName());
        contact.setLastName(updatedContact.getLastName());
        contact.setTitle(updatedContact.getTitle());
        log.info("Updating contact: {} for user: {}", contactId, email);
        return contactRepository.save(contact);
    }

    public void deleteContact(String email, Long contactId) {
        Contact contact = contactRepository.findById(contactId)
                .orElseThrow(() -> new ResourceNotFoundException("Contact not found!"));
        if (!contact.getUser().getEmail().equals(email)) {
            throw new RuntimeException("Unauthorized!");
        }
        log.info("Deleting contact: {} for user: {}", contactId, email);
        contactRepository.delete(contact);
    }
}
