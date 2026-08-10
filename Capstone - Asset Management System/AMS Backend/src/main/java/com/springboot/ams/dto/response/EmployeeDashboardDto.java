package com.springboot.ams.dto.response;

public record EmployeeDashboardDto(
        long myAllocatedAssets,
        long myPendingRequests,
        long myOpenServiceRequests,
        long myResolvedServiceRequests
) {
}
