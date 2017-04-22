package ro.devacademy.musicplayer;

import java.util.List;

import retrofit2.Call;
import retrofit2.http.GET;
import ro.devacademy.musicplayer.models.CaptionImage;

/**
 * Created by razvan on 01.03.2017.
 */

public interface CaptionAPI {
    @GET("/images")
    public Call<List<CaptionImage>> loadImages();
}
