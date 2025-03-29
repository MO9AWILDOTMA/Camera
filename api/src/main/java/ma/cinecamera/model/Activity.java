package ma.cinecamera.model;

import java.time.LocalDateTime;

import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import ma.cinecamera.model.enums.ActivityType;

@Getter
@Setter
@Builder
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "activities")
public class Activity extends BaseEntity {
    private String title;
    private String description;
    private LocalDateTime time;
    @Enumerated(EnumType.STRING)
    private ActivityType type;
}
