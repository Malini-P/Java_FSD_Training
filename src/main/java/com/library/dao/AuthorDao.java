package com.library.dao;

import com.library.model.Author;

import java.util.List;

public interface AuthorDao {
    Author saveAuthor(Author author);

    Author getById(int id);

    List<Author> getAll();

    void deleteById(int id);

    Author update(Author author);
}