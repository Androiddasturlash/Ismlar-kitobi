package uz.mahmud.ismlarkitobi;

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
}