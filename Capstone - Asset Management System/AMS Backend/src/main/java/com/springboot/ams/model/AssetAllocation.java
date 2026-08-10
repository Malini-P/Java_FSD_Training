package com.springboot.ams.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Entity
@Getter
@Setter
@Table(name = "asset_allocations")
public class AssetAllocation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnore
    private User employee;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnore
    private Asset asset;

    @CreationTimestamp
    @Column(updatable = false)
    private Instant allocatedAt;

    private Instant returnedAt;

    private boolean returned;
}
