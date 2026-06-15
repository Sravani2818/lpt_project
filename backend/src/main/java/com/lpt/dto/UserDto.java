package com.lpt.dto;

public record UserDto(
        Integer id,
        String email_id,
        String fullname,
        String phone,
        Short role,
        Short status) {}
