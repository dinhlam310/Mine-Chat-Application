package com.example.minechatapplication.entity;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "account")
public class Account {

    @Id
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name = "name" ,nullable = false)
    private String name;

}
