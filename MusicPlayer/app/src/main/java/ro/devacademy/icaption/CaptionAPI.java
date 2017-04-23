package ro.devacademy.icaption;

import java.util.List;

import bolts.Task;
import retrofit2.Call;
import retrofit2.http.GET;
import retrofit2.http.Header;
import ro.devacademy.icaption.models.CaptionImage;

/**
 * Created by razvan on 01.03.2017.
 */

public interface CaptionAPI {
    @GET("/images")
//    public Call<List<CaptionImage>> loadImages(@Header("Authorization") String auth);
    public Call<List<CaptionImage>> loadImages();
}
