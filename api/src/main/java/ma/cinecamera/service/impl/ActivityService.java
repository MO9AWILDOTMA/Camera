package ma.cinecamera.service.impl;

import java.time.LocalDateTime;
import java.util.List;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import ma.cinecamera.dto.resp.ActivityResp;
import ma.cinecamera.mapper.ActivityMapper;
import ma.cinecamera.model.Activity;
import ma.cinecamera.model.enums.ActivityType;
import ma.cinecamera.repository.ActivityRepository;
import ma.cinecamera.service.IActivityService;

@Service
public class ActivityService implements IActivityService {

    @Autowired
    private ActivityRepository repository;

    @Autowired
    private ActivityMapper mapper;

    @Override
    public List<ActivityResp> getAll(Integer page, Integer size) {
	page = page > 0 ? page - 1 : 0;
	size = size < 3 ? 3 : size;
	Pageable pageable = PageRequest.of(page, size);
	List<Activity> res = repository.findAllByOrderByTimeDesc(pageable).getContent();
	return mapper.entitiesToDto(res);
    }

    @Override
    @Transactional
    public void createActivity(ActivityType type, String message) {
	String title = "";
	switch (type) {
	case MOVIE:
	    title = "New Movie Added";
	    break;
	case USER:
	    title = "New User Registered";
	    break;
	case RESERVATION:
	    title = "New Booking";
	    break;
	case SHOWTIME:
	    title = "New Showtime Added";
	    break;
	case SCREENING_ROOM:
	    title = "New Screening Room Added";
	    break;
	}

	Activity activity = Activity.builder().title(title).description(message).time(LocalDateTime.now()).build();
	repository.save(activity);

    }

}
