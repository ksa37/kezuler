package com.kezuler.domain;

import lombok.Getter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.Column;
import javax.persistence.EntityListeners;
import javax.persistence.MappedSuperclass;
import java.time.LocalDateTime;

@Getter
@EntityListeners(AuditingEntityListener.class) //BaseEntity클래스에 Auditing 기능을 포함시킴
@MappedSuperclass //JPA Entity 클래스들이 BaseEntity을 상속할 경우 필드들(createdDate, modifiedDate)도 컬럼으로 인식하도록 함
public class BaseEntity {

    protected Boolean enabled = Boolean.TRUE;

    @CreatedDate //Entity가 생성되어 저장될 때 시간이 자동 저장
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate //조회한 Entity의 값을 변경할 때 시간이 자동 저장
    private LocalDateTime modifiedAt;

}