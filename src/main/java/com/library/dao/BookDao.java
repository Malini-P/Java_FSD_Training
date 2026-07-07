package com.library.dao;

import com.library.enums.BookStatus;
import com.library.enums.Genre;
import com.library.model.Book;

import java.util.List;

public interface BookDao {
    Book saveBook(Book book);

    Book getById(int id);

    List<Book> getAll();

    void deleteById(int id);

    Book update(Book book);

    List<Book> getByAuthor(int authorId);

    List<Book> getByAuthorV2(int authorId);

    List<Book> getByBorrower(int memberId);

    List<Book> filterBooks(Genre genre, BookStatus status);
}