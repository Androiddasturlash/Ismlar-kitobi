package uz.mahmud.ismlarkitobi.helper;

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
}