package com.example.minechatapplication.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "chat")
public class Chat {

    @Id
    @Column(name = "id", nullable = false)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account1_id", nullable = false)
    private Account account1;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account2_id", nullable = false)
    private Account account2;

    @JsonIgnore
    @OneToMany(mappedBy = "chat", fetch = FetchType.LAZY)
    private List<Message> messages;

}
