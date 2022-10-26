package com.kezuler.domain;

import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

import javax.persistence.*;

@Getter
@Entity
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class Alimtalk extends BaseEntity {

    @Id // primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "alimtalk_id")
    private Long id;

    @Column
    private String event;

    @Column
    private String type;

    @Column
    private String template;

    @Column
    private String content;

    @Column(columnDefinition = "TEXT")
    private String buttons;

    @Column
    private String btnType;

    @Column
    private String btnName;

    @Column
    private String pcLink;

    @Column
    private String moLink;

    @Column
    private String phone;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id")
    private Account account;


}
