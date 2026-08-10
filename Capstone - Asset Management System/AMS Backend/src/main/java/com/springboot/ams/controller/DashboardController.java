package com.springboot.ams.controller;

import com.springboot.ams.dto.response.AdminDashboardDto;
import com.springboot.ams.dto.response.EmployeeDashboardDto;
import com.springboot.ams.service.DashboardService;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "http://localhost:5173")
public class DashboardController {

    private final DashboardService dashboardService;

    // Admin dashboard stats
    @GetMapping("/admin-stats")
    public AdminDashboardDto getAdminStats() {
        return dashboardService.getAdminStats();
    }

    // Employee dashboard stats — uses Principal so no need to pass username in request
    @GetMapping("/employee-stats")
    public EmployeeDashboardDto getEmployeeStats(Principal principal) {
        return dashboardService.getEmployeeStats(principal.getName());
    }
}