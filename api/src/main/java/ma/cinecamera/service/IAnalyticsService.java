package ma.cinecamera.service;

import ma.cinecamera.dto.resp.AnalyticsData;

public interface IAnalyticsService {
    AnalyticsData getAnalyticsData(Integer days);
}
