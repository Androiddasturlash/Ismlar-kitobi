package uz.mahmud.ismlarkitobi;

import android.content.Intent;
import android.content.SharedPreferences;
import android.content.res.Configuration;
import android.graphics.Typeface;
import android.os.Bundle;
import android.os.Handler;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;

import java.util.Locale;

public class SplashActivity extends AppCompatActivity {

    private static final int SPLASH_DURATION = 3000; // 3 soniya

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        SharedPreferences preferences =
                getSharedPreferences("settings", MODE_PRIVATE);

        String language = preferences.getString("language", "uz");

        Locale locale = new Locale(language);
        Locale.setDefault(locale);

        Configuration configuration = getResources().getConfiguration();
        configuration.setLocale(locale);

        getResources().updateConfiguration(
                configuration,
                getResources().getDisplayMetrics()
        );
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_splash);

        TextView name = findViewById(R.id.name);

        name.setText(getString(R.string.app_name));
        name.setTypeface(null, Typeface.BOLD);

        new Handler().postDelayed(() -> {
            Intent intent = new Intent(SplashActivity.this, MainActivity.class);
            startActivity(intent);
            finish();
        }, SPLASH_DURATION);
    }
}
