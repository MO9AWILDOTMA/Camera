package ma.cinecamera.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import ma.cinecamera.dto.resp.ActivityResp;
import ma.cinecamera.model.Activity;

@Mapper(componentModel = "spring")
public interface ActivityMapper {
    @Mapping(target = "id", source = "entity.id")
    @Mapping(target = "createdAt", source = "entity.createdAt")
    @Mapping(target = "updatedAt", source = "entity.updatedAt")
    List<ActivityResp> entitiesToDto(List<Activity> entities);
}
