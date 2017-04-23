package ro.devacademy.icaption.models;

/**
 * Created by razvan on 01.03.2017.
 */

public class CaptionImage {

    public String getCaption() {
        return caption;
    }

    public void setCaption(String caption) {
        this.caption = caption;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    private String url;

    private String caption;
}
