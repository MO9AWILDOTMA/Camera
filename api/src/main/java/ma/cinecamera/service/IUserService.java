package ma.cinecamera.service;

import java.io.IOException;

import ma.cinecamera.dto.req.ProfileUpdateReq;
import ma.cinecamera.dto.req.RolesDto;
import ma.cinecamera.dto.resp.GlobalResp;
import ma.cinecamera.dto.resp.ListResponse;
import ma.cinecamera.dto.resp.UserRespDto;
import ma.cinecamera.model.User;

public interface IUserService {

    User getById(Long id);

    ListResponse getAll(Integer page, Integer size);

    UserRespDto getDetail(Long id);

    UserRespDto update(Long id, ProfileUpdateReq dto) throws IOException;

    GlobalResp delete(Long id);

    GlobalResp assignRoles(Long id, RolesDto dto);

    UserRespDto getMyAccount();

    UserRespDto updateMyAccount(ProfileUpdateReq dto) throws IOException;

    GlobalResp deleteMyAccount();

    Long getConnectedUserId();

}
