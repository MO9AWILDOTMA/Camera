package ma.cinecamera.service.impl;

import java.io.IOException;
import java.util.List;
import java.util.logging.Logger;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.github.slugify.Slugify;

import ma.cinecamera.dto.req.ScreeningRoomReqDto;
import ma.cinecamera.dto.resp.GlobalResp;
import ma.cinecamera.dto.resp.ScreeningRoomRespDto;
import ma.cinecamera.exception.ResourceNotFoundException;
import ma.cinecamera.mapper.ScreeningRoomMapper;
import ma.cinecamera.model.ScreeningRoom;
import ma.cinecamera.model.enums.MediaType;
import ma.cinecamera.repository.ScreeningRoomRepository;
import ma.cinecamera.service.IFileService;
import ma.cinecamera.service.IScreeningRoomService;

@Service
public class ScreeningRoomService implements IScreeningRoomService {

    @Autowired
    private ScreeningRoomRepository repository;

    @Autowired
    private ScreeningRoomMapper mapper;

    @Autowired
    private IFileService fileService;

    private final Logger logger = Logger.getLogger(ScreeningRoom.class.getName());

//  @Value("${screeningRoom.file.upload.directory}")
    private final String uploadDirectory = "src/main/resources/static/images/screeningRooms";

    private final Slugify slg = new Slugify();

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

	List<ScreeningRoomRespDto> respDto = mapper.entitiesToDto(sRooms);

	return respDto.stream().map(d -> {
	    d.setPicturePaths(fileService.getFilePaths(d.getId(), uploadDirectory, MediaType.SCREENING_ROOM));
	    return d;
	}).collect(Collectors.toList());
    }

    @Override
    public ScreeningRoomRespDto getScreeningRoomDetail(String slug) {
	ScreeningRoom sRoom = repository.findBySlug(slug)
		.orElseThrow(() -> new ResourceNotFoundException("Screening Room Not Found"));
	ScreeningRoomRespDto respDto = mapper.entityToDto(sRoom);

	// Set image paths in the response DTO
	String uniqueUploadDir = uploadDirectory + "/" + respDto.getId();
	respDto.setPicturePaths(fileService.getFilePaths(respDto.getId(), uniqueUploadDir, MediaType.SCREENING_ROOM));

	return respDto;
    }

    @Override
    public ScreeningRoomRespDto createScreeningRoom(ScreeningRoomReqDto dto) throws IOException {
	ScreeningRoom sRoom = mapper.DtoToEntity(dto);

	sRoom.setSlug(slg.slugify(sRoom.getName()));
	ScreeningRoom savedScreeningRoom = repository.save(sRoom);

	String uniqueUploadDir = uploadDirectory + "/" + savedScreeningRoom.getId();

	// Save associated image files
	fileService.saveFiles(dto.getImageFiles(), savedScreeningRoom.getId(), MediaType.SCREENING_ROOM,
		uniqueUploadDir);

	ScreeningRoomRespDto respDto = mapper.entityToDto(savedScreeningRoom);

	// Set image paths in the response DTO
	respDto.setPicturePaths(
		fileService.getFilePaths(savedScreeningRoom.getId(), uniqueUploadDir, MediaType.SCREENING_ROOM));

	return respDto;
    }

    @Override
    public ScreeningRoomRespDto updateScreeningRoom(Long id, ScreeningRoomReqDto dto) throws IOException {
	ScreeningRoom sRoom = getById(id);

	sRoom.setName(dto.getName());
	sRoom.setSeats(dto.getSeats());
	sRoom.setSlug(slg.slugify(sRoom.getName()));

	ScreeningRoom updatedRoom = repository.save(sRoom);

	String uniqueUploadDir = uploadDirectory + "/" + updatedRoom.getId();

	fileService.updateFiles(dto.getImageFiles(), updatedRoom.getId(), MediaType.SCREENING_ROOM, uniqueUploadDir);
	ScreeningRoomRespDto respDto = mapper.entityToDto(updatedRoom);

	// Set image paths in the response DTO
	respDto.setPicturePaths(
		fileService.getFilePaths(updatedRoom.getId(), uniqueUploadDir, MediaType.SCREENING_ROOM));

	return respDto;
    }

    @Override
    public GlobalResp deleteScreeningRoom(Long id) {
	ScreeningRoom sRoom = getById(id);
	fileService.deleteAllFiles(id, MediaType.SCREENING_ROOM);

	repository.delete(sRoom);
	return GlobalResp.builder().message("Showtime deleted succussfully").id(id).createdAt(sRoom.getCreatedAt())
		.updatedAt(sRoom.getUpdatedAt()).build();
    }

}
