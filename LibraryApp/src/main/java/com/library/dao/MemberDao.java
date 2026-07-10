package com.library.dao;

import com.library.model.Member;

import java.util.List;

public interface MemberDao {
    Member saveMember(Member member);

    Member getById(int id);

    List<Member> getAll();

    void deleteById(int id);

    Member update(Member member);
}