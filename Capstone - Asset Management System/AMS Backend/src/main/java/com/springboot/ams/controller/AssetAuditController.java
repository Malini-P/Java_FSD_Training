package com.springboot.ams.controller;

import com.springboot.ams.dto.response.AuditRespDto;
import com.springboot.ams.service.AssetAuditService;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/audits")
@CrossOrigin(origins = "http://localhost:5173")
public class AssetAuditController {

    private final AssetAuditService auditService;

    @PostMapping("/send-all")
    public ResponseEntity<List<AuditRespDto>> sendAuditToAll() {
        return ResponseEntity.ok(auditService.sendAuditToAll());
    }

    @GetMapping("/all")
    public ResponseEntity<List<AuditRespDto>> getAllAudits() {
        return ResponseEntity.ok(auditService.getAllAudits());
    }

    @GetMapping("/my")
    public ResponseEntity<List<AuditRespDto>> getMyAudits(Principal principal) {
        return ResponseEntity.ok(auditService.getMyAudits(principal.getName()));
    }

    @PutMapping("/{id}/verify")
    public ResponseEntity<AuditRespDto> verifyAudit(@PathVariable int id) {
        return ResponseEntity.ok(auditService.verifyAudit(id));
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<AuditRespDto> rejectAudit(@PathVariable int id) {
        return ResponseEntity.ok(auditService.rejectAudit(id));
    }
}
