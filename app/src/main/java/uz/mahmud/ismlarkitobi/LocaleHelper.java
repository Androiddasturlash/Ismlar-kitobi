package uz.mahmud.ismlarkitobi;

import android.content.Context;
import android.content.ContextWrapper;
import android.content.SharedPreferences;
import android.content.res.Configuration;

import java.util.Locale;

public class LocaleHelper {

    public static ContextWrapper wrap(Context context) {

        SharedPreferences preferences =
                context.getSharedPreferences("settings", Context.MODE_PRIVATE);

        String language = preferences.getString("language", "uz");

        Locale locale = new Locale(language);
        Locale.setDefault(locale);

        Configuration configuration =
                context.getResources().getConfiguration();

        configuration.setLocale(locale);

        Context newContext =
                context.createConfigurationContext(configuration);

        return new ContextWrapper(newContext);
    }
}