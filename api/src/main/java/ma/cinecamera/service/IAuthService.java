package ma.cinecamera.service;

import javax.servlet.http.HttpServletResponse;

import org.springframework.web.bind.annotation.RequestBody;

import ma.cinecamera.dto.req.LoginDto;
import ma.cinecamera.dto.req.RegisterDto;
import ma.cinecamera.dto.resp.GlobalResp;
import ma.cinecamera.dto.resp.UserRespDto;

public interface IAuthService {
    UserRespDto registerHandler(RegisterDto user);

    public UserRespDto loginHandler(@RequestBody LoginDto body, HttpServletResponse resp);

    public GlobalResp logoutHandler(HttpServletResponse resp);
}
