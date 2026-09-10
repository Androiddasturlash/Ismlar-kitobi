package uz.mahmud.ismlarkitobi;

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
}