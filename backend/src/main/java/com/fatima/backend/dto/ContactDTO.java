package com.fatima.backend.dto;

import lombok.Data;

@Data
public class ContactDTO {
    private String firstName;
    private String lastName;  // ✅ ADD
    private String title;     // ✅ ADD
}