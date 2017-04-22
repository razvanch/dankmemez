package ro.devacademy.musicplayer;

import android.graphics.Bitmap;
import android.graphics.drawable.Drawable;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.squareup.picasso.Picasso;
import com.squareup.picasso.Target;

import org.w3c.dom.Text;

import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;
import ro.devacademy.musicplayer.models.CaptionImage;

public class MainActivity extends AppCompatActivity implements Callback<List<CaptionImage>> {
    private static final String DEBUG_KEY = "icaption";
    private static final String BASE_URL = "http://icaption.azurewebsites.net/";

    private CaptionAPI api;
    private TextView textView;
    private ImageView imageView;
    private Button nextButton;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        textView = (TextView) findViewById(R.id.caption_text_view);
        imageView = (ImageView) findViewById(R.id.image_view);
        nextButton = (Button) findViewById(R.id.next_button);

        Gson gson = new GsonBuilder().setLenient().create();

        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl(BASE_URL)
                .addConverterFactory(GsonConverterFactory.create(gson))
                .build();

        api = retrofit.create(CaptionAPI.class);

        api.loadImages().enqueue(this);
    }

    @Override
    public void onResponse(Call<List<CaptionImage>> call, Response<List<CaptionImage>> response) {
        final List<CaptionImage> images;

        if (!response.isSuccessful()) {
            return;
        }

        images = response.body();

//        for (CaptionImage image : images) {
//            Log.e(DEBUG_KEY, image.getUrl());
//            Picasso.with(this)
//                    .load(image.getUrl())
//                    .priority(image == images.get(0) ? Picasso.Priority.HIGH : Picasso.Priority.NORMAL);
//        }

        nextButton.setOnClickListener(new View.OnClickListener() {
            private int imageIndex = 5;

            @Override
            public void onClick(View v) {
                imageIndex = (imageIndex + 1) % images.size();

                Picasso.with(MainActivity.this)
                        .load(images.get(imageIndex).getUrl())
                        .into(imageView);

                textView.setText(images.get(imageIndex).getCaption());
            }
        });

        Picasso.with(this).load(images.get(0).getUrl()).into(imageView);
        textView.setText(images.get(0).getCaption());

        Log.e(DEBUG_KEY, images.get(0).getUrl());
    }

    @Override
    public void onFailure(Call<List<CaptionImage>> call, Throwable t) {
        t.printStackTrace();
    }
}
