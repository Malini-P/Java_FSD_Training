package com.library;

import com.library.config.HibernateConfig;
import com.library.dao.*;
import com.library.dao.impl.*;
import com.library.dto.EventRegistrationDto;
import com.library.enums.*;
import com.library.model.*;

import java.time.Instant;
import java.util.Arrays;
import java.util.List;
import java.util.Scanner;

public class LibraryApp {

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        AuthorDao authorDao = new AuthorDaoImpl();
        MemberDao memberDao = new MemberDaoImpl();
        BookDao bookDao = new BookDaoImpl();
        LibraryEventDao eventDao = new LibraryEventDaoImpl();
        EventRegistrationDao registrationDao = new EventRegistrationDaoImpl();

        while (true) {
            System.out.println("--------------Library Ops------------");
            System.out.println("1. Insert Author");
            System.out.println("2. Insert Member");
            System.out.println("3. Insert Book");
            System.out.println("4. Get Book by Id");
            System.out.println("5. Get all Books");
            System.out.println("6. Delete Book");
            System.out.println("7. Update Book Status");
            System.out.println("8. Fetch Books by Author (HQL)");
            System.out.println("9. Fetch Books by Author (Native SQL)");
            System.out.println("10. Fetch Books Borrowed by Member");
            System.out.println("11. Filter Books by Genre / Status (Criteria API)");
            System.out.println("12. Insert Library Event");
            System.out.println("13. Register Member for Event");
            System.out.println("14. Fetch Registrations for Event");
            System.out.println("15. Fetch No-Shows for Event");
            System.out.println("16. Fetch Registrations for Event as DTO");
            System.out.println("0. To Exit");
            System.out.println("------------------------------------");
            int input = sc.nextInt();
            if (input == 0) {
                System.out.println("Exiting..");
                break;
            }
            switch (input) {
                case 1 -> {
                    System.out.println("--------Insert Author----------");
                    try {
                        Author author = new Author();
                        author.setName("R.K. Narayan");
                        author.setCountry("India");
                        author = authorDao.saveAuthor(author);
                        System.out.println("Author Inserted in DB");
                        System.out.println(author);
                    } catch (RuntimeException e) {
                        System.out.println("Insert op could not go thru " + e.getMessage());
                    }
                }
                case 2 -> {
                    System.out.println("--------Insert Member----------");
                    try {
                        Member member = new Member();
                        member.setName("Malini");
                        member.setEmail("malini" + System.currentTimeMillis() + "@example.com");
                        member.setMembershipType(MembershipType.PREMIUM);
                        member = memberDao.saveMember(member);
                        System.out.println("Member Inserted in DB");
                        System.out.println(member);
                    } catch (RuntimeException e) {
                        System.out.println("Insert op could not go thru " + e.getMessage());
                    }
                }
                case 3 -> {
                    System.out.println("--------Insert Book----------");
                    System.out.println("Enter Author id: ");
                    int authorId = sc.nextInt();
                    try {
                        Author author = authorDao.getById(authorId);
                        if (author == null) {
                            System.out.println("No author found for id: " + authorId);
                            break;
                        }
                        Book book = new Book();
                        book.setTitle("Swami and Friends");
                        book.setGenre(Genre.FICTION);
                        book.setStatus(BookStatus.AVAILABLE);
                        book.setAuthor(author);
                        book.setPublishedYear(1935);
                        book = bookDao.saveBook(book);
                        System.out.println("Book Inserted in DB");
                        System.out.println(book);
                    } catch (RuntimeException e) {
                        System.out.println("Insert op could not go thru " + e.getMessage());
                    }
                }
                case 4 -> {
                    System.out.println("---Book by ID---");
                    System.out.println("Enter book id: ");
                    int id = sc.nextInt();
                    Book book = bookDao.getById(id);
                    if (book == null)
                        System.out.println("Book not found... ");
                    else {
                        System.out.println("Book fetched for id " + id);
                        System.out.println(book);
                    }
                }
                case 5 -> {
                    List<Book> list = bookDao.getAll();
                    list.forEach(System.out::println);
                }
                case 6 -> {
                    System.out.println("Enter id to delete");
                    int id = sc.nextInt();
                    try {
                        bookDao.deleteById(id);
                        System.out.println("Book deleted");
                    } catch (RuntimeException e) {
                        System.out.println("Could not delete book: " + e.getMessage());
                    }
                }
                case 7 -> {
                    System.out.println("Enter id of book to update ");
                    int id = sc.nextInt();
                    Book book = bookDao.getById(id);
                    if (book == null) {
                        System.out.println("Book not found");
                        break;
                    }
                    System.out.println("Current Book: ");
                    System.out.println(book);
                    System.out.println("Enter member id who is borrowing this book: ");
                    int memberId = sc.nextInt();
                    Member member = memberDao.getById(memberId);
                    book.setStatus(BookStatus.BORROWED);
                    book.setBorrowedBy(member);
                    book = bookDao.update(book);
                    System.out.println("Book updated");
                    System.out.println(book);
                }
                case 8 -> {
                    System.out.println("Enter author id: ");
                    int authorId = sc.nextInt();
                    List<Book> list = bookDao.getByAuthor(authorId);
                    if (list.isEmpty())
                        System.out.println("No books to show for this author...");
                    list.forEach(System.out::println);
                }
                case 9 -> {
                    System.out.println("Enter author id: ");
                    int authorId = sc.nextInt();
                    List<Book> list = bookDao.getByAuthorV2(authorId);
                    if (list.isEmpty())
                        System.out.println("No books to show for this author...");
                    list.forEach(System.out::println);
                }
                case 10 -> {
                    System.out.println("Enter member id: ");
                    int memberId = sc.nextInt();
                    List<Book> list = bookDao.getByBorrower(memberId);
                    if (list.isEmpty())
                        System.out.println("No books borrowed by this member...");
                    list.forEach(System.out::println);
                }
                case 11 -> {
                    List<Book> list = bookDao.filterBooks(Genre.FICTION, null);
                    list.forEach(System.out::println);
                }
                case 12 -> {
                    System.out.println("--------Insert Library Event----------");
                    try {
                        LibraryEvent event = new LibraryEvent();
                        event.setTitle("Meet the Author: R.K. Narayan");
                        event.setEventDate(Instant.now());
                        event.setEventType(EventType.AUTHOR_TALK);
                        event = eventDao.saveEvent(event);
                        System.out.println("Event Inserted in DB");
                        System.out.println(event);
                    } catch (RuntimeException e) {
                        System.out.println("Insert op could not go thru " + e.getMessage());
                    }
                }
                case 13 -> {
                    System.out.println("Enter member id: ");
                    int memberId = sc.nextInt();
                    System.out.println("Enter event id: ");
                    int eventId = sc.nextInt();
                    try {
                        Member member = memberDao.getById(memberId);
                        LibraryEvent event = eventDao.getById(eventId);
                        if (member == null || event == null) {
                            System.out.println("Invalid member or event id");
                            break;
                        }
                        EventRegistration registration = new EventRegistration();
                        registration.setMember(member);
                        registration.setEvent(event);
                        registration.setAttendanceStatus(AttendanceStatus.REGISTERED);
                        registration = registrationDao.saveRegistration(registration);
                        System.out.println("Registration created");
                        System.out.println(registration);
                    } catch (RuntimeException e) {
                        System.out.println("Registration could not go thru " + e.getMessage());
                    }
                }
                case 14 -> {
                    System.out.println("Enter event id: ");
                    int eventId = sc.nextInt();
                    List<EventRegistration> list = registrationDao.findRegistrationsForEvent(eventId);
                    if (list.isEmpty())
                        System.out.println("No registrations found for this event...");
                    list.forEach(System.out::println);
                }
                case 15 -> {
                    System.out.println("Enter event id: ");
                    int eventId = sc.nextInt();
                    List<Member> list = registrationDao.findNoShowsForEvent(eventId);
                    if (list.isEmpty())
                        System.out.println("No no-shows found for this event...");
                    list.forEach(System.out::println);
                }
                case 16 -> {
                    System.out.println("Enter event id: ");
                    int eventId = sc.nextInt();
                    List<EventRegistrationDto> list = registrationDao.findRegistrationsForEventAsDto(eventId);
                    if (list.isEmpty())
                        System.out.println("No registrations found for this event...");
                    list.forEach(System.out::println);
                }
            }
        }

        HibernateConfig.closeFactory();
        sc.close();
    }
}