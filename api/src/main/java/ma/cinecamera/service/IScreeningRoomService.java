package ma.cinecamera.service;

import java.io.IOException;

import ma.cinecamera.dto.req.ScreeningRoomReqDto;
import ma.cinecamera.dto.resp.GlobalResp;
import ma.cinecamera.dto.resp.ListResponse;
import ma.cinecamera.dto.resp.ScreeningRoomRespDto;
import ma.cinecamera.model.ScreeningRoom;

public interface IScreeningRoomService {

    ScreeningRoom getById(Long id);

    ListResponse getAllScreeningRooms(Integer page, Integer size);

    ScreeningRoomRespDto getScreeningRoomDetail(String slug);

    ScreeningRoomRespDto createScreeningRoom(ScreeningRoomReqDto dto) throws IOException;

    ScreeningRoomRespDto updateScreeningRoom(Long id, ScreeningRoomReqDto dto) throws IOException;

    GlobalResp deleteScreeningRoom(Long id);

}
