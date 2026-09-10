package uz.mahmud.ismlarkitobi.model;

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
}