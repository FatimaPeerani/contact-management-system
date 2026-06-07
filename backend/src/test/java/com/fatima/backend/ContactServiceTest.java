package com.fatima.backend;

import com.fatima.backend.model.Contact;
import com.fatima.backend.repository.ContactRepository;
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

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ContactServiceTest {

    @Mock
    private ContactRepository contactRepository;

    @InjectMocks
    private ContactService contactService;

    @Test
    void testGetAllContacts() {
        Contact contact = new Contact();
        contact.setId(1L);
        contact.setFirstName("Ali");

        Page<Contact> page = new PageImpl<>(List.of(contact));
        PageRequest pageRequest = PageRequest.of(0, 10);

        when(contactRepository.findAll(pageRequest)).thenReturn(page);

        Page<Contact> result = contactService.getAllContacts("test@mail.com", pageRequest);

        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        verify(contactRepository, times(1)).findAll(pageRequest);
    }

    @Test
    void testCreateContact() {
        Contact contact = new Contact();
        contact.setFirstName("Sara");

        when(contactRepository.save(any(Contact.class))).thenReturn(contact);

        Contact result = contactService.createContact("test@mail.com", contact);

        assertNotNull(result);
        assertEquals("Sara", result.getFirstName());
        verify(contactRepository, times(1)).save(any(Contact.class));
    }

    @Test
    void testUpdateContact() {
        Contact contact = new Contact();
        contact.setFirstName("Updated");

        when(contactRepository.save(any(Contact.class))).thenReturn(contact);

        Contact result = contactService.updateContact("test@mail.com", 1L, contact);

        assertNotNull(result);
        assertEquals(1L, contact.getId());
        verify(contactRepository, times(1)).save(contact);
    }

    @Test
    void testDeleteContact() {
        doNothing().when(contactRepository).deleteById(1L);

        contactService.deleteContact("test@mail.com", 1L);

        verify(contactRepository, times(1)).deleteById(1L);
    }

    @Test
    void testSearchContacts() {
        Page<Contact> page = new PageImpl<>(List.of(new Contact()));
        PageRequest pageRequest = PageRequest.of(0, 10);

        when(contactRepository.findAll(pageRequest)).thenReturn(page);

        Page<Contact> result = contactService.searchContacts("test@mail.com", "Ali", pageRequest);

        assertNotNull(result);
        verify(contactRepository, times(1)).findAll(pageRequest);
    }
}