package com.springboot.ams.mapper;

import com.springboot.ams.dto.request.UserDto;
import com.springboot.ams.dto.response.UserRespDto;
import com.springboot.ams.model.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public User dtoToEntity(UserDto dto) {
        User user = new User();
        user.setUsername(dto.username());
        user.setPassword(dto.password());
        user.setRole(dto.role());
        return user;
    }

    public UserRespDto entityToDto(User user) {
        return new UserRespDto(
                user.getId(),
                user.getUsername(),
                user.getRole(),
                user.getCreatedAt()
        );
    }
}
