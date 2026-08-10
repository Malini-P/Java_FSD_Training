package com.springboot.ams.model;

import com.springboot.ams.enums.AssetStatus;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Getter
@Setter
@Table(name = "assets")
public class Asset {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false)
    private String assetName;

    private String assetModel;
    private String serialNumber;
    private String imagePath;   // stores uploaded image file name e.g. laptop.jpg

    @Enumerated(EnumType.STRING)
    private AssetStatus assetStatus;

    private Instant manufacturingDate;
    private Instant expiryDate;

    @Column(precision = 10, scale = 2)
    private BigDecimal assetValue;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnore
    private AssetCategory category;

    @CreationTimestamp
    @Column(updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    private Instant updatedAt;
}
