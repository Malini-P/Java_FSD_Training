package com.springboot.ams.service;

import com.springboot.ams.exception.InvalidFilePathException;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

class InvalidFilePathExceptionTest {
    @Test
    void invalidFilePathExceptionTest() {

        InvalidFilePathException ex =
                new InvalidFilePathException("Invalid path");

        assertThat(ex.getMessage())
                .isEqualTo("Invalid path");
    }
}
