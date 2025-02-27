package ma.cinecamera.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import ma.cinecamera.dto.req.ScreeningRoomReqDto;
import ma.cinecamera.dto.resp.GlobalResp;
import ma.cinecamera.dto.resp.ScreeningRoomRespDto;
import ma.cinecamera.exception.ResourceNotFoundException;
import ma.cinecamera.mapper.ScreeningRoomMapper;
import ma.cinecamera.model.ScreeningRoom;
import ma.cinecamera.repository.ScreeningRoomRepository;
import ma.cinecamera.service.IScreeningRoomService;

public class ScreeningRoomService implements IScreeningRoomService {

    @Autowired
    private ScreeningRoomRepository repository;

    @Autowired
    private ScreeningRoomMapper mapper;

    @Override
    public ScreeningRoom getById(Long id) {
	return repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Screening Room Not Found"));
    }

    @Override
    public List<ScreeningRoomRespDto> getAllScreeningRooms(Integer page, Integer size) {
	page = page > 0 ? page - 1 : 0;
	size = size < 3 ? 3 : size;
	Pageable pageable = PageRequest.of(page, size);
	List<ScreeningRoom> sRooms = repository.findAll(pageable).getContent();
	return mapper.entitiesToDto(sRooms));
    }

    @Override
    public ScreeningRoomRespDto getScreeningRoomDetail(Long id) {
	return mapper.entityToDto(getById(id));
    }

    @Override
    public ScreeningRoomRespDto createScreeningRoom(ScreeningRoomReqDto dto) {
	// TODO Auto-generated method stub
	return null;
    }

    @Override
    public ScreeningRoomRespDto updateScreeningRoom(Long id, ScreeningRoomReqDto dto) {
	// TODO Auto-generated method stub
	return null;
    }

    @Override
    public GlobalResp deleteScreeningRoom(Long id) {
	ScreeningRoom sRoom = getById(id);
    }

}
