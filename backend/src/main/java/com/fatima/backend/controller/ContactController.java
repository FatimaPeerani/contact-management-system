package com.fatima.backend.controller;

import com.fatima.backend.dto.ContactDTO;
import com.fatima.backend.model.Contact;
import com.fatima.backend.service.ContactService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/contacts")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class ContactController {

    private final ContactService contactService;

    @GetMapping
    public ResponseEntity<Page<Contact>> getAllContacts(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(
                contactService.getAllContacts(userDetails.getUsername(), pageable)
        );
    }

    @GetMapping("/search")
    public ResponseEntity<Page<Contact>> searchContacts(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(
                contactService.searchContacts(userDetails.getUsername(), keyword, pageable)
        );
    }

    @PostMapping
    public ResponseEntity<Contact> createContact(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody ContactDTO dto) {

        Contact contact = new Contact();
        contact.setFirstName(dto.getFirstName());
        contact.setLastName(dto.getLastName());  // ✅ fixed
        contact.setTitle(dto.getTitle());         // ✅ fixed

        return ResponseEntity.ok(
                contactService.createContact(userDetails.getUsername(), contact)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<Contact> updateContact(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @RequestBody ContactDTO dto) {

        Contact contact = new Contact();
        contact.setFirstName(dto.getFirstName());
        contact.setLastName(dto.getLastName());  // ✅ fixed
        contact.setTitle(dto.getTitle());         // ✅ fixed

        return ResponseEntity.ok(
                contactService.updateContact(userDetails.getUsername(), id, contact)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteContact(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {

        contactService.deleteContact(userDetails.getUsername(), id);
        return ResponseEntity.ok("Contact deleted successfully!");
    }
}