package ma.cinecamera.service;

import java.io.IOException;
import java.util.List;

import ma.cinecamera.dto.req.RolesDto;
import ma.cinecamera.dto.req.UserReqDto;
import ma.cinecamera.dto.resp.GlobalResp;
import ma.cinecamera.dto.resp.UserRespDto;
import ma.cinecamera.model.User;

public interface IUserService {

    User getById(Long id);

    List<UserRespDto> getAll(Integer page, Integer size);

    UserRespDto getDetail(Long id);

    UserRespDto update(Long id, UserReqDto dto) throws IOException;

    GlobalResp delete(Long id);

    GlobalResp assignRoles(Long id, RolesDto dto);

    UserRespDto getMyAccount();

    UserRespDto updateMyAccount(UserReqDto dto) throws IOException;

    GlobalResp deleteMyAccount();

}
