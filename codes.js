const codeDatabase = [
    {
        title: "MainActivity.java",
        lang: "language-java",
        code: `package uz.mahmud.ismlarkitobi;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.ApplicationInfo;
import android.content.res.Configuration;
import android.net.Uri;
import android.os.Bundle;

import androidx.appcompat.app.AppCompatActivity;
import androidx.core.content.FileProvider;
import androidx.core.view.GravityCompat;
import androidx.drawerlayout.widget.DrawerLayout;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import android.text.Editable;
import android.text.TextWatcher;

import com.google.android.material.navigation.NavigationView;
import com.google.android.material.textfield.TextInputEditText;

import com.google.android.material.appbar.MaterialToolbar;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.Locale;

import uz.mahmud.ismlarkitobi.adapter.NameAdapter;
import uz.mahmud.ismlarkitobi.helper.DatabaseHelper;
import uz.mahmud.ismlarkitobi.model.Model;

public class MainActivity extends AppCompatActivity {
    @Override
    protected void attachBaseContext(Context newBase) {
        super.attachBaseContext(LocaleHelper.wrap(newBase));
    }

    private MaterialToolbar toolbar;
    private RecyclerView recyclerView;
    private ArrayList<Model> list;
    private NameAdapter adapter;
    private DatabaseHelper helper;
    private TextInputEditText editText;
    private DrawerLayout drawerLayout;
    private NavigationView navigationView;

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
        setContentView(R.layout.activity_main);

        toolbar = findViewById(R.id.mainToolbar);
        setSupportActionBar(toolbar);

        drawerLayout = findViewById(R.id.drawerLayout);
        navigationView = findViewById(R.id.navigationView);

        toolbar.setNavigationOnClickListener(v ->
                drawerLayout.openDrawer(GravityCompat.START));

        navigationView.setNavigationItemSelectedListener(item -> {

            int id = item.getItemId();

            if (id == R.id.nav_home) {

                drawerLayout.closeDrawer(GravityCompat.START);

            } else if (id == R.id.nav_settings) {

                startActivity(new Intent(MainActivity.this, SettingsActivity.class));

            } else if (id == R.id.nav_share) {
                shareApk();

            } else if (id == R.id.nav_exit) {

               finish();
            }

            drawerLayout.closeDrawer(GravityCompat.START);
            return true;
        });

        recyclerView = findViewById(R.id.recyclerView);
        editText = findViewById(R.id.editText);
        recyclerView.setLayoutManager(new LinearLayoutManager(this));

        helper = new DatabaseHelper(this);

        try {
            helper.createDatabase();
            helper.openDatabase();

            list = helper.getNomList();

            adapter = new NameAdapter(this, list,null);
            recyclerView.setAdapter(adapter);

            editText.addTextChangedListener(new TextWatcher() {
                @Override
                public void beforeTextChanged(CharSequence s, int start, int count, int after) {

                }

                @Override
                public void onTextChanged(CharSequence s, int start, int before, int count) {
                    adapter.getFilter().filter(s);
                }

                @Override
                public void afterTextChanged(Editable s) {

                }
            });

        } catch (IOException e) {
            e.printStackTrace();
        }
    }
    private void shareApk() {
        try {
            ApplicationInfo app = getApplicationContext().getApplicationInfo();
            String apkPath = app.sourceDir;

            // Yangi nom bilan nusxa olish
            File originalApk = new File(apkPath);
            File newApk = new File(getExternalCacheDir(), "Ismlar kitobi.Apk");

            InputStream in = new FileInputStream(originalApk);
            OutputStream out = new FileOutputStream(newApk);

            byte[] buffer = new byte[1024];

            int length;
            while ((length = in.read(buffer)) > 0) {
                out.write(buffer, 0, length);
            }

            in.close();
            out.close();

            // Share qilish
            Intent shareIntent = new Intent(Intent.ACTION_SEND);
            shareIntent.setType("*/*");

            Uri uri = FileProvider.getUriForFile(
                    this,
                    getPackageName() + ".provider",
                    newApk
            );

            shareIntent.putExtra(Intent.EXTRA_STREAM, uri);
            shareIntent.putExtra(Intent.EXTRA_TEXT, "Download Ismlar kitobi app!");
            shareIntent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);

            startActivity(Intent.createChooser(shareIntent, "Share Ismlar kitobi"));

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    protected void onDestroy() {
        if (helper != null) {
            helper.close();
            helper.close();
        }
        super.onDestroy();
    }
}`
    },
    {
        title: "SplashActivity.java",
        lang: "language-java",
        code: `package uz.mahmud.ismlarkitobi;

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
}`
    },
    {
        title: "DetailActivity.java",
        lang: "language-java",
        code: `package uz.mahmud.ismlarkitobi;

import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Build;
import android.os.Bundle;
import android.text.Html;
import android.view.Menu;
import android.view.MenuItem;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.google.android.material.appbar.MaterialToolbar;

import uz.mahmud.ismlarkitobi.helper.DatabaseHelper;

public class DetailActivity extends AppCompatActivity {
    @Override
    protected void attachBaseContext(Context newBase) {
        super.attachBaseContext(LocaleHelper.wrap(newBase));
    }
    private MaterialToolbar toolbar;

    private TextView tvName, tvGender, tvShape, tvOrigin, tvMeaning;
    private DatabaseHelper db;
    private Menu menu;
    private boolean isFavorite = false;
    private int nomid;

    private String name;
    private String desc;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_detail);

        toolbar = findViewById(R.id.detailToolbar);
        setSupportActionBar(toolbar);

        if (getSupportActionBar() != null) {
            getSupportActionBar().setDisplayHomeAsUpEnabled(true);
        }

        toolbar.setNavigationOnClickListener(v -> finish());

        tvName = findViewById(R.id.tvName);
        tvGender = findViewById(R.id.tvGender);
        tvShape = findViewById(R.id.tvShape);
        tvOrigin = findViewById(R.id.tvOrigin);
        tvMeaning = findViewById(R.id.tvMeaning);

        name = getIntent().getStringExtra("name");
        desc = getIntent().getStringExtra("desc");
        nomid = getIntent().getIntExtra("nomid", 0);

        db = new DatabaseHelper(this);

        try {
            db.createDatabase();
        } catch (Exception e) {
            e.printStackTrace();
        }

        db.openDatabase();

        isFavorite = db.isFavorite(nomid);

        tvName.setText(name);

        if (desc == null) desc = "";

        // Gender
        if (desc.contains("Qiz bolalar")) {
            tvGender.setText("Qiz bolalar ismi");
        } else if (desc.contains("O'g'il")) {
            tvGender.setText("O'g'il bolalar ismi");
        } else {
            tvGender.setText("-");
        }

        // SHAKLLARI
        String shape = "";

        String[] parts = desc.split("</p>");

        if (parts.length >= 2) {

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
                shape = Html.fromHtml(parts[1], Html.FROM_HTML_MODE_LEGACY).toString().trim();
            } else {
                shape = Html.fromHtml(parts[1]).toString().trim();
            }

            if (shape.isEmpty()) {
                tvShape.setVisibility(TextView.GONE);
            } else {
                tvShape.setVisibility(TextView.VISIBLE);
                tvShape.setText(shape);
            }

        } else {
            tvShape.setVisibility(TextView.GONE);
        }

        // Origin
        if (desc.contains("KELIB CHIQISHI:")) {

            int start = desc.indexOf("KELIB CHIQISHI:");
            int end = desc.indexOf("</p>", start);

            if (start != -1 && end != -1) {

                String origin = desc.substring(start, end);
                origin = Html.fromHtml(origin, Html.FROM_HTML_MODE_LEGACY).toString();

                origin = origin.replace("KELIB CHIQISHI:", "").trim();

                tvOrigin.setText("KELIB CHIQISHI: " + origin);

            } else {
                tvOrigin.setText("KELIB CHIQISHI: -");
            }

        } else {
            tvOrigin.setText("KELIB CHIQISHI: -");
        }

        // Meaning
        int meaningStart = desc.indexOf("<strong>");

        if (meaningStart != -1) {

            String meaning = desc.substring(meaningStart);

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
                tvMeaning.setText(Html.fromHtml(meaning, Html.FROM_HTML_MODE_LEGACY));
            } else {
                tvMeaning.setText(Html.fromHtml(meaning));
            }

        } else {

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
                tvMeaning.setText(Html.fromHtml(desc, Html.FROM_HTML_MODE_LEGACY));
            } else {
                tvMeaning.setText(Html.fromHtml(desc));
            }
        }
    }
    @Override
    public boolean onCreateOptionsMenu(Menu menu) {

        getMenuInflater().inflate(R.menu.detail_menu, menu);

        this.menu = menu;

        MenuItem item = menu.findItem(R.id.menu_favorite);

        if (isFavorite) {
            item.setIcon(R.drawable.ic_favorite_1);
        } else {
            item.setIcon(R.drawable.ic_favorite_border_2);
        }


        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {

        int id = item.getItemId();

        if (id == android.R.id.home) {
            finish();
            return true;
        }

        if (id == R.id.menu_copy) {

            ClipboardManager clipboard =
                    (ClipboardManager) getSystemService(CLIPBOARD_SERVICE);

            ClipData clip = ClipData.newPlainText(
                    "Ism",
                    tvName.getText().toString()
                            + "\n\n"
                            + tvGender.getText().toString()
                            + "\n"
                            + tvShape.getText().toString()
                            + "\n"
                            + tvOrigin.getText().toString()
                            + "\n\n"
                            + tvMeaning.getText().toString()
            );

            clipboard.setPrimaryClip(clip);

            Toast.makeText(this,  getString(R.string.copied), Toast.LENGTH_SHORT).show();

            return true;
        }

        if (id == R.id.menu_share) {

            Intent intent = new Intent(Intent.ACTION_SEND);

            intent.setType("text/plain");

            intent.putExtra(Intent.EXTRA_TEXT,
                    tvName.getText().toString()
                            + "\n\n"
                            + tvMeaning.getText().toString());

            startActivity(Intent.createChooser(intent, getString(R.string.share)));

            return true;
        }

        if (id == R.id.menu_favorite) {

            MenuItem favItem = menu.findItem(R.id.menu_favorite);

            if (isFavorite) {

                db.removeFavorite(nomid);

                SharedPreferences preferences =
                        getSharedPreferences("settings", MODE_PRIVATE);

                preferences.edit()
                        .putString("last_removed_name", name)
                        .putLong("last_removed_time", System.currentTimeMillis())
                        .apply();

                isFavorite = false;

                favItem.setIcon(R.drawable.ic_favorite_border_2);

                Toast.makeText(this,
                        getString(R.string.favorite_removed),
                        Toast.LENGTH_SHORT).show();

            } else {

                db.addFavorite(name, desc, nomid);

                isFavorite = true;

                favItem.setIcon(R.drawable.ic_favorite_1);

                Toast.makeText(this,
                        getString(R.string.favorite_added),
                        Toast.LENGTH_SHORT).show();
            }

            return true;
        }

        return super.onOptionsItemSelected(item);
    }
    @Override
    protected void onDestroy() {
        super.onDestroy();

        if (db != null) {
            db.close();
        }
    }
}`
    },
    {
        title: "FavoriteActivity.java",
        lang: "language-java",
        code: `package uz.mahmud.ismlarkitobi;

import android.content.Context;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
import android.view.View;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.google.android.material.appbar.MaterialToolbar;
import com.google.android.material.snackbar.Snackbar;
import com.google.android.material.textfield.TextInputEditText;

import java.util.ArrayList;

import uz.mahmud.ismlarkitobi.adapter.NameAdapter;
import uz.mahmud.ismlarkitobi.helper.DatabaseHelper;
import uz.mahmud.ismlarkitobi.model.Model;

public class FavoriteActivity extends AppCompatActivity {
    @Override
    protected void attachBaseContext(Context newBase) {
        super.attachBaseContext(LocaleHelper.wrap(newBase));
    }

    private MaterialToolbar toolbar;
    private RecyclerView recyclerView;

    private DatabaseHelper db;
    private ArrayList<Model> list;
    private NameAdapter adapter;
    private TextView txtEmpty;
    private TextInputEditText editText;
    private String lastRemovedName = "";
    private long lastRemovedTime = 0;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_favorite);

        toolbar = findViewById(R.id.toolbar);
        recyclerView = findViewById(R.id.recyclerView);
        txtEmpty = findViewById(R.id.txtEmpty);
        editText = findViewById(R.id.editText);

        setSupportActionBar(toolbar);

        if (getSupportActionBar() != null) {
            getSupportActionBar().setDisplayHomeAsUpEnabled(true);
        }

        toolbar.setNavigationOnClickListener(v -> finish());

        db = new DatabaseHelper(this);

        try {
            db.createDatabase();
        } catch (Exception e) {
            e.printStackTrace();
        }

        db.openDatabase();

        list = db.getFavList();

        adapter = new NameAdapter(this, list, model -> {

            lastRemovedName = model.getName();
            lastRemovedTime = System.currentTimeMillis();

            SharedPreferences preferences =
                    getSharedPreferences("settings", MODE_PRIVATE);

            preferences.edit()
                    .putString("last_removed_name", lastRemovedName)
                    .putLong("last_removed_time", lastRemovedTime)
                    .apply();

            db.removeFavorite(model.getId());

            adapter.updateData(db.getFavList());

            checkEmpty();

            Toast.makeText(this,
                    getString(R.string.favorite_removed),
                    Toast.LENGTH_SHORT).show();

        });

        recyclerView.setLayoutManager(new LinearLayoutManager(this));
        recyclerView.setAdapter(adapter);
        checkEmpty();

        editText.addTextChangedListener(new TextWatcher() {

            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {

            }

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                adapter.getFilter().filter(s);
            }

            @Override
            public void afterTextChanged(Editable s) {

            }
        });
        editText.setOnEditorActionListener((v, actionId, event) -> {

            String text = editText.getText().toString().trim();

            adapter.getFilter().filter(text, count -> {

                if (adapter.getItemCount() == 0) {

                    String message = getString(R.string.favorite_not_found);

                    if (!lastRemovedName.isEmpty()
                            && text.trim().equalsIgnoreCase(lastRemovedName.trim())) {

                        long diff = System.currentTimeMillis() - lastRemovedTime;

                        if (diff < 15000) {
                            message = getString(R.string.favorite_just_removed);
                        } else {
                            message = getString(R.string.favorite_removed_earlier);
                        }
                    }

                    Snackbar.make(
                            recyclerView,
                            message,
                            Snackbar.LENGTH_SHORT
                    ).show();
                }
            });

            return true;
        });
    }
    private void checkEmpty() {

        if (list.isEmpty()) {
            txtEmpty.setVisibility(View.VISIBLE);
            recyclerView.setVisibility(View.GONE);
        } else {
            txtEmpty.setVisibility(View.GONE);
            recyclerView.setVisibility(View.VISIBLE);
        }
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();

        if (db != null) {
            db.close();
        }
    }
    @Override
    protected void onResume() {
        super.onResume();

        SharedPreferences preferences =
                getSharedPreferences("settings", MODE_PRIVATE);

        lastRemovedName = preferences.getString("last_removed_name", "");
        lastRemovedTime = preferences.getLong("last_removed_time", 0);

        adapter.updateData(db.getFavList());
        checkEmpty();
    }
}`
    },
    {
        title:"LocaleHelper.java",
        lang: "language-java",
        code:`package uz.mahmud.ismlarkitobi;

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
}`
    },
    {
        title:"SettingFragment.java",
        lang:"language-java",
        code:`package uz.mahmud.ismlarkitobi;

import android.os.Bundle;

import androidx.annotation.Nullable;
import androidx.preference.PreferenceFragmentCompat;

public class SettingFragment extends PreferenceFragmentCompat {

    @Override
    public void onCreatePreferences(@Nullable Bundle savedInstanceState, String rootKey) {
        setPreferencesFromResource(R.xml.settings, rootKey);
    }
}`
    },
    {
        title:"SettingsActivity.java",
        lang:"language-java",
        code:`package uz.mahmud.ismlarkitobi;

import android.content.Context;
import android.os.Bundle;

import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;

public class SettingsActivity extends AppCompatActivity {

    @Override
    protected void attachBaseContext(Context newBase) {
        super.attachBaseContext(LocaleHelper.wrap(newBase));
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {

        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_settings);

        Toolbar toolbar = findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);

        if (getSupportActionBar() != null) {
            getSupportActionBar().setTitle(getString(R.string.settings));
            getSupportActionBar().setDisplayHomeAsUpEnabled(true);
        }

        toolbar.setNavigationOnClickListener(v -> finish());

        if (savedInstanceState == null) {
            getSupportFragmentManager()
                    .beginTransaction()
                    .replace(R.id.settings_container, new SettingsFragment())
                    .commit();
        }
    }
}`
    },
    {
        title:"SettingsFragment.java",
        lang:"language-java",
        code:`package uz.mahmud.ismlarkitobi;

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
}`
    },
    {
        title:"NaeAdapteer.java",
        lang:"language-java",
        code:`package uz.mahmud.ismlarkitobi.adapter;

import android.content.Context;
import android.content.Intent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import android.widget.Filter;
import android.widget.Filterable;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import java.util.ArrayList;

import uz.mahmud.ismlarkitobi.DetailActivity;
import uz.mahmud.ismlarkitobi.R;
import uz.mahmud.ismlarkitobi.model.Model;

public class NameAdapter extends RecyclerView.Adapter<NameAdapter.ViewHolder> implements Filterable {

    private Context context;
    private ArrayList<Model> list;
    private ArrayList<Model> fullList;
    private OnItemLongClick listener;

    public NameAdapter(Context context, ArrayList<Model> list,OnItemLongClick listener) {
        this.context = context;
        this.list = list;
        this.fullList = new ArrayList<>(list);
        this.listener=listener;
    }
    public interface OnItemLongClick{
        void onLongClick(Model model);
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(context).inflate(R.layout.item_name, parent, false);
        return new ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {

        Model model = list.get(position);

        holder.txtName.setText(model.getName());
        holder.txtGender.setText(model.getGender());

        holder.itemView.setOnClickListener(v -> {

            Intent intent = new Intent(context, DetailActivity.class);

            intent.putExtra("name", model.getName());
            intent.putExtra("gender", model.getGender());
            intent.putExtra("desc", model.getDesc());
            intent.putExtra("nomid", model.getNomid());

            context.startActivity(intent);

        });

        holder.itemView.setOnLongClickListener(v -> {

            listener.onLongClick(model);

            return true;
        });
    }

    @Override
    public int getItemCount() {
        return list.size();
    }

    public static class ViewHolder extends RecyclerView.ViewHolder {

        TextView txtName, txtGender;

        public ViewHolder(@NonNull View itemView) {
            super(itemView);

            txtName = itemView.findViewById(R.id.txtName);
            txtGender = itemView.findViewById(R.id.txtGender);
        }
    }
    @Override
    public Filter getFilter() {
        return filter;
    }
    public void updateData(ArrayList<Model> newList) {
        list.clear();
        list.addAll(newList);

        fullList.clear();
        fullList.addAll(newList);

        notifyDataSetChanged();
    }

    private final Filter filter = new Filter() {

        @Override
        protected FilterResults performFiltering(CharSequence constraint) {

            ArrayList<Model> filteredList = new ArrayList<>();

            if (constraint == null || constraint.length() == 0) {

                filteredList.addAll(fullList);

            } else {

                String filterPattern = constraint.toString().toLowerCase().trim();

                for (Model item : fullList) {

                    if (item.getName() != null &&
                            item.getName().toLowerCase().contains(filterPattern)) {
                        filteredList.add(item);
                    }
                }
            }

            FilterResults results = new FilterResults();
            results.values = filteredList;
            return results;
        }

        @Override
        protected void publishResults(CharSequence constraint, FilterResults results) {

            list.clear();
            list.addAll((ArrayList<Model>) results.values);
            notifyDataSetChanged();
        }
    };
}`
    },
    {
        title:"DatabaseHelper.java",
        lang:"language-java",
        code:`package uz.mahmud.ismlarkitobi.helper;

import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.ArrayList;

import uz.mahmud.ismlarkitobi.model.Model;

public class DatabaseHelper extends SQLiteOpenHelper {

    private static final String DATABASE_NAME = "database.db";
    private static final int DATABASE_VERSION = 1;

    private final Context context;
    private SQLiteDatabase database;

    public DatabaseHelper(Context context) {
        super(context, DATABASE_NAME, null, DATABASE_VERSION);
        this.context = context;
    }

    @Override
    public void onCreate(SQLiteDatabase db) {

    }

    @Override
    public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {

    }

    public void createDatabase() throws IOException {

        if (!checkDatabase()) {

            this.getReadableDatabase();
            this.close();

            copyDatabase();
        }
    }

    private boolean checkDatabase() {

        File dbFile = context.getDatabasePath(DATABASE_NAME);
        return dbFile.exists();
    }

    private void copyDatabase() throws IOException {

        InputStream inputStream = context.getAssets().open(DATABASE_NAME);

        String outFileName = context.getDatabasePath(DATABASE_NAME).getPath();

        File file = new File(context.getDatabasePath(DATABASE_NAME).getParent());

        if (!file.exists()) {
            file.mkdirs();
        }

        OutputStream outputStream = new FileOutputStream(outFileName);

        byte[] buffer = new byte[1024];
        int length;

        while ((length = inputStream.read(buffer)) > 0) {
            outputStream.write(buffer, 0, length);
        }

        outputStream.flush();
        outputStream.close();
        inputStream.close();
    }

    public void openDatabase() {

        String path = context.getDatabasePath(DATABASE_NAME).getPath();

        database = SQLiteDatabase.openDatabase(
                path,
                null,
                SQLiteDatabase.OPEN_READWRITE
        );
    }
    // nom jadvali
    public ArrayList<Model> getNomList() {

        ArrayList<Model> list = new ArrayList<>();

        Cursor cursor = database.rawQuery("SELECT * FROM nom", null);

        while (cursor.moveToNext()) {

            Model model = new Model();

            model.setId(cursor.getInt(cursor.getColumnIndexOrThrow("_id")));
            model.setName(cursor.getString(cursor.getColumnIndexOrThrow("name")));
            model.setGender(cursor.getString(cursor.getColumnIndexOrThrow("gender")));
            model.setDesc(cursor.getString(cursor.getColumnIndexOrThrow("desc")));

            list.add(model);
        }

        cursor.close();

        return list;
    }

    // fav jadvali
    public ArrayList<Model> getFavList() {

        ArrayList<Model> list = new ArrayList<>();

        Cursor cursor = database.rawQuery("SELECT * FROM fav", null);

        while (cursor.moveToNext()) {

            Model model = new Model();

            model.setId(cursor.getInt(cursor.getColumnIndexOrThrow("_id")));
            model.setName(cursor.getString(cursor.getColumnIndexOrThrow("name")));
            model.setDesc(cursor.getString(cursor.getColumnIndexOrThrow("desc")));
            model.setNomid(cursor.getInt(cursor.getColumnIndexOrThrow("nomid")));

            list.add(model);
        }

        cursor.close();

        return list;
    }
    public void addFavorite(String name, String desc, int nomid) {

        if (isFavorite(nomid)) {
            return;
        }

        database.execSQL(
                "INSERT INTO fav(name,[desc],nomid) VALUES(?,?,?)",
                new Object[]{name, desc, nomid});
    }
    public boolean isFavorite(int nomid) {
        Cursor cursor = database.rawQuery(
                "SELECT * FROM fav WHERE nomid=?",
                new String[]{String.valueOf(nomid)});

        boolean exists = cursor.moveToFirst();
        cursor.close();

        return exists;
    }

    // Sevimlidan o'chirish
    public void removeFavorite(int nomid) {

        database.execSQL(
                "DELETE FROM fav WHERE nomid=?",
                new Object[]{nomid});
    }

    @Override
    public synchronized void close() {
        if (database != null && database.isOpen()) {
            database.close();
        }
        super.close();
    }
}`
    },
    {
        title:"Model.java",
        lang:"language-java",
        code:`package uz.mahmud.ismlarkitobi.model;

public class Model {

    private int id;
    private String name;
    private String gender;
    private String desc;
    private int nomid;

    public Model() {
    }

    public Model(int id, String name, String gender, String desc) {
        this.id = id;
        this.name = name;
        this.gender = gender;
        this.desc = desc;
    }

    public Model(int id, String name, String desc, int nomid) {
        this.id = id;
        this.name = name;
        this.desc = desc;
        this.nomid = nomid;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getDesc() {
        return desc;
    }

    public void setDesc(String desc) {
        this.desc = desc;
    }

    public int getNomid() {
        return nomid;
    }

    public void setNomid(int nomid) {
        this.nomid = nomid;
    }
}`
    },
    {
        title:"Build.gradle.kts",
        lang:"language-kotlin",
        code:`plugins {
    alias(libs.plugins.android.application)
}

android {
    namespace = "uz.mahmud.ismlarkitobi"
    compileSdk {
        version = release(36) {
            minorApiLevel = 1
        }
    }

    defaultConfig {
        applicationId = "uz.mahmud.ismlarkitobi"
        minSdk = 24
        targetSdk = 36
        versionCode = 1
        versionName = "1.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            optimization {
                enable = false
            }
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_11
        targetCompatibility = JavaVersion.VERSION_11
    }
}

dependencies {
    implementation(libs.activity.ktx)
    implementation(libs.appcompat)
    implementation(libs.constraintlayout)
    implementation(libs.material)
    testImplementation(libs.junit)
    androidTestImplementation(libs.espresso.core)
    androidTestImplementation(libs.ext.junit)
    implementation("androidx.preference:preference:1.2.1")
}`
    },
    {
        title:"AndroidManifest.xml",
        lang:"language-xml",
        code:`<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools">

    <application
        android:allowBackup="true"
        android:dataExtractionRules="@xml/data_extraction_rules"
        android:fullBackupContent="@xml/backup_rules"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.IsmlarKitobi">
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:windowSoftInputMode="adjustResize"/>
        <activity
            android:name=".DetailActivity"
            android:exported="false"
            android:windowSoftInputMode="adjustResize" />
        <activity
            android:name=".FavoriteActivity"
            android:exported="false"
            android:windowSoftInputMode="adjustResize" />
        <activity
            android:name=".SettingsActivity"
            android:exported="false"
            android:windowSoftInputMode="adjustResize" />
        <activity
            android:name=".SplashActivity"
            android:exported="true"
            android:windowSoftInputMode="adjustResize">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />

                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

        <provider
            android:name="androidx.core.content.FileProvider"
            android:authorities="\${applicationId}.provider"
            android:exported="false"
            android:grantUriPermissions="true">
            <meta-data
                android:name="android.support.FILE_PROVIDER_PATHS"
                android:resource="@xml/provider_path" />
        </provider>
    </application>

</manifest>`
    },
    {
        title:"activity.main.xml",
        lang:"language-xml",
        code:`<?xml version="1.0" encoding="utf-8"?>
<androidx.drawerlayout.widget.DrawerLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:id="@+id/drawerLayout"
    android:layout_width="match_parent"
    android:layout_height="match_parent">

    <androidx.constraintlayout.widget.ConstraintLayout
        android:layout_width="match_parent"
        android:layout_height="match_parent">

        <com.google.android.material.appbar.AppBarLayout
            android:id="@+id/appBar"
            android:layout_width="0dp"
            android:layout_height="wrap_content"
            app:layout_constraintTop_toTopOf="parent"
            app:layout_constraintStart_toStartOf="parent"
            app:layout_constraintEnd_toEndOf="parent">

            <com.google.android.material.appbar.MaterialToolbar
                android:id="@+id/mainToolbar"
                android:layout_width="match_parent"
                android:layout_height="?attr/actionBarSize"
                android:background="#2196F3"
                app:navigationIcon="@drawable/ic_menu"
                app:title="@string/app_name"
                app:titleCentered="false"
                app:titleTextColor="@android:color/white"/>

            <com.google.android.material.textfield.TextInputLayout
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:layout_margin="16dp"
                app:endIconMode="clear_text">

                <com.google.android.material.textfield.TextInputEditText
                    android:id="@+id/editText"
                    android:layout_width="match_parent"
                    android:layout_height="48dp"
                    android:hint="@string/name_search"
                    android:inputType="textPersonName"/>

            </com.google.android.material.textfield.TextInputLayout>

        </com.google.android.material.appbar.AppBarLayout>

        <androidx.recyclerview.widget.RecyclerView
            android:id="@+id/recyclerView"
            android:layout_width="0dp"
            android:layout_height="0dp"
            android:padding="8dp"
            app:layout_constraintTop_toBottomOf="@id/appBar"
            app:layout_constraintBottom_toBottomOf="parent"
            app:layout_constraintStart_toStartOf="parent"
            app:layout_constraintEnd_toEndOf="parent"/>

    </androidx.constraintlayout.widget.ConstraintLayout>

    <com.google.android.material.navigation.NavigationView
        android:id="@+id/navigationView"
        android:layout_width="300dp"
        android:layout_height="match_parent"
        android:layout_gravity="start"
        app:headerLayout="@layout/nav_header"
        app:menu="@menu/menu"/>

</androidx.drawerlayout.widget.DrawerLayout>`
    },
    {
        title:"activity.splash.xml",
        lang:"language-xml",
        code:`<?xml version="1.0" encoding="utf-8"?>
<androidx.constraintlayout.widget.ConstraintLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="@drawable/splash_wave"
    tools:context=".MainActivity">

    <ImageView
        android:id="@+id/splashImage"
        android:layout_width="130dp"
        android:layout_height="130dp"
        app:layout_constraintBottom_toBottomOf="parent"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintTop_toTopOf="parent"
        app:srcCompat="@drawable/nav_logo" />

    <TextView
        android:id="@+id/name"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:layout_marginTop="460dp"
        android:layout_marginLeft="5dp"
        android:layout_marginRight="5dp"
        android:gravity="center"
        android:textSize="24sp"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintHorizontal_bias="0.498"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintTop_toTopOf="parent" />

</androidx.constraintlayout.widget.ConstraintLayout>`
    },
    {
        title:"activity-detail.xml",
        lang:"language-xml",
        code:`<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical"
    android:background="#F3F3F3">

    <com.google.android.material.appbar.MaterialToolbar
        android:id="@+id/detailToolbar"
        android:layout_width="match_parent"
        android:layout_height="?attr/actionBarSize"
        android:background="#2196F3"
        app:navigationIcon="@drawable/ic_arrow"
        app:title="@string/app_name"
        app:titleCentered="false"
        app:titleTextColor="@android:color/white"/>

    <ScrollView
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:background="#F3F3F3">

        <LinearLayout
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:orientation="vertical"
            android:padding="16dp">

            <androidx.cardview.widget.CardView
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:layout_marginTop="10dp"
                app:cardCornerRadius="12dp"
                app:cardElevation="3dp">

                <LinearLayout
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content"
                    android:orientation="vertical"
                    android:padding="20dp">

                    <!-- Name -->
                    <TextView
                        android:id="@+id/tvName"
                        android:layout_width="wrap_content"
                        android:layout_height="wrap_content"
                        android:layout_gravity="center"
                        android:text="Name"
                        android:textColor="#333333"
                        android:textSize="26sp"
                        android:textStyle="bold" />

                    <!-- Gender -->
                    <TextView
                        android:id="@+id/tvGender"
                        android:layout_width="wrap_content"
                        android:layout_height="wrap_content"
                        android:layout_gravity="end"
                        android:layout_marginTop="25dp"
                        android:text="Gender"
                        android:textColor="#FF6A00"
                        android:textSize="22sp" />

                    <!-- Shapes -->
                    <TextView
                        android:id="@+id/tvShape"
                        android:layout_width="match_parent"
                        android:layout_height="wrap_content"
                        android:layout_marginTop="25dp"
                        android:text="SHAKLLARI:"
                        android:textColor="#444444"
                        android:textSize="20sp" />

                    <!-- Origin -->
                    <TextView
                        android:id="@+id/tvOrigin"
                        android:layout_width="match_parent"
                        android:layout_height="wrap_content"
                        android:layout_marginTop="8dp"
                        android:text="KELIB CHIQISHI:"
                        android:textColor="#444444"
                        android:textSize="20sp" />

                    <!-- Meaning title -->
                    <TextView
                        android:layout_width="wrap_content"
                        android:layout_height="wrap_content"
                        android:layout_marginTop="28dp"
                        android:textColor="#333333"
                        android:textSize="22sp"
                        android:textStyle="bold" />

                    <!-- Meaning -->
                    <TextView
                        android:id="@+id/tvMeaning"
                        android:layout_width="match_parent"
                        android:layout_height="wrap_content"
                        android:layout_marginTop="10dp"
                        android:lineSpacingExtra="4dp"
                        android:text="Meaning"
                        android:textColor="#444444"
                        android:textSize="20sp" />

                </LinearLayout>

            </androidx.cardview.widget.CardView>

        </LinearLayout>

    </ScrollView>

</LinearLayout>`
    },
    {
        title:"activity-favorite.xml",
        lang:"language-xml",
        code:`<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical">

    <com.google.android.material.appbar.MaterialToolbar
        android:id="@+id/toolbar"
        android:layout_width="match_parent"
        android:layout_height="?attr/actionBarSize"
        android:background="#2196F3"
        app:navigationIcon="@drawable/ic_arrow"
        app:title="@string/favorite_title"
        app:titleTextColor="@android:color/white"/>

    <com.google.android.material.textfield.TextInputLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:layout_margin="12dp"
        app:endIconMode="clear_text">

        <com.google.android.material.textfield.TextInputEditText
            android:id="@+id/editText"
            android:layout_width="match_parent"
            android:layout_height="48dp"
            android:hint="@string/search_hint"/>
    </com.google.android.material.textfield.TextInputLayout>

    <FrameLayout
        android:layout_width="match_parent"
        android:layout_height="match_parent">

        <androidx.recyclerview.widget.RecyclerView
            android:id="@+id/recyclerView"
            android:layout_width="match_parent"
            android:layout_height="match_parent"/>

        <TextView
            android:id="@+id/txtEmpty"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_gravity="center"
            android:text="@string/favorite_empty"
            android:textSize="20sp"
            android:textStyle="bold"
            android:visibility="gone" />
    </FrameLayout>

</LinearLayout>`
    },
    {
        title:"activity-settings.xml",
        lang:"language-xml",
        code:`<?xml version="1.0" encoding="utf-8"?>
<LinearLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical">

    <androidx.appcompat.widget.Toolbar
        android:id="@+id/toolbar"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:background="?attr/colorPrimary"
        android:titleTextColor="@android:color/white"
        android:theme="@style/ThemeOverlay.AppCompat.Dark.ActionBar"
        android:layout_alignParentTop="true"/>

    <FrameLayout
        android:id="@+id/settings_container"
        android:layout_width="match_parent"
        android:layout_height="match_parent"/>

</LinearLayout>`
    },
    {
        title:"bottom-language.xml",
        lang:"language-xml",
        code:`<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:orientation="vertical"
    android:padding="20dp">

    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:orientation="horizontal">

        <TextView
            android:id="@+id/LangTitle"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="Tilni tanlang"
            android:gravity="center"
            android:layout_weight="1"
            android:textSize="20sp"
            android:textStyle="bold"
            android:layout_marginBottom="16dp"/>

        <ImageView
            android:id="@+id/imgClose"
            android:layout_width="28dp"
            android:layout_height="28dp"
            android:layout_gravity="end"
            android:foreground="@drawable/border"
            android:src="@drawable/ic_close"
            android:background="?attr/selectableItemBackgroundBorderless"
            android:padding="4dp"/>
    </LinearLayout>

    <TextView
        android:id="@+id/txtUz"
        android:layout_width="match_parent"
        android:layout_height="48dp"
        android:gravity="center_vertical"
        android:drawablePadding="12dp"
        android:text="🇺🇿 O'zbek"
        android:paddingHorizontal="16dp"
        android:clickable="true"
        android:focusable="true"
        android:background="?attr/selectableItemBackground"/>

    <TextView
        android:id="@+id/txtRu"
        android:layout_width="match_parent"
        android:layout_height="48dp"
        android:drawablePadding="12dp"
        android:gravity="center_vertical"
        android:text="🇷🇺 Русский"
        android:paddingHorizontal="16dp"
        android:clickable="true"
        android:focusable="true"
        android:background="?attr/selectableItemBackground"/>

    <TextView
        android:id="@+id/txtEn"
        android:layout_width="match_parent"
        android:layout_height="48dp"
        android:drawablePadding="12dp"
        android:gravity="center_vertical"
        android:text="🇬🇧 English"
        android:paddingHorizontal="16dp"
        android:clickable="true"
        android:focusable="true"
        android:background="?attr/selectableItemBackground"/>

</LinearLayout>`
    },
    {
        title:"dialog-about.xml",
        lang:"language-xml",
        code:`<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:id="@+id/dialogs_root"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:layout_margin="5dp"
    android:gravity="center"
    android:orientation="vertical"
    android:padding="24dp">

    <ImageView
        android:id="@+id/imgClose"
        android:layout_width="28dp"
        android:layout_height="28dp"
        android:layout_gravity="end"
        android:background="?attr/selectableItemBackgroundBorderless"
        android:foreground="@drawable/border"
        android:padding="4dp"
        android:src="@drawable/ic_close" />

    <ImageView
        android:id="@+id/imgLogo"
        android:layout_width="90dp"
        android:layout_height="90dp"
        android:layout_marginTop="8dp"
        android:src="@drawable/nav_logo" />

    <TextView
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_marginTop="16dp"
        android:text="@string/app_name"
        android:textColor="#000000"
        android:textSize="22sp"
        android:textStyle="bold" />

    <TextView
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_marginTop="6dp"
        android:text="@string/about_text"
        android:textColor="#666666"
        android:textSize="16sp" />

    <TextView
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:layout_marginTop="20dp"
        android:gravity="center"
        android:paddingBottom="15dp"
        android:text="@string/version"
        android:textColor="#444444"
        android:textSize="15sp" />

</LinearLayout>`
    },
    {
        title:"item-name.xml",
        lang:"language-xml",
        code:`<?xml version="1.0" encoding="utf-8"?>
<androidx.cardview.widget.CardView
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:layout_margin="8dp"
    app:cardCornerRadius="12dp"
    app:cardElevation="4dp">

    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:background="?attr/selectableItemBackground"
        android:orientation="vertical"
        android:padding="16dp">

        <TextView
            android:id="@+id/txtName"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="Abdulloh"
            android:textColor="#000000"
            android:textSize="18sp"
            android:textStyle="bold"/>

        <TextView
            android:id="@+id/txtGender"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_marginTop="4dp"
            android:text="Erkak"
            android:textColor="#666666"
            android:textSize="14sp"/>

    </LinearLayout>

</androidx.cardview.widget.CardView>`
    },
    {
        title:"nav-header.xml",
        lang:"language-xml",
        code:`<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="190dp"
    android:background="#2196F3"
    android:gravity="bottom"
    android:orientation="vertical"
    android:padding="16dp">

    <ImageView
        android:layout_width="88dp"
        android:layout_height="88dp"
        android:layout_marginBottom="12dp"
        android:padding="8dp"
        android:src="@drawable/nav_logo"
        android:scaleType="centerCrop" />

    <TextView
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="@string/app_name"
        android:textColor="@android:color/white"
        android:textSize="22sp"
        android:textStyle="bold" />

    <TextView
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="@string/name_dictionary"
        android:textColor="#E3F2FD"
        android:textSize="14sp"
        android:layout_marginTop="2dp"/>

</LinearLayout>`
    },
    {
        title:"detail-menu.xml",
        lang:"language-xml",
        code:`<?xml version="1.0" encoding="utf-8"?>
<menu xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto">

    <item
        android:id="@+id/menu_copy"
        android:icon="@drawable/ic_copy"
        android:title="@string/copy"
        app:showAsAction="ifRoom"/>

    <item
        android:id="@+id/menu_favorite"
        android:icon="@drawable/ic_favorite_border"
        android:title="@string/favorite"
        app:showAsAction="ifRoom"/>

    <item
        android:id="@+id/menu_share"
        android:icon="@drawable/ic_share"
        android:title="@string/share"
        app:showAsAction="ifRoom"/>

</menu>`
    },
    {
        title:"menu.xml",
        lang:"language-xml",
        code:`<?xml version="1.0" encoding="utf-8"?>
<menu xmlns:android="http://schemas.android.com/apk/res/android">

    <group android:checkableBehavior="none">

        <item
            android:id="@+id/nav_home"
            android:icon="@drawable/ic_home"
            android:title="@string/home"/>

        <item
            android:id="@+id/nav_settings"
            android:icon="@drawable/ic_settings"
            android:title="@string/settings"/>
    </group>
    <item android:title="@string/other">
        <menu>
            <item
                android:id="@+id/nav_share"
                android:icon="@drawable/ic_share"
                android:title="@string/share"/>

            <item
                android:id="@+id/nav_exit"
                android:icon="@drawable/ic_exit"
                android:title="@string/exit"/>
        </menu>
    </item>
</menu>`
    },
    {
        title:"color-xml",
        lang:"language-xml",
        code:`<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="black">#FF000000</color>
    <color name="white">#FFFFFFFF</color>
</resources>`
    },
    {
        title:"strings-xml",
        lang:"language-xml",
        code:`<?xml version="1.0" encoding="utf-8" ?>
<resources>
    <string name="app_name">Ismlar kitobi</string>
    <string name="favorite_title">Sevimli ismlar</string>
    <string name="name_dictionary">O\'zbekcha ismlar lug\'ati</string>
    <string name="search_hint">Qidirish</string>
    <string name="favorite_empty">Sevimli ismlar yo\'q</string>
    <string name="favorite_not_found">Sevimlilarda mavjud emas</string>
    <string name="favorite_added">Sevimlilarga qo\'shildi</string>
    <string name="favorite_removed">Sevimlilardan o\'chirildi</string>
    <string name="copied">Nusxalandi</string>
    <string name="share">Ulashish</string>
    <string name="copy">Nusxalash</string>
    <string name="favorite">Sevimli</string>
    <string name="home">Bosh sahifa</string>
    <string name="favorites">Sevimlilar</string>
    <string name="other">Boshqa</string>
    <string name="exit">Chiqish</string>
    <string name="general">Umumiy</string>
    <string name="application">Ilova</string>
    <string name="lang">Til</string>
    <string name="chooice_language">Ilova tilini tanlang</string>
    <string name="share_friend">Ilovani do\'stlaringiz bilan ulashing</string>
    <string name="nav_favorite">Sevimlilar</string>
    <string name="fav">Sevimli ismlarni ko\'rish</string>
    <string name="about">Ilova haqida</string>
    <string name="version">1.0</string>
    <string name="vibration_on">Tebranish yoqildi</string>
    <string name="vibration_off">Tebranish o\'chirildi</string>
    <string name="settings">Sozlamalar</string>
    <string name="select_language">Tilni tanlang</string>
    <string name="favorite_just_removed">Bu sevimlini hozir o\'chirdingiz</string>
    <string name="favorite_removed_earlier">Bu sevimlini biroz oldin o\‘chirdingiz</string>
    <string name="name_search">Ismni kiriting...</string>
    <string name="about_summary">Ilova haqida ma\'lumot</string>
    <string name="about_text">Ushbu dastur o\‘zbek ismlarining ma\'nosi, kelib chiqishi va shakllari haqida ma\'lumot berish uchun yaratilgan. Ilova qulay qidiruv, sevimlilar ro\'yxati va tezkor navigatsiya imkoniyatlarini taqdim etadi.</string>
</resources>`
    },
    {
        title:"thees.xml",
        lang:"language-xml",
        code:`<resources xmlns:tools="http://schemas.android.com/tools">
    <!-- Base application theme. -->
    <style name="Base.Theme.IsmlarKitobi" parent="Theme.Material3.DayNight.NoActionBar">
        <!-- Customize your light theme here. -->
        <!-- <item name="colorPrimary">@color/my_light_primary</item> -->

        <item name="colorPrimary">#2196F3</item>
        <item name="colorOnPrimary">#FFFFFF</item>
        <item name="colorSecondary">#2196F3</item>
        <item name="colorOnSecondary">#FFFFFF</item>
        <item name="android:statusBarColor">#2196F3</item>
        <item name="android:navigationBarColor">#FFFFFF</item>

    </style>

    <style name="Theme.IsmlarKitobi" parent="Base.Theme.IsmlarKitobi" />
</resources>`
    },
    {
        title:"strings-en.xml",
        lang:"language-xml",
        code:`<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="app_name">Namebook</string>
    <string name="favorite_title">Favorite Names</string>
    <string name="name_dictionary">Uzbek names dictionary</string>
    <string name="search_hint">Search</string>
    <string name="favorite_empty">No favorite names</string>
    <string name="favorite_not_found">Not found in favorites</string>
    <string name="favorite_added">Added to favorites</string>
    <string name="favorite_removed">Removed from favorites</string>
    <string name="copied">Copied</string>
    <string name="share">Share</string>
    <string name="copy">Copy</string>
    <string name="favorite">Favorite</string>
    <string name="home">Home</string>
    <string name="favorites">Favorites</string>
    <string name="other">Other</string>
    <string name="exit">Exit</string>
    <string name="general">General</string>
    <string name="application">Application</string>
    <string name="lang">Language</string>
    <string name="chooice_language">Select the application language</string>
    <string name="share_friend">Share the application with your friends</string>
    <string name="nav_favorite">Favorites</string>
    <string name="fav">View your favorites</string>
    <string name="about">About the application</string>
    <string name="version">1.0</string>
    <string name="vibration_on">Vibration on</string>
    <string name="vibration_off">Vibration off</string>
    <string name="settings">Settings</string>
    <string name="select_language">Select Language</string>
    <string name="favorite_just_removed">You just removed this favorite</string>
    <string name="favorite_removed_earlier">You removed this favorite a little while ago</string>
    <string name="name_search">Enter name...</string>
    <string name="about_summary">App information</string>
    <string name="about_text">This application was created to provide information about the meanings, origins, and variations of Uzbek names. The app offers convenient search, a favorites list, and fast navigation.</string>
</resources>`
    },
    {
        title:"strings-ru.xml",
        lang:"language-xml",
        code:`<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="app_name">Книга имен</string>
    <string name="favorite_title">Избранные имена</string>
    <string name="name_dictionary">Словарь узбекских имен</string>
    <string name="search_hint">Поиск</string>
    <string name="favorite_empty">Нет избранных имен</string>
    <string name="favorite_not_found">В избранном не найдено</string>
    <string name="favorite_added">Добавлено в избранное</string>
    <string name="favorite_removed">Удалено из избранного</string>
    <string name="copied">Скопировано</string>
    <string name="share">Поделиться</string>
    <string name="copy">Копировать</string>
    <string name="favorite">Избранное</string>
    <string name="home">Главная</string>
    <string name="favorites">Избранное</string>
    <string name="other">Другое</string>
    <string name="exit">Выход</string>
    <string name="general">Общие</string>
    <string name="application">Приложение</string>
    <string name="lang">Язык</string>
    <string name="chooice_language">Выберите язык приложения</string>
    <string name="share_friend">Поделитесь приложением с друзьями</string>
    <string name="nav_favorite">Избранное</string>
    <string name="fav">Посмотреть избранное</string>
    <string name="about">О приложении</string>
    <string name="version">1.0</string>
    <string name="vibration_on">Вибрация включена</string>
    <string name="vibration_off">Вибрация</string>
    <string name="settings">Настройки</string>
    <string name="select_language">Выберите язык</string>
    <string name="favorite_just_removed">Вы только что удалили это из избранного</string>
    <string name="favorite_removed_earlier">Вы недавно удалили это имя из избранного</string>
    <string name="name_search">Введите имя...</string>
    <string name="about_summary">О приложении</string>
    <string name="about_text">Данное приложение создано для предоставления информации о значении, происхождении и формах узбекских имен. Приложение предлагает удобный поиск, список избранного и быструю навигацию.</string>
</resources>`
    },
    {
        title:"theme-night.xml",
        lang:"language-xml",
        code:`<resources xmlns:tools="http://schemas.android.com/tools">
    <!-- Base application theme. -->
    <style name="Base.Theme.IsmlarKitobi" parent="Theme.Material3.DayNight.NoActionBar">
        <!-- Customize your dark theme here. -->
        <!-- <item name="colorPrimary">@color/my_dark_primary</item> -->
    </style>
</resources>`
    },
    {
        title:"provider-xml",
        lang:"language-xml",
        code:`<?xml version="1.0" encoding="utf-8"?>
<paths>
    <external-path name="external_files" path="."/>
    <root-path name="root" path="."/>
</paths>`
    },
    {
        title:"settings-xml",
        lang:"language-xml",
        code:`<?xml version="1.0" encoding="utf-8"?>
<PreferenceScreen
    xmlns:android="http://schemas.android.com/apk/res/android">

    <PreferenceCategory
        android:title="@string/general">

        <Preference
            android:key="language"
            android:title="@string/lang"
            android:summary="@string/chooice_language"/>

    </PreferenceCategory>

    <PreferenceCategory
        android:title="@string/application">

        <Preference
            android:key="share"
            android:title="@string/share"
            android:summary="@string/share_friend"/>

        <Preference
            android:key="fav"
            android:title="@string/nav_favorite"
            android:summary="@string/fav"/>

        <Preference
            android:key="about"
            android:title="@string/about"
            android:summary="@string/about_summary"/>

    </PreferenceCategory>

</PreferenceScreen>`
    }
    // Shu yerga 20-30 ta kodni ketma-ket qo'shaverasiz!
];

