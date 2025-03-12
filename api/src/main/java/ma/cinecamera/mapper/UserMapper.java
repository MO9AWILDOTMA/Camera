package ma.cinecamera.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import ma.cinecamera.dto.req.RegisterDto;
import ma.cinecamera.dto.req.UserReqDto;
import ma.cinecamera.dto.resp.UserRespDto;
import ma.cinecamera.model.User;

@Mapper(componentModel = "spring")
public interface UserMapper {
    @Mapping(target = "id", source = "entity.id")
    @Mapping(target = "createdAt", source = "entity.createdAt")
    @Mapping(target = "updatedAt", source = "entity.updatedAt")
    UserRespDto entityToDto(User entity);

    User DtoToEntity(UserReqDto dto);

    User DtoToEntity(RegisterDto dto);

    List<UserRespDto> entitiesToDto(List<User> users);
}
