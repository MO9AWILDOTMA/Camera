package ma.cinecamera.service;

import java.util.List;

import ma.cinecamera.dto.resp.ActivityResp;
import ma.cinecamera.model.enums.ActivityType;

public interface IActivityService {

    List<ActivityResp> getAll(Integer page, Integer size);

    void createActivity(ActivityType type, String message);

    List<ActivityResp> getMyActivities(Long id);
}
