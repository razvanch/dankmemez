package ro.devacademy.icaption;

import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;

import com.facebook.CallbackManager;
import com.facebook.FacebookCallback;
import com.facebook.FacebookException;
import com.facebook.FacebookSdk;
import com.facebook.login.LoginManager;
import com.facebook.login.LoginResult;
import com.facebook.login.widget.LoginButton;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.squareup.picasso.Picasso;

import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;
import ro.devacademy.icaption.models.CaptionImage;

public class MainActivity extends AppCompatActivity implements Callback<List<CaptionImage>> {
    private static final String DEBUG_KEY = "icaption";
    private static final String BASE_URL = "https://icaption.azurewebsites.net/";

    private CaptionAPI api;
    private TextView textView;
    private ImageView imageView;
    private Button nextButton;
    private CallbackManager callbackManager;
    private LoginButton loginButton;

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


        FacebookSdk.sdkInitialize(getApplicationContext());
        Log.e("debug", "before callback triggered");

        api.loadImages().enqueue(MainActivity.this);

        callbackManager = CallbackManager.Factory.create();
        loginButton = (LoginButton) findViewById(R.id.login_button);
        loginButton.setReadPermissions("email", "public_profile");
        loginButton.registerCallback(callbackManager, new FacebookCallback<LoginResult>() {

            @Override
            public void onSuccess(LoginResult loginResult) {
                Log.e("debug", "onSuccess1 triggered");
                Log.e("debug", loginResult.toString());
//                api.loadImages().enqueue(MainActivity.this);
                Log.e("debug", "onSuccess2 triggered");
            }

            @Override
            public void onCancel() {
                Log.e("debug", "onCancel triggered");
            }

            @Override
            public void onError(FacebookException error) {
                Log.e("debug", "onErrortriggered");
            }
        });

        api.loadImages().enqueue(MainActivity.this);


        LoginManager.getInstance().registerCallback(callbackManager,
                new FacebookCallback<LoginResult>() {
                    @Override
                    public void onSuccess(LoginResult loginResult) {
                        Log.e("debug", "onSuccess11 triggered");
                        loginResult.
                        Log.e("debug", loginResult.getAccessToken().getToken().toString());
                        Log.e("debug", loginResult.getAccessToken().toString());
                        Log.e("debug", loginResult.getAccessToken().getSource().toString());
//                        api.loadImages(loginResult.getAccessToken().getToken().toString()).enqueue(MainActivity.this);
                        Log.e("debug", "onSuccess21 triggered");
                    }

                    @Override
                    public void onCancel() {
                        Log.e("debug", "onCancel2 triggered");
                    }

                    @Override
                    public void onError(FacebookException error) {
                        Log.e("debug", "onErrortriggered3");
                        Log.e("debug", error.toString());
                    }
                });
    }


    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        callbackManager.onActivityResult(requestCode, resultCode, data);
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
