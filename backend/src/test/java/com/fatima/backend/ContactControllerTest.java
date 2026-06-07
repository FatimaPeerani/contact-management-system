package com.fatima.backend;

import com.fatima.backend.dto.ContactDTO;
import com.fatima.backend.model.Contact;
import com.fatima.backend.service.ContactService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class ContactControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private ContactService contactService;

    @Test
    @WithMockUser(username = "test@mail.com")
    void testGetContacts() throws Exception {
        Page<Contact> page = new PageImpl<>(List.of(new Contact()));
        when(contactService.getAllContacts(anyString(), any(Pageable.class))).thenReturn(page);

        mockMvc.perform(get("/api/contacts")
                        .param("page", "0")
                        .param("size", "10"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(username = "test@mail.com")
    void testSearchContacts() throws Exception {
        Page<Contact> page = new PageImpl<>(List.of(new Contact()));
        when(contactService.searchContacts(anyString(), anyString(), any(Pageable.class))).thenReturn(page);

        mockMvc.perform(get("/api/contacts/search")
                        .param("keyword", "Ali")
                        .param("page", "0")
                        .param("size", "10"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(username = "test@mail.com")
    void testCreateContact() throws Exception {
        Contact contact = new Contact();
        contact.setFirstName("Ali");

        ContactDTO dto = new ContactDTO();
        dto.setFirstName("Ali");

        when(contactService.createContact(anyString(), any(Contact.class))).thenReturn(contact);

        mockMvc.perform(post("/api/contacts")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(username = "test@mail.com")
    void testUpdateContact() throws Exception {
        Contact contact = new Contact();
        contact.setFirstName("Updated");

        ContactDTO dto = new ContactDTO();
        dto.setFirstName("Updated");

        when(contactService.updateContact(anyString(), anyLong(), any(Contact.class))).thenReturn(contact);

        mockMvc.perform(put("/api/contacts/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(username = "test@mail.com")
    void testDeleteContact() throws Exception {
        doNothing().when(contactService).deleteContact(anyString(), anyLong());

        mockMvc.perform(delete("/api/contacts/1"))
                .andExpect(status().isOk());
    }
}