// HTML kartochkalarni avtomatik yaratish
document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("code-container");
    if (!container) return;

    codeDatabase.forEach((item) => {
        const card = document.createElement("div");
        card.className = "code-card";

        card.innerHTML = `
            <div class="code-header">
                <span class="code-title">${item.title}</span>
                <div class="actions">
                    <button class="btn-action" onclick="copyCode(this)">📋 Nusxalash</button>
                    <button class="btn-action" onclick="shareCode('${item.title}', this)">🔗 Ulashish</button>
                    <button class="btn-action" onclick="openCodeInNewWindow('${item.title}', this)" title="Yangi darchada ochish">🗔 Yangi darchada ochish</button>
                    <button class="btn-action" onclick="togglePlainText(this)" title="Plain text">📄 Oddiy matn</button>
                </div>
            </div>
            <div class="code-body">
                <div class="line-numbers"></div>
                <pre><code class="${item.lang || 'language-java'}"></code></pre>
            </div>

            <!-- Agarda ushbu element nav-header.xml bo'lsa rasmlarni chiqarish -->
        ${item.title === 'nav-header.xml' ? `
            <div class="drawable-container">
            <h3 class="drawable-title">Ilovamizda ishlatilgan drawable rasmlar</h3>
                <img src="images/ic_arrow.png" alt="Drawable 1" class="drawable-img">
                <img src="images/ic_close.png" alt="Drawable 2" class="drawable-img">
                <img src="images/ic_copy.png" alt="Drawable 3" class="drawable-img">
                <img src="images/ic_exit.png" alt="Drawable 4" class="drawable-img">
                <img src="images/ic_favorite_border.png" alt="Drawable 5" class="drawable-img">
                <img src="images/ic_favorite.png" alt="Drawable 6" class="drawable-img">
                <img src="images/ic_home.png" alt="Drawable 7" class="drawable-img">
                <img src="images/ic_menu.png" alt="Drawable 8" class="drawable-img">
                <img src="images/ic_settings.png" alt="Drawable 9" class="drawable-img">
                <img src="images/ic_share.png" alt="Drawable 10" class="drawable-img">
                <img src="images/nav_logo.png" alt="Drawable 11" class="drawable-img">
            </div>
        ` : ''}
    </div>
        `;

        const codeElement = card.querySelector("pre code");
        codeElement.textContent = item.code;

        container.appendChild(card);

        if (typeof hljs !== 'undefined') {
            hljs.highlightElement(codeElement);
        }
    });

    if (typeof updateLineNumbers === 'function') {
        updateLineNumbers();
    }
});