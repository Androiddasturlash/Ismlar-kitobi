package uz.mahmud.ismlarkitobi;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.appcompat.app.AlertDialog;
import androidx.preference.Preference;
import androidx.preference.PreferenceFragmentCompat;

import com.google.android.material.bottomsheet.BottomSheetDialog;

public class SettingsFragment extends PreferenceFragmentCompat {

    @Override
    public void onCreatePreferences(Bundle savedInstanceState, String rootKey) {

        setPreferencesFromResource(R.xml.settings, rootKey);

        Preference language = findPreference("language");

        if (language != null) {

            language.setOnPreferenceClickListener(preference -> {

                BottomSheetDialog dialog =
                        new BottomSheetDialog(requireContext());

                dialog.setContentView(R.layout.bottom_languaage);

                TextView title = dialog.findViewById(R.id.LangTitle);
                TextView uz = dialog.findViewById(R.id.txtUz);
                TextView ru = dialog.findViewById(R.id.txtRu);
                TextView en = dialog.findViewById(R.id.txtEn);

                if (uz != null) {
                    uz.setOnClickListener(v -> {

                        changeLanguage("uz");

                        dialog.dismiss();
                    });
                }

                if (ru != null) {
                    ru.setOnClickListener(v -> {

                        changeLanguage("ru");

                        dialog.dismiss();
                    });
                }

                if (en != null) {
                    en.setOnClickListener(v -> {

                        changeLanguage("en");

                        dialog.dismiss();
                    });
                }
                dialog.setCancelable(false);
                dialog.setCanceledOnTouchOutside(false);

                SharedPreferences preferences =
                        requireContext().getSharedPreferences("settings", Context.MODE_PRIVATE);

                String currentLang = preferences.getString("language", "uz");

                if (title != null) {
                    title.setText(getString(R.string.select_language));
                }

                if (uz != null) uz.setCompoundDrawablesRelativeWithIntrinsicBounds(0, 0, 0, 0);
                if (ru != null) ru.setCompoundDrawablesRelativeWithIntrinsicBounds(0, 0, 0, 0);
                if (en != null) en.setCompoundDrawablesRelativeWithIntrinsicBounds(0, 0, 0, 0);

                switch (currentLang) {
                    case "uz":
                        uz.setCompoundDrawablesRelativeWithIntrinsicBounds(0, 0, R.drawable.ic_check, 0);
                        break;

                    case "ru":
                        ru.setCompoundDrawablesRelativeWithIntrinsicBounds(0, 0, R.drawable.ic_check, 0);
                        break;

                    case "en":
                        en.setCompoundDrawablesRelativeWithIntrinsicBounds(0, 0, R.drawable.ic_check, 0);
                        break;
                }

                dialog.show();

                ImageView imgClose = dialog.findViewById(R.id.imgClose);

                if (imgClose != null) {
                    imgClose.setOnClickListener(v -> dialog.dismiss());
                }

                return true;
            });

        }

        Preference share = findPreference("share");

        if (share != null) {
            share.setOnPreferenceClickListener(preference -> {

                Intent intent = new Intent(
                        Intent.ACTION_VIEW,
                        android.net.Uri.parse("https://github.com/Androiddasturlash/Ismlar-kitobi"));

                startActivity(intent);

                return true;
            });
        }
        Preference about = findPreference("about");

        if (about != null) {

            about.setOnPreferenceClickListener(preference -> {

                AlertDialog dialog = new AlertDialog.Builder(requireContext())
                        .setView(R.layout.dialog_about)
                        .create();

                dialog.setCancelable(false);
                dialog.setCanceledOnTouchOutside(false);

                dialog.show();

                ImageView imgClose = dialog.findViewById(R.id.imgClose);

                if (imgClose != null) {
                    imgClose.setOnClickListener(v -> dialog.dismiss());
                }

                return true;
            });
        }
        Preference fav = findPreference("fav");

        if (fav != null) {

            fav.setOnPreferenceClickListener(preference -> {

                startActivity(
                        new Intent(requireContext(),
                                FavoriteActivity.class));

                return true;
            });

        }
    }
    private void changeLanguage(String language) {

        SharedPreferences preferences =
                requireContext().getSharedPreferences("settings", Context.MODE_PRIVATE);

        preferences.edit()
                .putString("language", language)
                .apply();

        Intent intent = new Intent(requireActivity(), MainActivity.class);
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);

        startActivity(intent);

        requireActivity().finish();
    }
}