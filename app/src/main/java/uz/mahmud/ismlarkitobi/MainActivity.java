package uz.mahmud.ismlarkitobi;

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
}