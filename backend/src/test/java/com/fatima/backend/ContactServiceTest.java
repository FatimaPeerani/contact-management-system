package com.fatima.backend;

import com.fatima.backend.model.Contact;
import com.fatima.backend.model.User;
import com.fatima.backend.repository.ContactRepository;
import com.fatima.backend.repository.UserRepository;
import com.fatima.backend.service.ContactService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ContactServiceTest {

    @Mock
    private ContactRepository contactRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private ContactService contactService;

    @Test
    void testGetAllContacts() {
        User user = new User();
        user.setId(1L);
        user.setEmail("fatima@test.com");

        Contact contact = new Contact();
        contact.setFirstName("Ali");
        contact.setLastName("Khan");

        Page<Contact> page = new PageImpl<>(List.of(contact));

        when(userRepository.findByEmail(any())).thenReturn(Optional.of(user));
        when(contactRepository.findByUserId(any(), any())).thenReturn(page);

        Page<Contact> result = contactService.getAllContacts("fatima@test.com", PageRequest.of(0, 10));

        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
    }

    @Test
    void testCreateContact() {
        User user = new User();
        user.setId(1L);
        user.setEmail("fatima@test.com");

        Contact contact = new Contact();
        contact.setFirstName("Sara");
        contact.setLastName("Ahmed");

        when(userRepository.findByEmail(any())).thenReturn(Optional.of(user));
        when(contactRepository.save(any())).thenReturn(contact);

        Contact result = contactService.createContact("fatima@test.com", contact);

        assertNotNull(result);
        assertEquals("Sara", result.getFirstName());
        verify(contactRepository, times(1)).save(any());
    }

    @Test
    void testDeleteContact() {
        User user = new User();
        user.setEmail("fatima@test.com");

        Contact contact = new Contact();
        contact.setId(1L);
        contact.setUser(user);

        when(contactRepository.findById(1L)).thenReturn(Optional.of(contact));

        contactService.deleteContact("fatima@test.com", 1L);

        verify(contactRepository, times(1)).delete(contact);
    }
}
