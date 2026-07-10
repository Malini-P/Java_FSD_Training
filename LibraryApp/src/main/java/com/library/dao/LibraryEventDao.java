package com.library.dao;

import com.library.model.LibraryEvent;

import java.util.List;

public interface LibraryEventDao {
    LibraryEvent saveEvent(LibraryEvent event);

    LibraryEvent getById(int id);

    List<LibraryEvent> getAll();

    void deleteById(int id);

    LibraryEvent update(LibraryEvent event);
}