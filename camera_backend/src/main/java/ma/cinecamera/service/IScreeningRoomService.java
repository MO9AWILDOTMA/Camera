package ma.cinecamera.service;

import java.util.List;

import ma.cinecamera.dto.req.ScreeningRoomReqDto;
import ma.cinecamera.dto.resp.GlobalResp;
import ma.cinecamera.dto.resp.ScreeningRoomRespDto;
import ma.cinecamera.model.ScreeningRoom;

public interface IScreeningRoomService {

    ScreeningRoom getById(Long id);

    List<ScreeningRoomRespDto> getAllScreeningRooms(Integer page, Integer size);

    ScreeningRoomRespDto getScreeningRoomDetail(Long id);

    ScreeningRoomRespDto createScreeningRoom(ScreeningRoomReqDto dto);

    ScreeningRoomRespDto updateScreeningRoom(Long id, ScreeningRoomReqDto dto);

    GlobalResp deleteScreeningRoom(Long id);

}
