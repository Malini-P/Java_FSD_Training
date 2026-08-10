package com.springboot.ams.utility;

import com.springboot.ams.exception.FileInvalidExtensionException;
import com.springboot.ams.exception.FileNotFoundException;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public class FileUtility {

    private FileUtility() {
    }

    public static void validateFile(MultipartFile file) {

        if (file.isEmpty()) {
            throw new FileNotFoundException("Please select file to upload");
        }
        List<String> allowedExts = List.of("png", "jpeg", "jpg");
        String filename = file.getOriginalFilename();
        String ext = filename.split("\\.")[1];

        if (!allowedExts.contains(ext)) {
            throw new FileInvalidExtensionException(ext + " not allowed");
        }
    }
}