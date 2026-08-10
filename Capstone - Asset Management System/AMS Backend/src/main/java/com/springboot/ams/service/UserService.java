package com.springboot.ams.service;

import com.springboot.ams.dto.request.UserDto;
import com.springboot.ams.dto.response.UserRespDto;
import com.springboot.ams.exception.ResourceNotFoundException;
import com.springboot.ams.mapper.UserMapper;
import com.springboot.ams.model.User;
import com.springboot.ams.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

/*
 * To create a bean in spring boot we can use following annotations
 * for services class use @Service
 * for repositories , use @Repository
 * for all other classes including util use @Component
 * */
@Service
@AllArgsConstructor
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private static final Logger logger = LoggerFactory.getLogger(UserService.class);
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        logger.info("Fetching user details by given username {}", username);
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Invalid Credentials"));
        logger.info("User Details fetched for user {}", user.getUsername());
        return user;
    }

    public List<UserRespDto> getAll() {
        return userRepository.findAll()
                .stream()
                .map(userMapper::entityToDto)
                .toList();
    }

    public UserRespDto addUser(UserDto dto) {
        User user = userMapper.dtoToEntity(dto);
        // Encode password before saving
        user.setPassword(passwordEncoder.encode(dto.password()));
        User saved = userRepository.save(user);
        return userMapper.entityToDto(saved);
    }

    public User getById(int id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Invalid user id"));
    }

    public UserRespDto getUserById(int id) {
        return userMapper.entityToDto(getById(id));
    }

    public User getByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));
    }

    public UserRespDto updateUser(int id, UserDto dto) {
        User existingUser = getById(id);
        existingUser.setUsername(dto.username());
        existingUser.setPassword(passwordEncoder.encode(dto.password()));
        existingUser.setRole(dto.role());
        User saved = userRepository.save(existingUser);
        return userMapper.entityToDto(saved);
    }

    public User saveUser(User user) {
        return userRepository.save(user);
    }

    public long countAll() {
        return userRepository.count();
    }

    public void deleteUser(int id) {
        getById(id);
        userRepository.deleteById(id);
    }
}
